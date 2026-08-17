-- Agenda de Reuniões dos Representantes: guarda correções manuais sobre as
-- reuniões vindas do Pipedrive (responsável/data/hora nem sempre confiáveis
-- lá — a Gabi agenda tanto no perfil dela quanto no do Hyorranes) e permite
-- adicionar reuniões retroativas que não têm registro correto no Pipedrive.
--
-- pipedrive_activity_id preenchido = corrige uma reunião que já existe no
-- Pipedrive (o front casa pelo id e essa linha vence por completo: data/hora/
-- responsavel sempre voltam junto, mesmo corrigindo só um campo).
-- pipedrive_activity_id nulo = reunião só existe aqui (lead_nome obrigatório).
--
-- Só Gabrielly e Hyorranes usam essa tela hoje; RLS liberada pra qualquer
-- usuário autenticado (mesmo nível de acesso que "OKRs & Metas do Squad" já
-- tem, que nem precisa de tabela — não há dado sensível além do que já é
-- visível no Pipedrive pros dois). updated_at é setado pelo app em cada escrita.
CREATE TABLE IF NOT EXISTS public.reps_agenda_reunioes (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pipedrive_activity_id bigint UNIQUE,
  lead_nome             text,
  lead_telefone         text,
  lead_email            text,
  responsavel           text NOT NULL CHECK (responsavel IN ('Gabrielly', 'Hyorranes')),
  data                  date NOT NULL,
  hora                  text,
  agendada_em           date NOT NULL,
  presenca              text CHECK (presenca IN ('compareceu', 'nao_compareceu')),
  created_by            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at            timestamptz NOT NULL DEFAULT now(),
  updated_at            timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reps_agenda_reunioes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reps autenticados leem a agenda"
  ON public.reps_agenda_reunioes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Reps autenticados gerenciam a agenda"
  ON public.reps_agenda_reunioes FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE INDEX idx_reps_agenda_reunioes_agendada_em ON public.reps_agenda_reunioes (agendada_em);
CREATE INDEX idx_reps_agenda_reunioes_pipedrive_id ON public.reps_agenda_reunioes (pipedrive_activity_id);
