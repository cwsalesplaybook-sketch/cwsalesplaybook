/** Checklist completo de onboarding (13 dias) — derivado da planilha ONB_COM_Onboarding_de_Pré-Vendas_SDR. */
import type { OnboardingItem } from '@/types';

export const ONBOARDING: OnboardingItem[] = [
  // ────────────────────────── DIA 1 — Imersão Organizacional
  { id: 'd1-1',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Li o e-mail de boas-vindas do Gente e Gestão' },
  { id: 'd1-2',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Participei da Reunião Geral de Sexta-Feira' },
  { id: 'd1-3',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Acessei o e-mail corporativo' },
  { id: 'd1-4',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Conheci o escritório' },
  { id: 'd1-5',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Criei conta no Slack com e-mail corporativo' },
  { id: 'd1-6',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Enviei mensagem me apresentando para o Glauton Brito no Slack' },
  { id: 'd1-7',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Criei conta no Confluence' },
  { id: 'd1-8',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Criei conta no Sandbox (falar com líderes do suporte)' },
  { id: 'd1-9',  dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Acessei o formulário de reembolso' },
  { id: 'd1-10', dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Fiz o Profile da Sólides e enviei ao líder direto' },
  { id: 'd1-11', dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Entrei no grupo de WhatsApp (CW - Off Topic)' },
  { id: 'd1-12', dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'link',    atividade: 'Segui @cardapio.web e @soucardapinho no Instagram', link: 'https://instagram.com/cardapio.web' },
  { id: 'd1-13', dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Baixei o app da Sólides' },
  { id: 'd1-14', dia: 'Dia 1', macrotopico: 'Imersão Organizacional', tipo: 'tarefa',  atividade: 'Conheci meu Padrinho de Onboarding (Joelma ou Pedro)' },

  // ────────────────────────── DIA 2 — Checklist + 1º Roleplay
  { id: 'd2-1', dia: 'Dia 2', macrotopico: 'Checklist + Ponto de contato', tipo: 'tarefa',   atividade: 'Comprei o SPIN Selling e solicitei reembolso' },
  { id: 'd2-2', dia: 'Dia 2', macrotopico: 'Checklist + Ponto de contato', tipo: 'tarefa',   atividade: 'Recebi feedback do processo seletivo (reunião com Joelma ou Pedro)' },
  { id: 'd2-3', dia: 'Dia 2', macrotopico: 'Checklist + Ponto de contato', tipo: 'tarefa',   atividade: 'Marquei meu primeiro 1:1 com a liderança' },
  { id: 'd2-4', dia: 'Dia 2', macrotopico: 'Checklist + Ponto de contato', tipo: 'roleplay', atividade: 'Realizei o 1º Roleplay completo' },
  { id: 'd2-5', dia: 'Dia 2', macrotopico: 'Checklist + Ponto de contato', tipo: 'tarefa',   atividade: 'Conversei com a liderança sobre os aprendizados do dia' },

  // ────────────────────────── DIA 3 — Roleplay + Aprendizados
  { id: 'd3-1', dia: 'Dia 3', macrotopico: 'Roleplay + Aprendizados', tipo: 'roleplay', atividade: 'Realizei o 2º Roleplay completo' },
  { id: 'd3-2', dia: 'Dia 3', macrotopico: 'Roleplay + Aprendizados', tipo: 'tarefa',   atividade: 'Conversei com a liderança sobre a jornada do cliente' },
  { id: 'd3-3', dia: 'Dia 3', macrotopico: 'Roleplay + Aprendizados', tipo: 'tarefa',   atividade: 'Conversei no final do dia sobre os aprendizados do dia' },

  // ────────────────────────── DIA 4 — Imersão Técnica P1
  { id: 'd4-1', dia: 'Dia 4', macrotopico: 'Imersão Técnica P1', tipo: 'video',    atividade: 'Iniciei o curso "Sales Engagement" (Meetime)' },
  { id: 'd4-2', dia: 'Dia 4', macrotopico: 'Imersão Técnica P1', tipo: 'leitura',  atividade: 'Estudei a estrutura comercial e os papéis de SDR/Closer' },
  { id: 'd4-3', dia: 'Dia 4', macrotopico: 'Imersão Técnica P1', tipo: 'roleplay', atividade: 'Realizei o 3º Roleplay completo' },
  { id: 'd4-4', dia: 'Dia 4', macrotopico: 'Imersão Técnica P1', tipo: 'tarefa',   atividade: 'Conversei com a liderança sobre os aprendizados do dia' },

  // ────────────────────────── DIA 5 — ICP, Rapport, BANT, SPIN
  { id: 'd5-1', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'leitura',  atividade: 'Li o artigo sobre ICP — Ideal Customer Profile', link: 'https://meetime.com.br/blog/inside-sales/icp/' },
  { id: 'd5-2', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'leitura',  atividade: 'Li o artigo sobre Rapport em vendas', link: 'https://meetime.com.br/blog/inside-sales/rapport/' },
  { id: 'd5-3', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'leitura',  atividade: 'Li o artigo sobre BANT', link: 'https://meetime.com.br/blog/inside-sales/bant/' },
  { id: 'd5-4', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'leitura',  atividade: 'Li o artigo sobre SPIN Selling', link: 'https://meetime.com.br/blog/inside-sales/spin-selling/' },
  { id: 'd5-5', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'roleplay', atividade: 'Realizei o 4º Roleplay completo' },
  { id: 'd5-6', dia: 'Dia 5', macrotopico: 'ICP, Rapport, BANT, SPIN', tipo: 'tarefa',   atividade: 'Conversei com a liderança sobre os aprendizados do dia' },

  // ────────────────────────── DIA 6 — Estudos práticos SPIN/BANT/Objeções
  { id: 'd6-1', dia: 'Dia 6', macrotopico: 'SPIN, BANT e Objeções (prática)', tipo: 'pratica',  atividade: 'Preenchi o Banco de Perguntas SPIN (3 cenários)' },
  { id: 'd6-2', dia: 'Dia 6', macrotopico: 'SPIN, BANT e Objeções (prática)', tipo: 'pratica',  atividade: 'Preenchi o Banco de Objeções (5+ contornos)' },
  { id: 'd6-3', dia: 'Dia 6', macrotopico: 'SPIN, BANT e Objeções (prática)', tipo: 'roleplay', atividade: 'Realizei o 5º Roleplay completo' },
  { id: 'd6-4', dia: 'Dia 6', macrotopico: 'SPIN, BANT e Objeções (prática)', tipo: 'tarefa',   atividade: 'Conversei com a liderança sobre os aprendizados do dia' },

  // ────────────────────────── DIA 7 — Produto + módulos
  { id: 'd7-1', dia: 'Dia 7', macrotopico: 'Produto Cardápio Web', tipo: 'leitura', atividade: 'Estudei o módulo de Cardápio Digital' },
  { id: 'd7-2', dia: 'Dia 7', macrotopico: 'Produto Cardápio Web', tipo: 'leitura', atividade: 'Estudei o módulo de Pedidos & Pagamentos' },
  { id: 'd7-3', dia: 'Dia 7', macrotopico: 'Produto Cardápio Web', tipo: 'leitura', atividade: 'Estudei o módulo de Marketing (cupom, fidelidade, disparo)' },
  { id: 'd7-4', dia: 'Dia 7', macrotopico: 'Produto Cardápio Web', tipo: 'leitura', atividade: 'Estudei o módulo de Gestão & Áreas de entrega' },
  { id: 'd7-5', dia: 'Dia 7', macrotopico: 'Produto Cardápio Web', tipo: 'roleplay', atividade: 'Realizei o 6º Roleplay (foco em Abertura / Rapport)' },

  // ────────────────────────── DIA 8 — Sandbox prático
  { id: 'd8-1', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'pratica', atividade: 'Montei um cardápio completo no sandbox' },
  { id: 'd8-2', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'pratica', atividade: 'Criei um cupom promocional' },
  { id: 'd8-3', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'pratica', atividade: 'Configurei o programa de fidelidade' },
  { id: 'd8-4', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'pratica', atividade: 'Disparei uma campanha de marketing' },
  { id: 'd8-5', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'pratica', atividade: 'Configurei áreas e taxas de entrega' },
  { id: 'd8-6', dia: 'Dia 8', macrotopico: 'Sandbox Prático', tipo: 'roleplay', atividade: 'Realizei o 7º Roleplay (foco em SPIN)' },

  // ────────────────────────── DIA 9 — Plataformas
  { id: 'd9-1', dia: 'Dia 9', macrotopico: 'Plataformas Comerciais', tipo: 'leitura',  atividade: 'Aprendi a operar o Meetime (cadências)' },
  { id: 'd9-2', dia: 'Dia 9', macrotopico: 'Plataformas Comerciais', tipo: 'leitura',  atividade: 'Aprendi a operar o Kommo (CRM SDR)' },
  { id: 'd9-3', dia: 'Dia 9', macrotopico: 'Plataformas Comerciais', tipo: 'leitura',  atividade: 'Aprendi a operar o Pipedrive (pipeline closer)' },
  { id: 'd9-4', dia: 'Dia 9', macrotopico: 'Plataformas Comerciais', tipo: 'pratica',  atividade: 'Escutei 3 prospecções reais com o time' },
  { id: 'd9-5', dia: 'Dia 9', macrotopico: 'Plataformas Comerciais', tipo: 'roleplay', atividade: 'Realizei o 8º Roleplay (foco em BANT)' },

  // ────────────────────────── DIA 10 — Métricas + cultura
  { id: 'd10-1', dia: 'Dia 10', macrotopico: 'Métricas e Cultura', tipo: 'leitura',  atividade: 'Estudei os KPIs do time (taxa de conversão, no-show, agendamentos)' },
  { id: 'd10-2', dia: 'Dia 10', macrotopico: 'Métricas e Cultura', tipo: 'leitura',  atividade: 'Revisei a missão, visão e os 7 valores da CW' },
  { id: 'd10-3', dia: 'Dia 10', macrotopico: 'Métricas e Cultura', tipo: 'roleplay', atividade: 'Realizei o 9º Roleplay (foco em Encerramento / Compromisso)' },

  // ────────────────────────── DIA 11 — Avaliação final
  { id: 'd11-1', dia: 'Dia 11', macrotopico: 'Avaliação Final', tipo: 'roleplay', atividade: 'Realizei o 10º Roleplay completo (avaliação final)' },
  { id: 'd11-2', dia: 'Dia 11', macrotopico: 'Avaliação Final', tipo: 'tarefa',   atividade: 'Recebi feedback estruturado da liderança' },
  { id: 'd11-3', dia: 'Dia 11', macrotopico: 'Avaliação Final', tipo: 'tarefa',   atividade: 'Defini meu plano de desenvolvimento dos próximos 30 dias' },

  // ────────────────────────── DIAS 12-13 — Treinamento de ligações
  { id: 'd12-1', dia: 'Dia 12', macrotopico: 'Treinamento de Ligações', tipo: 'pratica', atividade: 'Fiz minhas primeiras ligações reais acompanhado(a) da liderança' },
  { id: 'd12-2', dia: 'Dia 12', macrotopico: 'Treinamento de Ligações', tipo: 'tarefa',  atividade: 'Recebi feedback ao vivo das ligações' },
  { id: 'd13-1', dia: 'Dia 13', macrotopico: 'Treinamento de Ligações', tipo: 'pratica', atividade: 'Fiz ligações com mais autonomia' },
  { id: 'd13-2', dia: 'Dia 13', macrotopico: 'Treinamento de Ligações', tipo: 'tarefa',  atividade: 'Liberação para operar pleno após validação da liderança' },
];
