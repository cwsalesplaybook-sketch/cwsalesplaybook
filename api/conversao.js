const TOKEN_MEETIME = process.env.MEETIME_API_TOKEN;
const MEETIME_BASE = 'https://api.meetime.com.br/v2';

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

// Meetime opera em horário de Brasília (UTC-3, sem horário de verão desde
// 2019) — mesmo ajuste usado em api/meta.js.
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

  const { email, grupo } = req.query;
  if (!email) return res.status(400).json({ ok: false, erro: 'email obrigatório' });
  // 'todos' resolve os 5 grupos numa invocação só.
  const gruposAlvo = grupo === 'todos' ? NOMES_GRUPOS : [grupo];
  if (gruposAlvo.some(g => !GRUPOS_TIER[g])) return res.status(400).json({ ok: false, erro: 'grupo inválido' });

  try {
    // 1. Acha o usuário do Meetime pelo e-mail de login (mesmo domínio da conta).
    const usuarios = await buscarTudoMeetime(`${MEETIME_BASE}/users?`);
    const usuario = usuarios.find(u => (u.email || '').toLowerCase() === String(email).toLowerCase());
    if (!usuario) {
      const vazio = Object.fromEntries(gruposAlvo.map(g => [g, { agendamentos: 0 }]));
      const aviso = 'SDR não encontrado no Meetime (confira o e-mail de login)';
      return res.status(200).json(
        grupo === 'todos'
          ? { ok: true, grupos: vazio, aviso }
          : { ok: true, agendamentos: 0, aviso }
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

    const contagem = {};
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
      contagem[g] = { agendamentos: prospeccoes.filter(p => cadenciasDoGrupo.has(p.cadence_id)).length };
    }

    const ts = new Date().toISOString();
    if (grupo === 'todos') {
      return res.status(200).json({ ok: true, grupos: contagem, ts });
    }
    res.status(200).json({ ok: true, agendamentos: contagem[grupo].agendamentos, ts });
  } catch (e) {
    res.status(500).json({ ok: false, erro: String(e) });
  }
}
