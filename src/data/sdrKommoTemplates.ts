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
  'No-show',
  'UTI',
  'Confirmação',
  'Reengajamento',
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

  { id: 'no-show-abertura',   titulo: 'Abertura',    categoria: 'No-show', atalho: '/[SDR][NO-SHOW] Abertura' },
  { id: 'no-show-followup-1', titulo: 'Follow-up 1', categoria: 'No-show', atalho: '/[SDR][NO-SHOW] Follow-up 1' },
  { id: 'no-show-followup-2', titulo: 'Follow-up 2', categoria: 'No-show', atalho: '/[SDR][NO-SHOW] Follow-up 2' },
  { id: 'no-show-breakup',    titulo: 'Break-up',    categoria: 'No-show', atalho: '/[SDR][NO-SHOW] Break-up' },

  { id: 'uti-abertura',           titulo: 'Abertura',                categoria: 'UTI', atalho: '/[SDR][UTI] Abertura' },
  { id: 'uti-followup-1',         titulo: 'Follow-up 1',             categoria: 'UTI', atalho: '/[SDR][UTI] Follow-up 1' },
  { id: 'uti-followup-2',         titulo: 'Follow-up 2',             categoria: 'UTI', atalho: '/[SDR][UTI] Follow-up 2' },
  { id: 'uti-breakup',            titulo: 'Break up',                categoria: 'UTI', atalho: '/[SDR][UTI] Break up' },
  { id: 'uti-noshow-abertura',    titulo: 'No-show abertura',        categoria: 'UTI', atalho: '/[SDR][UTI] No-show abertura' },
  { id: 'uti-noshow-followup-1',  titulo: 'No-show follow 1',        categoria: 'UTI', atalho: '/[SDR][UTI] No-show follow 1' },
  { id: 'uti-noshow-followup-2',  titulo: 'No-show follow 2',        categoria: 'UTI', atalho: '/[SDR][UTI] No-show follow 2' },
  { id: 'uti-noshow-breakup',     titulo: 'No-show break up',        categoria: 'UTI', atalho: '/[SDR][UTI] No-show break up' },
  { id: 'uti-conf-hoje',          titulo: 'Confirmação hoje',        categoria: 'UTI', atalho: '/[SDR][UTI] Confirmação hoje' },
  { id: 'uti-conf-amanha',        titulo: 'Confirmação amanhã',      categoria: 'UTI', atalho: '/[SDR][UTI] Confirmação amanhã' },
  { id: 'uti-conf-30min',         titulo: 'Confirmação 30 minutos',  categoria: 'UTI', atalho: '/[SDR][UTI] Confirmação 30 minutos' },

  { id: 'conf-hoje',              titulo: 'Hoje',                       categoria: 'Confirmação', atalho: '/[SDR][CONF] Hoje' },
  { id: 'conf-amanha',            titulo: 'Amanhã',                     categoria: 'Confirmação', atalho: '/[SDR][CONF] Amanhã' },
  { id: 'conf-segunda',           titulo: 'Segunda-feira',              categoria: 'Confirmação', atalho: '/[SDR][CONF] Segunda-feira' },
  { id: 'conf-30min',             titulo: '30 minutos',                 categoria: 'Confirmação', atalho: '/[SDR][CONF] 30 minutos' },
  { id: 'conf-final-1h',          titulo: 'Confirmação final (1 hora)', categoria: 'Confirmação', atalho: '/[SDR][CONF] Confirmação final (1 hora)' },
  { id: 'conf-final',             titulo: 'Confirmação final',          categoria: 'Confirmação', atalho: '/[SDR][CONF] Confirmação final' },
  { id: 'conf-hoje-atualizado',   titulo: 'Hoje atualizado',            categoria: 'Confirmação', atalho: '/[SDR][CONF] Hoje atualizado' },
  { id: 'conf-amanha-atualizado', titulo: 'Amanhã atualizado',          categoria: 'Confirmação', atalho: '/[SDR][CONF] Amanhã atualizado' },
  { id: 'conf-30min-atualizado',  titulo: '30 minutos atualizado',      categoria: 'Confirmação', atalho: '/[SDR][CONF] 30 minutos atualizado' },

  { id: 'ret-continuar',     titulo: 'Vamos continuar nosso bate-papo?', categoria: 'Reengajamento', atalho: '/[SDR][RET] Vamos continuar nosso bate-papo?' },
  { id: 'ret-podendo-falar', titulo: 'Você tá podendo falar?',           categoria: 'Reengajamento', atalho: '/[SDR][RET] Você tá podendo falar?' },
  { id: 'ret-por-ai',        titulo: 'Você tá por aí?',                  categoria: 'Reengajamento', atalho: '/[SDR][RET] Você tá por aí?' },

  { id: 'plano-mesas',       titulo: 'Mesas atualizado',    categoria: 'Planos', atalho: '/[SDR][PLANO] Mesas atualizado' },
  { id: 'plano-delivery',    titulo: 'Delivery atualizado', categoria: 'Planos', atalho: '/[SDR][PLANO] Delivery atualizado' },
  { id: 'plano-premium',     titulo: 'Premium atualizado',  categoria: 'Planos', atalho: '/[SDR][PLANO] Premium atualizado' },
];
