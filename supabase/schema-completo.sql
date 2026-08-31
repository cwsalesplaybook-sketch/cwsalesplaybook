-- =====================================================================
-- CW Sales Playbook — schema completo (public)
-- Recria o schema num projeto Supabase novo. Cole TUDO no SQL Editor e rode.
-- Idempotente o suficiente pra rodar de novo. NÃO cria dados nem usuários.
--
-- Ordem: extensões -> tabelas -> funções -> RLS -> policies -> triggers -> grants.
-- (as funções vêm DEPOIS das tabelas porque referenciam sdr_profiles/rag_chunks)
-- =====================================================================

-- Não valida corpo de função na criação (evita erro de ordem de dependência).
set check_function_bodies = off;

-- ---------- Extensões ----------
create extension if not exists "pgcrypto";      -- gen_random_uuid()

-- =====================================================================
-- TABELAS
-- =====================================================================

-- ---------- content_overrides ----------
create table if not exists public.content_overrides (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now(),
  updated_by text
);

-- ---------- sdr_profiles ----------
create table if not exists public.sdr_profiles (
  user_id             uuid primary key references auth.users(id) on delete cascade,
  email               text,
  apelido             text,
  papel               text,
  squad               text,
  squads_lideradas    text[] not null default '{}',
  cargo_lideranca     text,
  onboarding_done     boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  cargo_representante text
);
comment on column public.sdr_profiles.cargo_representante is
  'Frente dentro do papel Representante: "Aquisição de Canal" ou "PSM" — define quais funis do Pipedrive alimentam a Meta do Mês de cada pessoa.';
create index if not exists idx_sdr_profiles_squad on public.sdr_profiles (squad);

-- ---------- team_metas ----------
create table if not exists public.team_metas (
  squad      text not null,
  mes        text not null,
  meta1      integer not null default 0,
  meta2      integer not null default 0,
  meta3      integer not null default 0,
  mega1      integer not null default 0,
  mega2      integer not null default 0,
  mega3      integer not null default 0,
  updated_by text,
  updated_at timestamptz not null default now(),
  primary key (squad, mes)
);

-- ---------- user_metas ----------
create table if not exists public.user_metas (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  sdr_id     text,
  meta1      integer default 0,
  meta2      integer default 0,
  meta3      integer default 0,
  ajuste     integer default 0,
  mes        text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  mega1      integer default 0,
  mega2      integer default 0,
  mega3      integer default 0,
  dias_uteis integer,
  unique (user_id, mes)
);

-- ---------- squad_kpis ----------
create table if not exists public.squad_kpis (
  squad                 text not null,
  mes                   text not null,
  meta_clientes         integer not null default 0,
  meta_clientes_dia     integer not null default 0,
  meta_ltr              numeric not null default 0,
  meta_no_show          numeric not null default 0,
  updated_by            text,
  updated_at            timestamptz not null default now(),
  meta_agendamentos_dia integer not null default 0,
  primary key (squad, mes)
);

-- ---------- promocoes ----------
create table if not exists public.promocoes (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  novo_papel    text not null,
  novo_squad    text,
  promovido_por text,
  status        text not null default 'pendente',
  created_at    timestamptz not null default now(),
  concluida_at  timestamptz
);

-- ---------- kanban_reunioes ----------
create table if not exists public.kanban_reunioes (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  contato         text not null,
  horario         timestamptz,
  etapa           text not null default 'reuniao_marcada' check (etapa in (
                    'reuniao_marcada','confirmacao_1','confirmacao_2','no_show',
                    'em_atendimento','link_pagamento','contratou','nao_contratou')),
  notas           text,
  google_event_id text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  closer          text
);
create index if not exists kanban_reunioes_user_id_idx on public.kanban_reunioes (user_id);
create unique index if not exists kanban_reunioes_user_google_event_idx
  on public.kanban_reunioes (user_id, google_event_id) where google_event_id is not null;

-- ---------- google_calendar_connections ----------
create table if not exists public.google_calendar_connections (
  user_id        uuid primary key references auth.users(id) on delete cascade,
  refresh_token  text not null,
  connected_at   timestamptz not null default now(),
  last_synced_at timestamptz
);

-- ---------- roleplay_scores ----------
create table if not exists public.roleplay_scores (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  nome_exibicao text not null,
  persona_id    text not null,
  dificuldade   text not null,
  pontos        integer not null,
  rank          text not null check (rank in ('S','A','B','C','D')),
  desfecho      text not null check (desfecho in ('vitoria','parcial','derrota','tempo')),
  raiz_revelada boolean not null default false,
  turnos        integer not null,
  jogadas       jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now()
);
create index if not exists roleplay_scores_user_id_idx on public.roleplay_scores (user_id);
create index if not exists roleplay_scores_persona_id_idx on public.roleplay_scores (persona_id);

-- ---------- onboarding_progress ----------
create table if not exists public.onboarding_progress (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  checked_ids text[] not null default '{}',
  done_items  integer not null default 0,
  total_items integer not null default 0,
  percent     integer not null default 0,
  updated_at  timestamptz not null default now()
);

-- ---------- reps_agenda_reunioes ----------
create table if not exists public.reps_agenda_reunioes (
  id                    uuid primary key default gen_random_uuid(),
  pipedrive_activity_id bigint unique,
  lead_nome             text,
  lead_telefone         text,
  lead_email            text,
  responsavel           text not null check (responsavel in ('Gabrielly','Hyorranes')),
  data                  date not null,
  hora                  text,
  agendada_em           date not null,
  presenca              text check (presenca in ('compareceu','nao_compareceu')),
  created_by            uuid references auth.users(id) on delete set null,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);
create index if not exists idx_reps_agenda_reunioes_agendada_em on public.reps_agenda_reunioes (agendada_em);
create index if not exists idx_reps_agenda_reunioes_pipedrive_id on public.reps_agenda_reunioes (pipedrive_activity_id);

-- ---------- rag_chunks (busca full-text da aba Tira-dúvidas) ----------
create table if not exists public.rag_chunks (
  id          uuid primary key default gen_random_uuid(),
  source      text not null,
  source_url  text not null,
  title       text,
  content     text not null,
  updated_at  timestamptz not null default now(),
  content_tsv tsvector generated always as
    (to_tsvector('portuguese', coalesce(title,'') || ' ' || content)) stored
);
create index if not exists rag_chunks_source_idx on public.rag_chunks (source);
create index if not exists rag_chunks_content_tsv_idx on public.rag_chunks using gin (content_tsv);

-- =====================================================================
-- FUNÇÕES (depois das tabelas — referenciam sdr_profiles / rag_chunks)
-- =====================================================================

create or replace function public.squads_que_lidero()
returns text[] language sql security definer set search_path = public stable as $$
  select coalesce(squads_lideradas, '{}') from public.sdr_profiles where user_id = auth.uid();
$$;

create or replace function public.lidero_o_usuario(alvo uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.sdr_profiles p
    where p.user_id = alvo and p.squad = any (public.squads_que_lidero())
  );
$$;

create or replace function public.mesmo_squad(alvo uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1
    from public.sdr_profiles caller
    join public.sdr_profiles alvo_perfil on alvo_perfil.user_id = alvo
    where caller.user_id = auth.uid()
      and caller.squad is not null
      and caller.squad = alvo_perfil.squad
  );
$$;

create or replace function public.meu_squad()
returns text language sql security definer set search_path = public stable as $$
  select squad from public.sdr_profiles where user_id = auth.uid();
$$;

create or replace function public.touch_content_overrides()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.to_or_tsquery(config regconfig, txt text)
returns tsquery language sql immutable as $$
  select coalesce(string_agg(word, ' | ')::tsquery, ''::tsquery)
  from (
    select (regexp_matches(to_tsvector(config, txt)::text, $q$'([^']+)'$q$, 'g'))[1] as word
  ) t;
$$;

create or replace function public.match_rag_chunks(query_text text, match_count int default 6)
returns table (id uuid, source text, source_url text, title text, content text, rank float)
language sql stable security definer set search_path = public as $$
  select id, source, source_url, title, content,
         ts_rank(content_tsv, public.to_or_tsquery('portuguese', query_text)) as rank
  from public.rag_chunks
  where content_tsv @@ public.to_or_tsquery('portuguese', query_text)
  order by rank desc
  limit match_count;
$$;

-- =====================================================================
-- RLS
-- =====================================================================
alter table public.content_overrides           enable row level security;
alter table public.sdr_profiles                enable row level security;
alter table public.team_metas                  enable row level security;
alter table public.user_metas                  enable row level security;
alter table public.squad_kpis                  enable row level security;
alter table public.promocoes                   enable row level security;
alter table public.kanban_reunioes             enable row level security;
alter table public.google_calendar_connections enable row level security;
alter table public.roleplay_scores             enable row level security;
alter table public.onboarding_progress         enable row level security;
alter table public.reps_agenda_reunioes        enable row level security;
alter table public.rag_chunks                  enable row level security;

-- ----- content_overrides -----
drop policy if exists "Conteúdo é público para leitura" on public.content_overrides;
create policy "Conteúdo é público para leitura" on public.content_overrides
  for select using (true);
drop policy if exists "Bloqueia escrita direta de clientes" on public.content_overrides;
create policy "Bloqueia escrita direta de clientes" on public.content_overrides
  for all using (false) with check (false);

-- ----- sdr_profiles -----
drop policy if exists "Usuário gerencia o próprio perfil" on public.sdr_profiles;
create policy "Usuário gerencia o próprio perfil" on public.sdr_profiles
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Líder vê perfis do squad que lidera" on public.sdr_profiles;
create policy "Líder vê perfis do squad que lidera" on public.sdr_profiles
  for select using (squad = any (public.squads_que_lidero()));
drop policy if exists "Colega vê perfis do mesmo squad" on public.sdr_profiles;
create policy "Colega vê perfis do mesmo squad" on public.sdr_profiles
  for select using (public.mesmo_squad(user_id));

-- ----- user_metas -----
drop policy if exists "SDR vê só a própria meta" on public.user_metas;
create policy "SDR vê só a própria meta" on public.user_metas
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Líder lê metas do squad" on public.user_metas;
create policy "Líder lê metas do squad" on public.user_metas
  for select using (public.lidero_o_usuario(user_id));
drop policy if exists "Líder edita metas do squad" on public.user_metas;
create policy "Líder edita metas do squad" on public.user_metas
  for all using (public.lidero_o_usuario(user_id)) with check (public.lidero_o_usuario(user_id));
drop policy if exists "Colega lê metas do mesmo squad" on public.user_metas;
create policy "Colega lê metas do mesmo squad" on public.user_metas
  for select using (public.mesmo_squad(user_id));

-- ----- team_metas -----
drop policy if exists "Escrita da meta do time só por service role" on public.team_metas;
create policy "Escrita da meta do time só por service role" on public.team_metas
  for all using (false) with check (false);
drop policy if exists "Líder edita meta do time" on public.team_metas;
create policy "Líder edita meta do time" on public.team_metas
  for all using (squad = any (public.squads_que_lidero())) with check (squad = any (public.squads_que_lidero()));
drop policy if exists "Membro lê meta do próprio squad" on public.team_metas;
create policy "Membro lê meta do próprio squad" on public.team_metas
  for select using (squad = public.meu_squad());

-- ----- squad_kpis -----
drop policy if exists "Líder edita KPIs do squad" on public.squad_kpis;
create policy "Líder edita KPIs do squad" on public.squad_kpis
  for all using (squad = any (public.squads_que_lidero())) with check (squad = any (public.squads_que_lidero()));
drop policy if exists "Membro lê KPIs do próprio squad" on public.squad_kpis;
create policy "Membro lê KPIs do próprio squad" on public.squad_kpis
  for select using (squad = public.meu_squad());

-- ----- promocoes -----
drop policy if exists "Vê a própria promoção" on public.promocoes;
create policy "Vê a própria promoção" on public.promocoes
  for select using (auth.uid() = user_id);
drop policy if exists "Conclui a própria promoção" on public.promocoes;
create policy "Conclui a própria promoção" on public.promocoes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Líder gerencia promoção do squad" on public.promocoes;
create policy "Líder gerencia promoção do squad" on public.promocoes
  for all using (public.lidero_o_usuario(user_id)) with check (public.lidero_o_usuario(user_id));

-- ----- kanban_reunioes -----
drop policy if exists "Vê os próprios cards" on public.kanban_reunioes;
create policy "Vê os próprios cards" on public.kanban_reunioes
  for select using (auth.uid() = user_id);
drop policy if exists "Cria os próprios cards" on public.kanban_reunioes;
create policy "Cria os próprios cards" on public.kanban_reunioes
  for insert with check (auth.uid() = user_id);
drop policy if exists "Edita os próprios cards" on public.kanban_reunioes;
create policy "Edita os próprios cards" on public.kanban_reunioes
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "Remove os próprios cards" on public.kanban_reunioes;
create policy "Remove os próprios cards" on public.kanban_reunioes
  for delete using (auth.uid() = user_id);

-- ----- google_calendar_connections -----
-- Sem policies de propósito: acesso só via service role (edge functions).

-- ----- roleplay_scores -----
drop policy if exists "Time inteiro vê o placar" on public.roleplay_scores;
create policy "Time inteiro vê o placar" on public.roleplay_scores
  for select using (auth.uid() is not null);
drop policy if exists "Cria a própria partida" on public.roleplay_scores;
create policy "Cria a própria partida" on public.roleplay_scores
  for insert with check (auth.uid() = user_id);
drop policy if exists "Remove a própria partida" on public.roleplay_scores;
create policy "Remove a própria partida" on public.roleplay_scores
  for delete using (auth.uid() = user_id);

-- ----- onboarding_progress -----
drop policy if exists "Time inteiro vê o progresso de onboarding" on public.onboarding_progress;
create policy "Time inteiro vê o progresso de onboarding" on public.onboarding_progress
  for select using (auth.uid() is not null);
drop policy if exists "Usuário grava o próprio progresso" on public.onboarding_progress;
create policy "Usuário grava o próprio progresso" on public.onboarding_progress
  for insert with check (auth.uid() = user_id);
drop policy if exists "Usuário atualiza o próprio progresso" on public.onboarding_progress;
create policy "Usuário atualiza o próprio progresso" on public.onboarding_progress
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ----- reps_agenda_reunioes -----
drop policy if exists "Reps autenticados leem a agenda" on public.reps_agenda_reunioes;
create policy "Reps autenticados leem a agenda" on public.reps_agenda_reunioes
  for select using (auth.role() = 'authenticated');
drop policy if exists "Reps autenticados gerenciam a agenda" on public.reps_agenda_reunioes;
create policy "Reps autenticados gerenciam a agenda" on public.reps_agenda_reunioes
  for all using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

-- ----- rag_chunks -----
-- Sem policies: só service role (script de ingestão e api/tira-duvidas-rag.js).

-- =====================================================================
-- Triggers
-- =====================================================================
drop trigger if exists trg_content_overrides_touch on public.content_overrides;
create trigger trg_content_overrides_touch
  before update on public.content_overrides
  for each row execute function public.touch_content_overrides();

-- =====================================================================
-- Grants (EXECUTE das funções de liderança só pra 'authenticated')
-- =====================================================================
revoke execute on function public.squads_que_lidero() from public, anon;
revoke execute on function public.lidero_o_usuario(uuid) from public, anon;
grant  execute on function public.squads_que_lidero() to authenticated;
grant  execute on function public.lidero_o_usuario(uuid) to authenticated;

-- =====================================================================
-- Realtime (sync ao vivo dos overrides de conteúdo)
-- =====================================================================
alter table public.content_overrides replica identity full;
do $$
begin
  alter publication supabase_realtime add table public.content_overrides;
exception when duplicate_object then null;
end $$;

reset check_function_bodies;
