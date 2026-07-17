const TOKEN_MEETIME = process.env.MEETIME_API_TOKEN;
const TOKEN_PIPEDRIVE = process.env.PIPEDRIVE_API_TOKEN;
const MEETIME_BASE = 'https://api.meetime.com.br/v2';
const PIPELINE_VENDAS = 2; // "Funil de Vendas" — mesmo critério de api/meta.js

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=300');

  if (!TOKEN_MEETIME) return res.status(500).json({ ok: false, erro: 'MEETIME_API_TOKEN não configurado' });
  if (!TOKEN_PIPEDRIVE) return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });

  const { email, grupo } = req.query;
  if (!email) return res.status(400).json({ ok: false, erro: 'email obrigatório' });
  const grupoConfig = GRUPOS_TIER[grupo];
  if (!grupoConfig) return res.status(400).json({ ok: false, erro: 'grupo inválido' });

  try {
    // 1. Acha o usuário do Meetime pelo e-mail de login (mesmo domínio da conta).
    const usuarios = await buscarTudoMeetime(`${MEETIME_BASE}/users?`);
    const usuario = usuarios.find(u => (u.email || '').toLowerCase() === String(email).toLowerCase());
    if (!usuario) {
      return res.status(200).json({ ok: true, agendamentos: 0, convertidos: 0, aviso: 'SDR não encontrado no Meetime (confira o e-mail de login)' });
    }

    // 2. Cadências do grupo de tier escolhido — ignora cadências de teste/automação.
    const cadencias = await buscarTudoMeetime(`${MEETIME_BASE}/cadences?`);
    const cadenciasDoGrupo = new Set(
      cadencias
        .filter(c => {
          if (/TESTE/i.test(c.name)) return false;
          return grupoConfig.regex
            ? grupoConfig.regex.test(c.name)
            : grupoConfig.tiers.some(t => new RegExp(`\\bTIER ${t}\\b`, 'i').test(c.name));
        })
        .map(c => c.id)
    );

    // 3. Reuniões (Ganho no Meetime) desse SDR, nesse grupo de tier, no mês inteiro.
    const agora = paraBR(new Date());
    const inicioMes = new Date(Date.UTC(agora.getUTCFullYear(), agora.getUTCMonth(), 1));
    const inicioMesUtc = new Date(inicioMes.getTime() + TZ_OFFSET_MS).toISOString();
    const agoraUtc = new Date().toISOString();

    const prospeccoes = await buscarTudoMeetime(
      `${MEETIME_BASE}/prospections?status=WON&user_id=${usuario.id}&end_after=${encodeURIComponent(inicioMesUtc)}&end_before=${encodeURIComponent(agoraUtc)}`
    );
    const doGrupo = prospeccoes.filter(p => cadenciasDoGrupo.has(p.cadence_id));

    // 4. Pra cada reunião, pega o telefone do lead no Meetime e procura a
    //    mesma pessoa no Pipedrive pelo telefone — se ela tem deal Ganho no
    //    Funil de Vendas, o cliente pagou (converteu).
    const resultados = await Promise.all(doGrupo.map(async (p) => {
      try {
        const r = await fetch(`${MEETIME_BASE}/leads?id=${p.lead_id}`, { headers: { Authorization: TOKEN_MEETIME } });
        const j = await r.json();
        const lead = (j.data || [])[0];
        const digitos = String(lead?.primaryPhoneString || '').replace(/\D/g, '');
        if (digitos.length < 8) return false;
        const termo = digitos.slice(-9); // número local, sem DDI, evita ambiguidade de formatação

        const rs = await fetch(`https://api.pipedrive.com/v1/persons/search?term=${encodeURIComponent(termo)}&fields=phone&api_token=${TOKEN_PIPEDRIVE}`);
        const js = await rs.json();
        const pessoas = js.data?.items || [];

        for (const item of pessoas) {
          const rd = await fetch(`https://api.pipedrive.com/v1/persons/${item.item.id}/deals?api_token=${TOKEN_PIPEDRIVE}`);
          const jd = await rd.json();
          const deals = jd.data || [];
          if (deals.some(d => d.status === 'won' && Number(d.pipeline_id) === PIPELINE_VENDAS)) return true;
        }
        return false;
      } catch { return false; }
    }));

    const convertidos = resultados.filter(Boolean).length;
    res.status(200).json({
      ok: true, agendamentos: doGrupo.length, convertidos,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
