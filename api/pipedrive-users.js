const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  try {
    const r = await fetch(`https://api.pipedrive.com/v1/users?api_token=${TOKEN}&limit=200`);
    const json = await r.json();
    if (!json.success) return res.status(500).json({ ok: false, erro: 'Pipedrive retornou erro' });

    const users = (json.data || []).map(u => ({
      id: String(u.id),
      name: u.name,
      email: u.email,
    }));

    res.status(200).json({ ok: true, users });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
