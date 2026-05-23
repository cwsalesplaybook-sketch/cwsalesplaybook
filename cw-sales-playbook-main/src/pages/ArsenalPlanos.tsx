/** Página /arsenal/planos — Planos disponíveis. */
import { Header } from '@/components/layout/Header';
import { EditableText } from '@/admin/EditableText';
import { BookOpen } from 'lucide-react';

export default function ArsenalPlanos() {
  return (
    <>
      <Header
        titulo="Planos"
        subtitulo="Planos e pacotes disponíveis para o time comercial"
        storeKey="arsenal.planos"
      />
      <div className="p-8 max-w-5xl space-y-6">
        <div className="cw-card p-8 text-center border-dashed">
          <BookOpen className="h-12 w-12 mx-auto text-cw-muted mb-4" />
          <h2 className="text-lg font-semibold text-cw-text mb-2">
            <EditableText
              storeKey="arsenal.planos.titulo"
              defaultValue="Aguardando liderança"
              className="text-lg font-semibold"
            />
          </h2>
          <p className="text-sm text-cw-muted max-w-md mx-auto">
            <EditableText
              storeKey="arsenal.planos.descricao"
              defaultValue="O conteúdo desta seção será preenchido pela liderança. Ative o Modo Gestor para adicionar os planos disponíveis."
              className="text-sm text-cw-muted"
              multiline
            />
          </p>
        </div>
      </div>
    </>
  );
}
