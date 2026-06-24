/** Templates de mensagem do Closer ("Arsenal de Mensagens").
 *  Conteúdo compartilhado (seed em código) e editável pelo gestor via
 *  override `closer.templates` (ver TemplatesSection). */

export interface CloserTemplate {
  id: string;
  titulo: string;
  categoria: string;
  texto: string;
  favorito?: boolean;
}

export const TEMPLATE_CATEGORIAS = [
  'Follow-up',
  'Cobrança',
  'Pagamento',
  'Negociação',
  'Outros',
] as const;

/** Seed inicial (mesmas mensagens de referência). O gestor pode editar/adicionar. */
export const SEED_TEMPLATES: CloserTemplate[] = [
  {
    id: 'followup-padrao',
    titulo: 'Follow-up Padrão',
    categoria: 'Follow-up',
    favorito: true,
    texto:
      'Olá! Tudo bem? Estou passando para saber se conseguiu analisar nossa proposta. Fico à disposição para esclarecer qualquer dúvida!',
  },
  {
    id: 'followup-quente',
    titulo: 'Follow-up Quente',
    categoria: 'Follow-up',
    favorito: true,
    texto:
      'Ei! Vi que você demonstrou bastante interesse. Que tal agendarmos uma call rápida para fecharmos?',
  },
  {
    id: 'ultima-tentativa',
    titulo: 'Última Tentativa',
    categoria: 'Follow-up',
    texto:
      'Olá! Essa é minha última tentativa de contato. Caso não tenha interesse, tudo bem! Mas se quiser aproveitar as condições especiais, me avise hoje.',
  },
  {
    id: 'link-pagamento',
    titulo: 'Link de Pagamento',
    categoria: 'Pagamento',
    texto:
      'Aqui está o link para finalizar sua assinatura: [LINK]. Qualquer dúvida, estou por aqui!',
  },
  {
    id: 'cobranca-link-enviado',
    titulo: 'Cobrança Link Enviado',
    categoria: 'Cobrança',
    texto:
      'Oi! Vi que o link ainda está pendente. Posso ajudar com algo? O pagamento está travando em algum ponto?',
  },
  {
    id: 'cobranca-escassez',
    titulo: 'Cobrança com Escassez',
    categoria: 'Cobrança',
    favorito: true,
    texto:
      'Última chamada! O desconto especial expira hoje às 23:59. Depois disso, só conseguiremos o valor cheio. Posso garantir pra você?',
  },
];
