import { Pool, type PoolClient } from 'pg';

// Duas conexões, dois papéis (equivalente ao anon/authenticated + service_role do Supabase):
//
// - DATABASE_URL         → role `app_user` (sem bypassrls). Toda leitura/escrita ligada a
//                           "o que o usuário logado pode ver" passa por aqui, com RLS ativo.
// - SERVICE_DATABASE_URL → role `neondb_owner` (bypassa RLS por padrão no Neon). Só pras
//                           poucas rotas que legitimamente precisam olhar além do próprio
//                           usuário, autorizadas por checagem em código (allowlist de e-mail),
//                           não por RLS — o mesmo padrão do service_role do Supabase.
//
// Ver neon/schema.sql (seção "ROLE DA API") pra como a role app_user foi criada.

let appPool: Pool | undefined;
let servicePool: Pool | undefined;

function getAppPool(): Pool {
  if (!appPool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error('DATABASE_URL não configurado');
    appPool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000 });
  }
  return appPool;
}

function getServicePool(): Pool {
  if (!servicePool) {
    const connectionString = process.env.SERVICE_DATABASE_URL;
    if (!connectionString) throw new Error('SERVICE_DATABASE_URL não configurado');
    servicePool = new Pool({ connectionString, max: 5, idleTimeoutMillis: 10_000 });
  }
  return servicePool;
}

/** Query sem contexto de usuário, role app_user — só serve pra tabelas sem RLS (users, refresh_tokens). */
export async function query<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await getAppPool().query(text, params);
  return rows as T[];
}

/**
 * Roda `fn` numa transação com app.user_id setado (RLS ativo como esse usuário).
 * userId null = "sem sessão" — RLS bloqueia tudo que dependa de dono/squad.
 */
export async function withUser<T>(userId: string | null, fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getAppPool().connect();
  try {
    await client.query('BEGIN');
    await client.query(`select set_config('app.user_id', $1, true)`, [userId ?? '']);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Query com a role de serviço (bypassa RLS). Use só nas rotas que fazem sua
 * própria checagem de autorização em código (mestre/gestor/setor) — nunca
 * exponha isso a uma query vinda direto do cliente sem checagem antes.
 */
export async function queryAsService<T = Record<string, unknown>>(text: string, params: unknown[] = []): Promise<T[]> {
  const { rows } = await getServicePool().query(text, params);
  return rows as T[];
}
