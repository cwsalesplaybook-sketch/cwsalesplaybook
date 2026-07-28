-- Base de conhecimento do RAG da aba Tira-dúvidas (ClarIA).
-- Ingerida a partir de Confluence, Google Sheets, Central de Ajuda e docs da API
-- por scripts/rag-ingest/ (rodado manualmente, fora do bundle do app).
-- Sem policy de RLS: só acessível via service_role (script de ingestão e
-- api/tira-duvidas-rag.js), nunca pelo frontend.

create extension if not exists vector;

create table public.rag_chunks (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text not null,
  title text,
  content text not null,
  embedding vector(768) not null,
  updated_at timestamptz not null default now()
);

create index rag_chunks_embedding_idx
  on public.rag_chunks
  using hnsw (embedding vector_cosine_ops);

create index rag_chunks_source_idx on public.rag_chunks (source);

alter table public.rag_chunks enable row level security;

create or replace function public.match_rag_chunks(
  query_embedding vector(768),
  match_count int default 6,
  match_threshold float default 0.65
)
returns table (
  id uuid,
  source text,
  source_url text,
  title text,
  content text,
  similarity float
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
    1 - (embedding <=> query_embedding) as similarity
  from public.rag_chunks
  where 1 - (embedding <=> query_embedding) >= match_threshold
  order by embedding <=> query_embedding
  limit match_count;
$$;
