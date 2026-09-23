const SDR_FIELD = 'ce39d035fad6c74095053ffe04bdb9bbc9ae2a53'; // campo "[QUAL] SDR/BDR"

function normalizar(s: string): string {
  return (s ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Acha o id da opção do Pipedrive ([QUAL] SDR/BDR) que casa com o nome informado. */
export async function acharSdrId(nome: string): Promise<{ id: string; label: string } | null> {
  const token = process.env.PIPEDRIVE_API_TOKEN;
  if (!token || !nome) return null;
  try {
    const r = await fetch(`https://api.pipedrive.com/v1/dealFields?api_token=${token}`);
    const json = await r.json();
    if (!json.success) return null;
    const campo = (json.data || []).find((f: { key: string }) => f.key === SDR_FIELD);
    const options: { id: number; label: string }[] = campo?.options || [];
    const alvo = normalizar(nome);
    let hit = options.find((o) => normalizar(o.label) === alvo);
    if (!hit) {
      const partes = alvo.split(' ');
      if (partes.length >= 2) {
        const pn = partes[0];
        const un = partes[partes.length - 1];
        hit = options.find((o) => {
          const l = normalizar(o.label);
          return l.startsWith(pn + ' ') && l.endsWith(' ' + un);
        });
      }
    }
    return hit ? { id: String(hit.id), label: hit.label } : null;
  } catch {
    return null;
  }
}
