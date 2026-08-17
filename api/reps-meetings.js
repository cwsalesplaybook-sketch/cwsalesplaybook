const TLDV_KEY = process.env.TLDV_API_KEY;
const BASE = 'https://pasta.tldv.io/v1alpha1';

// Só essas duas pessoas aparecem na aba Reuniões do Representante — filtra
// fora qualquer reunião da empresa que não envolva nenhuma delas.
const REP_EMAILS = new Set([
  'gabrielly.oliveira@cardapioweb.com',
  'hyorranes.souza@cardapioweb.com',
]);

async function buscarTodasReunioes() {
  const todas = [];
  let page = 1;
  while (true) {
    const r = await fetch(`${BASE}/meetings?limit=100&page=${page}`, {
      headers: { 'x-api-key': TLDV_KEY },
    });
    const json = await r.json();
    if (!r.ok) throw new Error(json?.message || `tl;dv retornou HTTP ${r.status}`);
    const results = Array.isArray(json.results) ? json.results : [];
    todas.push(...results);
    if (page >= (json.pages || 1) || results.length === 0 || page > 10) break;
    page++;
  }
  return todas;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TLDV_KEY) return res.status(500).json({ ok: false, erro: 'TLDV_API_KEY não configurado' });

  try {
    const todas = await buscarTodasReunioes();

    const filtradas = todas
      .filter(m => {
        const orgEmail = m.organizer?.email?.toLowerCase();
        if (orgEmail && REP_EMAILS.has(orgEmail)) return true;
        return (m.invitees || []).some(i => i.email && REP_EMAILS.has(i.email.toLowerCase()));
      })
      .map(m => ({
        id: m.id,
        nome: m.name,
        aconteceuEm: new Date(m.happenedAt).toISOString(),
        duracaoSegundos: m.duration,
        organizador: m.organizer ? { nome: m.organizer.name, email: m.organizer.email } : null,
        convidados: (m.invitees || []).map(i => ({ nome: i.name, email: i.email })),
        url: m.url,
      }))
      .sort((a, b) => new Date(b.aconteceuEm) - new Date(a.aconteceuEm));

    res.status(200).json({ ok: true, reunioes: filtradas, total: filtradas.length, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
