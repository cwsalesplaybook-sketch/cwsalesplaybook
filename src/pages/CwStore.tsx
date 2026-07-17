/** CW Store — o marketplace de apps parceiros da Cardápio Web: visão geral,
 *  funcionamento técnico e perspectiva comercial pro time vender.
 *  Conteúdo consolidado de dois materiais internos: o doc "CW Store — Visão
 *  Geral, Funcionamento e Perspectiva Comercial" (funcionamento + argumentos
 *  de venda) e a apresentação do Glauton Santos na Burger Expo Pizzaria 2026
 *  (a visão de "Sistema Operacional do Food Service", o modelo de revenue
 *  share pros parceiros e os apps de prova de conceito construídos com IA). */
import { useState } from 'react';
import {
  Store, ExternalLink, Mail, ShieldCheck, Boxes, Workflow, Users, Rocket,
  DollarSign, CheckCircle2, AlertTriangle, Sparkles, Package, ListChecks,
  Tags, CalendarCheck, ArrowRight, Building2, MessageCircle, Copy, Check,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const PILARES = [
  {
    titulo: 'CW App Store',
    subtitulo: 'o marketplace',
    icon: Store,
    cor: 'text-cw-purple-light bg-cw-purple/10 border-cw-purple/30',
    texto: 'Ponto de entrada pro estabelecimento: onde o restaurante descobre, instala e gerencia os apps parceiros, sem precisar de suporte técnico ou configuração manual.',
  },
  {
    titulo: 'OAuth',
    subtitulo: 'a autorização',
    icon: ShieldCheck,
    cor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    texto: 'O momento em que o Proprietário do estabelecimento concede, de forma explícita, as permissões que o app poderá usar — parecido com um login social, dentro do próprio portal da Cardápio Web.',
  },
  {
    titulo: 'API aberta',
    subtitulo: 'a integração de fato',
    icon: Workflow,
    cor: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
    texto: 'Por onde o app lê e escreve dados reais do estabelecimento (cardápio, pedidos, configurações de loja), depois que a instalação foi autorizada e o token foi emitido.',
  },
];

const FLUXO = [
  { n: 1, t: 'Cadastro do app', d: 'A integradora envia ao suporte da Cardápio Web nome, categoria, descrição, imagens, URLs técnicas e as permissões que o app precisa acessar.' },
  { n: 2, t: 'Aprovação', d: 'A Cardápio Web analisa o cadastro em Sandbox e depois em Produção. Pode levar até 7 dias corridos.' },
  { n: 3, t: 'Publicação', d: 'Uma vez aprovado, o app fica disponível no marketplace — público (listado no catálogo) ou privado (só por link direto).' },
  { n: 4, t: 'Instalação', d: 'O Proprietário do restaurante encontra o app na CW Store e clica em instalar.' },
  { n: 5, t: 'Autorização (OAuth)', d: 'O Proprietário escolhe qual loja será conectada e confirma as permissões solicitadas pelo app.' },
  { n: 6, t: 'Emissão de tokens', d: 'O app recebe credenciais vinculadas especificamente àquela instalação (aquele app + aquela loja).' },
  { n: 7, t: 'Uso da API', d: 'Com o token em mãos, o app consulta e atualiza dados da loja, do catálogo e dos pedidos, dentro do que foi autorizado.' },
  { n: 8, t: 'Eventos em tempo real', d: 'Opcional: se configurado, o app recebe notificação automática a cada novo pedido ou mudança de status, sem precisar ficar consultando a API o tempo todo.' },
];

const MODULOS_API = [
  { t: 'Loja', d: 'Dados do estabelecimento, horários de funcionamento, formas de pagamento e configurações gerais.' },
  { t: 'Catálogo', d: 'Categorias, produtos, complementos e a estrutura do cardápio.' },
  { t: 'Pedidos', d: 'Consulta, criação, atualização de status e histórico de pedidos.' },
];

const VALOR_RESTAURANTE = [
  'Expande o que o restaurante consegue fazer (marketing, fidelidade, gestão, logística, IA etc.) sem precisar contratar desenvolvimento próprio.',
  'Instalação simples, feita em poucos cliques, direto no sistema que o restaurante já usa.',
  'O próprio dono do negócio decide quais permissões conceder, e pode revogar o acesso a qualquer momento.',
];

const VALOR_PARCEIRO = [
  'Acesso direto a uma base de restaurantes que já usa a Cardápio Web — reduz o esforço de prospecção.',
  'Fluxo de instalação e autorização padronizado, o que acelera o fechamento comercial e a ativação de novos clientes.',
  'Apps públicos ganham vitrine própria dentro do marketplace, funcionando como gerador de leads.',
  'Dá pra publicar apps privados pra atender clientes ou contratos específicos, sem expor a solução no catálogo público.',
  'Organização por categorias (Marketing, Vendas, Gestão ou Logística), o que ajuda a posicionar comercialmente cada solução.',
];

const ARGUMENTOS_VENDA = [
  'Fazer parte de um ecossistema já validado por restaurantes, em vez de vender uma integração isolada.',
  'Redução do tempo de implementação pro cliente final, comparado a integrações manuais ou personalizadas.',
  'Quanto mais parceiros no ecossistema, mais valor agregado pra todos os restaurantes — um argumento de crescimento conjunto.',
];

const MODELO_PARCEIROS = [
  { icon: DollarSign, t: '80% fica com o parceiro', d: 'O desenvolvedor escolhe o preço e o posicionamento do próprio app. Sem taxa adicional de pagamento.' },
  { icon: Rocket, t: 'Distribuição sem custo de marketing', d: 'A Cardápio Web coloca o app diante de toda a base CW. A descoberta acontece dentro da própria plataforma.' },
  { icon: Sparkles, t: 'Receita recorrente', d: 'O parceiro cresce junto com a adoção do app pela base de restaurantes.' },
];

const QUEM_CONSTROI = [
  'Agências de food marketing',
  'Desenvolvedores e empresas tech',
  'Representantes comerciais',
  'Restaurantes e operadores',
  'Consultores do setor',
  'Pequenas, médias e grandes empresas',
];

const APPS_EXEMPLO = [
  { icon: ListChecks, t: 'Checklists Inteligentes', tempo: '1 semana' },
  { icon: Tags, t: 'Etiquetas', tempo: '3 dias' },
  { icon: CalendarCheck, t: 'Reserva de Mesas', tempo: '2 semanas' },
];

// Não é um produto pra "vender" (a maioria dos apps é de graça pro
// restaurante) — é um diferencial que já vem incluso. As frases refletem
// isso: mostram valor, não pressionam fechamento.
const FRASES = [
  {
    momento: 'Durante a demonstração',
    itens: [
      'Além do que você já tá vendo aqui, a gente tem uma loja de aplicativos dentro do sistema, a CW Store. São soluções de parceiros que se conectam direto no seu cardápio: fidelidade, IA, fiscal, o que fizer sentido pro seu negócio.',
      'Você não fica preso só no que a Cardápio Web já oferece. A CW Store é tipo uma loja de apps: você instala o que precisar, quando precisar, sem trocar de sistema.',
    ],
  },
  {
    momento: 'Diferencial frente à concorrência',
    itens: [
      'A diferença é que aqui você não troca de plataforma pra crescer, você adiciona funcionalidades por dentro, sem perder histórico nem reconfigurar tudo de novo.',
      'Muita gente troca de sistema porque o antigo não faz mais X. Com a CW Store isso tende a não acontecer: se surgir uma necessidade nova, é bem provável que já exista (ou vá existir) um app pra isso, plugado direto no seu cardápio.',
    ],
  },
  {
    momento: 'Quebra de objeção (custo)',
    itens: [
      'Não é uma cobrança extra da Cardápio Web, cada app tem o preço definido pelo próprio parceiro que criou, e muitos são gratuitos.',
      'Você só instala o que quiser. Não é obrigatório, é uma opção a mais que já vem disponível dentro da sua conta.',
    ],
  },
  {
    momento: 'Reforço pós-fechamento',
    itens: [
      'Vale a pena dar uma olhada na CW Store de tempos em tempos, o catálogo de apps só cresce, e pode aparecer uma solução que resolve exatamente uma dor que você tem hoje.',
      'Se você (ou alguém que você conhece) constrói ou já tem um sistema pronto pro food service, a CW Store também é um canal de distribuição, cadastra o app e a Cardápio Web coloca na frente da nossa base inteira.',
    ],
  },
];

function FraseCard({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);
  const copiar = () => {
    navigator.clipboard?.writeText(texto).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    });
  };
  return (
    <div className="rounded-xl border border-cw-border bg-cw-elevated p-4 flex items-start gap-3">
      <p className="flex-1 text-sm text-cw-text leading-relaxed">"{texto}"</p>
      <button
        onClick={copiar}
        title="Copiar frase"
        className={cn(
          'shrink-0 h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
          copiado ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400' : 'bg-cw-bg border-cw-border text-cw-muted hover:text-cw-purple-light hover:border-cw-purple/30',
        )}
      >
        {copiado ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  );
}

export default function CwStore() {
  return (
    <>
      <Header titulo="CW Store" subtitulo="O lançamento que transforma a Cardápio Web em plataforma para um mercado inteiro construir" />
      <div className="p-8 space-y-8">

        {/* Links de referência — sempre no topo */}
        <div className="cw-card p-5 flex flex-col sm:flex-row gap-3">
          <a
            href="https://docs.cardapioweb.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-cw-purple/30 bg-cw-purple/10 hover:bg-cw-purple/15 transition-colors group"
          >
            <div className="h-9 w-9 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
              <ExternalLink className="h-4 w-4 text-cw-purple-light" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cw-text">Documentação oficial</p>
              <p className="text-xs text-cw-muted truncate">docs.cardapioweb.com — API pública, OAuth e servidor MCP</p>
            </div>
            <ArrowRight className="h-4 w-4 text-cw-purple-light shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
          </a>
          <a
            href="mailto:integracao@cardapioweb.com"
            className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl border border-cw-border bg-cw-elevated hover:border-cw-purple/30 transition-colors group"
          >
            <div className="h-9 w-9 rounded-lg bg-cw-bg flex items-center justify-center shrink-0 border border-cw-border">
              <Mail className="h-4 w-4 text-cw-muted" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-cw-text">integracao@cardapioweb.com</p>
              <p className="text-xs text-cw-muted truncate">Dúvidas técnicas ou comerciais sobre cadastro e publicação</p>
            </div>
          </a>
        </div>

        {/* O que é */}
        <div className="cw-card p-6 flex gap-4">
          <div className="h-10 w-10 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
            <Store className="h-5 w-5 text-cw-purple-light" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-cw-text mb-1">O que é a CW Store</h2>
            <p className="text-sm text-cw-muted leading-relaxed">
              A CW Store (CW App Store) é o marketplace de aplicativos integrado ao portal da Cardápio Web. Nela, restaurantes descobrem, instalam e gerenciam soluções de parceiros diretamente dentro do sistema que já utilizam no dia a dia, sem precisar de configuração técnica manual. Pra integradoras e desenvolvedores, é o canal oficial de distribuição de soluções voltadas ao food service: gestão, marketing, fidelidade, módulo fiscal, atendimento, logística, automação, inteligência artificial, delivery e outras experiências digitais.
            </p>
            <p className="text-sm text-cw-muted leading-relaxed mt-2">
              Em resumo, a CW Store conecta três pontas: o restaurante que precisa de soluções prontas, a integradora que constrói essas soluções, e a Cardápio Web, que fornece a infraestrutura (marketplace, autenticação e API) pra essa relação acontecer de forma padronizada e segura.
            </p>
          </div>
        </div>

        {/* A visão — Sistema Operacional do Food Service */}
        <div className="cw-card p-6 space-y-4 border border-cw-purple/20 bg-cw-purple/5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-cw-purple-light" />
            <h2 className="text-lg font-bold text-cw-text">A visão: o Sistema Operacional do Food Service</h2>
          </div>
          <p className="text-sm text-cw-muted leading-relaxed">
            O paralelo é o do smartphone: a inovação decisiva não foi ter todas as funções num único aparelho, foi permitir que milhares de apps se conectassem a uma base estável. <strong className="text-cw-text">Você troca o app, não troca o ecossistema.</strong>
          </p>
          <p className="text-sm text-cw-muted leading-relaxed">
            O cardápio digital mantém a base — é onde o pedido chega e onde nascem os dados do pedido e do cliente. A CW App Store abre espaço pra centenas de soluções plugadas em cima dessa base: gestão, CRM, avaliação, fidelização, fiscal, agentes de IA, redes sociais, marketplaces. O restaurante escolhe como usar o ecossistema e troca o app sem deixar a base.
          </p>
          <div className="rounded-xl border border-cw-purple/20 bg-cw-bg/40 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light mb-1">A oportunidade</p>
            <p className="text-sm text-cw-text leading-relaxed">
              Já existe um mercado inteiro (especialistas independentes, pequenas e médias empresas, grandes empresas, agências) querendo construir pro food service. A CW Store transforma essa criação dispersa num canal de distribuição pra toda a base Cardápio Web.
            </p>
          </div>
        </div>

        {/* Como funciona — 3 pilares */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Boxes className="h-5 w-5 text-cw-purple-light" />
            Como funciona (visão técnica)
          </h2>
          <p className="text-sm text-cw-muted -mt-2">Três peças sustentam qualquer integração dentro da CW Store.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {PILARES.map((p) => (
              <div key={p.titulo} className={cn('rounded-2xl border p-5', p.cor)}>
                <div className="flex items-center gap-2 mb-2">
                  <p.icon className="h-5 w-5" />
                  <div>
                    <p className="font-bold text-cw-text leading-tight">{p.titulo}</p>
                    <p className="text-[10px] uppercase tracking-wider opacity-70">{p.subtitulo}</p>
                  </div>
                </div>
                <p className="text-xs text-cw-muted leading-relaxed">{p.texto}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fluxo passo a passo */}
        <div className="cw-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Workflow className="h-5 w-5 text-cw-purple-light" />
            O fluxo completo, passo a passo
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            {FLUXO.map((f) => (
              <div key={f.n} className="flex items-start gap-3 rounded-xl border border-cw-border bg-cw-elevated p-3">
                <div className="h-6 w-6 rounded-full bg-cw-purple/15 border border-cw-purple/30 flex items-center justify-center shrink-0 text-[11px] font-black text-cw-purple-light">
                  {f.n}
                </div>
                <div>
                  <p className="text-sm font-semibold text-cw-text">{f.t}</p>
                  <p className="text-xs text-cw-muted leading-relaxed mt-0.5">{f.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Módulos da API + ambientes */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="cw-card p-6 space-y-3">
            <h2 className="text-base font-bold text-cw-text flex items-center gap-2">
              <Package className="h-4 w-4 text-cw-purple-light" />
              Os três módulos da API
            </h2>
            <div className="space-y-2">
              {MODULOS_API.map((m) => (
                <div key={m.t} className="rounded-lg border border-cw-border bg-cw-elevated px-3 py-2">
                  <p className="text-xs font-bold text-cw-purple-light">{m.t}</p>
                  <p className="text-xs text-cw-muted">{m.d}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="cw-card p-6 space-y-3">
            <h2 className="text-base font-bold text-cw-text flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-cw-purple-light" />
              Ambientes e instalação
            </h2>
            <p className="text-xs text-cw-muted leading-relaxed">
              Dois ambientes totalmente isolados — <strong className="text-cw-text">Sandbox</strong> pra testes e validação, <strong className="text-cw-text">Produção</strong> pro uso real. Cada um tem cadastro, credenciais e instalações próprias, nada é compartilhado entre eles.
            </p>
            <p className="text-xs text-cw-muted leading-relaxed">
              Cada loja que instala um app gera uma instalação própria, com tokens específicos. Se o restaurante desinstalar, o acesso daquela loja é revogado na hora, sem afetar outras lojas ou apps. Reinstalar repete o fluxo de autorização do zero.
            </p>
          </div>
        </div>

        {/* Modelo pros parceiros */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-cw-purple-light" />
            Modelo pros parceiros que constroem
          </h2>
          <p className="text-sm text-cw-muted -mt-2">O parceiro cria valor, a Cardápio Web cuida da distribuição.</p>
          <div className="grid md:grid-cols-3 gap-4">
            {MODELO_PARCEIROS.map((m) => (
              <div key={m.t} className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-5">
                <m.icon className="h-5 w-5 text-emerald-400 mb-2" />
                <p className="font-bold text-cw-text text-sm mb-1">{m.t}</p>
                <p className="text-xs text-cw-muted leading-relaxed">{m.d}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-cw-border bg-cw-elevated p-4 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <p className="text-sm text-cw-muted">
              Muitos apps serão de graça pro food service — <strong className="text-cw-text">R$ 0 pra milhares de restaurantes no Brasil</strong>, sem custo pro desenvolvedor, o que acelera a adoção e a inovação.
            </p>
          </div>
        </div>

        {/* Quem pode construir */}
        <div className="cw-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Users className="h-5 w-5 text-cw-purple-light" />
            Quem pode construir
          </h2>
          <p className="text-sm text-cw-muted">
            Basicamente, qualquer pessoa que entenda do mercado de food service e queira transformar esse conhecimento em tecnologia. O diferencial não é só saber programar — é entender profundamente os problemas do setor.
          </p>
          <div className="flex flex-wrap gap-2">
            {QUEM_CONSTROI.map((q) => (
              <span key={q} className="text-xs font-semibold px-3 py-1.5 rounded-full border border-cw-border bg-cw-elevated text-cw-text">
                {q}
              </span>
            ))}
          </div>
        </div>

        {/* Prova de conceito: apps construídos com IA */}
        <div className="cw-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Rocket className="h-5 w-5 text-cw-purple-light" />
            A prova: sistemas completos nascendo em dias
          </h2>
          <p className="text-sm text-cw-muted">
            Três apps criados pro lançamento da CW Store mostram o que muda quando IA, API aberta e conhecimento de mercado trabalham juntos:
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {APPS_EXEMPLO.map((a) => (
              <div key={a.t} className="rounded-2xl border border-cw-border bg-cw-elevated p-5 text-center">
                <a.icon className="h-6 w-6 text-cw-purple-light mx-auto mb-2" />
                <p className="font-bold text-cw-text text-sm">{a.t}</p>
                <p className="text-xs text-emerald-400 font-semibold mt-1">{a.tempo}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Perspectiva comercial */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Building2 className="h-5 w-5 text-cw-purple-light" />
            Perspectiva comercial: como apresentar e vender a CW Store
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="cw-card p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">O valor pro restaurante (cliente final)</p>
              <ul className="space-y-2">
                {VALOR_RESTAURANTE.map((v, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cw-muted">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
            <div className="cw-card p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">O valor pra integradora e o parceiro comercial</p>
              <ul className="space-y-2">
                {VALOR_PARCEIRO.map((v, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-cw-muted">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    {v}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="cw-card p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">Argumentos de venda sugeridos</p>
            <ul className="space-y-2">
              {ARGUMENTOS_VENDA.map((v, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-cw-muted">
                  <ArrowRight className="h-4 w-4 text-cw-purple-light shrink-0 mt-0.5" />
                  {v}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" /> Pontos de atenção pro time comercial
            </p>
            <ul className="space-y-2">
              <li className="text-sm text-cw-muted">
                O processo de aprovação de um novo app pode levar até <strong className="text-cw-text">7 dias corridos</strong> — vale alinhar esse prazo com clientes e parceiros.
              </li>
              <li className="text-sm text-cw-muted">
                As permissões solicitadas no cadastro <strong className="text-cw-text">não podem ser removidas depois</strong>, e adicionar novas permissões exige que os clientes já instalados reinstalem o app. Por isso, é importante mapear bem as permissões necessárias antes da publicação.
              </li>
            </ul>
          </div>
        </div>

        {/* Frases prontas — não é uma venda tradicional (a maioria dos apps
            é de graça), é mostrar um diferencial que já vem incluso. */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-cw-purple-light" />
              Como falar sobre a CW Store na conversa
            </h2>
            <p className="text-sm text-cw-muted mt-1">
              Isso não é uma venda tradicional, a maioria dos apps é gratuita pro restaurante. É um diferencial que já vem incluso na conta, então a ideia é mostrar valor, não empurrar fechamento. Frases prontas pra usar (ou adaptar) em cada momento:
            </p>
          </div>
          {FRASES.map((f) => (
            <div key={f.momento} className="cw-card p-5 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-cw-purple-light">{f.momento}</p>
              <div className="space-y-2">
                {f.itens.map((texto, i) => <FraseCard key={i} texto={texto} />)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}
