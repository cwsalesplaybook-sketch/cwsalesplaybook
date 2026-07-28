-- Troca a busca por embedding (vector) por full-text search nativo do
-- Postgres. Motivo: a cota gratuita de embedding do Gemini é de 1000
-- requisições/dia — tanto a ingestão quanto o uso normal do chat (que
-- embedaria a pergunta de cada SDR) disputariam essa mesma cota. Full-text
-- search não depende de nenhuma chamada externa; o Gemini continua só
-- pra redigir a resposta final (generateContent, cota separada e folgada).

alter table public.rag_chunks
  drop column embedding,
  add column content_tsv tsvector
    generated always as (to_tsvector('portuguese', coalesce(title, '') || ' ' || content)) stored;

create index rag_chunks_content_tsv_idx on public.rag_chunks using gin (content_tsv);

drop function if exists public.match_rag_chunks(vector, int, float);

create or replace function public.match_rag_chunks(
  query_text text,
  match_count int default 6
)
returns table (
  id uuid,
  source text,
  source_url text,
  title text,
  content text,
  rank float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    id,
    source,
    source_url,
    title,
    content,
    ts_rank(content_tsv, plainto_tsquery('portuguese', query_text)) as rank
  from public.rag_chunks
  where content_tsv @@ plainto_tsquery('portuguese', query_text)
  order by rank desc
  limit match_count;
$$;
