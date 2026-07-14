/** Atalhos de mensagem do Kommo usados pelo SDR.
 *  Conteúdo compartilhado (seed em código) e editável pelo gestor via
 *  override `sdr.kommoTemplates` (ver TemplatesSection). O campo `atalho` é
 *  o texto exato que o SDR cola no Kommo pra disparar o modelo de mensagem;
 *  `mensagem` (opcional) é o conteúdo que o atalho envia, pra referência. */

export interface KommoTemplate {
  id: string;
  titulo: string;
  categoria: string;
  atalho: string;
  mensagem?: string;
  favorito?: boolean;
}

export const KOMMO_TEMPLATE_CATEGORIAS = [
  'Fluxo Kommo',
  'Confirmação',
  'Reengajamento',
  'Parcerias',
  'Planos',
] as const;

/** Seed inicial — atalhos que a Gabi já usa no Kommo. O gestor pode editar/adicionar. */
export const SEED_KOMMO_TEMPLATES: KommoTemplate[] = [
  { id: 'kommo-abertura',    titulo: 'Abertura',     categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Abertura' },
  { id: 'kommo-followup-1',  titulo: 'Follow-up 1',  categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Follow-up 1' },
  { id: 'kommo-followup-2',  titulo: 'Follow-up 2',  categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Follow-up 2' },
  { id: 'kommo-followup-3',  titulo: 'Follow-up 3',  categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Follow-up 3' },
  { id: 'kommo-followup-4',  titulo: 'Follow-up 4',  categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Follow-up 4' },
  { id: 'kommo-followup-5',  titulo: 'Follow-up 5',  categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Follow-up 5' },
  { id: 'kommo-breakup',     titulo: 'Break-up',     categoria: 'Fluxo Kommo', atalho: '/[SDR][KOMMO] Break-up' },

  { id: 'conf-hoje',         titulo: 'Hoje',                       categoria: 'Confirmação', atalho: '/[SDR][CONF] Hoje' },
  { id: 'conf-amanha',       titulo: 'Amanhã',                     categoria: 'Confirmação', atalho: '/[SDR][CONF] Amanhã' },
  { id: 'conf-segunda',      titulo: 'Segunda-feira',              categoria: 'Confirmação', atalho: '/[SDR][CONF] Segunda-feira' },
  { id: 'conf-final-1h',     titulo: 'Confirmação final (1 hora)', categoria: 'Confirmação', atalho: '/[SDR][CONF] Confirmação final (1 hora)' },

  { id: 'ret-continuar',     titulo: 'Vamos continuar nosso bate-papo?', categoria: 'Reengajamento', atalho: '/[SDR][RET] Vamos continuar nosso bate-papo?' },
  { id: 'ret-por-ai',        titulo: 'Você tá por aí?',                  categoria: 'Reengajamento', atalho: '/[SDR][RET] Você tá por aí?' },

  { id: 'par-breakup',       titulo: 'Break-up', categoria: 'Parcerias', atalho: '/[SDR][PAR] Break-up' },

  { id: 'plano-mesas',       titulo: 'Mesas atualizado',    categoria: 'Planos', atalho: '/[SDR][PLANO] Mesas atualizado' },
  { id: 'plano-delivery',    titulo: 'Delivery atualizado', categoria: 'Planos', atalho: '/[SDR][PLANO] Delivery atualizado' },
  { id: 'plano-premium',     titulo: 'Premium atualizado',  categoria: 'Planos', atalho: '/[SDR][PLANO] Premium atualizado' },
];
