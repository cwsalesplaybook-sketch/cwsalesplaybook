/** Hook que expõe os dados do perfil do usuário logado (via AuthContext). */
import { useAuth } from '@/context/AuthContext';

export interface UserProfile {
  id: string | null;
  avatarUrl: string | null;
  fullName: string | null;
  email: string | null;
  initials: string;
}

const EMPTY_PROFILE: UserProfile = { id: null, avatarUrl: null, fullName: null, email: null, initials: '?' };

export function useUserProfile(): UserProfile {
  const { user } = useAuth();
  if (!user) return EMPTY_PROFILE;

  const name = user.apelido ?? user.email ?? '';
  const initials =
    name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('') || '?';

  return {
    id: user.id,
    avatarUrl: null, // sem foto do Google agora que o login não é mais só OAuth
    fullName: name || null,
    email: user.email,
    initials,
  };
}
