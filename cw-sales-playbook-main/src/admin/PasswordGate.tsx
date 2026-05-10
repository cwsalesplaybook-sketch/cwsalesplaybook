/** Modal de senha mestre para destravar o Modo Gestor.
 *  A senha é validada no servidor (edge function editor-login). */
import { useState } from 'react';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEditor } from './EditorContext';
import { toast } from '@/hooks/use-toast';

export function PasswordGate() {
  const { passwordModalOpen, closePasswordModal, tryUnlock } = useEditor();
  const [pwd, setPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const ok = await tryUnlock(pwd);
      if (ok) {
        toast({ title: '🔓 Modo Gestor ativado', description: 'Suas alterações serão salvas para todos em tempo real.' });
        setPwd('');
      } else {
        toast({ title: 'Senha incorreta', description: 'Verifique com a liderança a senha mestre.', variant: 'destructive' });
        setPwd('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={passwordModalOpen} onOpenChange={(o) => !o && closePasswordModal()}>
      <DialogContent className="bg-cw-surface border-cw-border">
        <DialogHeader>
          <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center mb-3">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-2xl">Modo Gestor</DialogTitle>
          <DialogDescription className="text-cw-muted">
            Digite a senha mestre para destravar a edição. As alterações são
            salvas no servidor e refletidas em tempo real para todo o time.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handle} className="space-y-3">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted" />
            <Input
              autoFocus
              type="password"
              placeholder="Senha mestre"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              disabled={loading}
              className="pl-9 bg-cw-bg border-cw-border"
            />
          </div>
          <Button type="submit" disabled={loading || !pwd} className="w-full gradient-primary text-white">
            {loading ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Validando...</> : 'Destravar edição'}
          </Button>
          <p className="text-xs text-cw-muted text-center">
            Atalho: <kbd className="px-1.5 py-0.5 bg-cw-bg border border-cw-border rounded text-[10px]">Ctrl+Shift+E</kbd>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
