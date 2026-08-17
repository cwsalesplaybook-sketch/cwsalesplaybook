const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

// Pipelines do programa de Representantes — únicas cujas reuniões entram na
// agenda (Hyorranes também participa de reuniões internas/outros funis que
// não interessam aqui).
const PIPELINES_REP = new Set([60, 75]);

// Só entram reuniões AGENDADAS nesses últimos N dias (retroativo) — não é o
// histórico completo, é uma janela recente pra "quanto eu agendei" fazer sentido.
const JANELA_DIAS = 60;

// user_id real de cada pessoa no Pipedrive (confirmado via GET /v1/users) —
// é o melhor sinal disponível de quem vai fazer a reunião ANTES do ganho (o
// campo "[REP] Responsável pela reunião" só existe depois do ganho). Não é
// 100% confiável — a Gabi agenda tanto no perfil dela quanto no do Hyorranes
// — por isso o front permite corrigir manualmente por reunião.
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

// Pipedrive devolve add_time em UTC (timestamp de sistema, igual won_time);
// o time opera em horário de Brasília — mesmo ajuste usado em api/meta.js e
// api/reps-metas.js. due_date/due_time da reunião em si já são inseridos
// direto pelo usuário em horário local, não precisam desse ajuste.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) { return new Date(dataUtc.getTime() - TZ_OFFSET_MS); }
function dataBR(str) {
  return paraBR(new Date(str.replace(' ', 'T') + 'Z')).toISOString().slice(0, 10);
}
function hojeBR() { return paraBR(new Date()).toISOString().slice(0, 10); }

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
  const limiteAntigo = new Date(Date.now() - JANELA_DIAS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const dealCache = new Map();
  const personCache = new Map();
  const reunioes = [];

  try {
    for (const [, pessoa] of Object.entries(REP_PESSOAS)) {
      let start = 0;
      while (true) {
        // Sem filtro de "done" — pega tanto reuniões futuras quanto já
        // realizadas, pra alimentar o retroativo (quanto foi agendado por dia).
        const url = `https://api.pipedrive.com/v1/activities?api_token=${TOKEN}&type=meeting&limit=500&start=${start}&user_id=${pessoa.userId}`;
        const json = await fetchPipedriveComRetry(url);
        const atividades = Array.isArray(json.data) ? json.data : [];

        for (const a of atividades) {
          if (!a.person_id) continue;
          const agendadaEm = a.add_time ? dataBR(a.add_time) : null;
          if (!agendadaEm || agendadaEm < limiteAntigo) continue;

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
            agendadaEm, // dia em que a reunião foi marcada no Pipedrive
            data: a.due_date, // dia em que a reunião vai acontecer
            hora: a.due_time || null,
            done: !!a.done,
            responsavel: pessoa.nome,
            lead,
          });
        }

        if (!json.additional_data?.pagination?.more_items_in_collection) break;
        start += 500;
      }
    }

    reunioes.sort((x, y) => {
      const porAgendamento = y.agendadaEm.localeCompare(x.agendadaEm); // mais recente primeiro
      if (porAgendamento !== 0) return porAgendamento;
      return `${x.data} ${x.hora || '00:00'}`.localeCompare(`${y.data} ${y.hora || '00:00'}`);
    });

    res.status(200).json({ ok: true, reunioes, hoje, ts: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
