-- Perfis dos usuários (squad, papel, apelido) e metas agregadas por squad.
-- Habilita a "visão de time" na Meta do Mês: o SDR grava seu squad aqui;
-- a liderança grava quais squads lidera (squads_lideradas).
-- A leitura cruzada (líder vendo o time) é feita por service role numa API,
-- por isso a RLS direta mantém cada usuário restrito à própria linha.

-- ── Perfis ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.sdr_profiles (
  user_id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email            text,
  apelido          text,
  papel            text,
  squad            text,                         -- squad do próprio SDR
  squads_lideradas text[] NOT NULL DEFAULT '{}', -- squads que a liderança lidera
  cargo_lideranca  text,
  onboarding_done  boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.sdr_profiles ENABLE ROW LEVEL SECURITY;

-- Cada usuário gerencia apenas a própria linha. Leitura de time = service role.
CREATE POLICY "Usuário gerencia o próprio perfil"
  ON public.sdr_profiles FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Índice para buscar membros por squad (usado pela API de time via service role).
CREATE INDEX IF NOT EXISTS idx_sdr_profiles_squad ON public.sdr_profiles (squad);

-- ── Meta agregada por squad ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.team_metas (
  squad      text NOT NULL,
  mes        text NOT NULL,                 -- formato YYYY-MM
  meta1      integer NOT NULL DEFAULT 0,
  meta2      integer NOT NULL DEFAULT 0,
  meta3      integer NOT NULL DEFAULT 0,
  mega1      integer NOT NULL DEFAULT 0,
  mega2      integer NOT NULL DEFAULT 0,
  mega3      integer NOT NULL DEFAULT 0,
  updated_by text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (squad, mes)
);

ALTER TABLE public.team_metas ENABLE ROW LEVEL SECURITY;

-- Leitura liberada para usuários logados (o SDR vê a meta do time dele).
CREATE POLICY "Meta do time é legível por usuários logados"
  ON public.team_metas FOR SELECT
  USING (auth.role() = 'authenticated');

-- Escrita direta bloqueada: só a API (service role) grava, após validar o líder.
CREATE POLICY "Escrita da meta do time só por service role"
  ON public.team_metas FOR ALL
  USING (false)
  WITH CHECK (false);
