import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN = process.env.PIPEDRIVE_API_TOKEN ?? '';
const BASE = 'https://api.pipedrive.com/v1';

// Nomes excluídos do ranking (não são SDRs ativos)
const EXCLUIR = [
  'Pedro Marcos', 'Guilherme Rocha', 'Mariana Almeida', 'Eduarda Oliveira',
  'Gustavo Rebouças', 'Bruno França', 'Igor Silva', 'Vítor Matihara',
  'Eric Amaral', 'Ana Debora', 'Aloísio Vasconcelos', 'Beatriz Magalhães',
  'Vanessa Alencar', 'Leonardo Costa', 'Layza Batista', 'Hyorranes Souza',
  'Wanessa Gomes', 'Victória Viana', 'Eduarda Costa',
];

function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
}

const EXCLUIR_NORM = new Set(EXCLUIR.map(normalize));

function excluir(nome: string) {
  const n = normalize(nome);
  return EXCLUIR_NORM.has(n) || [...EXCLUIR_NORM].some(e => n.includes(e) || e.includes(n));
}

async function pd(path: string, params: Record<string, string> = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set('api_token', TOKEN);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const r = await fetch(url.toString());
  if (!r.ok) throw new Error(`Pipedrive ${path} → ${r.status} ${r.statusText}`);
  return r.json();
}

async function fetchAllDeals(params: Record<string, string>) {
  const all: any[] = [];
  let start = 0;
  const limit = 500;
  while (true) {
    const data = await pd('/deals', { ...params, start: String(start), limit: String(limit) });
    const items: any[] = data.data ?? [];
    all.push(...items);
    if (!data.additional_data?.pagination?.more_items_in_collection) break;
    start += limit;
  }
  return all;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  if (!TOKEN) {
    return res.status(500).json({ ok: false, erro: 'PIPEDRIVE_API_TOKEN não configurado' });
  }

  try {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const mes = `${y}-${m}`;
    const startDate = `${y}-${m}-01`;
    const lastDay = new Date(y, now.getMonth() + 1, 0).getDate();
    const endDate = `${y}-${m}-${String(lastDay).padStart(2, '0')}`;

    // 1. Descobrir pipeline "Funil de Vendas"
    const [pipelinesRes, fieldsRes, usersRes] = await Promise.all([
      pd('/pipelines'),
      pd('/dealFields', { limit: '200' }),
      pd('/users'),
    ]);

    const pipeline = (pipelinesRes.data ?? []).find((p: any) =>
      normalize(p.name ?? '').includes('funil de vendas') ||
      normalize(p.name ?? '').includes('vendas')
    );
    const pipelineId: number | undefined = pipeline?.id;

    // 2. Descobrir chave do campo [QUAL] SDR/BDR
    const sdrField = (fieldsRes.data ?? []).find((f: any) =>
      (f.name ?? '').includes('SDR') || (f.name ?? '').includes('SDR/BDR')
    );
    const sdrKey: string | undefined = sdrField?.key;

    // 3. Mapa userId → nome
    const userMap: Record<number, string> = {};
    for (const u of (usersRes.data ?? [])) {
      if (u.id && u.name) userMap[u.id] = u.name;
    }

    // 4. Buscar todos os negócios ganhos no mês
    const params: Record<string, string> = {
      status: 'won',
      start_date: startDate,
      end_date: endDate,
    };
    if (pipelineId) params.pipeline_id = String(pipelineId);

    const deals = await fetchAllDeals(params);

    // 5. Filtrar pelo mês exato e agrupar por SDR
    const counts: Record<string, number> = {};

    for (const deal of deals) {
      const wonTime: string = deal.won_time ?? deal.close_time ?? '';
      if (!wonTime.startsWith(mes)) continue;

      // Resolver nome do SDR
      let sdrNome: string | null = null;

      if (sdrKey) {
        const val = deal[sdrKey];
        if (typeof val === 'string' && val.trim()) {
          sdrNome = val.trim();
        } else if (typeof val === 'number' && userMap[val]) {
          sdrNome = userMap[val];
        } else if (val && typeof val === 'object') {
          sdrNome = val.name ?? val.label ?? String(val.value ?? '');
        }
      }

      // Fallback: dono do negócio
      if (!sdrNome) {
        const ownerId: number = deal.user_id?.id ?? deal.creator_user_id?.id;
        sdrNome = ownerId ? (userMap[ownerId] ?? deal.owner_name ?? null) : deal.owner_name ?? null;
      }

      if (!sdrNome || excluir(sdrNome)) continue;

      counts[sdrNome] = (counts[sdrNome] ?? 0) + 1;
    }

    // 6. Montar ranking ordenado
    const ranking = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .map(([nome, vendas], i) => ({
        id: String(i),
        nome,
        iniciais: nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join(''),
        vendas,
      }));

    return res.json({
      ok: true,
      ranking,
      mes,
      total: deals.length,
      pipeline: pipeline?.name ?? 'Todos',
      sdrField: sdrField?.name ?? '(owner fallback)',
    });

  } catch (e: any) {
    return res.status(500).json({ ok: false, erro: e.message ?? 'Erro interno' });
  }
}
