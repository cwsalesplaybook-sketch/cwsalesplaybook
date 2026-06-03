/** Aba Planos & Preços — tabela de planos, módulos e descontos reais. */
import { Check, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

const PLANOS = [
  {
    nome: 'Mesas',
    anual: 'R$139,99/mês',
    mensal: 'R$169,99/mês',
    total: 'R$1.679,88/ano',
    cor: 'text-cw-purple',
    bg: 'bg-cw-purple/5',
    borda: 'border-cw-purple/30',
    destaque: false,
    features: ['Cardápio para mesas e balcão', 'PDV + WhatsApp', 'Disparador de mensagens', 'Cupons e fidelidade', 'Automações WhatsApp', 'KDS + Fiado'],
  },
  {
    nome: 'Delivery',
    anual: 'R$179,99/mês',
    mensal: 'R$209,99/mês',
    total: 'R$2.159,88/ano',
    cor: 'text-blue-600',
    bg: 'bg-blue-50',
    borda: 'border-blue-200',
    destaque: false,
    features: ['Cardápio para delivery + balcão', 'ChatBot com IA', 'Pagamento online', 'Programa de fidelidade', 'Meta Ads + Google Ads', 'Tudo do Mesas'],
  },
  {
    nome: 'Premium',
    anual: 'R$239,99/mês',
    mensal: 'R$269,99/mês',
    total: 'R$2.879,88/ano',
    cor: 'text-amber-600',
    bg: 'bg-amber-50',
    borda: 'border-amber-300',
    destaque: true,
    features: ['Delivery + Mesas + Balcão', 'Integração iFood completa', 'Gestão de entregadores', 'Tudo do Delivery'],
  },
];

const MODULOS = [
  { nome: 'iFood',             anual: 'R$29,99/mês',  mensal: 'R$29,99/mês',  desc: 'Integração completa com iFood' },
  { nome: 'Estoque Avançado',  anual: 'R$29,99/mês',  mensal: 'R$29,99/mês',  desc: 'Com ficha técnica de insumos' },
  { nome: 'Cupom Fiscal',      anual: 'R$69,99/mês',  mensal: 'R$69,99/mês',  desc: 'Emissão de NF-e/NFC-e' },
  { nome: 'Entregadores',      anual: 'R$54,99/mês',  mensal: 'R$54,99/mês',  desc: 'Gestão e rotas de entrega' },
  { nome: 'Financeiro',        anual: 'R$69,99/mês',  mensal: 'R$69,99/mês',  desc: 'Gestão financeira completa' },
  { nome: 'Totem',             anual: 'R$99,99/dispositivo', mensal: 'R$99,99/dispositivo', desc: 'Autoatendimento touchscreen — pedidos sem garçom ou atendente' },
];

const DESCONTOS = [
  { tipo: 'Anual',      mesas: 'R$132,99',  delivery: 'R$170,99',  premium: 'R$227,99',  pct: '5%',  obs: 'Parceria' },
  { tipo: 'Semestral',  mesas: 'R$139,49',  delivery: 'R$176,69',  premium: 'R$232,49',  pct: '7%',  obs: 'Parceria' },
  { tipo: 'Trimestral', mesas: 'R$145,59',  delivery: 'R$181,99',  premium: 'R$236,59',  pct: '9%',  obs: 'Parceria' },
  { tipo: 'Mensal',     mesas: 'R$144,49',  delivery: 'R$178,49',  premium: 'R$229,49',  pct: '15%', obs: 'Parceria' },
];

const NEGOCIACAO = [
  { tipo: '20% por 3 meses', mesas: 'R$135,99',  delivery: 'R$167,99',  premium: 'R$215,99' },
  { tipo: '30% por 3 meses', mesas: 'R$118,99',  delivery: 'R$146,99',  premium: 'R$188,99' },
];

export function PlaybookPlanos() {
  return (
    <div className="space-y-6">

      {/* Cards de plano */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {PLANOS.map((p) => (
          <div key={p.nome} className={cn('rounded-2xl border p-5 relative', p.bg, p.borda)}>
            {p.destaque && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-amber-600 bg-amber-100 border border-amber-300 px-3 py-0.5 rounded-full uppercase tracking-wider">
                Mais completo
              </span>
            )}
            <p className={cn('text-lg font-black mb-1', p.cor)}>{p.nome}</p>
            <p className="text-2xl font-black text-cw-text">{p.anual}</p>
            <p className="text-xs text-cw-muted mb-1">no plano anual · {p.total}</p>
            <p className="text-xs text-cw-muted mb-4">ou {p.mensal} no mensal</p>
            <ul className="space-y-1.5">
              {p.features.map(f => (
                <li key={f} className="flex items-start gap-2 text-xs text-cw-text/80">
                  <Check className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', p.cor)} />
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Módulos */}
      <div className="cw-card p-5">
        <p className="text-[10px] font-black text-cw-purple uppercase tracking-widest mb-4">Módulos add-on</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {MODULOS.map(m => (
            <div key={m.nome} className="rounded-xl bg-cw-elevated border border-cw-border p-3 text-center">
              <p className="text-xs font-bold text-cw-text">{m.nome}</p>
              {m.desc && <p className="text-[10px] text-cw-muted mt-0.5 leading-tight">{m.desc}</p>}
              <p className="text-sm font-black text-cw-purple mt-1.5">{m.anual}</p>
              <p className="text-[10px] text-cw-muted">anual ou mensal</p>
            </div>
          ))}
        </div>
      </div>

      {/* Descontos parceria */}
      <div className="cw-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-green-600" />
          <p className="text-sm font-black text-cw-text">Descontos de parceria</p>
          <span className="text-[10px] text-cw-muted ml-auto">Valor mensal com desconto</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cw-border">
                <th className="text-left py-2 text-cw-muted font-semibold">Fidelidade</th>
                <th className="text-center py-2 text-cw-muted font-semibold">Desc.</th>
                <th className="text-center py-2 text-cw-purple font-semibold">Mesas</th>
                <th className="text-center py-2 text-blue-600 font-semibold">Delivery</th>
                <th className="text-center py-2 text-amber-600 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {DESCONTOS.map(d => (
                <tr key={d.tipo} className="border-b border-cw-border/50 hover:bg-cw-elevated transition-colors">
                  <td className="py-2 font-semibold text-cw-text">{d.tipo}</td>
                  <td className="py-2 text-center text-green-600 font-bold">{d.pct}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.mesas}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.delivery}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Descontos negociação */}
      <div className="cw-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-4 w-4 text-cw-red" />
          <p className="text-sm font-black text-cw-text">Promoções para negociação</p>
          <span className="text-[10px] text-cw-muted ml-auto">Valor mensal nos primeiros 3 meses</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-cw-border">
                <th className="text-left py-2 text-cw-muted font-semibold">Promoção</th>
                <th className="text-center py-2 text-cw-purple font-semibold">Mesas</th>
                <th className="text-center py-2 text-blue-600 font-semibold">Delivery</th>
                <th className="text-center py-2 text-amber-600 font-semibold">Premium</th>
              </tr>
            </thead>
            <tbody>
              {NEGOCIACAO.map(d => (
                <tr key={d.tipo} className="border-b border-cw-border/50 hover:bg-cw-elevated transition-colors">
                  <td className="py-2 font-semibold text-cw-text">{d.tipo}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.mesas}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.delivery}</td>
                  <td className="py-2 text-center text-cw-text font-semibold">{d.premium}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[10px] text-cw-muted mt-3">⚠️ Após os 3 meses, volta ao valor mensal padrão. Use com critério — encantar o cliente no onboarding garante a renovação.</p>
      </div>
    </div>
  );
}
