/** Página /arsenal/links — Links importantes do time. */
import { Header } from '@/components/layout/Header';
import { EditableText } from '@/admin/EditableText';
import { Link2 } from 'lucide-react';

export default function ArsenalLinks() {
  return (
    <>
      <Header
        titulo="Links Importantes"
        subtitulo="Referências e recursos essenciais para o dia a dia"
        storeKey="arsenal.links"
      />
      <div className="p-8 max-w-5xl space-y-6">
        <div className="cw-card p-8 text-center border-dashed">
          <Link2 className="h-12 w-12 mx-auto text-cw-muted mb-4" />
          <h2 className="text-lg font-semibold text-cw-text mb-2">
            <EditableText
              storeKey="arsenal.links.titulo"
              defaultValue="Aguardando liderança"
              className="text-lg font-semibold"
            />
          </h2>
          <p className="text-sm text-cw-muted max-w-md mx-auto">
            <EditableText
              storeKey="arsenal.links.descricao"
              defaultValue="Os links importantes serão adicionados pela liderança. Ative o Modo Gestor para cadastrar os recursos do time."
              className="text-sm text-cw-muted"
              multiline
            />
          </p>
        </div>
      </div>
    </>
  );
}
