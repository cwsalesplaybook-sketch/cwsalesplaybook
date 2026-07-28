/** Puxa páginas do Confluence (space CINTCW) — recursivo a partir de raízes
 *  conhecidas, pra pegar filhas novas automaticamente se o time adicionar
 *  mais páginas dentro de "Materiais de apoio" no futuro. */
const BASE = 'https://cardapio-web.atlassian.net/wiki';

// Raízes: "Materiais de apoio" (contém Matriz de objeção como filha) e a
// página solta "Informações sobre concorrentes" (achada via busca por título).
// A própria página do prompt do ClarIA (1319174145) é ignorada de propósito —
// ela é usada como base do system prompt em código, não como conteúdo pra buscar.
const ROOTS = ['1318715405', '1318617178'];

function authHeader(email, token) {
  const b64 = Buffer.from(`${email}:${token}`).toString('base64');
  return `Basic ${b64}`;
}

function htmlToText(html) {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&aacute;/g, 'á').replace(/&eacute;/g, 'é').replace(/&iacute;/g, 'í')
    .replace(/&oacute;/g, 'ó').replace(/&uacute;/g, 'ú').replace(/&atilde;/g, 'ã')
    .replace(/&otilde;/g, 'õ').replace(/&ccedil;/g, 'ç').replace(/&Ccedil;/g, 'Ç')
    .replace(/&Atilde;/g, 'Ã').replace(/&Otilde;/g, 'Õ').replace(/&mdash;/g, '-')
    .replace(/&rarr;/g, '->').replace(/&quot;/g, '"').replace(/&Eacute;/g, 'É')
    .replace(/&Iacute;/g, 'Í').replace(/&ecirc;/g, 'ê').replace(/&Ecirc;/g, 'Ê')
    .replace(/&atilde/g, 'ã').replace(/&#x20;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchPage(id, email, token) {
  const res = await fetch(`${BASE}/rest/api/content/${id}?expand=body.storage`, {
    headers: { Authorization: authHeader(email, token), Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Confluence content/${id} ${res.status}: ${await res.text()}`);
  return res.json();
}

async function fetchChildren(id, email, token) {
  const res = await fetch(`${BASE}/rest/api/content/${id}/child/page?limit=50`, {
    headers: { Authorization: authHeader(email, token), Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Confluence child/${id} ${res.status}: ${await res.text()}`);
  const json = await res.json();
  return json.results.map((r) => r.id);
}

export async function fetchConfluenceDocs(email, token) {
  const docs = [];
  const seen = new Set();

  async function walk(id) {
    if (seen.has(id)) return;
    seen.add(id);

    const page = await fetchPage(id, email, token);
    const html = page?.body?.storage?.value ?? '';
    const text = htmlToText(html);
    if (text.length > 20) {
      docs.push({
        source: 'confluence',
        sourceUrl: `https://cardapio-web.atlassian.net/wiki/spaces/CINTCW/pages/${id}`,
        title: page.title,
        content: text,
      });
    }

    const children = await fetchChildren(id, email, token);
    for (const childId of children) await walk(childId);
  }

  for (const rootId of ROOTS) await walk(rootId);
  return docs;
}
