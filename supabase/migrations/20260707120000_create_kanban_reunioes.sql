-- Kanban de reuniões do SDR: cada card é uma reunião marcada, movida entre
-- etapas até virar cliente (ou não). Board pessoal — cada usuário só vê o seu.
CREATE TABLE IF NOT EXISTS public.kanban_reunioes (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contato        text NOT NULL,
  horario        timestamptz,
  etapa          text NOT NULL DEFAULT 'reuniao_marcada' CHECK (etapa IN (
                   'reuniao_marcada', 'confirmacao_1', 'confirmacao_2', 'no_show',
                   'em_atendimento', 'link_pagamento', 'contratou', 'nao_contratou'
                 )),
  notas          text,
  google_event_id text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.kanban_reunioes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vê os próprios cards"
  ON public.kanban_reunioes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Cria os próprios cards"
  ON public.kanban_reunioes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Edita os próprios cards"
  ON public.kanban_reunioes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Remove os próprios cards"
  ON public.kanban_reunioes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX kanban_reunioes_user_id_idx ON public.kanban_reunioes (user_id);
