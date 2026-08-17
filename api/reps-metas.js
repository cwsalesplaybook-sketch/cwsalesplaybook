const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

/** Cada frente dentro do papel Representante tem seu próprio funil "principal"
 *  no Pipedrive — o negócio ganho nesse funil é o que conta como resultado
 *  pessoal (card "Representantes Cadastrados" / "Reps Ativados" da Meta do Mês). */
const CARGO_CONFIG = {
  // Prospecta e recruta — ganho no Funil de Reunião Agendada = rep cadastrado.
  'Aquisição de Canal': { pipelinePrincipal: 75 },
  // Ativa quem já foi cadastrado — ganho no funil de Onboarding→1º Cliente = rep ativado.
  'PSM': { pipelinePrincipal: 62 },
};

// "[REP] Funil de Prospecção de Representantes" — ganho = agendamento marcado.
// OKR do squad de Aquisição de Canal (soma todo mundo dessa frente).
const PIPELINE_PROSPECCAO = 60;

// Squad de Representantes mapeado por e-mail de login pro dono do negócio no
// Pipedrive + frente. owner_id do Hyorranes inferido pela predominância dele
// no Funil de Prospecção (80% dos negócios da amostra); confirmado pela Gabi.
// Beatriz (PSM): adicionar aqui assim que tivermos o owner_id dela no Pipedrive.
const REP_PESSOAS = {
  'gabrielly.oliveira@cardapioweb.com': { ownerId: 11726977, cargo: 'Aquisição de Canal' },
  'hyorranes.souza@cardapioweb.com': { ownerId: 21801658, cargo: 'Aquisição de Canal' },
};

// Pipedrive devolve datas em UTC; o time opera em horário de Brasília (UTC-3,
// sem horário de verão desde 2019) — mesmo ajuste usado em api/meta.js.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) { return new Date(dataUtc.getTime() - TZ_OFFSET_MS); }
function wonTimeLocal(utcStr) {
  const instante = paraBR(new Date(utcStr.replace(' ', 'T') + 'Z'));
  return instante.toISOString().slice(0, 19).replace('T', ' ');
}

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function fetchPipedriveComRetry(url, tentativas = 5) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url);
      const json = await r.json();
      if (json.success) return json;
      ultimoErro = new Error(json.error || `Pipedrive retornou success:false (HTTP ${r.status})`);
    } catch (e) { ultimoErro = e; }
    if (i < tentativas - 1) await esperar(400 * (i + 1) + Math.random() * 300);
  }
  throw ultimoErro;
}

/** Varre TODOS os negócios ganhos da empresa no mês atual (igual ao api/meta.js —
 *  `user_id`/`pipeline_id` como filtro de querystring são ignorados silenciosamente
 *  por essa conta do Pipedrive, confirmado via debug em produção: filtrar sempre no
 *  código, nunca na URL) e devolve uma contagem por chave "pipelineId:donoId".
 *  O dono do negócio vem no campo `user_id` da resposta (um objeto com `.id`) —
 *  NÃO existe campo `owner_id` na resposta bruta da API, apesar do nome comum
 *  em ferramentas/documentação de terceiros; confirmado via dump em produção. */
async function contarGanhosDoMesPorChave(chaves, prefixoMes, iniciaMes) {
  const contagens = Object.fromEntries(chaves.map(c => [c, 0]));
  let start = 0;
  while (true) {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&limit=200&start=${start}&sort=won_time%20DESC`;
    const json = await fetchPipedriveComRetry(url);
    if (!Array.isArray(json.data) || json.data.length === 0) break;
    let parar = false;
    for (const deal of json.data) {
      const wtRaw = deal.won_time || '';
      if (!wtRaw) continue;
      const wt = wonTimeLocal(wtRaw);
      if (wt < iniciaMes) { parar = true; break; }
      if (!wt.startsWith(prefixoMes)) continue;
      const donoId = deal.user_id?.id ?? deal.user_id;
      const chave = `${deal.pipeline_id}:${donoId}`;
      if (chave in contagens) contagens[chave]++;
    }
    if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
    start += 200;
  }
  return contagens;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const email = String(req.query.email || '').toLowerCase();
  const pessoa = REP_PESSOAS[email];

  const agora = paraBR(new Date());
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  try {
    // Agendamentos: OKR do squad de Aquisição de Canal inteiro (soma todo mundo dessa frente).
    const donosAquisicao = Object.values(REP_PESSOAS)
      .filter(p => p.cargo === 'Aquisição de Canal')
      .map(p => p.ownerId);
    const chaveProspeccaoPorOwner = donosAquisicao.map(oid => `${PIPELINE_PROSPECCAO}:${oid}`);

    // Resultado pessoal: funil principal da frente de quem está logado.
    const pipelinePrincipal = pessoa ? CARGO_CONFIG[pessoa.cargo]?.pipelinePrincipal : null;
    const chavePrincipal = pipelinePrincipal ? `${pipelinePrincipal}:${pessoa.ownerId}` : null;

    const chaves = [...chaveProspeccaoPorOwner, ...(chavePrincipal ? [chavePrincipal] : [])];
    const contagens = await contarGanhosDoMesPorChave(chaves, prefixo, iniciaMes);

    const agendamentos = chaveProspeccaoPorOwner.reduce((soma, c) => soma + contagens[c], 0);
    const cadastros = chavePrincipal ? contagens[chavePrincipal] : null;

    res.status(200).json({
      ok: true, mes: prefixo, cadastros,
      // Agendamentos só faz sentido pra quem é da Aquisição de Canal (OKR do squad).
      agendamentos: pessoa?.cargo === 'Aquisição de Canal' ? agendamentos : null,
      cargo: pessoa?.cargo ?? null,
      reconhecido: pessoa != null,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
