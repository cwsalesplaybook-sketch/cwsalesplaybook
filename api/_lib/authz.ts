// Listas de autorização do painel de gestão — consolidadas aqui como fonte única
// (antes viviam duplicadas em cada edge function do Supabase + no front-end).
// Ainda precisam bater com src/context/UserContext.tsx e src/admin/EditorContext.tsx
// até a Fase 3 trocar o front pra ler isso via API em vez de listas locais.

export type Setor = 'sdr' | 'closer' | 'representante' | 'parcerias';

export const MASTER_EMAILS = new Set<string>([
  'gabrielly.oliveira@cardapioweb.com',
  'vanessa.alencar@cardapioweb.com',
  'johnnyalves@cardapioweb.com',
  'glauton@cardapioweb.com',
  'matheus.lessa@cardapioweb.com',
]);

export const LIDER_SETOR: Record<string, Setor> = {
  'pedro.ferreira@cardapioweb.com': 'sdr',
  'joelma.vieira@cardapioweb.com': 'sdr',
  'vithoria.pinheiro@cardapioweb.com': 'sdr',
  'ana.clara@cardapioweb.com': 'sdr',
  'antonio.anderson@cardapioweb.com': 'sdr',
  'whenna.oliveira@cardapioweb.com': 'closer',
  'hyorranes.souza@cardapioweb.com': 'representante',
  'beatriz.magalhaes@cardapioweb.com': 'parcerias',
};

export function isMaster(email: string): boolean {
  return MASTER_EMAILS.has(email.trim().toLowerCase());
}

export function setorDoGestor(email: string): Setor | null {
  return LIDER_SETOR[email.trim().toLowerCase()] ?? null;
}

export function isGestorOuMaster(email: string): boolean {
  return isMaster(email) || setorDoGestor(email) !== null;
}

/** Setor de uma chave do content_overrides a partir do PREFIXO. Sem prefixo conhecido = "sdr". */
export function setorDaChave(key: string): Setor {
  if (key.startsWith('closer.')) return 'closer';
  if (key.startsWith('parcerias.')) return 'parcerias';
  if (key.startsWith('representante.')) return 'representante';
  return 'sdr';
}
