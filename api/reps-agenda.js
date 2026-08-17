const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

// Pipelines do programa de Representantes — únicas cujas reuniões entram na
// agenda (Hyorranes também participa de reuniões internas/outros funis que
// não interessam aqui).
const PIPELINES_REP = new Set([60, 75]);

// user_id real de cada pessoa no Pipedrive (confirmado via GET /v1/users) —
// é o que identifica quem vai fazer a reunião na atividade, ao contrário do
// "dono" do negócio, que nos funis de Representantes é sempre uma conta
// técnica compartilhada (ver api/reps-metas.js).
const REP_PESSOAS = {
  'gabrielly.oliveira@cardapioweb.com': { userId: 26387481, nome: 'Gabrielly' },
  'hyorranes.souza@cardapioweb.com': { userId: 24835051, nome: 'Hyorranes' },
};

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

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

// Pipedrive devolve datas em UTC; o time opera em horário de Brasília.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function hojeBR() {
  const agora = new Date(Date.now() - TZ_OFFSET_MS);
  return agora.toISOString().slice(0, 10);
}

function extrairLead(person) {
  if (!person) return { nome: null, telefone: null, email: null };
  return {
    nome: person.name ?? null,
    telefone: person.phone?.find(p => p.primary)?.value ?? person.phone?.[0]?.value ?? null,
    email: person.email?.find(p => p.primary)?.value ?? person.email?.[0]?.value ?? null,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=180, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const hoje = hojeBR();
  const dealCache = new Map();
  const personCache = new Map();
  const reunioes = [];

  try {
    for (const [, pessoa] of Object.entries(REP_PESSOAS)) {
      let start = 0;
      while (true) {
        const url = `https://api.pipedrive.com/v1/activities?api_token=${TOKEN}&type=meeting&done=0&limit=500&start=${start}&user_id=${pessoa.userId}`;
        const json = await fetchPipedriveComRetry(url);
        const atividades = Array.isArray(json.data) ? json.data : [];

        for (const a of atividades) {
          if ((a.due_date || '') < hoje) continue;
          if (!a.person_id) continue;

          let lead = null;

          if (a.deal_id) {
            if (!dealCache.has(a.deal_id)) {
              try {
                const dj = await fetchPipedriveComRetry(`https://api.pipedrive.com/v1/deals/${a.deal_id}?api_token=${TOKEN}`);
                dealCache.set(a.deal_id, dj.data);
              } catch {
                dealCache.set(a.deal_id, null);
              }
            }
            const deal = dealCache.get(a.deal_id);
            if (!deal || !PIPELINES_REP.has(deal.pipeline_id)) continue; // fora dos funis de Representantes
            lead = extrairLead(typeof deal.person_id === 'object' ? deal.person_id : null);
          }

          if (!lead || (!lead.nome && !lead.email && !lead.telefone)) {
            if (!personCache.has(a.person_id)) {
              try {
                const pj = await fetchPipedriveComRetry(`https://api.pipedrive.com/v1/persons/${a.person_id}?api_token=${TOKEN}`);
                personCache.set(a.person_id, pj.data);
              } catch {
                personCache.set(a.person_id, null);
              }
            }
            lead = extrairLead(personCache.get(a.person_id));
          }

          reunioes.push({
            id: a.id,
            data: a.due_date,
            hora: a.due_time || null,
            responsavel: pessoa.nome,
            lead,
          });
        }

        if (!json.additional_data?.pagination?.more_items_in_collection) break;
        start += 500;
      }
    }

    reunioes.sort((x, y) => `${x.data} ${x.hora || '00:00'}`.localeCompare(`${y.data} ${y.hora || '00:00'}`));

    res.status(200).json({ ok: true, reunioes, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
