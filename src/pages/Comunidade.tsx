/** Comunidade — feed social do time de Representantes: conquistas, aprendizados
 *  e novidades. Espelha a UI do portal de reps; publicações ficam só nesta sessão
 *  (sem persistência em banco ainda — mesmo estado inicial "vazio" do portal real). */
import { useState } from 'react';
import { Image, Trophy, Send } from 'lucide-react';
import { useUserProfile } from '@/hooks/useUserProfile';

interface Post {
  id: string;
  autor: string;
  iniciais: string;
  avatarUrl: string | null;
  texto: string;
  criadoEm: Date;
}

export default function Comunidade() {
  const userProfile = useUserProfile();
  const [texto, setTexto] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);

  const publicar = () => {
    if (!texto.trim()) return;
    setPosts(p => [{
      id: crypto.randomUUID(),
      autor: userProfile.fullName ?? 'Você',
      iniciais: userProfile.initials,
      avatarUrl: userProfile.avatarUrl,
      texto: texto.trim(),
      criadoEm: new Date(),
    }, ...p]);
    setTexto('');
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Comunidade</h1>
        <p className="text-sm text-cw-muted mt-1">Compartilhe conquistas, aprendizados e novidades com outros representantes.</p>
      </div>

      <div className="cw-card p-4">
        <div className="flex gap-3">
          {userProfile.avatarUrl ? (
            <img src={userProfile.avatarUrl} alt="" className="h-10 w-10 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-[#4a0080] flex items-center justify-center text-xs font-black text-white shrink-0">
              {userProfile.initials}
            </div>
          )}
          <textarea
            value={texto}
            onChange={e => setTexto(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) publicar(); }}
            placeholder="Compartilhe algo com a comunidade..."
            rows={3}
            className="flex-1 bg-cw-surface border border-cw-border rounded-xl px-3 py-2.5 text-sm text-cw-text placeholder:text-cw-muted focus:outline-none focus:border-cw-purple/50 resize-none"
          />
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 text-xs font-medium text-cw-muted hover:text-cw-text transition-colors">
              <Image className="h-3.5 w-3.5" /> Foto
            </button>
            <button className="flex items-center gap-1.5 text-xs font-medium text-cw-muted hover:text-cw-text transition-colors">
              <Trophy className="h-3.5 w-3.5" /> Conquista
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-cw-muted hidden sm:inline">Ctrl + Enter</span>
            <button
              onClick={publicar}
              disabled={!texto.trim()}
              className="flex items-center gap-1.5 gradient-primary text-white text-xs font-bold px-4 py-2 rounded-xl disabled:opacity-40"
            >
              <Send className="h-3.5 w-3.5" /> Publicar
            </button>
          </div>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="cw-card p-8 text-center">
          <p className="text-sm text-cw-muted">Nenhuma publicação ainda. Seja o primeiro!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {posts.map(p => (
            <div key={p.id} className="cw-card p-4 flex gap-3">
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
              ) : (
                <div className="h-9 w-9 rounded-full bg-[#4a0080] flex items-center justify-center text-[11px] font-black text-white shrink-0">
                  {p.iniciais}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-cw-text">{p.autor}</p>
                <p className="text-sm text-cw-text/90 mt-0.5 whitespace-pre-line">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
