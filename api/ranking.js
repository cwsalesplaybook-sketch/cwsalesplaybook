const TOKEN     = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';

// IDs de usuários que NÃO são SDRs (gestores, ops, etc.)
const MANAGERS = new Set([22291180, 11726977, 22991209, 22122891, 12994693, 11871118]);

// Nomes adicionais a excluir (case-insensitive, normalizado)
const EXCLUIR_NOMES = [
  'Pedro Marcos', 'Guilherme Rocha', 'Mariana Almeida', 'Eduarda Oliveira',
  'Gustavo Rebouças', 'Bruno França', 'Igor Silva', 'Vítor Matihara',
  'Eric Amaral', 'Ana Debora', 'Aloísio Vasconcelos', 'Beatriz Magalhães',
  'Vanessa Alencar', 'Leonardo Costa', 'Layza Batista', 'Hyorranes Souza',
  'Wanessa Gomes', 'Victória Viana', 'Eduarda Costa',
].map(n => n.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase());

function norm(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

function excluirNome(nome) {
  const n = norm(nome);
  return EXCLUIR_NOMES.some(e => n === e || n.includes(e) || e.includes(n));
}

function iniciais(nome) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('');
}

async function getUsers() {
  const url = `https://api.pipedrive.com/v1/users?api_token=${TOKEN}&limit=200`;
  const r   = await fetch(url);
  const j   = await r.json();
  const map = {};
  for (const u of (j.data || [])) {
    if (u.id && u.name) map[u.id] = u.name;
  }
  return map; // { userId: 'Nome Completo' }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

    const agora    = new Date();
    const ano      = agora.getUTCFullYear();
    const mesNum   = agora.getUTCMonth();
    const mes      = String(mesNum + 1).padStart(2, '0');
    const prefixo  = `${ano}-${mes}`;
    const iniciaMes = `${ano}-${mes}-01`;

    // Busca mapa de usuários em paralelo com a primeira página de deals
    const [userMap, primeiraPage] = await Promise.all([
      getUsers(),
      fetch(`https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&pipeline_id=2&limit=200&start=0&sort=close_time%20DESC`).then(r => r.json()),
    ]);

    const contagem = {}; // { userId: count }
    let paginaAtual = primeiraPage;
    let start = 0;

    while (true) {
      if (!paginaAtual.success || !Array.isArray(paginaAtual.data) || paginaAtual.data.length === 0) break;

      let parar = false;
      for (const deal of paginaAtual.data) {
        const ct = deal.close_time || '';
        const wt = deal.won_time   || '';
        if (!ct) continue;
        if (ct < iniciaMes) { parar = true; break; }           // todos os próximos são mais antigos
        if (!ct.startsWith(prefixo)) continue;                 // fora do mês atual
        if (!wt.startsWith(prefixo)) continue;                 // ganho fora do mês

        // Resolver quem é o SDR via campo customizado
        const sdrRaw = deal[SDR_FIELD];
        if (!sdrRaw) continue;

        const sdrId   = Number(sdrRaw);
        if (MANAGERS.has(sdrId)) continue;

        const sdrNome = userMap[sdrId];
        if (!sdrNome) continue;                                // ID desconhecido
        if (excluirNome(sdrNome)) continue;                    // está na lista de exclusão

        contagem[sdrId] = (contagem[sdrId] || 0) + 1;
      }

      if (parar || !paginaAtual.additional_data?.pagination?.more_items_in_collection) break;

      start += 200;
      const r = await fetch(`https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&pipeline_id=2&limit=200&start=${start}&sort=close_time%20DESC`);
      paginaAtual = await r.json();
    }

    const ranking = Object.entries(contagem)
      .map(([id, vendas]) => ({
        id,
        nome:     userMap[Number(id)] || `SDR ${id}`,
        iniciais: iniciais(userMap[Number(id)] || `S${id}`),
        vendas,
      }))
      .sort((a, b) => b.vendas - a.vendas);

    res.status(200).json({ ok: true, ranking, mes: prefixo, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
