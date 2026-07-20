const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/** Retry com backoff — absorve 429/5xx passageiro do Pipedrive em vez de
 *  falhar na primeira tentativa. */
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
  res.setHeader('Cache-Control', 's-maxage=300'); // cache 5 min

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  try {
    const json = await fetchPipedriveComRetry(`https://api.pipedrive.com/v1/users?api_token=${TOKEN}&limit=200`);

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
