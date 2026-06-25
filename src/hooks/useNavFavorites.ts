/** Favoritos de abas da sidebar — por colaborador, salvos no navegador.
 *  A chave inclui o identificador do usuário (email) pra separar favoritos
 *  de pessoas diferentes que usem o mesmo navegador. */
import { useCallback, useEffect, useState } from 'react';

function storageKey(userKey: string) {
  return `cw-fav-nav:${userKey || 'anon'}`;
}

export function useNavFavorites(userKey: string) {
  const [favs, setFavs] = useState<string[]>([]);

  // (Re)carrega quando o usuário muda (ex.: login resolve o email).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey(userKey));
      setFavs(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      setFavs([]);
    }
  }, [userKey]);

  const toggle = useCallback((route: string) => {
    setFavs((prev) => {
      const next = prev.includes(route) ? prev.filter((r) => r !== route) : [...prev, route];
      try {
        localStorage.setItem(storageKey(userKey), JSON.stringify(next));
      } catch {
        /* ignore quota / private mode */
      }
      return next;
    });
  }, [userKey]);

  const isFav = useCallback((route: string) => favs.includes(route), [favs]);

  return { favs, isFav, toggle };
}
