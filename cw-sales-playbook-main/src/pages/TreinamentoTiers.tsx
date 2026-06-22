/** Treinamento por Tiers — trilha de desenvolvimento por faixa de maturidade. */
import { useState } from 'react';
import { GraduationCap, ChevronDown, ChevronUp, Target, Lightbulb, BookOpen } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

interface Topico { titulo: string; descricao: string }
interface Tier {
  id: string;
  label: string;
  subtitulo: string;
  canal?: string;
  foco: string;
  metrica: string;
  cor: string;
  badge: string;
  topicos: Topico[];
}

const TIERS: Tier[] = [
  {
    id: 'parcerias',
    label: 'Tier Parcerias',
    subtitulo: 'Canal indireto via parceiros estratégicos',
    canal: 'Parcerias',
    foco: 'Ativação de parceiros, geração de indicações e gestão do relacionamento com canais indiretos.',
    metrica: 'Indicações geradas, taxa de conversão de leads de parceiros',
    cor: 'border-orange-500/30 bg-orange-500/5',
    badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
    topicos: [
      { titulo: 'O que é o canal de Parcerias', descricao: 'Parceiros são empresas ou profissionais que indicam leads para a CW em troca de comissão ou benefícios. Diferente do canal direto, o SDR de Parcerias atua como ponto de contato entre o parceiro e o processo comercial.' },
      { titulo: 'Como ativar um parceiro', descricao: 'Primeiro contato: apresentação do programa de parcerias, alinhamento de expectativas e cadastro no Kommo. Envie o kit de parceiro com materiais de apoio, tabela de comissão e canal de comunicação exclusivo.' },
      { titulo: 'Cadência de relacionamento', descricao: 'Contato semanal com os top 5 parceiros ativos. Reunião mensal de revisão de resultados. Reconheça publicamente parceiros que mais indicam (rankin no grupo de WhatsApp/Slack).' },
      { titulo: 'Tratamento do lead de parceiro', descricao: 'Lead vindo de parceiro tem prioridade na fila. Registre a origem no Kommo com o nome do parceiro. Avise o parceiro quando o lead avançar em cada etapa do funil.' },
      { titulo: 'Comissão e pagamento', descricao: 'Comissão paga após o lead completar 30 dias como cliente ativo. Valor definido na tabela do programa. SDR não define comissão, apenas confirma o registro da indicação no sistema.' },
    ],
  },
  {
    id: 'tier1-2',
    label: 'Tier 1 e 2',
    subtitulo: 'Fundamentos de prospecção e qualificação',
    foco: 'Volume de prospecção, construção de script sólido e primeiros agendamentos consistentes.',
    metrica: 'Ligações realizadas, conversas iniciadas, reuniões agendadas',
    cor: 'border-blue-500/30 bg-blue-500/5',
    badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    topicos: [
      { titulo: 'Foco no volume', descricao: 'No Tier 1 e 2, o principal motor é o volume. Quanto mais ligações e contatos você faz, mais rápido você aprende a qualificar. A meta de ligações diárias não é negociável — é o termômetro de quem vai evoluir.' },
      { titulo: 'Construção do script', descricao: 'Script não é decoreba — é estrutura de pensamento. Entenda cada parte: abertura (rapport), BANT (qualificação), pitch curto (proposta de valor) e próximo passo (agenda). Pratique no Roleplay até fluir natural.' },
      { titulo: 'Hora de Ouro', descricao: 'A Hora de Ouro é a janela de maior probabilidade de contato. Nenhuma distração durante esse horário: sem redes sociais, sem WhatsApp pessoal, sem café. É o momento mais valioso do seu dia.' },
      { titulo: 'Gestão do Kommo', descricao: 'Todo lead abordado precisa estar no Kommo com status atualizado. Nada de "eu lembro depois" — lançar no CRM na hora é parte do processo, não burocracia.' },
      { titulo: 'Cadência de follow-up', descricao: 'Lead que não atendeu não é lead perdido. Estruture sua cadência: ligação, WhatsApp, e-mail em dias alternados por até 5 tentativas antes de marcar como inativo. Consistência ganha leads que o primeiro contato não fecha.' },
    ],
  },
  {
    id: 'tier3',
    label: 'Tier 3',
    subtitulo: 'Qualidade na qualificação e taxa de conversão',
    foco: 'Melhorar a taxa de conversão de agendamentos em reuniões realizadas e SALs entregues.',
    metrica: 'Taxa de no-show, qualidade dos SALs, feedbacks do Closer',
    cor: 'border-purple-500/30 bg-purple-500/5',
    badge: 'text-cw-purple-light bg-cw-purple/10 border-cw-purple/20',
    topicos: [
      { titulo: 'Da quantidade para a qualidade', descricao: 'No Tier 3 o volume já está estabelecido. Agora o jogo é qualidade: leads melhor qualificados chegam ao Closer com mais contexto, as reuniões têm mais chances de avançar e o número de SALs aprovados sobe.' },
      { titulo: 'BANT aprofundado', descricao: 'Não basta checar os 4 critérios — vá fundo em cada um. Budget: o lead sabe quanto investe hoje em ferramentas similares? Authority: quem assina? Need: qual a consequência de não resolver? Timing: o que travou até agora?' },
      { titulo: 'Redução de no-show', descricao: 'No-show mata a taxa de conversão. Estratégias: confirmação 24h antes + 2h antes, envio de lembrete via WhatsApp com o link da reunião, personalização do convite de calendário com contexto do que vai ser discutido.' },
      { titulo: 'Briefing do lead para o Closer', descricao: 'Antes de transferir o lead, preencha o briefing padrão no Kommo: contexto da empresa, problema identificado, critério de decisão, objeção antecipada. Closer que recebe lead com briefing completo fecha mais.' },
      { titulo: 'Feedback loop com o Closer', descricao: 'Peça feedback semanal do Closer sobre a qualidade dos leads. Quais entraram sem qualificação suficiente? Quais tiveram o menor esforço para avançar? Use isso para calibrar sua qualificação na semana seguinte.' },
    ],
  },
  {
    id: 'tier4-5',
    label: 'Tier 4 e 5',
    subtitulo: 'Alta performance e referência técnica',
    foco: 'Ser referência técnica no time, mentoriar Tier 1-2, contribuir com processos e gerar receita previsível.',
    metrica: 'Receita gerada, consistência mês a mês, NPS do Closer sobre a qualidade dos leads',
    cor: 'border-yellow-500/30 bg-yellow-500/5',
    badge: 'text-cw-yellow bg-cw-yellow/10 border-cw-yellow/30',
    topicos: [
      { titulo: 'Consistência como padrão', descricao: 'No Tier 4 e 5, bater meta uma vez não é suficiente. O diferencial é repetir mês a mês. Isso exige revisão constante de processo, análise de métricas e capacidade de se reinventar quando o canal muda.' },
      { titulo: 'Mentoria informal', descricao: 'SDRs sênior naturalmente se tornam referência para Tiers 1 e 2. Esteja disponível para responder dúvidas, fazer role-play improvisado e dar feedbacks. Quem ensina consolida o próprio aprendizado.' },
      { titulo: 'Contribuição com o processo', descricao: 'Identifique gargalos no processo de prospecção e proponha melhorias com dados. Um bom insight operacional vindo de quem está na linha de frente vale mais do que qualquer consultoria externa.' },
      { titulo: 'Gestão de pipeline avançada', descricao: 'No Tier 4 e 5 você precisa prever o fechamento do mês com antecedência. Analise a taxa de conversão por etapa, antecipe onde o pipeline vai furar e ajuste a prospecção antes que o problema apareça nos números.' },
      { titulo: 'Preparação para evolução de carreira', descricao: 'Tier 5 é o pré-requisito para pleitear uma posição de Closer ou de Team Lead. Nessa fase, demonstre capacidade de gestão de si mesmo, liderança de pares e domínio completo do processo comercial da CW.' },
    ],
  },
];

export default function TreinamentoTiers() {
  const [aberto, setAberto] = useState<Record<string, boolean>>({});

  const toggle = (tierId: string, idx: number) => {
    const key = `${tierId}-${idx}`;
    setAberto((p) => ({ ...p, [key]: !p[key] }));
  };

  return (
    <>
      <Header titulo="Treinamento por Tiers" subtitulo="Trilha de desenvolvimento por faixa de maturidade comercial" />
      <div className="p-8 space-y-8 max-w-4xl">

        <div className="cw-card p-5 flex gap-4">
          <div className="h-10 w-10 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
            <GraduationCap className="h-5 w-5 text-cw-purple-light" />
          </div>
          <div>
            <p className="font-semibold text-cw-text mb-1">Como funciona a progressão por Tiers</p>
            <p className="text-sm text-cw-muted leading-relaxed">
              Os tiers são agrupados por faixas levando em conta taxa de conversão e canal de origem. O objetivo é facilitar a condução dos treinamentos, garantindo que cada pessoa trabalhe os desafios específicos do seu nível de maturidade.
            </p>
          </div>
        </div>

        {TIERS.map((tier) => (
          <div key={tier.id} className={cn('rounded-xl border p-6 space-y-5', tier.cor)}>
            {/* Header do Tier */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full border', tier.badge)}>
                    {tier.label}
                  </span>
                  {tier.canal && (
                    <span className="text-xs text-cw-muted font-medium">Canal: {tier.canal}</span>
                  )}
                </div>
                <p className="text-cw-muted text-sm">{tier.subtitulo}</p>
              </div>
            </div>

            {/* Foco e Métrica */}
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="bg-cw-bg/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cw-muted">
                  <Target className="h-3.5 w-3.5" />
                  Foco
                </div>
                <p className="text-xs text-cw-muted leading-relaxed">{tier.foco}</p>
              </div>
              <div className="bg-cw-bg/50 rounded-lg p-3 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cw-muted">
                  <Lightbulb className="h-3.5 w-3.5" />
                  Métricas-chave
                </div>
                <p className="text-xs text-cw-muted leading-relaxed">{tier.metrica}</p>
              </div>
            </div>

            {/* Tópicos accordion */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-cw-muted mb-3">
                <BookOpen className="h-3.5 w-3.5" />
                Tópicos do treinamento
              </div>
              {tier.topicos.map(({ titulo, descricao }, i) => {
                const key = `${tier.id}-${i}`;
                return (
                  <div key={i} className="bg-cw-bg/40 rounded-lg border border-cw-border/50 overflow-hidden">
                    <button
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-cw-text hover:text-cw-purple-light transition-colors"
                      onClick={() => toggle(tier.id, i)}
                    >
                      <span>{titulo}</span>
                      {aberto[key]
                        ? <ChevronUp className="h-4 w-4 text-cw-muted shrink-0" />
                        : <ChevronDown className="h-4 w-4 text-cw-muted shrink-0" />
                      }
                    </button>
                    {aberto[key] && (
                      <div className="px-4 pb-4 text-xs text-cw-muted leading-relaxed border-t border-cw-border/50 pt-3">
                        {descricao}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </>
  );
}
