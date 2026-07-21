const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // campo "[QUAL] SDR/BDR"
const PIPELINE_VENDAS = 2; // "Funil de Vendas" — única pipeline que conta como fechamento

// Pipedrive devolve datas em UTC, mas o time opera em horário de Brasília
// (UTC-3, sem horário de verão desde 2019). Sem esse ajuste, um negócio
// ganho às 21h-23h59 (Brasília) vira "dia seguinte" em UTC — e se isso
// acontecer no fim do mês, o fechamento é contado no mês errado.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;

/** Desloca um instante UTC pra que os getters getUTC* devolvam o horário de Brasília. */
function paraBR(dataUtc) {
  return new Date(dataUtc.getTime() - TZ_OFFSET_MS);
}

/** Converte string 'YYYY-MM-DD HH:MM:SS' (UTC, formato do Pipedrive) pro mesmo formato em horário de Brasília. */
function wonTimeLocal(utcStr) {
  const instante = paraBR(new Date(utcStr.replace(' ', 'T') + 'Z'));
  return instante.toISOString().slice(0, 19).replace('T', ' ');
}

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/** Retry com backoff — sem isso, um 429/5xx passageiro do Pipedrive
 *  (json.success:false) era tratado igual a "acabaram as páginas" e o
 *  endpoint respondia ok:true com ganhos:0, mascarando o erro real. */
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const { sdrId } = req.query;
  if (!sdrId) return res.status(400).json({ ok: false, erro: 'sdrId obrigatório' });

  const agora = paraBR(new Date());
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
      const json = await fetchPipedriveComRetry(url);
      if (!Array.isArray(json.data) || json.data.length === 0) break;
      let parar = false;
      for (const deal of json.data) {
        const wtRaw = deal.won_time || '';
        if (!wtRaw) continue;
        const wt = wonTimeLocal(wtRaw); // ajustado pro horário de Brasília
        if (wt < iniciaMes) { parar = true; break; } // ordenado por won_time DESC → para no mês anterior
        if (!wt.startsWith(prefixo)) continue;
        if (Number(deal.pipeline_id) !== PIPELINE_VENDAS) continue; // só Funil de Vendas
        const id = (deal[SDR_FIELD] != null && deal[SDR_FIELD] !== '') ? String(deal[SDR_FIELD]) : null;
        if (id === String(sdrId)) {
          ganhos++;
          const dia = wt.slice(0, 10); // 'YYYY-MM-DD' (data do ganho, já em horário de Brasília)
          porDia[dia] = (porDia[dia] || 0) + 1;
        }
      }
      if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
      start += 200;
    }

    // Calcular dias úteis
    const primeiroDia = new Date(Date.UTC(ano, mesNum, 1));
    const ultimoDia   = new Date(Date.UTC(ano, mesNum + 1, 0));
    const hoje        = agora;

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
