import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowLeft, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

/** Página simples pra pessoa trocar a própria senha (ex.: depois de entrar com
 *  uma senha temporária que o gestor gerou). Acessível pelo ícone de chave no
 *  bloco de perfil da Sidebar. */
export default function TrocarSenha() {
  const navigate = useNavigate();
  const [senha, setSenha] = useState('');
  const [senha2, setSenha2] = useState('');
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  const [ok, setOk] = useState(false);

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');
    if (senha.length < 8) { setErro('A senha precisa ter pelo menos 8 caracteres.'); return; }
    if (senha !== senha2) { setErro('As senhas não conferem.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: senha });
    setLoading(false);
    if (error) { setErro(error.message); return; }
    setOk(true);
    setSenha(''); setSenha2('');
  };

  return (
    <div className="max-w-md mx-auto p-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-cw-muted hover:text-cw-text transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Voltar
      </button>

      <div className="cw-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
            <KeyRound className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-cw-text">Trocar senha</h1>
            <p className="text-xs text-cw-muted mt-0.5">Defina uma nova senha para sua conta.</p>
          </div>
        </div>

        {ok ? (
          <div className="flex items-start gap-2 px-3 py-3 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm">
            <Check className="h-4 w-4 shrink-0 mt-0.5" />
            Senha atualizada! Da próxima vez, entre com ela.
          </div>
        ) : (
          <form onSubmit={salvar} className="flex flex-col gap-3">
            <input
              className="w-full rounded-xl border border-cw-border bg-cw-elevated px-4 py-3 text-sm text-cw-text outline-none focus:border-cw-purple/50"
              type="password" placeholder="Nova senha" autoComplete="new-password"
              value={senha} onChange={e => setSenha(e.target.value)} disabled={loading}
            />
            <input
              className="w-full rounded-xl border border-cw-border bg-cw-elevated px-4 py-3 text-sm text-cw-text outline-none focus:border-cw-purple/50"
              type="password" placeholder="Confirmar nova senha" autoComplete="new-password"
              value={senha2} onChange={e => setSenha2(e.target.value)} disabled={loading}
            />
            {erro && <p className="text-xs text-red-500">{erro}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 w-full py-3 rounded-xl gradient-primary text-white font-bold text-sm disabled:opacity-60"
            >
              {loading ? 'Salvando...' : 'Salvar nova senha'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
