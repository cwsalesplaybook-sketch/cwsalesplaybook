-- Conexão de cada SDR com o próprio Google Calendar (OAuth individual,
-- sem domain-wide delegation). O refresh_token só é lido pelas edge
-- functions via service role — RLS fica ligada e sem policies, então
-- nem o próprio dono do token consegue ler pelo client.
CREATE TABLE IF NOT EXISTS public.google_calendar_connections (
  user_id         uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token   text NOT NULL,
  connected_at    timestamptz NOT NULL DEFAULT now(),
  last_synced_at  timestamptz
);

ALTER TABLE public.google_calendar_connections ENABLE ROW LEVEL SECURITY;
-- Sem policies de propósito: acesso só via service role (edge functions).

-- Evita duplicar card ao re-sincronizar o mesmo evento do calendário.
CREATE UNIQUE INDEX IF NOT EXISTS kanban_reunioes_user_google_event_idx
  ON public.kanban_reunioes (user_id, google_event_id)
  WHERE google_event_id IS NOT NULL;
