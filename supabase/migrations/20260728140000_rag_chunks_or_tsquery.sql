-- match_rag_chunks usava plainto_tsquery, que exige TODAS as palavras da
-- pergunta no mesmo chunk (semântica E) — bom demais pra bater com
-- perguntas naturais de SDR. Troca pra uma busca OU: cada termo da
-- pergunta pontua, ranqueado por quantos/quão raros os termos batem
-- (ts_rank), igual um "qualquer uma dessas palavras, as que mais baterem
-- ganham" em vez de "todas ou nada".

create or replace function public.to_or_tsquery(config regconfig, txt text)
returns tsquery
language sql
immutable
as $$
  select coalesce(string_agg(word, ' | ')::tsquery, ''::tsquery)
  from (
    select (regexp_matches(to_tsvector(config, txt)::text, $q$'([^']+)'$q$, 'g'))[1] as word
  ) t;
$$;

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
    ts_rank(content_tsv, public.to_or_tsquery('portuguese', query_text)) as rank
  from public.rag_chunks
  where content_tsv @@ public.to_or_tsquery('portuguese', query_text)
  order by rank desc
  limit match_count;
$$;
