-- Permite que a liderança enxergue/edite os dados do(s) squad(s) que lidera,
-- sem afrouxar o acesso geral. Usa funções SECURITY DEFINER para evitar
-- recursão de RLS ao consultar a própria sdr_profiles dentro das policies.

-- Squads que o usuário logado lidera.
CREATE OR REPLACE FUNCTION public.squads_que_lidero()
RETURNS text[]
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT coalesce(squads_lideradas, '{}')
  FROM public.sdr_profiles
  WHERE user_id = auth.uid();
$$;

-- O usuário logado lidera o squad do usuário alvo?
CREATE OR REPLACE FUNCTION public.lidero_o_usuario(alvo uuid)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.sdr_profiles p
    WHERE p.user_id = alvo
      AND p.squad = ANY (public.squads_que_lidero())
  );
$$;

-- sdr_profiles: líder enxerga os perfis dos membros do squad que lidera.
CREATE POLICY "Líder vê perfis do squad que lidera"
  ON public.sdr_profiles FOR SELECT
  USING (squad = ANY (public.squads_que_lidero()));

-- user_metas: líder lê as metas dos membros do squad.
CREATE POLICY "Líder lê metas do squad"
  ON public.user_metas FOR SELECT
  USING (public.lidero_o_usuario(user_id));

-- user_metas: líder define/ajusta a meta individual de membros do squad.
CREATE POLICY "Líder edita metas do squad"
  ON public.user_metas FOR ALL
  USING (public.lidero_o_usuario(user_id))
  WITH CHECK (public.lidero_o_usuario(user_id));

-- team_metas: líder grava a meta agregada dos squads que lidera.
CREATE POLICY "Líder edita meta do time"
  ON public.team_metas FOR ALL
  USING (squad = ANY (public.squads_que_lidero()))
  WITH CHECK (squad = ANY (public.squads_que_lidero()));
