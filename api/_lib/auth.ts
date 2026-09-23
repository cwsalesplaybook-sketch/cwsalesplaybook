import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { randomBytes, createHash } from 'crypto';

const ACCESS_TOKEN_TTL = '1h';
const REMEMBER_TTL_DAYS = 30;
const SESSION_TTL_DAYS = 1;
const REFRESH_COOKIE = 'cw_refresh';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não configurado');
  return new TextEncoder().encode(secret);
}

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

export async function signAccessToken(payload: AccessTokenPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_TTL)
    .sign(getJwtSecret());
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null;
    return { sub: payload.sub, email: payload.email };
  } catch {
    return null;
  }
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Token opaco aleatório — só o hash SHA-256 dele fica gravado em refresh_tokens. */
export function generateRefreshToken(): string {
  return randomBytes(32).toString('base64url');
}

export function hashRefreshToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

export function refreshTokenExpiry(remember: boolean): Date {
  const days = remember ? REMEMBER_TTL_DAYS : SESSION_TTL_DAYS;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

// ---- cookie do refresh token (httpOnly; só vai pra /api/auth/*) ----

export function serializeRefreshCookie(token: string, expires: Date): string {
  const maxAge = Math.max(0, Math.floor((expires.getTime() - Date.now()) / 1000));
  return `${REFRESH_COOKIE}=${token}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=${maxAge}`;
}

export function clearRefreshCookie(): string {
  return `${REFRESH_COOKIE}=; HttpOnly; Secure; SameSite=Lax; Path=/api/auth; Max-Age=0`;
}

export function readCookie(req: { headers: { cookie?: string } }, name: string): string | null {
  const raw = req.headers.cookie ?? '';
  const match = raw
    .split(';')
    .map((s) => s.trim())
    .find((s) => s.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

export function readRefreshCookie(req: { headers: { cookie?: string } }): string | null {
  return readCookie(req, REFRESH_COOKIE);
}

export function readBearerToken(req: { headers: { authorization?: string } }): string | null {
  const header = req.headers.authorization ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(header);
  return match ? match[1] : null;
}

// ---- token break-glass do editor (senha mestre, sem conta de usuário) ----
// Substitui o token HMAC caseiro do antigo editor-login: mesma ideia (senha mestre
// vira um token de curta duração), mas agora é um JWT normal assinado com o mesmo
// JWT_SECRET, verificado do mesmo jeito que o token de sessão comum.
const EDITOR_TOKEN_TTL = '8h';

export async function signEditorToken(): Promise<string> {
  return new SignJWT({ role: 'editor' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(EDITOR_TOKEN_TTL)
    .sign(getJwtSecret());
}

export async function verifyEditorToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload.role === 'editor';
  } catch {
    return false;
  }
}
