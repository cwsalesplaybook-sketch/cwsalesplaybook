/** Ingestão da base de conhecimento do RAG (Tira-dúvidas / ClarIA).
 *  Roda manualmente (`node index.mjs`) sempre que o conteúdo das fontes
 *  mudar — não é um endpoint, não faz parte do bundle do app.
 *
 *  Fontes: Confluence (Matriz de objeções + Informações sobre concorrentes),
 *  Google Sheets ([IS] Playbook de Vendas, todas as abas), Central de Ajuda
 *  e docs da API (ambos Mintlify).
 *
 *  Busca é full-text search do Postgres (sem custo/cota de IA nenhuma) —
 *  ver match_rag_chunks em neon/schema.sql. O Gemini só
 *  entra depois, em api/tira-duvidas-rag.ts, pra redigir a resposta final.
 *
 *  Env vars obrigatórias: SERVICE_DATABASE_URL (Neon, role dona das tabelas),
 *  CONFLUENCE_EMAIL, CONFLUENCE_API_TOKEN.
 */
import pg from 'pg';
import { fetchConfluenceDocs } from './lib/confluence.mjs';
import { fetchGoogleSheetDocs } from './lib/sheets.mjs';
import { fetchMintlifyDocs } from './lib/mintlify.mjs';
import { chunkText } from './lib/chunk.mjs';

const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID || '12IUEiWLFcXnLMqfAD0fAbDX0QBlW8hFI9qJrsWxmnUs';

const REQUIRED_ENV = ['SERVICE_DATABASE_URL', 'CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN'];

function checkEnv() {
  const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
  if (missing.length) {
    console.error(`Faltam env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

async function collectDocs() {
  const docs = [];

  const fontes = [
    { label: 'Confluence', fn: () => fetchConfluenceDocs(process.env.CONFLUENCE_EMAIL, process.env.CONFLUENCE_API_TOKEN) },
    { label: 'Google Sheets', fn: () => fetchGoogleSheetDocs(GOOGLE_SHEET_ID) },
    { label: 'Central de Ajuda', fn: () => fetchMintlifyDocs('https://ajuda.cardapioweb.com', 'ajuda') },
    { label: 'Docs da API', fn: () => fetchMintlifyDocs('https://docs.cardapioweb.com', 'docs-api') },
  ];

  for (const { label, fn } of fontes) {
    try {
      const result = await fn();
      console.log(`${label}: ${result.length} documento(s)`);
      docs.push(...result);
    } catch (e) {
      console.error(`${label} falhou: ${e.message}`);
    }
  }
  return docs;
}

async function main() {
  checkEnv();


  console.log('Coletando documentos...');
  const docs = await collectDocs();

  const sourcesFetched = [...new Set(docs.map((d) => d.source))];
  console.log(`\nTotal: ${docs.length} documentos de ${sourcesFetched.length} fonte(s): ${sourcesFetched.join(', ')}`);

  if (sourcesFetched.length === 0) {
    console.log('Nenhuma fonte respondeu, nada pra gravar. Abortando sem mexer no banco.');
    return;
  }

  console.log('\nQuebrando documentos em chunks...');
  const rows = [];
  for (const doc of docs) {
    for (const piece of chunkText(doc.content)) {
      rows.push({ source: doc.source, source_url: doc.sourceUrl, title: doc.title, content: piece });
    }
  }
  console.log(`Total de chunks: ${rows.length}`);

  // Limpa as fontes atualizadas e insere tudo numa transação só — se algo
  // falhar no meio, o banco fica como estava.
  console.log('\nGravando no banco...');
  const client = new pg.Client({ connectionString: process.env.SERVICE_DATABASE_URL });
  await client.connect();
  try {
    await client.query('BEGIN');
    await client.query('delete from public.rag_chunks where source = any($1)', [sourcesFetched]);
    const BATCH = 200;
    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const values = [];
      const params = [];
      batch.forEach((r, j) => {
        values.push(`($${j * 4 + 1}, $${j * 4 + 2}, $${j * 4 + 3}, $${j * 4 + 4})`);
        params.push(r.source, r.source_url, r.title, r.content);
      });
      await client.query(
        `insert into public.rag_chunks (source, source_url, title, content) values ${values.join(', ')}`,
        params,
      );
      console.log(`  ${Math.min(i + BATCH, rows.length)}/${rows.length} chunks inseridos`);
    }
    await client.query('COMMIT');
  } catch (e) {
    await client.query('ROLLBACK').catch(() => {});
    throw e;
  } finally {
    await client.end();
  }

  console.log('\nResumo por fonte:');
  const bySource = rows.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + 1;
    return acc;
  }, {});
  for (const [source, count] of Object.entries(bySource)) console.log(`  ${source}: ${count} chunks`);

  console.log('\nIngestão concluída.');
}

main().catch((e) => {
  console.error('Erro fatal na ingestão:', e);
  process.exit(1);
});
