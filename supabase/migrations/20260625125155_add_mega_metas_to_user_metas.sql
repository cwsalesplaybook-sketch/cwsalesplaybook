-- Mega Metas (objetivo stretch) na Meta do Mês.
-- Colunas aditivas, default 0, não afetam dados existentes.
ALTER TABLE public.user_metas
  ADD COLUMN IF NOT EXISTS mega1 integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mega2 integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS mega3 integer DEFAULT 0;
