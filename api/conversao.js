const TOKEN_MEETIME = process.env.MEETIME_API_TOKEN;
const TOKEN_PIPEDRIVE = process.env.PIPEDRIVE_API_TOKEN;
const MEETIME_BASE = 'https://api.meetime.com.br/v2';
const PIPELINE_VENDAS = 2; // "Funil de Vendas" — mesmo critério de api/meta.js
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // "[QUAL] SDR/BDR" — mesmo campo de api/meta.js
const TIER_FIELD = '346353ade45adcb68850667587de1da11b3bdadd'; // "Tipo de tier", no próprio negócio

// Grupos de tier que o SDR escolhe no filtro (mapeiam pro nome da cadência no Meetime).
// 'manual' casa pelo texto "ADIÇÃO MANUAL" da cadência; 'parcerias' casa pela
// cadência "[AG. PARCERIA]" (agendamento vindo do time de Parcerias) — ambos
// em vez de um número de tier.
const GRUPOS_TIER = {
  '1-2': { tiers: [1, 2] },
  '3': { tiers: [3] },
  '4-5': { tiers: [4, 5] },
  'manual': { regex: /ADI[ÇC][ÃA]O MANUAL/i },
  'parcerias': { regex: /AG\.?\s*PARCERIA/i },
};
const NOMES_GRUPOS = Object.keys(GRUPOS_TIER);

// Pra esses grupos, "convertidos" vem direto do campo "Tipo de tier" do
// negócio no Pipedrive (validado ao vivo: bate com o match por telefone) —
// não precisa mais de telefone nem de bater no rate limit do Pipedrive lead
// por lead. 'manual' fica de fora: validei que os negócios reativados via
// Adição Manual carregam o tier ORIGINAL do lead (de antes da reativação),
// não "Adição manual" — não dá pra confiar nesse campo pra esse grupo.
const TIERS_PIPEDRIVE = {
  '1-2': [1438, 1439],       // Tier 1, Tier 2
  '3': [1440, 1441],         // Tier 3.1, Tier 3.2
  '4-5': [1442, 1443],       // Tier 4, Tier 5
  'parcerias': [1568],       // Agentes
};

// Pipedrive/Meetime operam em horário de Brasília (UTC-3, sem horário de
// verão desde 2019) — mesmo ajuste usado em api/meta.js.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) {
  return new Date(dataUtc.getTime() - TZ_OFFSET_MS);
}

/** Pagina um endpoint do Meetime até acabar os resultados (a API não expõe cursor). */
async function buscarTudoMeetime(url) {
  let start = 0;
  let tudo = [];
  while (true) {
    const r = await fetch(`${url}&start=${start}&limit=100`, { headers: { Authorization: TOKEN_MEETIME } });
    const json = await r.json();
    const pagina = json.data || [];
    tudo = tudo.concat(pagina);
    if (pagina.length < 100) break;
    start += 100;
  }
  return tudo;
}

function esperar(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

/** Fetch com retry/backoff (com jitter) — absorve 429 esporádico do
 *  Meetime/Pipedrive sem virar silenciosamente "não converteu". */
async function fetchComRetry(url, headers, tentativas = 6) {
  let ultimoErro;
  for (let i = 0; i < tentativas; i++) {
    try {
      const r = await fetch(url, headers ? { headers } : undefined);
      if (r.ok) return r.json();
      if (r.status === 429 || r.status >= 500) { ultimoErro = new Error(`HTTP ${r.status}`); }
      else throw new Error(`HTTP ${r.status}`);
    } catch (e) { ultimoErro = e; }
    if (i < tentativas - 1) await esperar(500 * (i + 1) + Math.random() * 300);
  }
  throw ultimoErro;
}

/** Roda fn sobre items com no máximo `limite` execuções em paralelo por vez. */
async function mapComLimite(items, limite, fn) {
  const resultados = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const i = cursor++;
      resultados[i] = await fn(items[i]);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limite, items.length) }, worker));
  return resultados;
}

// Espaçamento mínimo entre chamadas ao Pipedrive — proativo, não reativo.
// Confirmado nos logs do Vercel: mesmo com concorrência baixa e 6 tentativas
// de retry/backoff, uma fração dos leads batia 429 em TODAS as tentativas —
// o limite do Pipedrive é sustentado, não só de rajada, então só retry não
// resolve. Serializar as chamadas com esse intervalo evita bater no limite
// em vez de tentar se recuperar depois de já ter estourado.
const INTERVALO_PIPEDRIVE_MS = 300;
let ultimaChamadaPipedrive = 0;
async function fetchPipedrive(url) {
  const espera = ultimaChamadaPipedrive + INTERVALO_PIPEDRIVE_MS - Date.now();
  if (espera > 0) await esperar(espera);
  ultimaChamadaPipedrive = Date.now();
  return fetchComRetry(url);
}

/** Converte 'YYYY-MM-DD HH:MM:SS' (UTC, formato do won_time do Pipedrive)
 *  pro mesmo formato em horário de Brasília — mesma lógica de api/meta.js. */
function wonTimeLocal(utcStr) {
  const instante = paraBR(new Date(utcStr.replace(' ', 'T') + 'Z'));
  return instante.toISOString().slice(0, 19).replace('T', ' ');
}

/** Busca todos os negócios Ganho deste SDR no mês, direto no Pipedrive (sem
 *  passar pelo Meetime nem por telefone) — mesma paginação de api/meta.js. */
async function buscarGanhosDiretoPipedrive(sdrId, iniciaMesStr) {
  const encontrados = [];
  let start = 0;
  while (true) {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN_PIPEDRIVE}&status=won&limit=200&start=${start}&sort=won_time%20DESC`;
    const json = await fetchComRetry(url);
    const pagina = json.data || [];
    if (pagina.length === 0) break;
    let parar = false;
    for (const deal of pagina) {
      const wtRaw = deal.won_time || '';
      if (!wtRaw) continue;
      const wt = wonTimeLocal(wtRaw);
      if (wt < iniciaMesStr) { parar = true; break; }
      if (String(deal[SDR_FIELD]) === String(sdrId) && Number(deal.pipeline_id) === PIPELINE_VENDAS) {
        encontrados.push(deal);
      }
    }
    if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
    start += 200;
  }
  return encontrados;
}

/** Pra uma reunião (prospecção Ganho no Meetime), pega o telefone do lead e
 *  procura a mesma pessoa no Pipedrive — se ela tem deal Ganho no Funil de
 *  Vendas, o cliente pagou (converteu). */
async function resolverConversao(p) {
  try {
    const j = await fetchComRetry(`${MEETIME_BASE}/leads?id=${p.lead_id}`, { Authorization: TOKEN_MEETIME });
    const lead = (j.data || [])[0];
    const digitos = String(lead?.primaryPhoneString || '').replace(/\D/g, '');
    if (digitos.length < 8) return false;
    const termo = digitos.slice(-9); // número local, sem DDI, evita ambiguidade de formatação

    const js = await fetchPipedrive(`https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(termo)}&fields=phone&api_token=${TOKEN_PIPEDRIVE}`);
    const pessoas = js.data?.items || [];

    for (const item of pessoas) {
      const jd = await fetchPipedrive(`https://api.pipedrive.com/v1/persons/${item.item.id}/deals?api_token=${TOKEN_PIPEDRIVE}`);
      const deals = jd.data || [];
      if (deals.some(d => d.status === 'won' && Number(d.pipeline_id) === PIPELINE_VENDAS)) return true;
    }
    return false;
  } catch (e) {
    console.error('conversao: falha ao resolver lead', p.lead_id, e);
    return false;
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN_MEETIME) return res.status(500).json({ ok: false, erro: 'MEETIME_API_TOKEN não configurado' });
  if (!TOKEN_PIPEDRIVE) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const { email, grupo, sdrId } = req.query;
  if (!email) return res.status(400).json({ ok: false, erro: 'email obrigatório' });
  // 'todos' resolve os 5 grupos numa invocação só — é o que o frontend usa,
  // pra ter um único ponto batendo no Pipedrive em vez de 5 requisições
  // concorrentes (5 invocações serverless não coordenam rate limit entre si;
  // isso já causou "convertidos" flutuando a cada refresh, ver histórico).
  const gruposAlvo = grupo === 'todos' ? NOMES_GRUPOS : [grupo];
  if (gruposAlvo.some(g => !GRUPOS_TIER[g])) return res.status(400).json({ ok: false, erro: 'grupo inválido' });

  try {
    // 1. Acha o usuário do Meetime pelo e-mail de login (mesmo domínio da conta).
    const usuarios = await buscarTudoMeetime(`${MEETIME_BASE}/users?`);
    const usuario = usuarios.find(u => (u.email || '').toLowerCase() === String(email).toLowerCase());
    if (!usuario) {
      const vazio = Object.fromEntries(gruposAlvo.map(g => [g, { agendamentos: 0, convertidos: 0, projecaoGanhos: 0 }]));
      const aviso = 'SDR não encontrado no Meetime (confira o e-mail de login)';
      return res.status(200).json(
        grupo === 'todos'
          ? { ok: true, grupos: vazio, aviso }
          : { ok: true, agendamentos: 0, convertidos: 0, projecaoGanhos: 0, aviso }
      );
    }

    // 2. Cadências — buscadas uma vez só e reaproveitadas por todos os grupos alvo.
    const cadencias = await buscarTudoMeetime(`${MEETIME_BASE}/cadences?`);

    // 3. Reuniões (Ganho no Meetime) desse SDR no mês inteiro — também buscadas
    //    uma vez só, depois filtradas por grupo.
    const agora = paraBR(new Date());
    const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
    const inicioMesUtc = new Date(inicioMes.getTime() + TZ_OFFSET_MS).toISOString();
    const agoraUtc = new Date().toISOString();

    const prospeccoes = await buscarTudoMeetime(
      `${MEETIME_BASE}/prospections?status=WON&user_id=${usuario.id}&end_after=${encodeURIComponent(inicioMesUtc)}&end_before=${encodeURIComponent(agoraUtc)}`
    );

    // Dias úteis do mês (mesmo critério de api/meta.js) — usados pra projetar,
    // a partir do ritmo de reuniões até agora, quantos ganhos (fechamentos)
    // devem sair até o fim do mês na taxa de conversão observada.
    const primeiroDia = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
    const ultimoDia = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth() + 1, 0));
    let diasUteisTotal = 0, diasPassados = 0;
    for (let d = new Date(primeiroDia); d <= ultimoDia; d.setUTCDate(d.getUTCDate() + 1)) {
      const dow = d.getUTCDay();
      if (dow === 0 || dow === 6) continue;
      diasUteisTotal++;
      if (d < agora) diasPassados++;
    }

    const porGrupo = {};
    for (const g of gruposAlvo) {
      const cfg = GRUPOS_TIER[g];
      const cadenciasDoGrupo = new Set(
        cadencias
          .filter(c => {
            if (/TESTE/i.test(c.name)) return false;
            return cfg.regex
              ? cfg.regex.test(c.name)
              : cfg.tiers.some(t => new RegExp(`\\bTIER ${t}\\b`, 'i').test(c.name));
          })
          .map(c => c.id)
      );
      porGrupo[g] = prospeccoes.filter(p => cadenciasDoGrupo.has(p.cadence_id));
    }

    // 4. "Convertidos": grupos com tier direto no Pipedrive usam o campo
    //    "Tipo de tier" do próprio negócio (sem telefone, sem rate limit por
    //    lead) — só precisa de UMA busca paginada de todos os Ganho do SDR
    //    no mês. Sem sdrId (SDR ainda não configurou o próprio perfil) cai
    //    pro telefone em tudo, como antes. 'manual' sempre usa telefone.
    const contagem = Object.fromEntries(gruposAlvo.map(g => [g, { agendamentos: porGrupo[g].length, convertidos: 0 }]));
    const gruposViaPipedrive = sdrId ? gruposAlvo.filter(g => TIERS_PIPEDRIVE[g]) : [];
    const gruposViaTelefone = gruposAlvo.filter(g => !gruposViaPipedrive.includes(g));

    if (gruposViaPipedrive.length > 0) {
      const iniciaMesStr = `${agora.getUTCFullYear()}-${String(agora.getUTCMonth() + 1).padStart(2, '0')}-01`;
      const ganhosDoSdr = await buscarGanhosDiretoPipedrive(sdrId, iniciaMesStr);
      for (const g of gruposViaPipedrive) {
        const idsDoTier = TIERS_PIPEDRIVE[g];
        contagem[g].convertidos = ganhosDoSdr.filter(d => idsDoTier.includes(Number(d[TIER_FIELD]))).length;
      }
    }

    if (gruposViaTelefone.length > 0) {
      // Concorrência 1: o espaçamento de fetchPipedrive só é confiável se as
      // chamadas forem sequenciais (concorrência >1 faria duas chamadas lerem
      // o mesmo "última chamada" antes de qualquer uma atualizar).
      const todasComGrupo = gruposViaTelefone.flatMap(g => porGrupo[g].map(p => ({ p, g })));
      const resolvidos = await mapComLimite(todasComGrupo, 1, ({ p }) => resolverConversao(p));
      todasComGrupo.forEach(({ g }, i) => { if (resolvidos[i]) contagem[g].convertidos++; });
    }

    // Projeção de ganhos até o fim do mês: pega o ritmo de reuniões por dia
    // útil até agora e estica pros dias úteis totais do mês, depois aplica a
    // taxa de conversão observada (convertidos/agendamentos) em cima disso.
    for (const g of gruposAlvo) {
      const { agendamentos, convertidos } = contagem[g];
      const ritmoReunioesPorDia = diasPassados > 0 ? agendamentos / diasPassados : 0;
      const projecaoReunioes = Math.round(ritmoReunioesPorDia * diasUteisTotal);
      const taxaConversao = agendamentos > 0 ? convertidos / agendamentos : 0;
      contagem[g].projecaoGanhos = Math.round(projecaoReunioes * taxaConversao);
    }

    const ts = new Date().toISOString();
    if (grupo === 'todos') {
      return res.status(200).json({ ok: true, grupos: contagem, ts });
    }
    const unico = contagem[grupo];
    res.status(200).json({ ok: true, agendamentos: unico.agendamentos, convertidos: unico.convertidos, projecaoGanhos: unico.projecaoGanhos, ts });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
