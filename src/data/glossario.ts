/** Glossário CW — termos e siglas que todo Cardapinho precisa entender. */
import type { GlossarioTermo } from '@/types';

export const GLOSSARIO: GlossarioTermo[] = [
  { categoria: 'Vendas', termo: 'BANT', definicao: 'Budget, Authority, Need, Timing — framework para qualificar leads pelos 4 vetores essenciais.' },
  { categoria: 'Vendas', termo: 'SPIN', definicao: 'Situação, Problema, Implicação, Necessidade — sequência de perguntas para descobrir dor real do cliente.' },
  { categoria: 'Vendas', termo: 'ICP', definicao: 'Ideal Customer Profile — o restaurante que mais valor extrai do CW e fica conosco por mais tempo.' },
  { categoria: 'Funil',  termo: 'SAL', definicao: 'Sales Accepted Lead — lead que o SDR qualificou e o Closer aceitou trabalhar.' },
  { categoria: 'Funil',  termo: 'MQL', definicao: 'Marketing Qualified Lead — lead vindo do marketing com potencial inicial.' },
  { categoria: 'Funil',  termo: 'SQL', definicao: 'Sales Qualified Lead — lead totalmente qualificado e pronto para proposta.' },
  { categoria: 'Time',   termo: 'SDR', definicao: 'Sales Development Representative — quem prospecta, qualifica e agenda.' },
  { categoria: 'Time',   termo: 'Closer', definicao: 'Quem fecha a venda — recebe o lead qualificado do SDR.' },
  { categoria: 'Time',   termo: 'Squad', definicao: 'Time tático com SDRs e Closer trabalhando juntos por uma meta comum.' },
  { categoria: 'Time',   termo: 'Tier', definicao: 'Faixa de senioridade dentro de um nível de carreira (Tier 1, 2, 3...).' },
  { categoria: 'CW',     termo: 'Cumbuca', definicao: 'Ritual semanal de leitura compartilhada — cada um lê e ensina parte do livro.' },
  { categoria: 'CW',     termo: 'Berserker', definicao: 'Competição interna mensal: o SDR que mais entrega na métrica do mês vira o Berserker.' },
  { categoria: 'CW',     termo: 'Hora de Ouro', definicao: 'Janela de horário com maior taxa de contato — zero distração, só prospecção.' },
  { categoria: 'CW',     termo: 'Padrinho', definicao: 'Veterano que apadrinha o novato nos primeiros 30 dias — tira dúvidas e dá contexto.' },
  { categoria: 'CW',     termo: 'Roleplay', definicao: 'Simulação de ligação real para treinar abertura, SPIN, BANT, contorno de objeção e fechamento.' },
];
