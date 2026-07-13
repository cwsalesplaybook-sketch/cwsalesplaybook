-- Fecha a brecha: team_metas/squad_kpis (só as metas-alvo, sem progresso real)
-- eram legíveis por QUALQUER usuário logado, não só de quem é do squad. Troca
-- pela mesma regra de isolamento por squad usada em sdr_profiles/user_metas —
-- quem lidera continua coberto pelas policies "Líder edita..." (FOR ALL já
-- inclui SELECT); isso aqui cobre o membro comum lendo só o próprio squad.

-- Squad do usuário logado (null se ainda não escolheu / não é SDR).
CREATE OR REPLACE FUNCTION public.meu_squad()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT squad FROM public.sdr_profiles WHERE user_id = auth.uid();
$$;

DROP POLICY IF EXISTS "Meta do time é legível por usuários logados" ON public.team_metas;
DROP POLICY IF EXISTS "KPIs do squad são legíveis por usuários logados" ON public.squad_kpis;

CREATE POLICY "Membro lê meta do próprio squad"
  ON public.team_metas FOR SELECT
  USING (squad = public.meu_squad());

CREATE POLICY "Membro lê KPIs do próprio squad"
  ON public.squad_kpis FOR SELECT
  USING (squad = public.meu_squad());
