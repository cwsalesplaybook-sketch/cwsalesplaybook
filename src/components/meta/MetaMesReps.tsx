/** Meta do Mês de Representantes — ainda não configurado (mesmo estado
 *  "em construção" do portal real de reps: sem squad/meta de time definidos). */
export default function MetaMesReps() {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-cw-text">Meta do Mês</h1>
        <p className="text-sm text-cw-muted mt-1">Visualize e acompanhe sua meta mensal em tempo real.</p>
      </div>
      <div className="cw-card p-10 flex flex-col items-center text-center gap-4">
        <div className="h-16 w-16 rounded-2xl bg-cw-purple/10 border border-cw-purple/20 flex items-center justify-center">
          <span className="text-3xl">🚧</span>
        </div>
        <div>
          <h3 className="text-lg font-bold text-cw-text">Metas em construção</h3>
          <p className="text-sm text-cw-muted max-w-md mx-auto mt-1 leading-relaxed">
            A visualização de metas mensais será configurada em breve para os representantes. Você poderá acompanhar seu progresso diretamente aqui.
          </p>
        </div>
      </div>
    </div>
  );
}
