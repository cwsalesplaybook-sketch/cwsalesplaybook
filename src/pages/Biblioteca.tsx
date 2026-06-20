/** Biblioteca de Estudos — livros, podcasts, vídeos, artigos e cursos recomendados. */
import { useState } from 'react';
import { BookOpen, Headphones, Play, FileText, GraduationCap, ExternalLink } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

type Aba = 'livros' | 'podcasts' | 'videos' | 'artigos' | 'cursos';

const ABAS: { key: Aba; label: string; Icon: React.ElementType }[] = [
  { key: 'livros',   label: 'Livros',    Icon: BookOpen       },
  { key: 'podcasts', label: 'Podcasts',  Icon: Headphones     },
  { key: 'videos',   label: 'Vídeos',    Icon: Play           },
  { key: 'artigos',  label: 'Artigos',   Icon: FileText       },
  { key: 'cursos',   label: 'Cursos',    Icon: GraduationCap  },
];

interface Livro { titulo: string; autor: string; resumo: string }
interface Secao { categoria: string; livros: Livro[] }

const LIVROS: Secao[] = [
  {
    categoria: 'Vendas',
    livros: [
      { titulo: 'A Bíblia de Vendas', autor: 'Jeffrey Gitomer', resumo: 'Manual completo de técnicas de vendas, prospecção e relacionamento com clientes.' },
      { titulo: 'Prospecção Fanática', autor: 'Jeb Blount', resumo: 'Guia definitivo para preencher o pipeline e manter uma cadência de prospecção consistente.' },
      { titulo: 'SPIN Selling', autor: 'Neil Rackham', resumo: 'Metodologia baseada em perguntas de Situação, Problema, Implicação e Necessidade para grandes vendas.' },
      { titulo: 'A Venda Desafiadora', autor: 'Matthew Dixon e Brent Adamson', resumo: 'Como SDRs de alta performance ensinam, personalizam e controlam a conversa de vendas.' },
    ],
  },
  {
    categoria: 'Gestão de Vendas',
    livros: [
      { titulo: 'Receita Previsível', autor: 'Aaron Ross', resumo: 'O livro que criou o modelo de SDR. Como construir um motor de geração de leads previsível.' },
      { titulo: 'Gestão de Alta Performance', autor: 'Andrew Grove', resumo: 'Fundamentos de gestão para líderes que querem extrair o máximo de seus times.' },
      { titulo: 'O Pipeline de Vendas', autor: 'Mike Weinberg', resumo: 'Como criar, gerenciar e maximizar o pipeline para bater metas consistentemente.' },
    ],
  },
  {
    categoria: 'Técnicas de Negociação',
    livros: [
      { titulo: 'Nunca Divida a Diferença', autor: 'Chris Voss', resumo: 'Técnicas de negociação do FBI aplicadas em vendas, baseadas em empatia e inteligência tática.' },
      { titulo: 'Como Chegar ao Sim', autor: 'Roger Fisher e William Ury', resumo: 'Método de Harvard para negociação baseada em princípios, não em posições.' },
    ],
  },
  {
    categoria: 'Persuasão',
    livros: [
      { titulo: 'As Armas da Persuasão', autor: 'Robert Cialdini', resumo: 'Os 6 princípios da influência que todo vendedor precisa dominar: reciprocidade, compromisso, prova social, autoridade, afinidade e escassez.' },
      { titulo: 'Pré-suasão', autor: 'Robert Cialdini', resumo: 'Como o que acontece antes da sua mensagem de vendas determina se ela vai funcionar.' },
    ],
  },
  {
    categoria: 'Comunicação',
    livros: [
      { titulo: 'Como Fazer Amigos e Influenciar Pessoas', autor: 'Dale Carnegie', resumo: 'Clássico atemporal sobre relacionamentos humanos, empatia e comunicação eficaz.' },
      { titulo: 'Comunicação Não-Violenta', autor: 'Marshall Rosenberg', resumo: 'Técnicas para comunicar necessidades e ouvi-las no outro sem gerar conflito.' },
    ],
  },
];

interface PodcastItem { nome: string; descrição: string; plataforma: string }
const PODCASTS: PodcastItem[] = [
  { nome: 'Papo de Vendedor', descrição: 'Conversas profundas sobre técnicas, mentalidade e carreira em vendas no Brasil.', plataforma: 'Spotify / Apple Podcasts' },
  { nome: 'Jornada do Herói das Vendas', descrição: 'Entrevistas com vendedores de alta performance sobre seus processos e histórias reais.', plataforma: 'Spotify' },
  { nome: 'Café com ADM', descrição: 'Gestão comercial, estratégia e liderança de times de vendas.', plataforma: 'YouTube / Spotify' },
  { nome: 'Venda Com Propósito', descrição: 'Técnicas consultivas, prospecção e construção de relacionamentos de longo prazo.', plataforma: 'Spotify' },
];

interface VideoItem { titulo: string; canal: string; descricao: string }
const VIDEOS: VideoItem[] = [
  { titulo: 'Cold Call 2.0 — Como prospectar sem ser chato', canal: 'Canal CW / Interno', descricao: 'Workshop interno sobre como abordar leads frios com contexto e personalização.' },
  { titulo: 'Masterclass SPIN Selling', canal: 'YouTube — Neil Rackham', descricao: 'O próprio autor explicando como aplicar a metodologia em contextos modernos de vendas.' },
  { titulo: 'Objeção "Tô satisfeito com o atual" — Como contornar', canal: 'Canal CW / Interno', descricao: 'Role-play gravado com o time mostrando como tratar a objeção mais comum no segmento.' },
  { titulo: 'Framework de Fechamento em 3 Passos', canal: 'Thiago Concer', descricao: 'Como criar senso de urgência sem pressão e conduzir o lead até a decisão.' },
];

interface ArtigoItem { titulo: string; fonte: string; tema: string }
const ARTIGOS: ArtigoItem[] = [
  { titulo: 'The Ultimate Guide to Sales Qualification', fonte: 'HubSpot Blog', tema: 'Qualificação' },
  { titulo: 'Como usar BANT em 2024', fonte: 'Resultados Digitais', tema: 'Metodologia' },
  { titulo: 'Cold Email vs. Cold Call: O que funciona melhor?', fonte: 'Salesloft Blog', tema: 'Prospecção' },
  { titulo: 'Por que SDRs falham na Hora de Ouro?', fonte: 'Meetime Blog', tema: 'Produtividade' },
  { titulo: 'Como montar um cadência de follow-up que não irrita o lead', fonte: 'Exact Sales Blog', tema: 'Follow-up' },
];

interface CursoItem { nome: string; plataforma: string; nivel: string; foco: string }
const CURSOS: CursoItem[] = [
  { nome: 'SDR Academy', plataforma: 'Inside Sales', nivel: 'Iniciante a Intermediário', foco: 'Prospecção, qualificação e cadência' },
  { nome: 'Vendas Consultivas na Prática', plataforma: 'Hotmart', nivel: 'Intermediário', foco: 'SPIN Selling, BANT, fechamento' },
  { nome: 'Comunicação e Persuasão em Vendas', plataforma: 'Coursera', nivel: 'Todos os níveis', foco: 'Rapport, escuta ativa, linguagem corporal' },
  { nome: 'Gestão de Pipeline no CRM', plataforma: 'Pipedrive Academy', nivel: 'Todos os níveis', foco: 'Kommo/Pipedrive, automações, relatórios' },
];

export default function Biblioteca() {
  const [aba, setAba] = useState<Aba>('livros');

  return (
    <>
      <Header titulo="Biblioteca de Estudos" subtitulo="Recursos para acelerar seu desenvolvimento no comercial" />
      <div className="p-8 space-y-6">

        {/* Tabs */}
        <div className="flex gap-1 border-b border-cw-border overflow-x-auto">
          {ABAS.map(({ key, label, Icon }) => (
            <button
              key={key}
              onClick={() => setAba(key)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
                aba === key
                  ? 'border-cw-purple text-cw-purple-light'
                  : 'border-transparent text-cw-muted hover:text-cw-text'
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Livros */}
        {aba === 'livros' && (
          <div className="space-y-6">
            {LIVROS.map(({ categoria, livros }) => (
              <div key={categoria} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">{categoria}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {livros.map(({ titulo, autor, resumo }) => (
                    <div key={titulo} className="cw-card p-4 flex gap-3 hover:border-cw-purple/30 transition-colors">
                      <div className="h-10 w-10 rounded bg-cw-purple/15 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-cw-purple-light" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-sm text-cw-text">{titulo}</p>
                        <p className="text-xs text-cw-purple-light/80 font-medium">{autor}</p>
                        <p className="text-xs text-cw-muted leading-relaxed">{resumo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Podcasts */}
        {aba === 'podcasts' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {PODCASTS.map(({ nome, descrição, plataforma }) => (
              <div key={nome} className="cw-card p-5 space-y-2 hover:border-cw-purple/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Headphones className="h-4 w-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-cw-text">{nome}</p>
                    <p className="text-[11px] text-cw-muted/60 font-medium">{plataforma}</p>
                  </div>
                </div>
                <p className="text-xs text-cw-muted leading-relaxed">{descrição}</p>
              </div>
            ))}
          </div>
        )}

        {/* Vídeos */}
        {aba === 'videos' && (
          <div className="space-y-3">
            {VIDEOS.map(({ titulo, canal, descricao }) => (
              <div key={titulo} className="cw-card p-4 flex gap-4 items-start hover:border-cw-purple/30 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-red-500/15 flex items-center justify-center shrink-0">
                  <Play className="h-5 w-5 text-red-400" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="font-semibold text-sm text-cw-text">{titulo}</p>
                  <p className="text-xs text-cw-muted font-medium">{canal}</p>
                  <p className="text-xs text-cw-muted leading-relaxed">{descricao}</p>
                </div>
                <ExternalLink className="h-4 w-4 text-cw-muted/40 shrink-0 mt-0.5" />
              </div>
            ))}
          </div>
        )}

        {/* Artigos */}
        {aba === 'artigos' && (
          <div className="space-y-3">
            {ARTIGOS.map(({ titulo, fonte, tema }) => (
              <div key={titulo} className="cw-card p-4 flex items-center gap-4 hover:border-cw-purple/30 transition-colors">
                <div className="h-9 w-9 rounded-lg bg-blue-500/15 flex items-center justify-center shrink-0">
                  <FileText className="h-4 w-4 text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-cw-text">{titulo}</p>
                  <p className="text-xs text-cw-muted">{fonte}</p>
                </div>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cw-purple/10 text-cw-purple-light border border-cw-purple/20">
                  {tema}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Cursos */}
        {aba === 'cursos' && (
          <div className="grid sm:grid-cols-2 gap-4">
            {CURSOS.map(({ nome, plataforma, nivel, foco }) => (
              <div key={nome} className="cw-card p-5 space-y-3 hover:border-cw-purple/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-lg bg-cw-yellow/15 flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4 w-4 text-cw-yellow" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-cw-text">{nome}</p>
                    <p className="text-[11px] text-cw-muted font-medium">{plataforma}</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-cw-muted">
                  <p><span className="text-cw-text/60 font-medium">Nível:</span> {nivel}</p>
                  <p><span className="text-cw-text/60 font-medium">Foco:</span> {foco}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </>
  );
}
