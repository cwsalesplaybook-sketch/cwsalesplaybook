const TOKEN = process.env.PIPEDRIVE_API_TOKEN;
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // campo "[QUAL] SDR/BDR"

/** Devolve a lista viva de SDRs vinculáveis (id + nome), lida direto das opções
 *  do campo "[QUAL] SDR/BDR" no Pipedrive. Antes essa lista era hardcoded em 3
 *  arquivos do front — toda vez que um novato entrava no time e passava a
 *  vender, alguém precisava lembrar de editar código pra ele aparecer no
 *  vínculo/config de meta. Agora reflete o Pipedrive automaticamente. */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Opções do campo mudam raramente (só quando alguém entra/sai do time SDR).
  res.setHeader('Cache-Control', 's-maxage=1800, stale-while-revalidate=3600');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  try {
    const r = await fetch(`https://api.pipedrive.com/v1/dealFields?api_token=${TOKEN}`);
    const json = await r.json();
    if (!json.success) throw new Error(json.error || `Pipedrive retornou success:false (HTTP ${r.status})`);

    const campo = (json.data || []).find(f => f.key === SDR_FIELD);
    const options = (campo?.options || [])
      .map(o => ({ id: String(o.id), name: o.label }))
      .filter(o => o.name);

    res.status(200).json({ ok: true, options });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
