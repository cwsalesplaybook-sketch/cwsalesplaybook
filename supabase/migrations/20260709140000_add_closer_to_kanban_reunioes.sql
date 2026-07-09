-- Cada card do Kanban de reuniões passa a poder marcar qual closer é o
-- responsável por atender aquela reunião, pra dar pra buscar/filtrar por
-- closer dentro do próprio board do SDR.
ALTER TABLE public.kanban_reunioes
  ADD COLUMN IF NOT EXISTS closer text;
