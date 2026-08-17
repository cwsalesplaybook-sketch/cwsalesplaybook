const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

// "[REP] Funil de Prospecção de Representantes" — ganho = agendamento marcado.
const PIPELINE_PROSPECCAO = 60;
// "[REP] Funil de Reunião Agendada" — ganho = reunião deu certo, rep foi cadastrado.
const PIPELINE_REUNIAO = 75;

// Squad de Aquisição de Canal (Representantes) — mapeado por e-mail de login pro
// owner_id do Pipedrive. owner_id do Hyorranes inferido pela predominância dele
// no Funil de Prospecção (80% dos negócios da amostra); revisar se algo destoar.
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

/** Conta negócios ganhos de uma pipeline+owner com "Ganho em" (won_time) no mês atual.
 *  O endpoint /v1/deals do Pipedrive filtra owner por `user_id` (não `owner_id` —
 *  esse é só o nome do campo na resposta) e não filtra por `pipeline_id` via
 *  querystring; por isso os dois são reconferidos manualmente em cada negócio,
 *  em vez de confiar cegamente no filtro do lado do servidor.
 *  Também NÃO para de paginar cedo assumindo `sort=won_time DESC` — combinado
 *  com `user_id`, o Pipedrive nem sempre respeita esse sort (gerava contagem
 *  zerada mesmo com ganhos reais no mês), então varre até o fim sempre. */
async function contarGanhosDoMes(pipelineId, ownerId, prefixoMes) {
  let count = 0;
  let start = 0;
  while (true) {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&user_id=${ownerId}&limit=200&start=${start}`;
    const json = await fetchPipedriveComRetry(url);
    if (!Array.isArray(json.data) || json.data.length === 0) break;
    for (const deal of json.data) {
      const wtRaw = deal.won_time || '';
      if (!wtRaw) continue;
      const wt = wonTimeLocal(wtRaw);
      if (!wt.startsWith(prefixoMes)) continue;
      if (Number(deal.pipeline_id) !== pipelineId) continue;
      if (Number(deal.owner_id?.id ?? deal.owner_id) !== ownerId) continue;
      count++;
    }
    if (!json.additional_data?.pagination?.more_items_in_collection) break;
    start += 200;
  }
  return count;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const email = String(req.query.email || '').toLowerCase();
  const ownerId = REP_OWNERS[email];

  // Modo debug temporário — inspeciona o formato bruto que o Pipedrive
  // devolve pra essa conta, pra investigar a contagem zerada.
  if (req.query.debug) {
    try {
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&user_id=${ownerId || REP_OWNERS['gabrielly.oliveira@cardapioweb.com']}&limit=5`;
      const json = await fetchPipedriveComRetry(url);
      return res.status(200).json({
        ok: true,
        amostra: (json.data || []).map(d => ({
          id: d.id, pipeline_id: d.pipeline_id, owner_id: d.owner_id, won_time: d.won_time, status: d.status,
        })),
      });
    } catch (e) {
      return res.status(500).json({ ok: false, erro: String(e) });
    }
  }

  const agora = paraBR(new Date());
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;

  try {
    // Agendamentos: OKR do squad inteiro — soma Gabrielly + Hyorranes.
    let agendamentos = 0;
    for (const oid of Object.values(REP_OWNERS)) {
      agendamentos += await contarGanhosDoMes(PIPELINE_PROSPECCAO, oid, prefixo);
    }

    // Cadastros: meta pessoal de quem está logado — só se reconhecido no mapa.
    let cadastros = null;
    if (ownerId) cadastros = await contarGanhosDoMes(PIPELINE_REUNIAO, ownerId, prefixo);

    res.status(200).json({
      ok: true, mes: prefixo, agendamentos, cadastros,
      reconhecido: ownerId != null,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
