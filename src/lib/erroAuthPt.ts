/** Traduz as mensagens de erro do Supabase Auth / edge functions pro português.
 *  O Supabase devolve tudo em inglês; a gente nunca mostra o texto cru pro time. */

const REDE =
  /edge function|failed to send|failed to fetch|networkerror|load failed|network request failed|restricted|exceed_egress|non-2xx/i;

const MAPA: [RegExp, string][] = [
  [/invalid login credentials|invalid credentials/i, 'E-mail ou senha incorretos.'],
  [/email not confirmed/i, 'Seu e-mail ainda não foi confirmado. Peça pro gestor liberar.'],
  [/user already registered|already been registered|already registered/i, 'Já existe uma conta com esse e-mail. Use "Entrar" ou "Esqueci a senha".'],
  [/password should be at least\s*(\d+)/i, 'A senha precisa ter pelo menos $1 caracteres.'],
  [/signup requires a valid password|password.*required/i, 'Digite uma senha.'],
  [/unable to validate email address|invalid email|email.*invalid/i, 'E-mail inválido.'],
  [/(for security purposes|only request this after)\D*(\d+)\s*second/i, 'Aguarde alguns segundos e tente de novo.'],
  [/email rate limit exceeded|over_email_send_rate_limit|too many requests|rate limit/i, 'Muitas tentativas em pouco tempo. Aguarde um pouco e tente de novo.'],
  [/new password should be different/i, 'A nova senha precisa ser diferente da atual.'],
  [/same as the old password|different from the old/i, 'A nova senha precisa ser diferente da atual.'],
  [/auth session missing|session.*expired|jwt expired|invalid refresh token|refresh token not found/i, 'Sua sessão expirou. Entre de novo.'],
  [/user not found/i, 'Conta não encontrada.'],
  [/signups not allowed|signup is disabled/i, 'Cadastro desativado no momento. Fale com o gestor.'],
  [/weak password|password is too weak|pwned|leaked/i, 'Essa senha é muito fraca. Escolha outra.'],
  [/email address .* is invalid|email_address_invalid/i, 'E-mail inválido.'],
];

export function traduzErroAuth(msg: unknown): string {
  const m = (msg instanceof Error ? msg.message : String(msg ?? '')).trim();
  if (!m) return 'Não foi possível concluir. Tente de novo em alguns minutos.';
  if (REDE.test(m)) return 'Serviço indisponível no momento. Tente de novo em alguns minutos.';
  for (const [re, pt] of MAPA) {
    const hit = m.match(re);
    if (hit) return pt.replace('$1', hit[1] ?? hit[2] ?? '');
  }
  // Não reconhecido: mensagem genérica em PT (nunca o texto cru em inglês).
  return 'Não foi possível concluir. Tente de novo em alguns minutos.';
}
