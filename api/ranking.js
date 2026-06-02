const TOKEN = '***PIPEDRIVE_TOKEN_REMOVIDO***';
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';

const SDRS_ATIVOS = {
  '1523': 'Miguel Nunes', '1445': 'Gabrielly Oliveira', '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon', '1686': 'Jonas Sobreira', '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho', '1407': 'Lara Stefanny', '1727': 'Raquel Alves',
  '1710': 'José Guilherme', '1728': 'Fabíola Azevedo', '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva', '1555': 'Ana Alice', '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela', '1707': 'Karoline Santos', '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues', '1706': 'Raissa Fonseca', '1335': 'João Paulo',
};

const MANAGERS = new Set([22291180, 11726977, 22991209, 22122891, 12994693, 11871118]);

async function contarMes(prefixo, iniciaMes) {
  const contagem = {};
  let start = 0;
  while (true) {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&pipeline_id=2&limit=200&start=${start}&sort=close_time%20DESC`;
    const r = await fetch(url);
    const json = await r.json();
    if (!json.success || !Array.isArray(json.data) || json.data.length === 0) break;
    let parar = false;
    for (const deal of json.data) {
      const ct = deal.close_time || '';
      const wt = deal.won_time || '';
      if (!ct) continue;
      if (ct < iniciaMes) { parar = true; break; }
      if (!ct.startsWith(prefixo)) continue;
      if (!wt.startsWith(prefixo)) continue;
      const ownerId = Number(deal.user_id?.id ?? deal.user_id);
      if (MANAGERS.has(ownerId)) continue;
      const sdrId = deal[SDR_FIELD] ? String(deal[SDR_FIELD]) : null;
      if (sdrId && SDRS_ATIVOS[sdrId]) contagem[sdrId] = (contagem[sdrId] || 0) + 1;
    }
    if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
    start += 200;
  }
  return contagem;
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const agora = new Date();
    const anoAtual = agora.getUTCFullYear();
    const mesAtual = agora.getUTCMonth(); // 0-indexed

    // Mês atual
    const anoC = anoAtual;
    const mesC = String(mesAtual + 1).padStart(2, '0');
    const prefixoC = `${anoC}-${mesC}`;
    const inicioC = `${anoC}-${mesC}-01`;

    // Mês anterior
    const dtAnterior = new Date(Date.UTC(anoAtual, mesAtual - 1, 1));
    const anoB = dtAnterior.getUTCFullYear();
    const mesB = String(dtAnterior.getUTCMonth() + 1).padStart(2, '0');
    const prefixoB = `${anoB}-${mesB}`;
    const inicioB = `${anoB}-${mesB}-01`;

    const [competicao, baseline] = await Promise.all([
      contarMes(prefixoC, inicioC),
      contarMes(prefixoB, inicioB),
    ]);

    const ranking = Object.keys(SDRS_ATIVOS)
      .map(id => {
        const b = baseline[id] || 0;
        const c = competicao[id] || 0;
        const crescimento = b > 0 ? ((c - b) / b) * 100 : c > 0 ? 100 : 0;
        return { id, nome: SDRS_ATIVOS[id], iniciais: iniciais(SDRS_ATIVOS[id]), baseline: b, competicao: c, crescimento: Math.round(crescimento * 10) / 10 };
      })
      .filter(s => s.baseline > 0 || s.competicao > 0)
      .sort((a, b) => b.crescimento - a.crescimento);

    res.status(200).json({ ok: true, ranking, mes: prefixoC, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
