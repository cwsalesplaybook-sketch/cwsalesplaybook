const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // campo "[QUAL] SDR/BDR"
const PIPELINE_VENDAS = 2; // "Funil de Vendas" — única pipeline que conta como fechamento

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const { sdrId } = req.query;
  if (!sdrId) return res.status(400).json({ ok: false, erro: 'sdrId obrigatório' });

  const agora = new Date();
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  let ganhos = 0;
  const porDia = {}; // { 'YYYY-MM-DD': count }
  let start = 0;

  try {
    while (true) {
      // Replica o relatório "Nº de neg ganhos dos SDRs": Funil de Vendas (pipeline 2),
      // status Ganho, "Ganho em" (won_time) no mês, agrupado por [QUAL] SDR/BDR.
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&limit=200&start=${start}&sort=won_time%20DESC`;
      const r = await fetch(url);
      const json = await r.json();
      if (!json.success || !Array.isArray(json.data) || json.data.length === 0) break;
      let parar = false;
      for (const deal of json.data) {
        const wt = deal.won_time || '';
        if (!wt) continue;
        if (wt < iniciaMes) { parar = true; break; } // ordenado por won_time DESC → para no mês anterior
        if (!wt.startsWith(prefixo)) continue;
        if (Number(deal.pipeline_id) !== PIPELINE_VENDAS) continue; // só Funil de Vendas
        const id = (deal[SDR_FIELD] != null && deal[SDR_FIELD] !== '') ? String(deal[SDR_FIELD]) : null;
        if (id === String(sdrId)) {
          ganhos++;
          const dia = wt.slice(0, 10); // 'YYYY-MM-DD' (data do ganho)
          porDia[dia] = (porDia[dia] || 0) + 1;
        }
      }
      if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
      start += 200;
    }

    // Calcular dias úteis
    const primeiroDia = new Date(Date.UTC(ano, mesNum, 1));
    const ultimoDia   = new Date(Date.UTC(ano, mesNum + 1, 0));
    const hoje        = new Date();

    let diasUteisTotal = 0, diasPassados = 0, diasRestantes = 0;
    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setUTCDate(d.getUTCDate() + 1)) {
      const dow = d.getUTCDay();
      if (dow === 0 || dow === 6) continue;
      diasUteisTotal++;
      if (d < hoje) diasPassados++;
      else diasRestantes++;
    }

    // Semana atual
    const inicioSemana = new Date(hoje);
    inicioSemana.setDate(hoje.getDate() - hoje.getDay() + 1);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate() + 4);
    let diasUteisSemanais = 0;
    for (let d = new Date(inicioSemana); d <= fimSemana; d.setDate(d.getDate() + 1)) {
      const dow = d.getDay();
      if (dow !== 0 && dow !== 6) diasUteisSemanais++;
    }

    // Montar série diária para o gráfico (somente até hoje)
    const evolucao = [];
    let acumulado = 0;
    for (let d = new Date(primeiroDia); d <= hoje && d <= ultimoDia; d.setUTCDate(d.getUTCDate() + 1)) {
      const chave = d.toISOString().slice(0, 10);
      const noDia = porDia[chave] || 0;
      acumulado += noDia;
      evolucao.push({
        dia: `${String(d.getUTCDate()).padStart(2, '0')}/${mes}`,
        noDia,
        acumulado,
      });
    }

    res.status(200).json({
      ok: true, ganhos, mes: prefixo,
      diasUteisTotal, diasPassados, diasRestantes, diasUteisSemanais,
      evolucao,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
