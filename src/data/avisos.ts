/** Avisos padrão do Mural (Dashboard). Editáveis pelo Modo Gestor. */
export type AvisoIcon = 'BookOpen' | 'Swords' | 'Target' | 'Megaphone' | 'Calendar' | 'Sparkles' | 'Trophy';

export interface Aviso {
  id: string;
  icon: AvisoIcon;
  badge: string;
  text: string;
}

export const AVISOS_PADRAO: Aviso[] = [
  { id: 'a1', icon: 'Megaphone', badge: 'Em breve', text: 'Aguardando liderança.' },
];
