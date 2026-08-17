/** Atalhos de mensagem do Kommo usados pelo Representante (Aquisição de Canal).
 *  Conteúdo compartilhado (seed em código) e editável pelo gestor via
 *  override `representante.kommoTemplates` (ver components/reps/TemplatesSection).
 *  O campo `atalho` é o texto exato colado no Kommo pra disparar o modelo de
 *  mensagem; `mensagem` (opcional) é o conteúdo que o atalho envia, pra referência. */
import type { KommoTemplate } from './sdrKommoTemplates';

export const KOMMO_TEMPLATE_CATEGORIAS = [
  'Fluxo Kommo',
  'Confirmação',
  'Reengajamento',
] as const;

/** Seed inicial — atalhos de cadência do Programa de Representantes (2026-08-17). */
export const SEED_KOMMO_TEMPLATES: KommoTemplate[] = [
  {
    id: 'rep-abertura',
    titulo: 'Abertura',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] Abertura',
    mensagem: 'Olá, {nome}! Tudo certo? Aqui é o {agente}, especialista de representantes da Cardápio Web.\nVi que você preencheu o formulário e demonstrou interesse em conhecer melhor a oportunidade. Estou entrando em contato para entender melhor seu perfil e te explicar como funciona o modelo de parceria!\nMe conta: você hoje já atua com vendas, atendimento ao setor de restaurantes ou possui alguma carteira de clientes?',
  },
  {
    id: 'rep-followup-1',
    titulo: 'Follow-up 1',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] FOLLOW UP 1',
    mensagem: 'Olá, {nome}! Tudo certo?\nComo comentei, estamos lançando oficialmente o Programa de Representantes da Cardápio Web, com uma comissão bastante atrativa e modelo de receita recorrente.\nAntes de avançarmos, queria te apresentar o formato e entender seu momento. Qual melhor horário para conversarmos?',
  },
  {
    id: 'rep-followup-2',
    titulo: 'Follow-up 2',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] FOLLOW UP 2',
    mensagem: 'Olá, {nome}! Tudo certo\nO programa de representantes é simples: você vende, oferece serviços adicionais, constrói carteira e recebe comissão recorrente todos os meses.\nEstamos abrindo poucas vagas agora porque queremos gente com perfil de execução.\nSe fizer sentido pra você gerar uma renda previsível com tecnologia para restaurantes, me diz que eu te explico como você pode começar ainda essa semana.',
  },
  {
    id: 'rep-followup-3',
    titulo: 'Follow-up 3',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] FOLLOW UP 3',
    mensagem: 'Oi, {nome}! Tudo bem?\nVi seu contato aqui e fiquei com uma dúvida rápida: você já trabalhou de perto com cardápio digital para restaurantes, ou é mais uma área nova pra você?\nQueria entender melhor antes de te explicar por que te procurei',
  },
  {
    id: 'rep-followup-4',
    titulo: 'Follow-up 4',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] FOLLOW UP 4',
    mensagem: 'Fala, {nome}! Tudo certo?\nPassando para te avisar que estamos encerrando as vagas do Programa de Representantes da Cardápio Web este mês.\nAs próximas oportunidades só abrem na turma do próximo mês. Essa é a chance de você já começar a gerar comissão recorrente, criando uma base de clientes que te paga todos os meses, além de ampliar seu portfólio com uma solução validada no mercado.\nSe ainda faz sentido para você, me responde agora para garantirmos sua vaga antes do fechamento.',
  },
  {
    id: 'rep-breakup',
    titulo: 'Break up',
    categoria: 'Fluxo Kommo',
    atalho: '/[REP] Break up',
    mensagem: 'Fala, {nome}! Passando para nossa última mensagem sobre o programa de representantes.\nComo não tivemos retorno, vou encerrar seu acompanhamento por aqui para não ficar insistindo 😄\nMas deixo as portas abertas caso queira retomar futuramente. Acredito que sua região ainda tem bastante potencial para o projeto 🚀\nObrigado pelo tempo e sucesso por aí!',
  },
  {
    id: 'rep-confirmacao-reuniao',
    titulo: 'Confirmação de Reunião',
    categoria: 'Confirmação',
    atalho: '/[REP] Confirmação de Reunião',
    mensagem: 'Bom dia, {nome}!\nSó confirmando: nosso encontro está marcado para hoje!\nAté breve!',
  },
  {
    id: 'par-retomada-1',
    titulo: 'Mensagem de retomada 1',
    categoria: 'Reengajamento',
    atalho: '/[PAR] Mensagem de retomada 1',
    mensagem: '{nome}, bora continuar nosso papo?',
  },
];
