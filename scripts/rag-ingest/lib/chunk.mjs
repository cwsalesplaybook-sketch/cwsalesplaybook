/** Quebra um texto longo em pedaços de ~maxChars, tentando cortar em
 *  parágrafo ou frase antes do limite, com sobreposição entre pedaços
 *  pra não perder contexto na fronteira. */
export function chunkText(text, { maxChars = 1800, overlap = 150 } = {}) {
  const clean = text.replace(/\r\n/g, '\n').trim();
  if (clean.length === 0) return [];
  if (clean.length <= maxChars) return [clean];

  const chunks = [];
  let start = 0;
  while (start < clean.length) {
    let end = Math.min(start + maxChars, clean.length);
    if (end < clean.length) {
      const paraBreak = clean.lastIndexOf('\n\n', end);
      const sentBreak = clean.lastIndexOf('. ', end);
      if (paraBreak > start + maxChars * 0.5) end = paraBreak;
      else if (sentBreak > start + maxChars * 0.5) end = sentBreak + 1;
    }
    const piece = clean.slice(start, end).trim();
    if (piece) chunks.push(piece);
    if (end >= clean.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks;
}
