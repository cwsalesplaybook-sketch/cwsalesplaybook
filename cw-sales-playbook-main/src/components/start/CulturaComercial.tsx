/** Cultura do Comercial — rituais e valores do time de vendas CW. */
import { Mic, Swords, BookOpen, MessageCircle, Trophy, Zap, Star } from 'lucide-react';

interface Ritual {
  icon: React.ElementType;
  nome: string;
  frequencia: string;
  descricao: string;
  cor: string;
  iconBg: string;
}

const RITUAIS: Ritual[] = [
  {
    icon: Mic,
    nome: 'Roleplay',
    frequencia: 'Diário',
    descricao: 'Simulação de ligação real com script, objeções e feedback imediato. O SDR pratica abertura, SPIN, contorno de objeção e fechamento. Quem não praticar no roleplay vai praticar com o cliente de verdade.',
    cor: 'border-purple-500/30',
    iconBg: 'bg-purple-500/15 text-purple-400',
  },
  {
    icon: Star,
    nome: 'Grito de Guerra',
    frequencia: 'Diário',
    descricao: 'Ritual de alta performance no início do dia. Afirmação coletiva que alinha o time em energia, propósito e foco antes da Hora de Ouro. Parece simples, mas quem faz percebe o impacto no clima e na produtividade do dia.',
    cor: 'border-yellow-500/30',
    iconBg: 'bg-cw-yellow/15 text-cw-yellow',
  },
  {
    icon: BookOpen,
    nome: 'Cumbuca',
    frequencia: 'Semanal',
    descricao: 'Leitura coletiva semanal onde cada membro lê e ensina parte do livro para o time. É um compromisso: quem não leu faz o capítulo ser cancelado e pulado. Conhecimento que fica no indivíduo não escala. Conhecimento compartilhado cria cultura.',
    cor: 'border-blue-500/30',
    iconBg: 'bg-blue-500/15 text-blue-400',
  },
  {
    icon: MessageCircle,
    nome: 'Roda de Conversa',
    frequencia: 'Quinzenal',
    descricao: 'Espaço aberto para discussão de desafios reais, aprendizados da semana e insights sobre o mercado. Sem hierarquia — todo mundo fala, todo mundo ouve. A honestidade na Roda de Conversa acelera o aprendizado coletivo.',
    cor: 'border-emerald-500/30',
    iconBg: 'bg-emerald-500/15 text-emerald-400',
  },
  {
    icon: Trophy,
    nome: 'Bater Metas',
    frequencia: 'Mensal',
    descricao: 'Celebração coletiva quando o time bate a meta. Não é só comemorativo — é o reconhecimento de que a consistência do processo dá resultado. Cada meta batida é documentada no histórico do time.',
    cor: 'border-orange-500/30',
    iconBg: 'bg-orange-500/15 text-orange-400',
  },
  {
    icon: Swords,
    nome: 'Berserker',
    frequencia: 'Mensal',
    descricao: 'Competição interna onde a liderança define uma métrica principal do mês. Quem mais entregar nessa métrica vira o Berserker do mês e entra no Hall of Fame. Não é sobre rivalidade, é sobre superar o próprio limite.',
    cor: 'border-red-500/30',
    iconBg: 'bg-red-500/15 text-red-400',
  },
  {
    icon: Zap,
    nome: 'Feedbacks',
    frequencia: 'Contínuo',
    descricao: 'Feedback é moeda corrente aqui. Não existe "deixa pra depois" — feedback dado no momento certo muda comportamento. Tanto positivo quanto construtivo. A regra é: específico, acionável e respeitoso.',
    cor: 'border-cw-purple/30',
    iconBg: 'bg-cw-purple/15 text-cw-purple-light',
  },
];

export function CulturaComercial() {
  return (
    <section className="cw-card p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-cw-yellow" />
        <h2 className="text-xl font-bold">Cultura do Comercial</h2>
      </div>
      <p className="text-sm text-cw-muted leading-relaxed">
        Rituais são a espinha dorsal da nossa cultura. Eles criam previsibilidade, aceleram o desenvolvimento individual e fortalecem o time. Conhecer e participar deles não é opcional — é o que diferencia quem pertence de quem está só de passagem.
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-4">
        {RITUAIS.map(({ icon: Icon, nome, frequencia, descricao, cor, iconBg }) => (
          <div key={nome} className={`cw-card p-4 space-y-3 border rounded-xl ${cor} hover:bg-cw-elevated/60 transition-colors`}>
            <div className="flex items-start justify-between gap-2">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${iconBg}`}>
                <Icon className="h-4 w-4" />
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-cw-muted bg-cw-bg px-2 py-0.5 rounded-full border border-cw-border">
                {frequencia}
              </span>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-semibold text-sm text-cw-text">{nome}</h3>
              <p className="text-xs text-cw-muted leading-relaxed">{descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
