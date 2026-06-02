/** Serverless function — busca deals ganhos do mês no Pipedrive e retorna ranking de SDRs. */
import type { VercelRequest, VercelResponse } from '@vercel/node';

const TOKEN = process.env.VITE_PIPEDRIVE_TOKEN || 'd31c60a2f05d7f0f83254f264bbe9f0d1ab81f26';
const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53';

const SDRS_ATIVOS: Record<string, string> = {
  '1523': 'Miguel Nunes',
  '1445': 'Gabrielly Oliveira',
  '1556': 'Thais Giurizatto',
  '1667': 'Luis Lincon',
  '1686': 'Jonas Sobreira',
  '1382': 'Tatyanna Freitas',
  '1708': 'Kailane Carvalho',
  '1407': 'Lara Stefanny',
  '1727': 'Raquel Alves',
  '1710': 'José Guilherme',
  '1728': 'Fabíola Azevedo',
  '1729': 'Enizia Evangelista',
  '1607': 'Caique Silva',
  '1555': 'Ana Alice',
  '1608': 'Ryan Felipe',
  '1730': 'Maria Gabriela',
  '1707': 'Karoline Santos',
  '1685': 'Dayana Ferreira',
  '1738': 'Clara Rodrigues',
  '1706': 'Raissa Fonseca',
  '1335': 'João Paulo',
};

// Managers excluídos
const EXCLUDE_OWNERS = new Set([22291180, 11726977, 22991209, 22122891, 12994693, 11871118]);

function getIniciais(nome: string) {
  return nome.split(' ').filter(Boolean).slice(0, 2).map(n => n[0].toUpperCase()).join('');
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  try {
    const agora = new Date();
    const ano = agora.getFullYear();
    const mes = String(agora.getMonth() + 1).padStart(2, '0');
    const prefixo = `${ano}-${mes}`;
    const iniciaMes = `${ano}-${mes}-01`;

    let start = 0;
    const limit = 200;
    const contagem: Record<string, number> = {};
    let paginas = 0;

    while (paginas < 15) {
      paginas++;
      const url = `https://api.pipedrive.com/v1/deals?api_token=${TOKEN}&status=won&pipeline_id=2&limit=${limit}&start=${start}&sort=close_time%20DESC`;
      const r = await fetch(url);
      const json = await r.json();
      if (!json.success || !json.data?.length) break;

      let achouAntigo = false;
      for (const deal of json.data) {
        const closeTime: string = deal.close_time ?? '';
        if (!closeTime) continue;
        if (closeTime < iniciaMes) { achouAntigo = true; break; }
        if (!closeTime.startsWith(prefixo)) continue;

        const wonTime: string = deal.won_time ?? '';
        if (!wonTime.startsWith(prefixo)) continue;

        const ownerId = typeof deal.user_id === 'object' ? deal.user_id?.id : deal.user_id;
        if (EXCLUDE_OWNERS.has(Number(ownerId))) continue;

        const sdrId = deal[SDR_FIELD] ? String(deal[SDR_FIELD]) : null;
        if (sdrId && SDRS_ATIVOS[sdrId]) {
          contagem[sdrId] = (contagem[sdrId] ?? 0) + 1;
        }
      }

      if (achouAntigo || !json.additional_data?.pagination?.more_items_in_collection) break;
      start += limit;
    }

    const ranking = Object.entries(contagem)
      .map(([sdrId, vendas]) => ({
        sdrId,
        nome: SDRS_ATIVOS[sdrId],
        iniciais: getIniciais(SDRS_ATIVOS[sdrId]),
        vendas,
      }))
      .sort((a, b) => b.vendas - a.vendas);

    res.json({ success: true, ranking, mes: `${prefixo}`, updatedAt: new Date().toISOString() });
  } catch (e) {
    res.status(500).json({ success: false, error: String(e) });
  }
}
