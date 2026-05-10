/** Seção Playbook — abas com conteúdo de referência do time.
 *  Todos os textos e listas são editáveis no Modo Gestor. */
import { ExternalLink, Briefcase, Target, Map, Sparkles, CheckCircle2, Zap, Swords, Handshake, XCircle, DollarSign, ArrowRight, Trash2, Plus } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  PLAYBOOK_URL, CARGOS, JORNADA, SPIN, BANT, OBJECOES, PASSAGEM_BASTAO, MOTIVOS_PERDA,
} from '@/data/playbook';
import CulturaEstrategia from './CulturaEstrategia';
import { cn } from '@/lib/utils';
import { EditableText } from '@/admin/EditableText';
import { useEditableContent, useContentStore } from '@/store/contentStore';
import { useEditor } from '@/admin/EditorContext';
import { toast } from '@/hooks/use-toast';

const SPIN_COLORS: Record<'purple' | 'red' | 'yellow' | 'green', string> = {
  purple: 'border-cw-purple/50 bg-cw-purple/10 text-cw-purple-light',
  red:    'border-cw-red/50 bg-cw-red/10 text-red-300',
  yellow: 'border-cw-yellow/50 bg-cw-yellow/10 text-cw-yellow',
  green:  'border-emerald-500/50 bg-emerald-500/10 text-emerald-300',
};

function SectionCard({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('cw-card cw-card-hover p-5', className)}>{children}</div>;
}

function useArrayEdit<T>(storeKey: string, defaultValue: T[]) {
  const { isEditing } = useEditor();
  const items = useEditableContent<T[]>(storeKey, defaultValue);
  const saveOverride = useContentStore((s) => s.saveOverride);
  const update = async (next: T[]) => {
    try { await saveOverride(storeKey, next); }
    catch (e) { toast({ title: 'Falha ao salvar', description: e instanceof Error ? e.message : '', variant: 'destructive' }); }
  };
  const remove = (i: number) => update(items.filter((_, idx) => idx !== i));
  const add = (item: T) => update([...items, item]);
  return { isEditing, items, update, remove, add };
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute top-2 right-2 z-10 h-7 w-7 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/it:opacity-100 transition-opacity"
      title="Remover"
    >
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  );
}

function openSheet(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function SheetLink({ label = 'Abrir na planilha completa', urlKey = 'playbook.url' }: { label?: string; urlKey?: string }) {
  const url = useEditableContent<string>(urlKey, PLAYBOOK_URL);
  return (
    <button
      onClick={() => openSheet(url)}
      className="inline-flex items-center gap-2 text-sm font-semibold text-cw-purple-light hover:text-cw-yellow transition-colors mt-2"
    >
      {label} <ExternalLink className="h-3.5 w-3.5" />
    </button>
  );
}

const TABS_DEFAULT = [
  { id: 'cultura',    label: '🧭 Cultura & Estratégia' },
  { id: 'cargos',     label: '📋 Cargos' },
  { id: 'icp',        label: '🎯 ICP' },
  { id: 'jornada',    label: '🗺️ Jornada' },
  { id: 'spin',       label: '🔄 SPIN' },
  { id: 'bant',       label: '✅ BANT' },
  { id: 'hacks',      label: '💡 Hacks' },
  { id: 'objecoes',   label: '⚡ Objeções' },
  { id: 'passagem',   label: '🤝 Passagem' },
  { id: 'perda',      label: '❌ Motivos de Perda' },
  { id: 'planos',     label: '📈 Planos' },
];

export default function Playbook() {
  const url = useEditableContent<string>('playbook.url', PLAYBOOK_URL);
  const tabs = useEditableContent('playbook.tabs', TABS_DEFAULT);

  const cargos = useArrayEdit('playbook.cargos', CARGOS);
  const jornada = useArrayEdit('playbook.jornada', JORNADA);
  const spinList = useArrayEdit('playbook.spin', SPIN);
  const bantList = useArrayEdit('playbook.bant', BANT);
  const objs = useArrayEdit('playbook.objecoes', OBJECOES);
  const passagem = useArrayEdit('playbook.passagem', PASSAGEM_BASTAO);
  const perda = useArrayEdit('playbook.perda', MOTIVOS_PERDA);

  return (
    <>
      <Header
        titulo="Playbook de Vendas"
        subtitulo="Consulte os materiais de referência do time comercial."
        storeKey="playbook.header"
        acoes={
          <Button onClick={() => openSheet(url)} className="gradient-primary text-white hover:brightness-110 gap-2">
            <ExternalLink className="h-4 w-4" /> Abrir planilha completa
          </Button>
        }
      />

      <div className="p-8">
        <Tabs defaultValue="cultura" className="w-full">
          <div className="overflow-x-auto scrollbar-cw -mx-1 pb-2">
            <TabsList className="bg-cw-surface border border-cw-border p-1 inline-flex w-max">
              {tabs.map((t, i) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="data-[state=active]:gradient-primary data-[state=active]:text-white whitespace-nowrap text-xs font-medium"
                >
                  <EditableText storeKey={`playbook.tabs.${i}.label`} defaultValue={t.label} className="text-xs font-medium" />
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* CULTURA & ESTRATÉGIA */}
          <TabsContent value="cultura" className="mt-6">
            <CulturaEstrategia />
          </TabsContent>

          {/* CARGOS */}
          <TabsContent value="cargos" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cargos.items.map((c, i) => (
                <div key={c.sigla + i} className="relative group/it">
                  <SectionCard>
                    <div className="flex items-start gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-cw-text">
                          <EditableText storeKey={`playbook.cargos.${i}.sigla`} defaultValue={c.sigla} className="font-bold" />
                        </h4>
                        <p className="text-xs text-cw-muted">
                          <EditableText storeKey={`playbook.cargos.${i}.nome`} defaultValue={c.nome} className="text-xs" />
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-cw-muted leading-relaxed">
                      <EditableText storeKey={`playbook.cargos.${i}.descricao`} defaultValue={c.descricao} multiline className="text-sm" />
                    </p>
                  </SectionCard>
                  {cargos.isEditing && <RemoveBtn onClick={() => cargos.remove(i)} />}
                </div>
              ))}
            </div>
            {cargos.isEditing && (
              <div className="flex justify-center mt-4">
                <Button size="sm" variant="outline" onClick={() => cargos.add({ sigla: 'NOVO', nome: 'Novo cargo', descricao: 'Descrição.' })} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Cargo
                </Button>
              </div>
            )}
          </TabsContent>

          {/* ICP */}
          <TabsContent value="icp" className="mt-6 space-y-4 max-w-3xl">
            <SectionCard>
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-cw-purple-light" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.icp.titulo" defaultValue="O que é o ICP" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-cw-muted leading-relaxed">
                <EditableText
                  storeKey="playbook.icp.texto"
                  defaultValue="O ICP (Ideal Customer Profile) define o perfil do lead com maior probabilidade de fechar e se tornar um cliente de sucesso. Conhecer o ICP é fundamental para priorizar esforços de prospecção e qualificação."
                  multiline
                  className="text-cw-muted"
                />
              </p>
            </SectionCard>

            <div className="cw-card cw-card-hover p-5 border-l-4 border-l-cw-purple">
              <p className="text-sm text-cw-muted">
                <EditableText storeKey="playbook.icp.cta" defaultValue="Acesse o ICP completo na planilha oficial." multiline className="text-sm" />
              </p>
              <SheetLink label="Ver ICP completo" />
            </div>
          </TabsContent>

          {/* JORNADA */}
          <TabsContent value="jornada" className="mt-6 space-y-4">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <Map className="h-5 w-5 text-cw-purple-light" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.jornada.titulo" defaultValue="Jornada do Cliente" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-sm text-cw-muted">
                <EditableText storeKey="playbook.jornada.subtitulo" defaultValue="As etapas que um lead percorre da prospecção ao onboarding." multiline className="text-sm" />
              </p>
            </SectionCard>

            <div className="overflow-x-auto scrollbar-cw">
              <div className="flex items-stretch gap-3 min-w-max pb-2">
                {jornada.items.map((j, i) => (
                  <div key={j.etapa + i} className="flex items-center gap-3">
                    <div className="cw-card cw-card-hover p-4 min-w-[180px] relative group/it">
                      <div className="text-[10px] font-bold text-cw-purple-light uppercase tracking-wider">
                        Etapa {i + 1}
                      </div>
                      <h4 className="font-bold text-cw-text mt-1">
                        <EditableText storeKey={`playbook.jornada.${i}.etapa`} defaultValue={j.etapa} className="font-bold" />
                      </h4>
                      <p className="text-xs text-cw-muted mt-2 leading-relaxed">
                        <EditableText storeKey={`playbook.jornada.${i}.desc`} defaultValue={j.desc} multiline className="text-xs" />
                      </p>
                      {jornada.isEditing && <RemoveBtn onClick={() => jornada.remove(i)} />}
                    </div>
                    {i < jornada.items.length - 1 && <ArrowRight className="h-5 w-5 text-cw-purple shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
            {jornada.isEditing && (
              <div className="flex justify-center">
                <Button size="sm" variant="outline" onClick={() => jornada.add({ etapa: 'Nova etapa', desc: 'Descrição.' })} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Etapa
                </Button>
              </div>
            )}

            <div className="cw-card p-4">
              <SheetLink label="Veja o fluxo completo na planilha" />
            </div>
          </TabsContent>

          {/* SPIN */}
          <TabsContent value="spin" className="mt-6 space-y-4">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-cw-purple-light" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.spin.titulo" defaultValue="SPIN Selling" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-sm text-cw-muted leading-relaxed">
                <EditableText storeKey="playbook.spin.intro" defaultValue="Metodologia criada por Neil Rackham que estrutura a venda com perguntas estratégicas nos 4 pilares abaixo." multiline className="text-sm" />
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spinList.items.map((s, i) => (
                <div
                  key={s.letra + i}
                  className={cn(
                    'rounded-xl border-2 p-5 transition-all hover:scale-[1.02] relative group/it',
                    SPIN_COLORS[s.cor],
                  )}
                >
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-5xl font-black tracking-tighter">
                      <EditableText storeKey={`playbook.spin.${i}.letra`} defaultValue={s.letra} className="text-5xl font-black" />
                    </span>
                    <span className="text-xl font-bold text-cw-text">
                      <EditableText storeKey={`playbook.spin.${i}.nome`} defaultValue={s.nome} className="text-xl font-bold" />
                    </span>
                  </div>
                  <p className="text-sm text-cw-muted mb-3">
                    <EditableText storeKey={`playbook.spin.${i}.descricao`} defaultValue={s.descricao} multiline className="text-sm" />
                  </p>
                  <p className="text-sm italic text-cw-text border-l-2 border-current pl-3">
                    <EditableText storeKey={`playbook.spin.${i}.exemplo`} defaultValue={s.exemplo} multiline className="text-sm italic" />
                  </p>
                  {spinList.isEditing && <RemoveBtn onClick={() => spinList.remove(i)} />}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* BANT */}
          <TabsContent value="bant" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bantList.items.map((b, i) => (
                <div key={b.letra + i} className="relative group/it">
                  <SectionCard>
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-black text-gradient-primary">
                        <EditableText storeKey={`playbook.bant.${i}.letra`} defaultValue={b.letra} className="text-4xl font-black" />
                      </span>
                      <h4 className="text-lg font-bold text-cw-text">
                        <EditableText storeKey={`playbook.bant.${i}.nome`} defaultValue={b.nome} className="text-lg font-bold" />
                      </h4>
                    </div>
                    <p className="text-sm text-cw-muted">
                      <EditableText storeKey={`playbook.bant.${i}.desc`} defaultValue={b.desc} multiline className="text-sm" />
                    </p>
                  </SectionCard>
                  {bantList.isEditing && <RemoveBtn onClick={() => bantList.remove(i)} />}
                </div>
              ))}
            </div>
            <SectionCard className="border-l-4 border-l-cw-yellow">
              <p className="text-sm text-cw-muted leading-relaxed">
                <EditableText
                  storeKey="playbook.bant.rodape"
                  defaultValue="Use o BANT para qualificar o lead antes de avançar no funil. Lead desqualificado cedo é tempo de qualidade liberado para leads quentes."
                  multiline
                  className="text-sm"
                />
              </p>
            </SectionCard>
          </TabsContent>

          {/* HACKS */}
          <TabsContent value="hacks" className="mt-6 space-y-4 max-w-3xl">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="h-5 w-5 text-cw-yellow" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.hacks.titulo" defaultValue="Hacks de Performance" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-cw-muted leading-relaxed">
                <EditableText storeKey="playbook.hacks.texto" defaultValue="Técnicas e atalhos práticos para melhorar performance nas ligações e prospecção." multiline className="text-cw-muted" />
              </p>
            </SectionCard>
            <div className="cw-card p-4">
              <SheetLink label="Acesse os hacks completos na planilha" />
            </div>
          </TabsContent>

          {/* OBJEÇÕES */}
          <TabsContent value="objecoes" className="mt-6 space-y-4">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <Swords className="h-5 w-5 text-cw-red" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.obj.titulo" defaultValue="Matriz de Objeções" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-sm text-cw-muted leading-relaxed">
                <EditableText storeKey="playbook.obj.intro" defaultValue="Mapeia as principais resistências dos leads e os melhores argumentos para cada uma." multiline className="text-sm" />
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {objs.items.map((o, i) => (
                <div key={o.objecao + i} className="cw-card cw-card-hover p-5 relative group/it">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-cw-red/15 text-red-300 border border-cw-red/40">
                      Objeção
                    </span>
                  </div>
                  <h4 className="font-bold text-cw-text mb-3">
                    "<EditableText storeKey={`playbook.objecoes.${i}.objecao`} defaultValue={o.objecao} className="font-bold" />"
                  </h4>
                  <div className="border-l-2 border-cw-purple pl-3">
                    <p className="text-xs text-cw-purple-light font-semibold uppercase mb-1 tracking-wider">Argumento</p>
                    <p className="text-sm text-cw-muted leading-relaxed">
                      <EditableText storeKey={`playbook.objecoes.${i}.argumento`} defaultValue={o.argumento} multiline className="text-sm" />
                    </p>
                  </div>
                  {objs.isEditing && <RemoveBtn onClick={() => objs.remove(i)} />}
                </div>
              ))}
            </div>
            {objs.isEditing && (
              <div className="flex justify-center">
                <Button size="sm" variant="outline" onClick={() => objs.add({ objecao: 'Nova objeção', argumento: 'Argumento.' })} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Objeção
                </Button>
              </div>
            )}

            <div className="cw-card p-4">
              <SheetLink label="Ver matriz completa" />
            </div>
          </TabsContent>

          {/* PASSAGEM */}
          <TabsContent value="passagem" className="mt-6 space-y-4 max-w-3xl">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <Handshake className="h-5 w-5 text-cw-purple-light" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.pass.titulo" defaultValue="Passagem de Bastão" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-cw-muted leading-relaxed">
                <EditableText
                  storeKey="playbook.pass.intro"
                  defaultValue="Momento em que o SDR transfere o lead qualificado para o Closer. Uma passagem bem feita garante continuidade e evita retrabalho."
                  multiline
                  className="text-cw-muted"
                />
              </p>
            </SectionCard>

            <div className="cw-card p-5">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-cw-muted mb-4">Checklist</h4>
              <ul className="space-y-3">
                {passagem.items.map((item, i) => (
                  <li key={i} className="flex items-center gap-3 group/it relative">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                    <span className="text-sm text-cw-text flex-1">
                      <EditableText storeKey={`playbook.passagem.${i}`} defaultValue={item} multiline className="text-sm" />
                    </span>
                    {passagem.isEditing && (
                      <button onClick={() => passagem.remove(i)} className="h-6 w-6 rounded bg-cw-red/15 text-cw-red border border-cw-red/30 hover:bg-cw-red/25 flex items-center justify-center opacity-0 group-hover/it:opacity-100 transition-opacity">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {passagem.isEditing && (
                <div className="mt-3">
                  <Button size="sm" variant="outline" onClick={() => passagem.add('Novo item' as never)} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
                    <Plus className="h-3.5 w-3.5 mr-1" /> Item
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* MOTIVOS DE PERDA */}
          <TabsContent value="perda" className="mt-6 space-y-4">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="h-5 w-5 text-cw-red" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.perda.titulo" defaultValue="Motivos de Perda" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-sm text-cw-muted leading-relaxed">
                <EditableText storeKey="playbook.perda.intro" defaultValue="Entender por que perdemos um lead é tão importante quanto entender por que fechamos." multiline className="text-sm" />
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {perda.items.map((m, i) => (
                <div key={m.motivo + i} className="cw-card cw-card-hover p-5 border-l-4 border-l-cw-red/70 relative group/it">
                  <h4 className="font-bold text-cw-text mb-2">
                    <EditableText storeKey={`playbook.perda.${i}.motivo`} defaultValue={m.motivo} className="font-bold" />
                  </h4>
                  <p className="text-sm text-cw-muted leading-relaxed">
                    <EditableText storeKey={`playbook.perda.${i}.desc`} defaultValue={m.desc} multiline className="text-sm" />
                  </p>
                  {perda.isEditing && <RemoveBtn onClick={() => perda.remove(i)} />}
                </div>
              ))}
            </div>
            {perda.isEditing && (
              <div className="flex justify-center">
                <Button size="sm" variant="outline" onClick={() => perda.add({ motivo: 'Novo motivo', desc: 'Descrição.' })} className="border-dashed border-cw-purple-light/40 text-cw-purple-light">
                  <Plus className="h-3.5 w-3.5 mr-1" /> Motivo
                </Button>
              </div>
            )}

            <div className="cw-card p-4">
              <SheetLink label="Ver lista completa" />
            </div>
          </TabsContent>

          {/* PLANOS */}
          <TabsContent value="planos" className="mt-6 space-y-4 max-w-2xl">
            <SectionCard>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-5 w-5 text-cw-yellow" />
                <h3 className="text-lg font-bold">
                  <EditableText storeKey="playbook.planos.titulo" defaultValue="Planos e Preços" className="text-lg font-bold" />
                </h3>
              </div>
              <p className="text-cw-muted leading-relaxed">
                <EditableText
                  storeKey="playbook.planos.texto"
                  defaultValue="Os planos e preços são atualizados com frequência. Sempre consulte a versão mais recente na planilha oficial antes de uma negociação."
                  multiline
                  className="text-cw-muted"
                />
              </p>
            </SectionCard>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Button onClick={() => openSheet(url)} className="gradient-primary text-white hover:brightness-110 gap-2 h-12">
                <ExternalLink className="h-4 w-4" />
                <EditableText storeKey="playbook.planos.btn1" defaultValue="Ver Planos Atualizados" />
              </Button>
              <Button onClick={() => openSheet(url)} variant="outline" className="border-cw-purple/40 hover:bg-cw-elevated text-cw-text gap-2 h-12">
                <ExternalLink className="h-4 w-4" />
                <EditableText storeKey="playbook.planos.btn2" defaultValue="Calculadora de Planos" />
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
