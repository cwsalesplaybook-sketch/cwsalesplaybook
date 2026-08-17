const TOKEN = process.env.PIPEDRIVE_API_TOKEN;

/** Campo "[REP] Responsável pela reunião" — identifica individualmente quem
 *  fechou o negócio. NÃO usar o "dono" (user_id) do negócio pra isso: nos
 *  funis de Representantes ele aponta sempre pra uma conta técnica/compartilhada
 *  (confirmado via dump em produção — user_id = Glauton Santos, id 11726977,
 *  em 100% dos negócios ganhos de ambas as pipelines, independente de quem
 *  realmente fez a reunião). Esse campo só passou a ser preenchido a partir de
 *  2026-08-14 — negócios ganhos antes disso ficam sem valor nele. */
const CAMPO_RESPONSAVEL = '5423af2de1d73fe3debbb582186c18338baed8cb';

/** Cada frente dentro do papel Representante tem seu próprio funil "principal"
 *  no Pipedrive — o negócio ganho nesse funil é o que conta como resultado
 *  pessoal (card "Representantes Cadastrados" / "Reps Ativados" da Meta do Mês).
 *  `fallbackSemCampo`: e-mail de quem herda os negócios ganhos ANTES do campo
 *  acima existir (sem isso o total de quem já vinha usando o funil despencaria
 *  no dia em que o campo passou a existir). Fica cada vez menos relevante à
 *  medida que meses antigos saem da janela e tudo vier com o campo preenchido. */
const CARGO_CONFIG = {
  // Prospecta e recruta — ganho no Funil de Reunião Agendada = rep cadastrado.
  'Aquisição de Canal': { pipelinePrincipal: 75, fallbackSemCampo: 'gabrielly.oliveira@cardapioweb.com' },
  // Ativa quem já foi cadastrado — ganho no funil de Onboarding→1º Cliente = rep ativado.
  'PSM': { pipelinePrincipal: 62, fallbackSemCampo: null },
};

// "[REP] Funil de Prospecção de Representantes" — ganho = agendamento marcado.
// OKR do squad de Aquisição de Canal inteiro: soma TODOS os ganhos da pipeline,
// sem filtrar por pessoa (é uma métrica de squad, não individual).
const PIPELINE_PROSPECCAO = 60;

// Squad de Representantes mapeado por e-mail de login. ownerId confirmado
// direto na lista de usuários do Pipedrive (GET /v1/users) — não usado pra
// contar ganhos (ver CAMPO_RESPONSAVEL acima), só fica registrado aqui pra
// referência/uso futuro. Beatriz (PSM): id encontrado, falta ela logar pelo
// menos uma vez pro cargo_representante dela virar "PSM" e o mapeamento ativar.
const REP_PESSOAS = {
  'gabrielly.oliveira@cardapioweb.com': { ownerId: 26387481, cargo: 'Aquisição de Canal', respostaId: '1796' },
  'hyorranes.souza@cardapioweb.com': { ownerId: 24835051, cargo: 'Aquisição de Canal', respostaId: '1795' },
  'beatriz.andrade@cardapioweb.com': { ownerId: 23176285, cargo: 'PSM', respostaId: null },
};

// Pipedrive devolve datas em UTC; o time opera em horário de Brasília (UTC-3,
// sem horário de verão desde 2019) — mesmo ajuste usado em api/meta.js.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) { return new Date(dataUtc.getTime() - TZ_OFFSET_MS); }
function wonTimeLocal(utcStr) {
  const instante = paraBR(new Date(utcStr.replace(' ', 'T') + 'Z'));
  return instante.toISOString().slice(0, 19).replace('T', ' ');
}

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

/** Varre TODOS os negócios ganhos da empresa no mês atual (igual ao api/meta.js —
 *  `user_id`/`pipeline_id` como filtro de querystring são ignorados silenciosamente
 *  por essa conta do Pipedrive, confirmado via debug em produção: filtrar sempre no
 *  código, nunca na URL) e devolve, pra cada pipeline pedida, o total de ganhos e a
 *  contagem por valor do CAMPO_RESPONSAVEL (negócios sem esse campo preenchido não
 *  entram em `porResposta`, mas contam em `total`). */
async function escanearGanhosDoMes(pipelinesAlvo, prefixoMes, iniciaMes) {
  const porPipeline = Object.fromEntries(pipelinesAlvo.map(p => [p, { total: 0, porResposta: {} }]));
  let start = 0;
  while (true) {
    const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&limit=200&start=${start}&sort=won_time%20DESC`;
    const json = await fetchPipedriveComRetry(url);
    if (!Array.isArray(json.data) || json.data.length === 0) break;
    let parar = false;
    for (const deal of json.data) {
      const wtRaw = deal.won_time || '';
      if (!wtRaw) continue;
      const wt = wonTimeLocal(wtRaw);
      if (wt < iniciaMes) { parar = true; break; }
      if (!wt.startsWith(prefixoMes)) continue;
      const bucket = porPipeline[deal.pipeline_id];
      if (!bucket) continue;
      bucket.total++;
      const resposta = deal[CAMPO_RESPONSAVEL];
      if (resposta != null) {
        const chave = String(resposta);
        bucket.porResposta[chave] = (bucket.porResposta[chave] || 0) + 1;
      }
    }
    if (parar || !json.additional_data?.pagination?.more_items_in_collection) break;
    start += 200;
  }
  return porPipeline;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const email = String(req.query.email || '').toLowerCase();
  const pessoa = REP_PESSOAS[email];

  const agora = paraBR(new Date());
  const ano = agora.getUTCFullYear();
  const mesNum = agora.getUTCMonth();
  const mes = String(mesNum + 1).padStart(2, '0');
  const prefixo = `${ano}-${mes}`;
  const iniciaMes = `${ano}-${mes}-01`;

  try {
    const pipelinePrincipal = pessoa ? CARGO_CONFIG[pessoa.cargo]?.pipelinePrincipal : null;
    const pipelinesAlvo = [PIPELINE_PROSPECCAO, ...(pipelinePrincipal ? [pipelinePrincipal] : [])];
    const porPipeline = await escanearGanhosDoMes(pipelinesAlvo, prefixo, iniciaMes);

    // Agendamentos: OKR do squad de Aquisição de Canal inteiro — total da
    // pipeline, sem filtrar por pessoa (é uma métrica de squad, não individual).
    const agendamentos = porPipeline[PIPELINE_PROSPECCAO]?.total ?? 0;

    // Resultado pessoal: quanto do CAMPO_RESPONSAVEL bate com essa pessoa, mais
    // (só pra quem é o fallback da frente) os negócios ganhos antes do campo
    // existir, que não têm valor nenhum nele.
    let cadastros = null;
    if (pessoa && pipelinePrincipal) {
      const dados = porPipeline[pipelinePrincipal];
      const doCampo = (pessoa.respostaId != null ? dados.porResposta[pessoa.respostaId] : null) || 0;
      const cfg = CARGO_CONFIG[pessoa.cargo];
      let semCampo = 0;
      if (cfg?.fallbackSemCampo === email) {
        const atribuidos = Object.values(dados.porResposta).reduce((a, b) => a + b, 0);
        semCampo = dados.total - atribuidos;
      }
      cadastros = doCampo + semCampo;
    }

    res.status(200).json({
      ok: true, mes: prefixo, cadastros,
      // Agendamentos só faz sentido pra quem é da Aquisição de Canal (OKR do squad).
      agendamentos: pessoa?.cargo === 'Aquisição de Canal' ? agendamentos : null,
      cargo: pessoa?.cargo ?? null,
      reconhecido: pessoa != null,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
