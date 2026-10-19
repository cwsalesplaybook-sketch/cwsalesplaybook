/** Fase 4 da migração Supabase → Neon: copia os dados reais.
 *
 *  Roda manualmente, uma vez, no momento do corte:
 *    node --env-file=.env.migracao.local scripts/migrar-supabase-neon.mjs            (simulação: só conta)
 *    node --env-file=.env.migracao.local scripts/migrar-supabase-neon.mjs --executar (grava no Neon)
 *
 *  Env vars:
 *    SUPABASE_DB_URL      → connection string do Postgres do Supabase (Project Settings →
 *                           Database → Connection string, modo "Session"). Precisa ser a
 *                           conexão direta ao banco, não a URL REST: é o único jeito de ler
 *                           auth.users com o hash da senha.
 *    SERVICE_DATABASE_URL → Neon, role dona das tabelas (neondb_owner), com neon/schema.sql já
 *                           aplicado e a role app_user criada.
 *
 *  O que faz:
 *  - auth.users → public.users mantendo o MESMO id (todas as FKs continuam batendo) e o hash
 *    bcrypt da senha (bcryptjs lê o $2a$ do Supabase) — ninguém precisa trocar de senha.
 *    google_sub vem de auth.identities (provider google).
 *  - Copia as tabelas de dados com as colunas que existem nos dois lados.
 *  - papel/onboarding_done: no Supabase o app lia isso do user_metadata, e o sdr_profiles
 *    dessincronizava. No Neon a fonte é só o sdr_profiles, então o user_metadata vence.
 *  - Tudo numa transação: se qualquer passo falhar, o Neon fica como estava.
 *  - Se o Neon já tiver dados, aborta (pra não duplicar). --limpar apaga antes de copiar.
 */
import pg from 'pg';

const EXECUTAR = process.argv.includes('--executar');
const LIMPAR = process.argv.includes('--limpar');

// Ordem importa por causa das FKs (users primeiro).
const TABELAS = [
  'content_overrides',
  'sdr_profiles',
  'team_metas',
  'user_metas',
  'squad_kpis',
  'promocoes',
  'roleplay_scores',
  'onboarding_progress',
  'reps_agenda_reunioes',
  'rag_chunks',
];

for (const k of ['SUPABASE_DB_URL', 'SERVICE_DATABASE_URL']) {
  if (!process.env[k]) {
    console.error(`Falta a env var ${k}.`);
    process.exit(1);
  }
}

const origem = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
const destino = new pg.Client({ connectionString: process.env.SERVICE_DATABASE_URL });

/** Colunas graváveis da tabela (sem colunas geradas, ex.: rag_chunks.content_tsv). */
async function colunas(client, tabela) {
  const { rows } = await client.query(
    `select column_name from information_schema.columns
     where table_schema = 'public' and table_name = $1 and is_generated = 'NEVER'
     order by ordinal_position`,
    [tabela],
  );
  return rows.map((r) => r.column_name);
}

/** Colunas json/jsonb do destino — o pg mandaria um array JS como array do Postgres, não como JSON. */
async function colunasJson(tabela) {
  const { rows } = await destino.query(
    `select column_name from information_schema.columns
     where table_schema = 'public' and table_name = $1 and data_type in ('json', 'jsonb')`,
    [tabela],
  );
  return new Set(rows.map((r) => r.column_name));
}

async function inserirEmLotes(tabela, cols, rows) {
  const LOTE = 200;
  const json = await colunasJson(tabela);
  const lista = cols.map((c) => `"${c}"`).join(', ');
  for (let i = 0; i < rows.length; i += LOTE) {
    const lote = rows.slice(i, i + LOTE);
    const params = [];
    const values = lote.map((row, j) => {
      cols.forEach((c) => params.push(json.has(c) && row[c] != null ? JSON.stringify(row[c]) : row[c]));
      return `(${cols.map((_, k) => `$${j * cols.length + k + 1}`).join(', ')})`;
    });
    await destino.query(`insert into public.${tabela} (${lista}) values ${values.join(', ')}`, params);
  }
}

async function main() {
  await origem.connect();
  await destino.connect();
  console.log(EXECUTAR ? '== MODO EXECUÇÃO (grava no Neon) ==' : '== SIMULAÇÃO (nada é gravado; use --executar) ==');

  // --- Neon precisa estar vazio (ou --limpar) ---
  const ocupadas = [];
  for (const t of ['users', ...TABELAS]) {
    const { rows } = await destino.query(`select count(*)::int as n from public.${t}`);
    if (rows[0].n > 0) ocupadas.push(`${t} (${rows[0].n})`);
  }
  if (ocupadas.length && !LIMPAR) {
    console.error(`\nO Neon já tem dados em: ${ocupadas.join(', ')}.`);
    console.error('Rode com --limpar pra apagar e copiar de novo.');
    process.exit(1);
  }

  // --- Usuários ---
  const { rows: usuarios } = await origem.query(`
    select u.id, lower(u.email) as email, u.encrypted_password, u.created_at, u.updated_at,
           u.raw_user_meta_data as meta,
           (select i.provider_id from auth.identities i
             where i.user_id = u.id and i.provider = 'google' limit 1) as google_sub
    from auth.users u
    where u.email is not null and u.deleted_at is null
    order by u.created_at`);
  console.log(`\nusers: ${usuarios.length}`);

  const dados = {};
  for (const t of TABELAS) {
    const colsOrigem = await colunas(origem, t);
    const colsDestino = await colunas(destino, t);
    if (colsOrigem.length === 0) {
      console.log(`${t}: não existe no Supabase, pulando`);
      continue;
    }
    const cols = colsDestino.filter((c) => colsOrigem.includes(c));
    const soNoSupabase = colsOrigem.filter((c) => !colsDestino.includes(c));
    const { rows } = await origem.query(`select ${cols.map((c) => `"${c}"`).join(', ')} from public.${t}`);
    dados[t] = { cols, rows };
    console.log(`${t}: ${rows.length}${soNoSupabase.length ? `  (colunas que ficam pra trás: ${soNoSupabase.join(', ')})` : ''}`);
  }

  // papel / onboarding_done do user_metadata → sdr_profiles
  const perfis = new Map((dados.sdr_profiles?.rows ?? []).map((p) => [p.user_id, p]));
  let papeisCorrigidos = 0;
  let perfisCriados = 0;
  for (const u of usuarios) {
    const papelMeta = u.meta?.papel ?? null;
    const onboardingMeta = u.meta?.onboarding_done === true;
    const p = perfis.get(u.id);
    if (p) {
      if (papelMeta && p.papel !== papelMeta) {
        p.papel = papelMeta;
        papeisCorrigidos++;
      }
      if (onboardingMeta) p.onboarding_done = true;
    } else if (papelMeta) {
      const novo = { user_id: u.id, email: u.email, papel: papelMeta, onboarding_done: onboardingMeta };
      perfis.set(u.id, novo);
      dados.sdr_profiles?.rows.push(novo);
      perfisCriados++;
    }
  }
  console.log(`\nsdr_profiles: ${papeisCorrigidos} papel(éis) corrigido(s) pelo user_metadata, ${perfisCriados} perfil(s) criado(s)`);

  // Linhas que apontam pra usuário que não existe mais seriam rejeitadas pela FK do Neon.
  const ids = new Set(usuarios.map((u) => u.id));
  for (const [t, { cols, rows }] of Object.entries(dados)) {
    if (!cols.includes('user_id')) continue;
    const antes = rows.length;
    dados[t].rows = rows.filter((r) => r.user_id == null || ids.has(r.user_id));
    if (dados[t].rows.length < antes) console.log(`${t}: ${antes - dados[t].rows.length} linha(s) órfã(s) descartada(s)`);
  }
  // sdr_profiles pode ter ganho linhas novas sem todas as colunas — normaliza pra null.
  if (dados.sdr_profiles) {
    for (const r of dados.sdr_profiles.rows) for (const c of dados.sdr_profiles.cols) if (!(c in r)) r[c] = null;
    dados.sdr_profiles.rows.forEach((r) => {
      r.squads_lideradas ??= [];
      r.onboarding_done ??= false;
      r.created_at ??= new Date();
      r.updated_at ??= new Date();
    });
  }

  if (!EXECUTAR) {
    console.log('\nSimulação ok. Pra gravar: --executar');
    return;
  }

  await destino.query('BEGIN');
  try {
    if (LIMPAR) {
      await destino.query(`truncate public.users, ${TABELAS.map((t) => `public.${t}`).join(', ')}, public.refresh_tokens cascade`);
      console.log('\nNeon limpo.');
    }
    await inserirEmLotes(
      'users',
      ['id', 'email', 'password_hash', 'google_sub', 'created_at', 'updated_at'],
      usuarios.map((u) => ({
        id: u.id,
        email: u.email,
        password_hash: u.encrypted_password || null,
        google_sub: u.google_sub,
        created_at: u.created_at,
        updated_at: u.updated_at ?? u.created_at,
      })),
    );
    for (const t of TABELAS) {
      if (!dados[t]) continue;
      await inserirEmLotes(t, dados[t].cols, dados[t].rows);
    }
    await destino.query('COMMIT');
  } catch (e) {
    await destino.query('ROLLBACK').catch(() => {});
    throw e;
  }

  console.log('\nConferindo contagens no Neon:');
  for (const t of ['users', ...TABELAS]) {
    const { rows } = await destino.query(`select count(*)::int as n from public.${t}`);
    const esperado = t === 'users' ? usuarios.length : dados[t]?.rows.length ?? 0;
    console.log(`  ${t}: ${rows[0].n}${rows[0].n === esperado ? '' : `  ⚠ esperado ${esperado}`}`);
  }
  console.log('\nMigração concluída.');
}

main()
  .catch((e) => {
    console.error('\nErro — nada foi gravado:', e.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await origem.end().catch(() => {});
    await destino.end().catch(() => {});
  });
