-- Promoções: o líder marca quem foi promovido (e para qual cargo); a pessoa
-- recebe a celebração na Meta do Mês e confirma, trocando de dashboard.
CREATE TABLE IF NOT EXISTS public.promocoes (
  user_id      uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  novo_papel   text NOT NULL,
  novo_squad   text,
  promovido_por text,
  status       text NOT NULL DEFAULT 'pendente',  -- pendente | concluida
  created_at   timestamptz NOT NULL DEFAULT now(),
  concluida_at timestamptz
);

ALTER TABLE public.promocoes ENABLE ROW LEVEL SECURITY;

-- A própria pessoa vê a sua promoção.
CREATE POLICY "Vê a própria promoção"
  ON public.promocoes FOR SELECT
  USING (auth.uid() = user_id);

-- A própria pessoa conclui (confirma) a sua promoção.
CREATE POLICY "Conclui a própria promoção"
  ON public.promocoes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- O líder cria/edita/remove a promoção de membros do squad que lidera.
CREATE POLICY "Líder gerencia promoção do squad"
  ON public.promocoes FOR ALL
  USING (public.lidero_o_usuario(user_id))
  WITH CHECK (public.lidero_o_usuario(user_id));
