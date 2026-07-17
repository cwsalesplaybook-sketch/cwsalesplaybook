const TOKEN_MEETIME = process.env.MEETIME_API_TOKEN;
const TOKEN_PIPEDRIVE = process.env.PIPEDRIVE_API_TOKEN;
const MEETIME_BASE = 'https://api.meetime.com.br/v2';
const PIPELINE_VENDAS = 2; // "Funil de Vendas" — mesmo critério de api/meta.js

// Grupos de tier que o SDR escolhe no filtro (mapeiam pro nome da cadência no Meetime).
// 'manual' casa pelo texto "ADIÇÃO MANUAL" da cadência; 'parcerias' casa pela
// cadência "[AG. PARCERIA]" (agendamento vindo do time de Parcerias) — ambos
// em vez de um número de tier.
const GRUPOS_TIER = {
  '1-2': { tiers: [1, 2] },
  '3': { tiers: [3] },
  '4-5': { tiers: [4, 5] },
  'manual': { regex: /ADI[ÇC][ÃA]O MANUAL/i },
  'parcerias': { regex: /AG\.?\s*PARCERIA/i },
};
const NOMES_GRUPOS = Object.keys(GRUPOS_TIER);

// Pipedrive/Meetime operam em horário de Brasília (UTC-3, sem horário de
// verão desde 2019) — mesmo ajuste usado em api/meta.js.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) {
  return new Date(dataUtc.getTime() - TZ_OFFSET_MS);
}

/** Pagina um endpoint do Meetime até acabar os resultados (a API não expõe cursor). */
async function buscarTudoMeetime(url) {
  let start = 0;
  let tudo = [];
  while (true) {
    const r = await fetch(`${url}&start=${start}&limit=100`, { headers: { Authorization: TOKEN_MEETIME } });
    const json = await r.json();
    const pagina = json.data || [];
    tudo = tudo.concat(pagina);
    if (pagina.length < 100) break;
    start += 100;
  }
  return tudo;
}

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/** Fetch com retry/backoff (com jitter) — absorve 429 esporádico do
 *  Meetime/Pipedrive sem virar silenciosamente "não converteu". */
async function fetchComRetry(url, headers, tentativas = 6) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url, headers ? { headers } : undefined);
      if (r.ok) return r.json();
      if (r.status === 429 || r.status >= 500) { ultimoErro = new Error(`HTTP ${r.status}`); }
      else throw new Error(`HTTP ${r.status}`);
    } catch (e) { ultimoErro = e; }
    if (i < tentativas - 1) await esperar(500 * (i + 1) + Math.random() * 300);
  }
  throw ultimoErro;
}

/** Roda fn sobre items com no máximo `limite` execuções em paralelo por vez. */
async function mapComLimite(items, limite, fn) {
  const resultados = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      resultados[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, items.length) }, worker));
  return resultados;
}

/** Pra uma reunião (prospecção Ganho no Meetime), pega o telefone do lead e
 *  procura a mesma pessoa no Pipedrive — se ela tem deal Ganho no Funil de
 *  Vendas, o cliente pagou (converteu). */
async function resolverConversao(p) {
  try {
    const j = await fetchComRetry(`${MEETIME_BASE}/leads?id=${p.lead_id}`, { Authorization: TOKEN_MEETIME });
    const lead = (j.data || [])[0];
    const digitos = String(lead?.primaryPhoneString || '').replace(/\D/g, '');
    if (digitos.length < 8) return false;
    const termo = digitos.slice(-9); // número local, sem DDI, evita ambiguidade de formatação

    const js = await fetchComRetry(`https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(termo)}&fields=phone&api_token=${TOKEN_PIPEDRIVE}`);
    const pessoas = js.data?.items || [];

    for (const item of pessoas) {
      const jd = await fetchComRetry(`https://api.pipedrive.com/v1/persons/${item.item.id}/deals?api_token=${TOKEN_PIPEDRIVE}`);
      const deals = jd.data || [];
      if (deals.some(d => d.status === 'won' && Number(d.pipeline_id) === PIPELINE_VENDAS)) return true;
    }
    return false;
  } catch (e) {
    console.error('conversao: falha ao resolver lead', p.lead_id, e);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN_MEETIME) return res.status(500).json({ ok: false, erro: 'MEETIME_API_TOKEN não configurado' });
  if (!TOKEN_PIPEDRIVE) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const { email, grupo } = req.query;
  if (!email) return res.status(400).json({ ok: false, erro: 'email obrigatório' });
  // 'todos' resolve os 5 grupos numa invocação só — é o que o frontend usa,
  // pra ter um único ponto batendo no Pipedrive em vez de 5 requisições
  // concorrentes (5 invocações serverless não coordenam rate limit entre si;
  // isso já causou "convertidos" flutuando a cada refresh, ver histórico).
  const gruposAlvo = grupo === 'todos' ? NOMES_GRUPOS : [grupo];
  if (gruposAlvo.some(g => !GRUPOS_TIER[g])) return res.status(400).json({ ok: false, erro: 'grupo inválido' });

  try {
    // 1. Acha o usuário do Meetime pelo e-mail de login (mesmo domínio da conta).
    const usuarios = await buscarTudoMeetime(`${MEETIME_BASE}/users?`);
    const usuario = usuarios.find(u => (u.email || '').toLowerCase() === String(email).toLowerCase());
    if (!usuario) {
      const vazio = Object.fromEntries(gruposAlvo.map(g => [g, { agendamentos: 0, convertidos: 0 }]));
      const aviso = 'SDR não encontrado no Meetime (confira o e-mail de login)';
      return res.status(200).json(
        grupo === 'todos'
          ? { ok: true, grupos: vazio, aviso }
          : { ok: true, agendamentos: 0, convertidos: 0, aviso }
      );
    }

    // 2. Cadências — buscadas uma vez só e reaproveitadas por todos os grupos alvo.
    const cadencias = await buscarTudoMeetime(`${MEETIME_BASE}/cadences?`);

    // 3. Reuniões (Ganho no Meetime) desse SDR no mês inteiro — também buscadas
    //    uma vez só, depois filtradas por grupo.
    const agora = paraBR(new Date());
    const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
    const inicioMesUtc = new Date(inicioMes.getTime() + TZ_OFFSET_MS).toISOString();
    const agoraUtc = new Date().toISOString();

    const prospeccoes = await buscarTudoMeetime(
      `${MEETIME_BASE}/prospections?status=WON&user_id=${usuario.id}&end_after=${encodeURIComponent(inicioMesUtc)}&end_before=${encodeURIComponent(agoraUtc)}`
    );

    const porGrupo = {};
    for (const g of gruposAlvo) {
      const cfg = GRUPOS_TIER[g];
      const cadenciasDoGrupo = new Set(
        cadencias
          .filter(c => {
            if (/TESTE/i.test(c.name)) return false;
            return cfg.regex
              ? cfg.regex.test(c.name)
              : cfg.tiers.some(t => new RegExp(`\\bTIER ${t}\\b`, 'i').test(c.name));
          })
          .map(c => c.id)
      );
      porGrupo[g] = prospeccoes.filter(p => cadenciasDoGrupo.has(p.cadence_id));
    }

    // 4. Resolve TODAS as reuniões de TODOS os grupos alvo numa lista só, com
    //    concorrência única e baixa — é essa consolidação que evita estourar
    //    o rate limit do Pipedrive.
    const todasComGrupo = gruposAlvo.flatMap(g => porGrupo[g].map(p => ({ p, g })));
    const resolvidos = await mapComLimite(todasComGrupo, 3, ({ p }) => resolverConversao(p));

    const contagem = Object.fromEntries(gruposAlvo.map(g => [g, { agendamentos: porGrupo[g].length, convertidos: 0 }]));
    todasComGrupo.forEach(({ g }, i) => { if (resolvidos[i]) contagem[g].convertidos++; });

    const ts = new Date().toISOString();
    if (grupo === 'todos') {
      return res.status(200).json({ ok: true, grupos: contagem, ts });
    }
    const unico = contagem[grupo];
    res.status(200).json({ ok: true, agendamentos: unico.agendamentos, convertidos: unico.convertidos, ts });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
