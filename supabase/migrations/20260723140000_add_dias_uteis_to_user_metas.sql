-- Permite sobrepor manualmente os "dias restantes" (dias úteis) exibidos na
-- Meta do Mês, em vez de depender só do cálculo automático da API do Pipedrive.
-- NULL = automático (comportamento atual, sem mudança pra quem não configurar).
ALTER TABLE public.user_metas
  ADD COLUMN IF NOT EXISTS dias_uteis integer;
