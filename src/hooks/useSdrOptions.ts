/** Lista de SDRs vinculáveis ao Pipedrive (campo "[QUAL] SDR/BDR"), buscada ao
 *  vivo em /api/sdr-options — evita ter que editar código toda vez que
 *  alguém novo entra no time e passa a vender no Pipedrive (era hardcoded em
 *  3 arquivos antes, e ficava desatualizado sempre que esqueciam de mexer nos 3).
 *  Cai pra um snapshot fixo só se a API falhar (Pipedrive fora do ar etc). */
import { useEffect, useState } from 'react';

export interface SdrOption { id: string; name: string; }

const FALLBACK: SdrOption[] = [
  { id: '1523', name: 'Miguel Nunes' }, { id: '1445', name: 'Gabrielly Oliveira' }, { id: '1556', name: 'Thais Giurizatto' },
  { id: '1667', name: 'Luis Lincon' }, { id: '1686', name: 'Jonas Sobreira' }, { id: '1382', name: 'Tatyanna Freitas' },
  { id: '1708', name: 'Kailane Carvalho' }, { id: '1407', name: 'Lara Stefanny' }, { id: '1727', name: 'Raquel Alves' },
  { id: '1710', name: 'José Guilherme' }, { id: '1728', name: 'Fabíola Azevedo' }, { id: '1729', name: 'Enizia Evangelista' },
  { id: '1607', name: 'Caique Silva' }, { id: '1555', name: 'Ana Alice' }, { id: '1608', name: 'Ryan Felipe' },
  { id: '1730', name: 'Maria Gabriela' }, { id: '1685', name: 'Dayana Ferreira' },
  { id: '1738', name: 'Clara Rodrigues' }, { id: '1706', name: 'Raissa Fonseca' }, { id: '1335', name: 'João Paulo' },
];

export function useSdrOptions() {
  const [options, setOptions] = useState<SdrOption[]>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const r = await fetch('/api/sdr-options');
        const json = await r.json();
        if (ativo && json.ok && Array.isArray(json.options) && json.options.length > 0) {
          setOptions(json.options);
        }
      } catch { /* mantém o fallback */ }
      finally { if (ativo) setLoading(false); }
    })();
    return () => { ativo = false; };
  }, []);

  const map: Record<string, string> = Object.fromEntries(options.map(o => [o.id, o.name]));
  return { options, map, loading };
}
