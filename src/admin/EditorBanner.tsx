/** Banner fixo no topo quando o Modo Gestor está ativo.
 *  Inclui ações de exportar / importar / resetar / sair.
 *  Os dados agora moram no Cloud — export/import servem para backup/migração. */
import { useRef, useState } from 'react';
import { Download, Upload, RotateCcw, LogOut, Sparkles, Loader2, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useEditor } from './EditorContext';
import { useContentStore } from '@/store/contentStore';
import { toast } from '@/hooks/use-toast';

export function EditorBanner() {
  const { isEditing, lock } = useEditor();
  const exportJSON = useContentStore((s) => s.exportJSON);
  const importJSON = useContentStore((s) => s.importJSON);
  const resetAll = useContentStore((s) => s.resetAll);
  const overrides = useContentStore((s) => s.overrides);
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  if (!isEditing) return null;

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cw-portal-overrides-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: '💾 Exportado', description: 'Backup das alterações gerado.' });
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(String(ev.target?.result));
        setBusy(true);
        await importJSON(data);
        toast({ title: '📥 Importado', description: 'Configurações aplicadas para todos.' });
      } catch (e) {
        const msg = e instanceof Error ? e.message : 'JSON malformado';
        toast({ title: 'Falha ao importar', description: msg, variant: 'destructive' });
      } finally {
        setBusy(false);
      }
    };
    reader.readAsText(file);
  };

  const handleReset = async () => {
    if (!confirm('Resetar TODAS as alterações para todos os usuários? Não dá para desfazer.')) return;
    setBusy(true);
    try {
      await resetAll();
      toast({ title: '↺ Resetado', description: 'Conteúdo padrão restaurado para todos.' });
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erro ao resetar';
      toast({ title: 'Falha ao resetar', description: msg, variant: 'destructive' });
    } finally {
      setBusy(false);
    }
  };

  const count = Object.keys(overrides).length;

  return (
    <div className="sticky top-0 z-50 gradient-hot text-white border-b border-cw-purple-light/40">
      <div className="px-6 py-2.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-7 w-7 rounded-md bg-white/20 backdrop-blur flex items-center justify-center">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="text-sm">
            <strong className="font-bold uppercase tracking-wider">Modo Gestor Ativo</strong>
            <span className="text-white/80 ml-2 hidden sm:inline inline-flex items-center gap-1">
              <Cloud className="h-3 w-3" />
              {count === 0 ? 'sincronizado' : `${count} alteraç${count === 1 ? 'ão' : 'ões'} salv${count === 1 ? 'a' : 'as'} no servidor`}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImport(f);
              e.target.value = '';
            }}
          />
          <Button size="sm" variant="ghost" disabled={busy} onClick={() => fileRef.current?.click()} className="text-white hover:bg-white/20 h-8">
            <Upload className="h-3.5 w-3.5 mr-1" /> Importar
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={handleExport} className="text-white hover:bg-white/20 h-8">
            <Download className="h-3.5 w-3.5 mr-1" /> Exportar
          </Button>
          <Button size="sm" variant="ghost" disabled={busy} onClick={handleReset} className="text-white hover:bg-white/20 h-8">
            {busy ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5 mr-1" />} Reset
          </Button>
          <Button size="sm" variant="ghost" onClick={lock} className="text-white hover:bg-white/20 h-8">
            <LogOut className="h-3.5 w-3.5 mr-1" /> Sair
          </Button>
        </div>
      </div>
    </div>
  );
}
