/** Avisos padrão do Mural (Dashboard). Editáveis pelo Modo Gestor. */
export type AvisoIcon = 'BookOpen' | 'Swords' | 'Target' | 'Megaphone' | 'Calendar' | 'Sparkles' | 'Trophy';

export interface Aviso {
  id: string;
  icon: AvisoIcon;
  badge: string;
  text: string;
}

export const AVISOS_PADRAO: Aviso[] = [
  { id: 'a1', icon: 'BookOpen', badge: 'Esta semana', text: 'Cumbuca dessa semana: capítulos 7 e 8 do SPIN Selling.' },
  { id: 'a2', icon: 'Swords', badge: 'Berserker', text: 'Métrica do Berserker deste mês: agendamentos realizados.' },
  { id: 'a3', icon: 'Target', badge: 'Q2', text: 'Meta do trimestre: dobrar o time até o final de Q2.' },
];
