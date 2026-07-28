/** Puxa qualquer site Mintlify (expõe /llms.txt com índice + versão .md de
 *  cada página) — reaproveitado pra ajuda.cardapioweb.com (Central de Ajuda)
 *  e docs.cardapioweb.com (API/OAuth pra integradoras). */
export async function fetchMintlifyDocs(baseUrl, sourceName) {
  const idxRes = await fetch(`${baseUrl}/llms.txt`);
  if (!idxRes.ok) throw new Error(`llms.txt ${idxRes.status} em ${baseUrl}`);
  const idx = await idxRes.text();

  const urls = [...idx.matchAll(/\((https?:\/\/[^\s)]+\.md)\)/g)].map((m) => m[1]);

  const docs = [];
  for (const url of urls) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const md = await res.text();
      if (md.trim().length < 30) continue;
      const title = md.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? url;
      docs.push({
        source: sourceName,
        sourceUrl: url.replace(/\.md$/, ''),
        title,
        content: md,
      });
    } catch {
      // ignora falha pontual de um artigo, segue os demais
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return docs;
}
