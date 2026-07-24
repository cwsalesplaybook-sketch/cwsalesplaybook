/** Biblioteca de Estudos — livros, podcasts, vídeos, artigos e cursos recomendados. */
import { useState } from 'react';
import { BookOpen, Headphones, Play, FileText, GraduationCap, ExternalLink, FileDown } from 'lucide-react';
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

interface Livro { titulo: string; autor: string; resumo: string; pdf?: string }
interface Secao { categoria: string; livros: Livro[] }

const LIVROS: Secao[] = [
  {
    categoria: 'Vendas',
    livros: [
      { titulo: 'A Bíblia de Vendas', autor: 'Jeffrey Gitomer', resumo: 'Manual completo de técnicas de vendas, prospecção e relacionamento com clientes.', pdf: '/livros/a-biblia-de-vendas.pdf' },
      { titulo: 'Prospecção Fanática', autor: 'Jeb Blount', resumo: 'Guia definitivo para preencher o pipeline e manter uma cadência de prospecção consistente.', pdf: '/livros/prospeccao-fanatica.pdf' },
      { titulo: 'SPIN Selling', autor: 'Neil Rackham', resumo: 'Metodologia baseada em perguntas de Situação, Problema, Implicação e Necessidade para grandes vendas.', pdf: '/livros/spin-selling.pdf' },
      { titulo: 'A Venda Desafiadora', autor: 'Matthew Dixon e Brent Adamson', resumo: 'Como SDRs de alta performance ensinam, personalizam e controlam a conversa de vendas.', pdf: '/livros/a-venda-desafiadora.pdf' },
      { titulo: 'Objeções', autor: 'Jeb Blount', resumo: 'Guia definitivo para dominar a arte e a ciência de superar o não em cada etapa do processo de vendas.', pdf: '/livros/objecoes.pdf' },
      { titulo: 'Inteligência Emocional em Vendas', autor: 'Jeb Blount', resumo: 'Como os supervendedores usam a inteligência emocional para se conectar com os leads e fechar mais negócios.', pdf: '/livros/inteligencia-emocional-em-vendas.pdf' },
      { titulo: 'Alcançando a Excelência em Vendas para Grandes Clientes', autor: 'Robert B. Miller e Stephen E. Heiman', resumo: 'Táticas e estratégias para chegar a quem decide a compra e vencer a concorrência em vendas para grandes clientes.' },
      { titulo: 'Vendas Virtuais', autor: 'Jeb Blount', resumo: 'Como usar vídeo, telefone, mensagens e redes sociais para engajar clientes, avançar o pipeline e fechar negócios à distância.' },
    ],
  },
  {
    categoria: 'Gestão de Vendas',
    livros: [
      { titulo: 'Receita Previsível', autor: 'Aaron Ross', resumo: 'O livro que criou o modelo de SDR. Como construir um motor de geração de leads previsível.', pdf: '/livros/receita-previsivel.pdf' },
      { titulo: 'Gestão de Alta Performance', autor: 'Andrew Grove', resumo: 'Fundamentos de gestão para líderes que querem extrair o máximo de seus times.', pdf: '/livros/gestao-de-alta-performance.pdf' },
      { titulo: 'O Pipeline de Vendas', autor: 'Mike Weinberg', resumo: 'Como criar, gerenciar e maximizar o pipeline para bater metas consistentemente.' },
      { titulo: 'BE 2.0', autor: 'Jim Collins', resumo: 'Roteiro para líderes de pequenas e médias empresas construírem organizações sólidas e duradouras.' },
      { titulo: 'Pipeline de Liderança', autor: 'Ram Charan, Stephen Drotter e James Noel', resumo: 'A arquitetura interna para desenvolver gestores capacitados em todos os níveis da organização.' },
      { titulo: 'Hipercrescimento', autor: 'Aaron Ross e Jason Lemkin', resumo: 'Diagnóstico das razões pelas quais uma empresa não cresce mais rápido e como sair da estagnação.' },
      { titulo: 'Comece Pelo Porquê', autor: 'Simon Sinek', resumo: 'Por que empresas e líderes mais admirados e influentes são movidos por um forte senso de propósito.' },
      { titulo: 'A Meta', autor: 'Eliyahu M. Goldratt', resumo: 'Romance sobre melhoria contínua e como resolver gargalos de produção e receita numa organização.' },
      { titulo: 'The Sales Acceleration Formula', autor: 'Mark Roberge', resumo: 'Abordagem escalável e previsível para crescer receita e construir um time de vendas vencedor.' },
      { titulo: 'Scaling Up', autor: 'Verne Harnish', resumo: 'Guia para crescimento sustentável equilibrando Pessoas, Estratégia, Execução e Caixa.' },
      { titulo: 'The Sales Development Playbook', autor: 'Trish Bertuzzi', resumo: 'Seis elementos para construir pipeline recorrente e acelerar o crescimento com inside sales.' },
      { titulo: 'The SaaS Sales Method: Sales As a Science', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'Primeiro livro da série Sales Blueprints — a ciência por trás das vendas em receita recorrente.' },
      { titulo: 'Blueprints for a SaaS Sales Organization', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'Como desenhar, construir e escalar uma organização de vendas centrada no cliente.' },
      { titulo: 'The SaaS Sales Method Fundamentals', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'Como toda a organização se comunica com o cliente, em cada canal e interação.' },
      { titulo: 'The SaaS Sales Method for SDRs', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'As técnicas mais avançadas de prospecção para Sales Development Representatives.' },
      { titulo: 'The SaaS Sales Method for Account Executives', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'Como vencer clientes com ciclos de venda mais curtos, contratos menores e menos tempo de treinamento.' },
      { titulo: 'The SaaS Sales Method for Customer Success & Account Managers', autor: 'Jacco van der Kooij e Fernando Pizarro', resumo: 'Como Customer Success e Account Managers aplicam as habilidades fundamentais de vendas para fazer o cliente crescer.' },
    ],
  },
  {
    categoria: 'Técnicas de Negociação',
    livros: [
      { titulo: 'Negocie Como Se Sua Vida Dependesse Disso', autor: 'Chris Voss', resumo: 'Nove princípios contraintuitivos de negociação de alto risco, do ex-negociador de reféns do FBI.', pdf: '/livros/nunca-divida-a-diferenca.pdf' },
      { titulo: 'Como Chegar ao Sim', autor: 'Roger Fisher e William Ury', resumo: 'Método de Harvard para negociação baseada em princípios, não em posições.' },
      { titulo: 'Negocie Qualquer Coisa com Qualquer Pessoa', autor: 'Eduardo Ferraz', resumo: 'Técnicas práticas para obter ótimos resultados em pequenos e grandes acordos do dia a dia.' },
    ],
  },
  {
    categoria: 'Técnicas de Persuasão',
    livros: [
      { titulo: 'As Armas da Persuasão', autor: 'Robert Cialdini', resumo: 'Os 6 princípios da influência que todo vendedor precisa dominar: reciprocidade, compromisso, prova social, autoridade, afinidade e escassez.' },
      { titulo: 'Pré-suasão', autor: 'Robert Cialdini', resumo: 'Como o que acontece antes da sua mensagem de vendas determina se ela vai funcionar.' },
      { titulo: 'Manual de Persuasão do FBI', autor: 'Jack Schafer', resumo: 'Estratégias do Programa de Análise Comportamental do FBI para entrevistar, detectar mentiras e influenciar no dia a dia.' },
      { titulo: 'Como Fazer Amigos e Influenciar Pessoas', autor: 'Dale Carnegie', resumo: 'Clássico atemporal sobre relacionamentos humanos, empatia e comunicação eficaz.' },
    ],
  },
  {
    categoria: 'Comunicação',
    livros: [
      { titulo: 'Comunicação Não-Violenta', autor: 'Marshall Rosenberg', resumo: 'Técnicas para comunicar necessidades e ouvi-las no outro sem gerar conflito.' },
      { titulo: 'Empatia Assertiva', autor: 'Kim Scott', resumo: 'Como se importar pessoalmente com as pessoas e ao mesmo tempo confrontá-las diretamente, sem cair na agressividade nem na insinceridade.' },
      { titulo: 'Como Convencer Alguém em 90 Segundos', autor: 'Nicholas Boothman', resumo: 'Como usar rosto, corpo, atitude e voz para causar uma primeira impressão marcante e criar conexões duradouras.' },
    ],
  },
];

interface PodcastItem { titulo: string; link: string }
interface SecaoPodcast { categoria: string; podcasts: PodcastItem[] }

const PODCASTS: SecaoPodcast[] = [
  {
    categoria: 'Vendas',
    podcasts: [
      { titulo: 'Transformando suas reuniões de vendas em espetáculo, com Maria Valadares', link: 'https://open.spotify.com/episode/3yt7gj5kIBvHWmXS6zraDy' },
      { titulo: 'Mitos da prospecção por telefone e como diferenciar sua cold-call, com Myrian Mourão', link: 'https://open.spotify.com/episode/6zF7jQGJ4ShfaqDsV5q0Wl' },
    ],
  },
  {
    categoria: 'Gestão de Vendas',
    podcasts: [
      { titulo: 'Forecast e previsibilidade em vendas: quais são as melhores práticas?, com Carlos Campos', link: 'https://open.spotify.com/episode/5eDRJj1j9wnUSHPxeSTLlW' },
      { titulo: 'O que não te contam sobre ser líder de vendas, com Eduardo Rodrigues', link: 'https://open.spotify.com/episode/5QUXF6uj25X2ZvsoviVuuF' },
      { titulo: 'Análises de Marketing a Vendas para fazer antes do segundo semestre, com Diego Cordovez', link: 'https://open.spotify.com/episode/6Fys7BjviH1Tj9Kb35sPAy' },
      { titulo: 'How to Scale a Billion Dollar Sales Team, com John McMahon (Board Member, Snowflake)', link: 'https://open.spotify.com/episode/1SeFv3BDwYPVvbwufi2Od0' },
      { titulo: 'Recrutando SDRs: como atrair e selecionar em pré-vendas, com Gustavo Marques', link: 'https://open.spotify.com/episode/3VXQv6a4MEVYuCunUB8V27' },
      { titulo: 'Gestão Ágil em time de vendas: como identificar e solucionar problemas, com Bárbara Silvério', link: 'https://open.spotify.com/episode/2dX8mOQaya7jw8Fk0eBXJz' },
      { titulo: 'Treinamento e Carreira em Vendas', link: 'https://open.spotify.com/episode/62Hx4M69shY5TXFtK4GmWZ' },
      { titulo: 'Inteligência Comercial: a estratégia além das listas de prospecção, com Roberta Kuzolitz', link: 'https://open.spotify.com/episode/2MU6IbzM2O9xnG1XfL1hCj' },
    ],
  },
  {
    categoria: 'Gestão de Pré-vendas',
    podcasts: [
      { titulo: 'Como avaliar e otimizar uma operação de prospecção, com Felipe Traina', link: 'https://open.spotify.com/episode/0zfJPQP1Hou7Lg7FZ38RNg' },
      { titulo: 'Como dimensionar uma operação de prospecção outbound', link: 'https://open.spotify.com/episode/6Q4I6xvwCEqIGd2144xgUR' },
      { titulo: 'Geração de listas e enriquecimento de dados na prospecção, com Paulo Krieser', link: 'https://open.spotify.com/episode/3BOFRHuKiD1vkaksaMMoSQ' },
    ],
  },
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
                  {livros.map(({ titulo, autor, resumo, pdf }) => (
                    <div
                      key={titulo}
                      role={pdf ? 'button' : undefined}
                      tabIndex={pdf ? 0 : undefined}
                      onClick={pdf ? () => window.open(pdf, '_blank', 'noopener,noreferrer') : undefined}
                      onKeyDown={pdf ? (e) => { if (e.key === 'Enter') window.open(pdf, '_blank', 'noopener,noreferrer'); } : undefined}
                      className={cn(
                        'cw-card p-4 flex gap-3 transition-colors',
                        pdf ? 'hover:border-cw-purple/50 cursor-pointer' : 'hover:border-cw-purple/30'
                      )}
                    >
                      <div className="h-10 w-10 rounded bg-cw-purple/15 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-cw-purple-light" />
                      </div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm text-cw-text">{titulo}</p>
                          {pdf && <FileDown className="h-4 w-4 text-cw-purple-light/60 shrink-0 mt-0.5" />}
                        </div>
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
          <div className="space-y-6">
            {PODCASTS.map(({ categoria, podcasts }) => (
              <div key={categoria} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">{categoria}</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {podcasts.map(({ titulo, link }) => (
                    <a
                      key={titulo + link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cw-card p-4 flex items-start gap-3 hover:border-cw-purple/50 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <Headphones className="h-4 w-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-cw-text leading-snug">{titulo}</p>
                        <p className="text-[11px] text-cw-muted/60 font-medium mt-1">Spotify</p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-cw-muted/40 shrink-0 mt-0.5" />
                    </a>
                  ))}
                </div>
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
