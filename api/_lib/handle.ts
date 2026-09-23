import type { VercelRequest, VercelResponse } from '@vercel/node';

/**
 * Envolve um handler de rota com tratamento de erro padrão:
 * - violação de RLS (Postgres 42501) vira 403 "Sem permissão" em vez de
 *   estourar como erro não tratado (500 cru);
 * - qualquer outro erro inesperado vira 500 com mensagem genérica (loga o
 *   erro de verdade no console pra debug).
 */
export function withErrorHandling(
  fn: (req: VercelRequest, res: VercelResponse) => unknown | Promise<unknown>,
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      await fn(req, res);
    } catch (err: unknown) {
      const code = (err as { code?: string } | null)?.code;
      if (code === '42501') {
        return res.status(403).json({ ok: false, error: 'Sem permissão' });
      }
      console.error('Erro não tratado em', req.url, err);
      return res.status(500).json({ ok: false, error: 'Erro interno' });
    }
  };
}
