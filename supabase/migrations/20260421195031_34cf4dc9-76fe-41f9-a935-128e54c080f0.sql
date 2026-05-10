-- Tabela única para todos os overrides de conteúdo do portal.
-- Cada chave (ex: "mural.aviso.a1.text", "carreira.niveis", "playbook.cultura.missao")
-- mapeia para um JSON com o valor customizado. SDRs leem; só edge function escreve.
CREATE TABLE public.content_overrides (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT
);

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

-- Leitura pública: todos os usuários do portal veem o conteúdo final.
CREATE POLICY "Conteúdo é público para leitura"
  ON public.content_overrides FOR SELECT
  USING (true);

-- Escrita: bloqueada para clientes. Só a edge function (service role) escreve.
CREATE POLICY "Bloqueia escrita direta de clientes"
  ON public.content_overrides FOR ALL
  USING (false)
  WITH CHECK (false);

-- Habilita realtime para sincronização ao vivo entre gestores e SDRs.
ALTER PUBLICATION supabase_realtime ADD TABLE public.content_overrides;
ALTER TABLE public.content_overrides REPLICA IDENTITY FULL;

-- Trigger para atualizar updated_at automaticamente.
CREATE OR REPLACE FUNCTION public.touch_content_overrides()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_content_overrides_touch
  BEFORE UPDATE ON public.content_overrides
  FOR EACH ROW EXECUTE FUNCTION public.touch_content_overrides();