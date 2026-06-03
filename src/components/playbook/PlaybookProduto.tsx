/** Aba Produto — 3 focos da CW, funcionalidades por plano e módulos extras. */
import { Bot, TrendingUp, BarChart3, Check, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

const FOCOS = [
  {
    icon: Bot,
    titulo: 'Automação de Atendimento',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/8',
    borda: 'border-cw-purple/20',
    features: [
      'ChatBot com Inteligência Artificial',
      'Cardápio digital (delivery, mesa, balcão)',
      'Sistema PDV dentro do WhatsApp',
      'Cardápio rápido e com boa usabilidade',
      'Pagamento online — Mercado Pago, Cielo, Pix',
      'Agendamento de pedidos',
    ],
    integracoes: ['Mercado Pago', 'Cielo', 'Tuna (Pix)'],
  },
  {
    icon: TrendingUp,
    titulo: 'Aumento de Vendas',
    cor: 'text-green-600',
    bg: 'bg-green-50',
    borda: 'border-green-200',
    features: [
      'Disparador de mensagens em massa no WhatsApp',
      'Automações e agendamentos de mensagens',
      'Programa de fidelidade',
      'Cupons e descontos',
      'Filtros avançados de clientes',
      'Integração com Meta Ads e Google Ads',
    ],
    integracoes: ['Facebook Pixel', 'API de conversões Meta', 'Catálogo Facebook', 'Google Tag Manager', 'Google Analytics'],
  },
  {
    icon: BarChart3,
    titulo: 'Gestão da Empresa',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    borda: 'border-blue-200',
    features: [
      'PDV, estoque, caixa e impressoras',
      'Gestão de rotas de entrega',
      'Emissão de Nota Fiscal',
      'Gestão financeira (F360)',
      'Terceirização de entregadores',
      'Integração com iFood e Entrega Fácil',
    ],
    integracoes: ['F360', 'Foody Delivery', 'Pick N Go', 'Entrega Fácil iFood', 'Zumm', 'Saipos', 'Eclética', 'Berp Sistemas'],
  },
];

const PLANOS = [
  {
    nome: 'Mesas',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/5',
    borda: 'border-cw-purple/30',
    features: [
      'Cardápio digital para mesas e balcão',
      'Sistema PDV no WhatsApp',
      'Disparador de mensagens',
      'Automações de mensagens',
      'Cupons e descontos',
      'Filtros avançados de clientes',
      'PDV + estoque simplificado + caixa',
      'Gestão financeira F360',
      'Fiado e KDS',
      'Agendamento de pedidos',
    ],
  },
  {
    nome: 'Delivery',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    borda: 'border-blue-200',
    features: [
      'Tudo do Mesas +',
      'Cardápio digital para delivery',
      'ChatBot com Inteligência Artificial',
      'Pagamento online (Mercado Pago, Cielo)',
      'Programa de fidelidade',
      'Integração Meta Ads e Google Ads',
    ],
  },
  {
    nome: 'Premium',
    cor: 'text-amber-600',
    bg: 'bg-amber-50',
    borda: 'border-amber-200',
    destaque: true,
    features: [
      'Tudo do Delivery +',
      'Integração com iFood e Entrega Fácil',
      'Cardápio para delivery, mesas e balcão',
      'Gestão de entregadores',
    ],
  },
];

const MODULOS = [
  { nome: 'Módulo iFood', desc: 'Integração completa com iFood' },
  { nome: 'Estoque Avançado', desc: 'Com ficha técnica de insumos' },
  { nome: 'Cupom Fiscal', desc: 'Emissão de NF-e/NFC-e' },
  { nome: 'Entregadores', desc: 'Gestão e rotas de entrega' },
  { nome: 'Financeiro', desc: 'Gestão financeira completa' },
  { nome: 'Totem', desc: 'Autoatendimento touchscreen — cliente faz o pedido sozinho, com pagamento integrado. R$99,99/dispositivo.' },
];

export function PlaybookProduto() {
  return (
    <div className="space-y-6">
      {/* Intro */}
      <div className="cw-card p-5">
        <p className="text-sm text-cw-text/80 leading-relaxed">
          A Cardápio Web é, essencialmente, uma plataforma de <strong className="text-cw-purple">comércio eletrônico</strong> — o cardápio digital é nossa prioridade número 1. Ajudamos restaurantes a vender diretamente aos seus clientes, com autonomia e sem depender de intermediários.
        </p>
        <a
          href="https://www.youtube.com/watch?v=rfmGEWZZUNU"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 mt-3 text-xs text-cw-purple font-semibold hover:underline"
        >
          <ExternalLink className="h-3.5 w-3.5" /> Assistir vídeo completo do produto
        </a>
      </div>

      {/* 3 Focos */}
      <div>
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">Os 3 focos da Cardápio Web</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {FOCOS.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.titulo} className={cn('rounded-2xl border p-5', f.bg, f.borda)}>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-white shadow-sm flex items-center justify-center">
                    <Icon className={cn('h-4 w-4', f.cor)} />
                  </div>
                  <p className={cn('text-sm font-black', f.cor)}>{f.titulo}</p>
                </div>
                <ul className="space-y-1.5 mb-4">
                  {f.features.map(feat => (
                    <li key={feat} className="flex items-start gap-2 text-xs text-cw-text/80">
                      <Check className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', f.cor)} />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="border-t border-black/5 pt-3">
                  <p className="text-[10px] font-bold text-cw-muted uppercase tracking-wider mb-1.5">Integrações</p>
                  <div className="flex flex-wrap gap-1">
                    {f.integracoes.map(i => (
                      <span key={i} className="text-[10px] bg-white/70 border border-black/8 px-2 py-0.5 rounded-full text-cw-muted">{i}</span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Planos */}
      <div>
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">Funcionalidades por plano</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PLANOS.map((p) => (
            <div key={p.nome} className={cn('rounded-2xl border p-5', p.bg, p.borda)}>
              <p className={cn('text-base font-black mb-4', p.cor)}>{p.nome}</p>
              <ul className="space-y-1.5">
                {p.features.map(feat => (
                  <li key={feat} className="flex items-start gap-2 text-xs text-cw-text/80">
                    <Check className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', p.cor)} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Módulos extras */}
      <div>
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-3">Módulos extras (add-ons)</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MODULOS.map(m => (
            <div key={m.nome} className="cw-card p-4">
              <p className="text-sm font-bold text-cw-text">{m.nome}</p>
              <p className="text-xs text-cw-muted mt-0.5">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
