/** Regras de Conduta — normas do time comercial CW. */
import { Shield, Clock, CalendarX2, Brain, Users, HandshakeIcon, MessageSquare } from 'lucide-react';
import { Header } from '@/components/layout/Header';

interface Regra {
  icon: React.ElementType;
  titulo: string;
  cor: string;
  iconCor: string;
  itens: string[];
}

const REGRAS: Regra[] = [
  {
    icon: Clock,
    titulo: 'Atrasos',
    cor: 'bg-red-500/10 border-red-500/20',
    iconCor: 'text-red-400 bg-red-500/15',
    itens: [
      'Atrasos não são tolerados sem comunicação prévia.',
      'Avise o líder direto com no mínimo 30 minutos de antecedência se souber que vai se atrasar.',
      'Dois atrasos não comunicados no mês são registrados como ocorrência.',
      'Rituais como Roleplay, Cumbuca e Reunião de Sexta têm horário fixo — atraso interfere no coletivo.',
      'Em caso de imprevisto, entre em contato imediatamente pelo WhatsApp do líder.',
    ],
  },
  {
    icon: CalendarX2,
    titulo: 'Ausências',
    cor: 'bg-orange-500/10 border-orange-500/20',
    iconCor: 'text-orange-400 bg-orange-500/15',
    itens: [
      'Ausências precisam ser comunicadas com pelo menos 24h de antecedência.',
      'Para ausências por motivo de saúde, envie o atestado em até 48h após o retorno.',
      'Ausências sem comunicação ou justificativa são tratadas como falta não justificada.',
      'Consultas e compromissos pessoais devem ser marcados fora do horário de pico (Hora de Ouro).',
      'Faltas em rituais obrigatórios precisam de aprovação prévia do líder.',
    ],
  },
  {
    icon: Brain,
    titulo: 'Mentalidade',
    cor: 'bg-purple-500/10 border-purple-500/20',
    iconCor: 'text-cw-purple-light bg-cw-purple/15',
    itens: [
      'Mentalidade de crescimento é obrigatória: o erro é parte do processo, não é desculpa.',
      'Foque em soluções, não em problemas. Se tem um obstáculo, leve junto uma proposta de como superar.',
      'Não compare sua curva com a de outros — compare com a sua própria do mês anterior.',
      'Feedbacks são presentes: receba sem defensividade e aplique dentro de 48h.',
      'Celebre conquistas do time como se fossem suas. Aqui todo mundo sobe junto.',
    ],
  },
  {
    icon: Users,
    titulo: 'Participação em Rituais',
    cor: 'bg-blue-500/10 border-blue-500/20',
    iconCor: 'text-blue-400 bg-blue-500/15',
    itens: [
      'Presença nos rituais (Cumbuca, Roleplay, Reunião de Sexta, Grito de Guerra) é obrigatória.',
      'Cumbuca: leia o capítulo da semana antes do ritual — quem não leu não participa e o capítulo é pulado.',
      'Roleplay: venha preparado, com o script atualizado e postura de aprendizado.',
      'Reunião de Sexta: traga seus números atualizados no Kommo/Pipedrive.',
      'Roda de Conversa: participação ativa é esperada — silêncio permanente não é aceito.',
    ],
  },
  {
    icon: HandshakeIcon,
    titulo: 'Ética',
    cor: 'bg-emerald-500/10 border-emerald-500/20',
    iconCor: 'text-emerald-400 bg-emerald-500/15',
    itens: [
      'Nunca prometa algo que o produto não entrega. Cliente enganado vira cancelamento e reputação negativa.',
      'Não manipule objeções com argumentos falsos — use dados reais e cases verdadeiros.',
      'Dados de leads são confidenciais — não compartilhe fora do time sem autorização.',
      'Respeite o "não" do lead. Insistência abusiva depois de uma negativa clara é proibida.',
      'Qualquer irregularidade ou pressão inadequada deve ser reportada ao líder imediatamente.',
    ],
  },
  {
    icon: MessageSquare,
    titulo: 'Comunicação',
    cor: 'bg-yellow-500/10 border-yellow-500/20',
    iconCor: 'text-cw-yellow bg-cw-yellow/10',
    itens: [
      'Responda mensagens do time e do líder em até 2h durante o horário de trabalho.',
      'Use os canais certos: operacional no Slack, urgências no WhatsApp.',
      'Mantenha o Kommo atualizado diariamente — lead sem atualização há 24h é sinal de falha no processo.',
      'Seja direto e objetivo nas comunicações internas. Clareza economiza tempo de todo mundo.',
      'Qualquer conflito no time deve ser resolvido em conversa direta antes de escalar para a liderança.',
    ],
  },
];

export default function RegrasConduta() {
  return (
    <>
      <Header titulo="Regras de Conduta" subtitulo="Normas que sustentam a cultura de alta performance do time" />
      <div className="p-8 space-y-6">

        <div className="cw-card p-5 flex gap-4 border-cw-purple/30">
          <div className="h-10 w-10 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
            <Shield className="h-5 w-5 text-cw-purple-light" />
          </div>
          <div>
            <p className="font-semibold text-cw-text mb-1">Por que temos regras?</p>
            <p className="text-sm text-cw-muted leading-relaxed">
              Times de alta performance não são definidos apenas por números, mas pela consistência de comportamento. Regras claras criam previsibilidade, respeito mútuo e um ambiente onde todo mundo pode crescer sem depender da boa vontade de cada indivíduo.
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {REGRAS.map(({ icon: Icon, titulo, cor, iconCor, itens }) => (
            <div key={titulo} className={`cw-card p-5 space-y-4 border rounded-xl ${cor}`}>
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${iconCor}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <h3 className="font-semibold text-cw-text">{titulo}</h3>
              </div>
              <ul className="space-y-2.5">
                {itens.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-cw-muted leading-relaxed">
                    <span className="text-cw-muted/40 shrink-0 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
