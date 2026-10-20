import type { VercelRequest, VercelResponse } from '@vercel/node';
import { queryAsService } from '../../_lib/db.js';
import { verifyAccessToken, verifyEditorToken, readBearerToken } from '../../_lib/auth.js';
import { isMaster, setorDoGestor, setorDaChave, type Setor } from '../../_lib/authz.js';
import { withErrorHandling } from '../../_lib/handle.js';

interface Upsert {
  key: string;
  value: unknown;
}
interface Body {
  token?: string; // token break-glass do editor-login (fallback, tratado como mestre)
  key?: string;
  value?: unknown;
  upserts?: Upsert[];
  deletes?: string[];
  resetAll?: boolean;
}

// Porta de api/content/save (antes: edge function editor-save). Escreve em
// content_overrides usando a conexão de serviço (RLS bloqueia escrita direta
// de clientes nessa tabela de propósito) — a autorização é toda feita aqui,
// por e-mail (mestre grava tudo, gestor só o setor dele) ou pelo token
// break-glass do /api/auth/editor-login (tratado como mestre).
async function handlerImpl(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  const body = (req.body ?? {}) as Body;

  let isMasterCaller = false;
  let allowedSetor: Setor | null = null;
  let email = '';

  const bearer = readBearerToken(req);
  if (bearer) {
    const payload = await verifyAccessToken(bearer);
    if (payload) email = payload.email.toLowerCase();
  }

  if (email && isMaster(email)) {
    isMasterCaller = true;
  } else if (email && setorDoGestor(email)) {
    allowedSetor = setorDoGestor(email);
  } else if (typeof body.token === 'string' && (await verifyEditorToken(body.token))) {
    isMasterCaller = true; // break-glass por senha mestre
  } else {
    return res.status(401).json({ ok: false, error: 'Sem permissão de edição' });
  }

  const chaveLiberada = (key: string): boolean => {
    if (isMasterCaller) return true;
    if (allowedSetor) return setorDaChave(key) === allowedSetor;
    return false;
  };

  if (body.resetAll) {
    if (!isMasterCaller) return res.status(403).json({ ok: false, error: 'Apenas mestre pode resetar tudo' });
    await queryAsService(`delete from public.content_overrides where key <> ''`);
    return res.status(200).json({ ok: true, reset: true });
  }

  const upserts: Upsert[] = Array.isArray(body.upserts) ? body.upserts : [];
  const deletes: string[] = Array.isArray(body.deletes) ? body.deletes : [];
  if (typeof body.key === 'string' && 'value' in body) {
    upserts.push({ key: body.key, value: body.value });
  }
  if (upserts.length === 0 && deletes.length === 0) {
    return res.status(400).json({ ok: false, error: 'Nada para salvar' });
  }

  const todasChaves = [...upserts.map((u) => u.key), ...deletes];
  const negada = todasChaves.find((k) => !chaveLiberada(k));
  if (negada) {
    return res.status(403).json({ ok: false, error: `Sem permissão para editar fora do seu setor (${negada})` });
  }

  const updatedBy = email || (isMasterCaller ? 'master' : 'gestor');

  for (const u of upserts) {
    await queryAsService(
      `insert into public.content_overrides (key, value, updated_by, updated_at)
       values ($1, $2, $3, now())
       on conflict (key) do update set value = excluded.value, updated_by = excluded.updated_by, updated_at = now()`,
      [u.key, JSON.stringify(u.value), updatedBy],
    );
  }
  if (deletes.length > 0) {
    await queryAsService(`delete from public.content_overrides where key = any($1)`, [deletes]);
  }

  return res.status(200).json({ ok: true, upserts: upserts.length, deletes: deletes.length });
}

export default withErrorHandling(handlerImpl);
