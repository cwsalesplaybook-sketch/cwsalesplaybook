const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

// "[REP] Funil de Prospecção de Representantes" — ganho = agendamento marcado.
const PIPELINE_PROSPECCAO = 60;
// "[REP] Funil de Reunião Agendada" — ganho = reunião deu certo, rep foi cadastrado.
const PIPELINE_REUNIAO = 75;

// Squad de Aquisição de Canal (Representantes) — mapeado por e-mail de login pro
// owner_id do Pipedrive. owner_id do Hyorranes inferido pela predominância dele
// no Funil de Prospecção (80% dos negócios da amostra); confirmado pela Gabi.
const REP_OWNERS = {
  'gabrielly.oliveira@cardapioweb.com': 11726977,
  'hyorranes.souza@cardapioweb.com': 21801658,
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
 *  `user_id`/`owner_id`/`pipeline_id` como query param são ignorados silenciosamente
 *  por essa conta do Pipedrive, confirmado via debug em produção: filtrar sempre no
 *  código, nunca na querystring) e devolve uma contagem por chave "pipelineId:ownerId". */
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
      const chave = `${deal.pipeline_id}:${deal.owner_id?.id ?? deal.owner_id}`;
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
  const ownerId = REP_OWNERS[email];

  if (req.query.debug) {
    try {
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&limit=2&sort=won_time%20DESC`;
      const json = await fetchPipedriveComRetry(url);
      const bruto = (json.data || [{}])[0] || {};
      const semCustomFields = Object.fromEntries(Object.entries(bruto).filter(([k]) => k !== 'custom_fields'));
      return res.status(200).json({ ok: true, chaves: Object.keys(bruto), primeiroDealSemCustomFields: semCustomFields });
    } catch (e) {
      return res.status(500).json({ ok: false, erro: String(e) });
    }
  }

  const agora = paraBR(new Date());
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  try {
    const chaveProspeccaoPorOwner = Object.values(REP_OWNERS).map(oid => `${PIPELINE_PROSPECCAO}:${oid}`);
    const chaveReuniao = ownerId ? `${PIPELINE_REUNIAO}:${ownerId}` : null;
    const chaves = [...chaveProspeccaoPorOwner, ...(chaveReuniao ? [chaveReuniao] : [])];

    const contagens = await contarGanhosDoMesPorChave(chaves, prefixo, iniciaMes);

    const agendamentos = chaveProspeccaoPorOwner.reduce((soma, c) => soma + contagens[c], 0);
    const cadastros = chaveReuniao ? contagens[chaveReuniao] : null;

    res.status(200).json({
      ok: true, mes: prefixo, agendamentos, cadastros,
      reconhecido: ownerId != null,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
