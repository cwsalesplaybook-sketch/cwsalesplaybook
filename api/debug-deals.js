const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';
const PIPELINE_VENDAS = 2;
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;

function paraBR(dataUtc) {
  return new Date(dataUtc.getTime() - TZ_OFFSET_MS);
}
function wonTimeLocal(utcStr) {
  const instante = paraBR(new Date(utcStr.replace(' ', 'T') + 'Z'));
  return instante.toISOString().slice(0, 19).replace('T', ' ');
}

// Endpoint temporário de debug: lista os negócios individuais contados pra um
// sdrId no mês atual, pra investigar divergências entre o dashboard e o Pipedrive.
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'sem token' });

  const { sdrId } = req.query;
  if (!sdrId) return res.status(400).json({ ok: false, erro: 'sdrId obrigatório' });

  const agora = paraBR(new Date());
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  const deals = [];
  const idsVistos = new Set();
  let duplicatas = [];
  let start = 0;

  try {
    while (true) {
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&limit=200&start=${start}&sort=won_time%20DESC`;
      const r = await fetch(url);
      const json = await r.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) break;
      let parar = false;
      for (const deal of json.data) {
        const wtRaw = deal.won_time || '';
        if (!wtRaw) continue;
        const wt = wonTimeLocal(wtRaw);
        if (wt < iniciaMes) { parar = true; break; }
        if (!wt.startsWith(prefixo)) continue;
        if (Number(deal.pipeline_id) !== PIPELINE_VENDAS) continue;
        const id = (deal[SDR_FIELD] != null && deal[SDR_FIELD] !== '') ? String(deal[SDR_FIELD]) : null;
        if (id === String(sdrId)) {
          if (idsVistos.has(deal.id)) duplicatas.push(deal.id);
          idsVistos.add(deal.id);
          deals.push({
            id: deal.id, title: deal.title, won_time: deal.won_time, won_time_br: wt,
            close_time: deal.close_time, status: deal.status, pipeline_id: deal.pipeline_id,
            stage_id: deal.stage_id, value: deal.value, org: deal.org_name ?? null,
          });
        }
      }
      if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
      start += 200;
    }
    res.status(200).json({ ok: true, mes: prefixo, total: deals.length, duplicatas, deals });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
