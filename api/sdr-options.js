const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // campo "[QUAL] SDR/BDR"

// O "sdrId" usado no app (metas, ranking, ganhos) é o id de uma opção deste
// campo customizado do negócio — não é o id de usuário do Pipedrive. Por
// isso pra descobrir quem é SDR/BDR precisamos das opções do campo, não da
// lista de usuários (que não inclui contas sem assento/desativadas).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  try {
    const r = await fetch(`https://api.pipedrive.com/v1/dealFields?api_token=${TOKEN}`);
    const json = await r.json();
    if (!json.success) return res.status(500).json({ ok: false, erro: 'Pipedrive retornou erro ao listar dealFields' });

    const campo = (json.data || []).find(f => f.key === SDR_FIELD);
    if (!campo) return res.status(500).json({ ok: false, erro: 'Campo SDR/BDR não encontrado no Pipedrive', chavesDisponiveis: (json.data || []).map(f => f.key) });

    const options = (campo.options || []).map(o => ({ id: String(o.id), name: o.label }));
    res.status(200).json({ ok: true, options });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
