const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';
const PIPELINE_VENDAS = 2;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'Token não configurado' });

  const { sdrId } = req.query;
  if (!sdrId) return res.status(400).json({ ok: false, erro: 'sdrId obrigatório' });

  const agora = new Date();
  const ano = agora.getUTCFullYear();
  const mes = String(agora.getUTCMonth() + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  const motivos = {};
  const leads = [];
  let total = 0;
  let start = 0;

  const isNoShow = (motivo) => {
    const n = motivo.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
    return n.includes('no show') || n.includes('no-show');
  };

  const maskPhone = (tel) => {
    const digits = String(tel || '').replace(/\D/g, '');
    if (digits.length < 4) return null;
    return `${digits.slice(0, 3)}xxxx`;
  };

  const dadosPessoa = (deal) => {
    const person = deal.person_id;
    if (!person || typeof person !== 'object') return { nome: null, telefone: null };
    const nome = person.name ? String(person.name).split(' ')[0] : null;
    const telRaw = Array.isArray(person.phone) ? (person.phone.find(p => p.primary)?.value || person.phone[0]?.value) : null;
    return { nome, telefone: maskPhone(telRaw) };
  };

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
        if (isNoShow(motivo)) continue; // SDR não vê perdas por "No show"

        motivos[motivo] = (motivos[motivo] || 0) + 1;
        total++;
        const { nome, telefone } = dadosPessoa(deal);
        leads.push({ titulo: deal.title || 'Sem título', nome, telefone, motivo, data: lt.slice(0, 10) });
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

    leads.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : 0));

    res.status(200).json({ ok: true, total, motivos: lista, leads, mes: prefixo });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
