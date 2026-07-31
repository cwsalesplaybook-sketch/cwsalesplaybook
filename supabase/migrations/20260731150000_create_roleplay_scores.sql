-- Placar do Roleplay (simulador de call do SDR): cada linha é uma partida
-- jogada até o fim, com a sequência de cartas guardada pra permitir replay/
-- verificação (a pontuação nunca é confiada como veio, é recalculada a
-- partir de "jogadas" no cliente antes de exibir no ranking). Leaderboard
-- é do time inteiro, não por squad — todo mundo vê todo mundo.
CREATE TABLE IF NOT EXISTS public.roleplay_scores (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_exibicao  text NOT NULL,
  persona_id     text NOT NULL,
  dificuldade    text NOT NULL,
  pontos         integer NOT NULL,
  rank           text NOT NULL CHECK (rank IN ('S','A','B','C','D')),
  desfecho       text NOT NULL CHECK (desfecho IN ('vitoria','parcial','derrota','tempo')),
  raiz_revelada  boolean NOT NULL DEFAULT false,
  turnos         integer NOT NULL,
  jogadas        jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.roleplay_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Time inteiro vê o placar"
  ON public.roleplay_scores FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Cria a própria partida"
  ON public.roleplay_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Remove a própria partida"
  ON public.roleplay_scores FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX roleplay_scores_user_id_idx ON public.roleplay_scores (user_id);
CREATE INDEX roleplay_scores_persona_id_idx ON public.roleplay_scores (persona_id);
