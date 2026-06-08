export type ChangelogType = 'feature' | 'fix' | 'update' | 'breaking';

export interface ChangelogEntry {
  id: string;
  version: string;
  date: string;
  title: string;
  description: string;
  postedBy: string;
  type: ChangelogType;
}

export const CHANGELOG_PADRAO: ChangelogEntry[] = [
  {
    id: 'cl1',
    version: '1.3',
    date: '2026-06-08',
    title: 'Widget de busca rápida no Playbook',
    description: 'Botão ⚡ fixo no canto inferior direito em todas as páginas. Digite uma palavra-chave para navegar direto para a aba correta do Playbook ou FAQ.',
    postedBy: 'CW Sales Playbook',
    type: 'feature',
  },
  {
    id: 'cl2',
    version: '1.2',
    date: '2026-06-05',
    title: 'FAQ e Mural de Avisos',
    description: 'FAQ como página própria com 19 perguntas em 3 categorias (Totem, Planos, Produto). Mural de Avisos com sino de notificações e leitura individual.',
    postedBy: 'CW Sales Playbook',
    type: 'feature',
  },
  {
    id: 'cl3',
    version: '1.1',
    date: '2026-05-30',
    title: 'Ranking dinâmico via Pipedrive',
    description: 'Top Guerreiros agora busca dados reais do Pipedrive em tempo real. Exibe top 5 com negócios ganhos no mês e destaca o SDR logado.',
    postedBy: 'CW Sales Playbook',
    type: 'update',
  },
];
