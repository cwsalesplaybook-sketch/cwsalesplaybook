import type { VercelRequest } from '@vercel/node';
import { verifyAccessToken, readBearerToken, type AccessTokenPayload } from './auth';

/** Extrai e valida o access token Bearer da requisição. null = não autenticado. */
export async function getCaller(req: VercelRequest): Promise<AccessTokenPayload | null> {
  const token = readBearerToken(req);
  if (!token) return null;
  return verifyAccessToken(token);
}
