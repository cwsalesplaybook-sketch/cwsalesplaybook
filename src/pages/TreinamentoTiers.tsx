/** Treinamento por Tiers — trilha de desenvolvimento por faixa de maturidade. */
import { Header } from '@/components/layout/Header';
import TreinamentoConteudo from '@/components/playbook/TreinamentoConteudo';

export default function TreinamentoTiers() {
  return (
    <>
      <Header titulo="Treinamento por Tiers" subtitulo="Trilha de desenvolvimento por faixa de maturidade comercial" />
      <div className="p-8">
        <TreinamentoConteudo />
      </div>
    </>
  );
}
