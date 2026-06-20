/** Automações — erros comuns na Kommo e responsabilidades do SDR. */
import { AlertTriangle, CheckCircle2, Zap, User, AlertCircle, Info } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';

const ERROS = [
  {
    numero: 1,
    titulo: 'Lead não encontrado na Kommo',
    descricao: 'A automação tenta localizar um lead existente para disparar a ação, mas não encontra nenhum registro com os dados fornecidos (telefone ou e-mail).',
    causas: [
      'Lead cadastrado com número de telefone diferente do utilizado na automação',
      'Lead duplicado no Kommo com dados divergentes',
      'Lead não foi criado antes de o gatilho ser acionado',
    ],
    solucao: 'Verifique se o lead existe no Kommo com os dados exatos utilizados na automação. Se necessário, crie o lead manualmente ou corrija o cadastro existente antes de reenviar a automação.',
    impacto: 'A automação para sem executar nenhuma ação. Nenhuma mensagem é enviada ao lead.',
    cor: 'text-red-400 bg-red-500/10 border-red-500/30',
    iconCor: 'text-red-400',
  },
  {
    numero: 2,
    titulo: 'Falha no envio do template na Kommo',
    descricao: 'O lead foi encontrado, mas a Kommo não conseguiu entregar o template de mensagem via WhatsApp.',
    causas: [
      'Template não aprovado pela Meta ou com status inativo',
      'Número de telefone do lead fora do formato correto (+55 DDD NÚMERO)',
      'Janela de 24h do WhatsApp Business encerrada (fora da janela de conversa ativa)',
      'Conta WhatsApp Business desconectada ou com limite de envio atingido',
    ],
    solucao: 'Confirme o status do template no painel da Meta Business. Verifique o formato do telefone no Kommo. Se a janela de 24h fechou, inicie uma nova conversa com o template de abertura antes de enviar o template principal.',
    impacto: 'O lead existe no Kommo, mas a mensagem não chega ao destinatário. O SDR precisa contatar manualmente.',
    cor: 'text-orange-400 bg-orange-500/10 border-orange-500/30',
    iconCor: 'text-orange-400',
  },
];

const RESPONSABILIDADES = [
  'Monitorar diariamente o log de automações na Kommo e identificar falhas',
  'Verificar se leads novos estão sendo cadastrados com número no formato correto (+55 DDD NÚMERO)',
  'Reportar ao líder imediatamente quando identificar falha recorrente no mesmo template',
  'Não aguardar a automação reprocessar sozinha — agir manualmente dentro de 1h após identificar erro',
  'Manter o status do lead atualizado no Kommo para evitar triggers duplicados',
];

const RESUMO = [
  { erro: 'Lead não encontrado', causa: 'Dados divergentes ou lead inexistente', acao: 'Criar/corrigir lead no Kommo', responsavel: 'SDR' },
  { erro: 'Falha no template', causa: 'Template inativo ou janela fechada', acao: 'Verificar template e contatar manualmente', responsavel: 'SDR' },
  { erro: 'Número inválido', causa: 'Formato incorreto no cadastro', acao: 'Corrigir formato no Kommo', responsavel: 'SDR' },
  { erro: 'Conta desconectada', causa: 'WhatsApp Business offline', acao: 'Reportar ao líder / suporte técnico', responsavel: 'Líder' },
];

export default function Automacoes() {
  return (
    <>
      <Header titulo="Automações" subtitulo="Erros comuns na Kommo e como agir" />
      <div className="p-8 space-y-8">

        {/* Intro */}
        <div className="cw-card p-6 flex gap-4">
          <div className="h-10 w-10 rounded-lg bg-cw-purple/20 flex items-center justify-center shrink-0">
            <Zap className="h-5 w-5 text-cw-purple-light" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-3 mb-1">
              <h2 className="font-semibold text-cw-text">Sobre as automações</h2>
              <span className="text-[10px] text-cw-muted bg-cw-elevated px-2 py-0.5 rounded-full border border-cw-border shrink-0">
                por Pedro Ferreira
              </span>
            </div>
            <p className="text-sm text-cw-muted leading-relaxed">
              As automações da CW rodam via Kommo integrada ao WhatsApp Business. Quando um lead atinge determinado estágio no funil, a automação dispara um template de mensagem automaticamente. Falhas nesse processo precisam de ação rápida do SDR para não perder o timing de contato.
            </p>
          </div>
        </div>

        {/* Erros */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-cw-purple-light" />
            Erros mais comuns
          </h2>
          {ERROS.map((erro) => (
            <div key={erro.numero} className={cn('cw-card p-6 border rounded-xl', erro.cor.split(' ').slice(2).join(' '))}>
              <div className="flex items-start gap-4 mb-5">
                <div className={cn('h-9 w-9 rounded-lg border flex items-center justify-center shrink-0 text-sm font-black', erro.cor)}>
                  {erro.numero}
                </div>
                <div className="flex-1">
                  <h3 className={cn('font-semibold text-base', erro.iconCor)}>{erro.titulo}</h3>
                  <p className="text-sm text-cw-muted mt-1 leading-relaxed">{erro.descricao}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cw-muted">Causas</p>
                  <ul className="space-y-1.5">
                    {erro.causas.map((c, i) => (
                      <li key={i} className="text-xs text-cw-muted flex gap-2">
                        <span className="text-cw-muted/40 shrink-0 mt-0.5">•</span>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cw-muted">Solução</p>
                  <p className="text-xs text-cw-muted leading-relaxed">{erro.solucao}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-cw-muted">Impacto</p>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className={cn('h-3.5 w-3.5 shrink-0 mt-0.5', erro.iconCor)} />
                    <p className="text-xs text-cw-muted leading-relaxed">{erro.impacto}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Responsabilidades do SDR */}
        <div className="cw-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <User className="h-5 w-5 text-cw-purple-light" />
            Responsabilidade do SDR
          </h2>
          <ul className="space-y-3">
            {RESPONSABILIDADES.map((r, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-cw-muted">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Tabela resumo */}
        <div className="cw-card p-6 space-y-4">
          <h2 className="text-lg font-bold text-cw-text flex items-center gap-2">
            <Info className="h-5 w-5 text-cw-purple-light" />
            Resumo rápido
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cw-border">
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-cw-muted">Erro</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-cw-muted">Causa provável</th>
                  <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-wider text-cw-muted">Ação</th>
                  <th className="text-left py-2 text-xs font-semibold uppercase tracking-wider text-cw-muted">Responsável</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cw-border">
                {RESUMO.map((row, i) => (
                  <tr key={i}>
                    <td className="py-3 pr-4 font-medium text-cw-text">{row.erro}</td>
                    <td className="py-3 pr-4 text-cw-muted">{row.causa}</td>
                    <td className="py-3 pr-4 text-cw-muted">{row.acao}</td>
                    <td className="py-3">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full border',
                        row.responsavel === 'SDR'
                          ? 'text-cw-purple-light bg-cw-purple/10 border-cw-purple/30'
                          : 'text-cw-muted bg-cw-bg border-cw-border'
                      )}>
                        {row.responsavel}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}
