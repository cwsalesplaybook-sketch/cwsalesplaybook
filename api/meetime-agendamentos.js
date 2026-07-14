const TOKEN = process.env.MEETIME_API_TOKEN;
const BASE = 'https://api.meetime.com.br/v2';

// Squad nosso -> "team_name" do Meetime. Squad "Serpentes" (Vithoria Rodrigues,
// liderança nova) ainda não tem time formado no Meetime — sem mapeamento ainda.
const SQUAD_PARA_TIME_MEETIME = {
  'Águia':   'Time Pedro',
  'Tubarão': 'Time Anderson',
  'Lobo':    'Time Joelma',
};

// Cadências de reagendamento/no-show — Ganho nelas não é um agendamento
// novo, é recuperação de quem já tinha faltado ou ainda não confirmou,
// então não conta pra "Agendamentos hoje" mesmo sendo Standard+Inbound.
const CADENCIAS_EXCLUIDAS = new Set([
  '[NO-SHOW] Fluxo de leads que não apareceram na reunião com closer',
  '[NO-SHOW][BDR][ON] Fluxo de leads que não apareceram na reunião com a agente de parcerias',
  '[PROSPECTS] Follow-up para garantir reunião',
  '[SETUP] Correção de problemas de no-show de WhatsApp',
]);

// Pipedrive/Meetime operam em horário de Brasília (UTC-3, sem horário de
// verão desde 2019) — mesmo ajuste usado em api/meta.js.
const TZ_OFFSET_MS = 3 * 60 * 60 * 1000;
function paraBR(dataUtc) {
  return new Date(dataUtc.getTime() - TZ_OFFSET_MS);
}

/** Pagina um endpoint do Meetime até acabar os resultados (a API não expõe cursor). */
async function buscarTudo(url) {
  let start = 0;
  let tudo = [];
  while (true) {
    const r = await fetch(`${url}&start=${start}&limit=100`, { headers: { Authorization: TOKEN } });
    const json = await r.json();
    const pagina = json.data || [];
    tudo = tudo.concat(pagina);
    if (pagina.length < 100) break;
    start += 100;
  }
  return tudo;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN) return res.status(500).json({ ok: false, erro: 'MEETIME_API_TOKEN não configurado' });

  const { squad } = req.query;
  if (!squad) return res.status(400).json({ ok: false, erro: 'squad obrigatório' });

  const timeNome = SQUAD_PARA_TIME_MEETIME[squad];
  if (!timeNome) {
    return res.status(200).json({ ok: true, agendamentosHoje: 0, aviso: `squad "${squad}" sem time do Meetime mapeado` });
  }

  // Janela de "hoje" em horário de Brasília, convertida de volta pra UTC real
  // (formato que a API do Meetime espera nos filtros de data).
  const agoraBR = paraBR(new Date());
  const inicioHojeBR = new Date(Date.UTC(agoraBR.getUTCFullYear(), agoraBR.getUTCMonth(), agoraBR.getUTCDate()));
  const fimHojeBR = new Date(inicioHojeBR.getTime() + 24 * 60 * 60 * 1000 - 1);
  const inicioHojeUtc = new Date(inicioHojeBR.getTime() + TZ_OFFSET_MS).toISOString();
  const fimHojeUtc = new Date(fimHojeBR.getTime() + TZ_OFFSET_MS).toISOString();

  try {
    // 1. Usuários do time do squad, pra filtrar as prospecções pelo dono certo.
    const usuarios = await buscarTudo(`${BASE}/users?`);
    const idsDoTime = new Set(usuarios.filter(u => u.team_name === timeNome).map(u => u.id));

    // 2. Cadências "Standard" + foco Inbound Ativo/Passivo — mesmo filtro do
    //    dashboard de metas do Meetime (Tipo de cadência: Standard; Cadências:
    //    Inbound Passivo + Inbound Ativo, sem Outbound/Outro) — menos as 4
    //    cadências de reagendamento/no-show em CADENCIAS_EXCLUIDAS.
    const cadencias = await buscarTudo(`${BASE}/cadences?`);
    const cadenciasValidas = new Set(
      cadencias
        .filter(c => c.type === 'STANDARD'
          && (c.cadence_focus === 'ACTIVE_INBOUND' || c.cadence_focus === 'PASSIVE_INBOUND')
          && !CADENCIAS_EXCLUIDAS.has(c.name))
        .map(c => c.id)
    );

    // 3. Todo Ganho hoje do time nessas cadências conta como agendamento —
    //    "SDR deu ganho" é o próprio ato de agendar a reunião, independente
    //    do canal (vídeo chamada, WhatsApp, ligação etc.).
    const prospeccoes = await buscarTudo(
      `${BASE}/prospections?status=WON&end_after=${encodeURIComponent(inicioHojeUtc)}&end_before=${encodeURIComponent(fimHojeUtc)}`
    );
    const agendamentosHoje = prospeccoes.filter(p => idsDoTime.has(p.owner_id) && cadenciasValidas.has(p.cadence_id)).length;

    res.status(200).json({
      ok: true, agendamentosHoje,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
