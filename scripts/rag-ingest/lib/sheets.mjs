/** Baixa o workbook inteiro do Google Sheets num request só (export=xlsx),
 *  sem precisar mapear o gid de cada aba manualmente, e converte cada aba
 *  em texto legível linha a linha ("Coluna: valor | Coluna2: valor2"). */
import * as XLSX from 'xlsx';

export async function fetchGoogleSheetDocs(sheetId) {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=xlsx`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheets export ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const wb = XLSX.read(buf, { type: 'buffer' });

  const docs = [];
  for (const sheetName of wb.SheetNames) {
    const ws = wb.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
    if (rows.length === 0) continue;

    const lines = rows
      .map((row) =>
        Object.entries(row)
          .filter(([, v]) => String(v).trim() !== '')
          .map(([k, v]) => `${k}: ${v}`)
          .join(' | '),
      )
      .filter(Boolean);
    if (lines.length === 0) continue;

    docs.push({
      source: 'sheets',
      sourceUrl: `https://docs.google.com/spreadsheets/d/${sheetId}/edit`,
      title: sheetName,
      content: lines.join('\n'),
    });
  }
  return docs;
}
