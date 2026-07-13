-- Meta do Squad passa a ser visível (leitura) pra qualquer membro do squad,
-- não só pra quem lidera — closer comum passa a acompanhar o andamento da
-- meta do time. A UI (MeuSquadMetaView) só exibe o agregado do squad, nunca
-- o detalhe individual dos colegas, mas a policy libera leitura de linha
-- porque o total real (fechamentos vindos do Pipedrive) só é calculável
-- no cliente somando o sdr_id de cada colega.

-- KPI novo: meta de agendamentos por dia (mesmo padrão de "clientes/dia").
ALTER TABLE public.squad_kpis
  ADD COLUMN IF NOT EXISTS meta_agendamentos_dia integer NOT NULL DEFAULT 0;

-- Squad do usuário logado é o mesmo squad do usuário alvo?
CREATE OR REPLACE FUNCTION public.mesmo_squad(alvo uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sdr_profiles caller
    JOIN public.sdr_profiles alvo_perfil ON alvo_perfil.user_id = alvo
    WHERE caller.user_id = auth.uid()
      AND caller.squad IS NOT NULL
      AND caller.squad = alvo_perfil.squad
  );
$$;

-- sdr_profiles: colega de squad enxerga os perfis dos membros do mesmo squad.
CREATE POLICY "Colega vê perfis do mesmo squad"
  ON public.sdr_profiles FOR SELECT
  USING (public.mesmo_squad(user_id));

-- user_metas: colega de squad lê (não edita) as metas dos membros do mesmo squad.
CREATE POLICY "Colega lê metas do mesmo squad"
  ON public.user_metas FOR SELECT
  USING (public.mesmo_squad(user_id));
