-- Tira o EXECUTE das funções de liderança do anon/public (não vazam dados,
-- mas não há razão de ficarem expostas via RPC). A RLS roda como o papel
-- 'authenticated', então mantemos o EXECUTE só para ele.
REVOKE EXECUTE ON FUNCTION public.squads_que_lidero() FROM public, anon;
REVOKE EXECUTE ON FUNCTION public.lidero_o_usuario(uuid) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.squads_que_lidero() TO authenticated;
GRANT EXECUTE ON FUNCTION public.lidero_o_usuario(uuid) TO authenticated;
