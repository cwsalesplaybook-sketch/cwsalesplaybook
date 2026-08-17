-- Progresso do checklist de onboarding: uma linha por usuário, sobrescrita
-- (upsert) a cada mudança. Guardada no Supabase pra o gestor acompanhar o
-- avanço de cada SDR em /admin; o localStorage do próprio usuário já cobre
-- a persistência imediata no navegador dele.
CREATE TABLE IF NOT EXISTS public.onboarding_progress (
  user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  checked_ids text[] NOT NULL DEFAULT '{}',
  done_items  integer NOT NULL DEFAULT 0,
  total_items integer NOT NULL DEFAULT 0,
  percent     integer NOT NULL DEFAULT 0,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.onboarding_progress ENABLE ROW LEVEL SECURITY;

-- Leitura liberada pro time logado: é assim que o painel do gestor
-- (GestorAdminPage) lê o progresso de todo mundo direto do client.
CREATE POLICY "Time inteiro vê o progresso de onboarding"
  ON public.onboarding_progress FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Cada usuário só grava/atualiza a própria linha.
CREATE POLICY "Usuário grava o próprio progresso"
  ON public.onboarding_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário atualiza o próprio progresso"
  ON public.onboarding_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
