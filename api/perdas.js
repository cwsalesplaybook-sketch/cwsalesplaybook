const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';
const PIPELINE_VENDAS = 2;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'Token não configurado' });

  const { sdrId } = req.query;
  if (!sdrId) return res.status(400).json({ ok: false, erro: 'sdrId obrigatório' });

  const agora = new Date();
  const ano = agora.getUTCFullYear();
  const mes = String(agora.getUTCMonth() + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  const motivos = {};
  let total = 0;
  let start = 0;

  try {
    while (true) {
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=lost&limit=200&start=${start}&sort=lost_time%20DESC`;
      const r = await fetch(url);
      const json = await r.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) break;

      let parar = false;
      for (const deal of json.data) {
        const lt = deal.lost_time || '';
        if (!lt) continue;
        if (lt < iniciaMes) { parar = true; break; }
        if (!lt.startsWith(prefixo)) continue;
        if (Number(deal.pipeline_id) !== PIPELINE_VENDAS) continue;

        const id = deal[SDR_FIELD] != null ? String(deal[SDR_FIELD]) : null;
        if (id !== String(sdrId)) continue;

        const motivo = deal.lost_reason?.trim() || 'Sem motivo registrado';
        motivos[motivo] = (motivos[motivo] || 0) + 1;
        total++;
      }

      if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
      start += 200;
    }

    const lista = Object.entries(motivos)
      .map(([motivo, count]) => ({
        motivo,
        count,
        pct: total > 0 ? Math.round((count / total) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    res.status(200).json({ ok: true, total, motivos: lista, mes: prefixo });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
