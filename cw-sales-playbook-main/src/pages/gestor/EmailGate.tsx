import { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';

export function EmailGate({ children }: { children: React.ReactNode }) {
  const { email, setEmail } = useUser();
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState(false);

  if (email) return <>{children}</>;

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setEmail(value.trim());
      setLoading(false);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-cw-bg flex items-center justify-center p-6">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <img
            src="https://cardapioweb.com/wp-content/uploads/2024/01/Logo-Cardapio-Web.png"
            alt="Cardápio Web"
            className="h-8 w-auto object-contain mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-cw-text">Modo Gestor</h1>
          <p className="text-sm text-cw-muted">
            Informe seu e-mail corporativo para continuar.
          </p>
        </div>

        <form onSubmit={handle} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-cw-muted" />
            <Input
              autoFocus
              type="email"
              placeholder="seu@cardapioweb.com"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              disabled={loading}
              className="pl-9 bg-cw-surface border-cw-border"
            />
          </div>
          <Button
            type="submit"
            disabled={loading || !value.trim()}
            className="w-full gradient-primary text-white"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
