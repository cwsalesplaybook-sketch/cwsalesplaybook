/** Seção Gestão: framework + liderança. */
import { Puzzle, Award } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FrameworkGestao from './FrameworkGestao';
import NiveisLideranca from './NiveisLideranca';
import DesafiosEquipe from './DesafiosEquipe';

export default function Gestao() {
  return (
    <>

      <div className="p-8 ">
        <Tabs defaultValue="framework" className="w-full">
          <TabsList className="bg-cw-surface border border-cw-border p-1">
            <TabsTrigger
              value="framework"
              className="data-[state=active]:gradient-primary data-[state=active]:text-white gap-2"
            >
              <Puzzle className="h-4 w-4" />
              Framework de Gestão
            </TabsTrigger>
            <TabsTrigger
              value="lideranca"
              className="data-[state=active]:gradient-primary data-[state=active]:text-white gap-2"
            >
              <Award className="h-4 w-4" />
              Liderança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="framework" className="mt-6">
            <FrameworkGestao />
          </TabsContent>

          <TabsContent value="lideranca" className="mt-6 space-y-10">
            <NiveisLideranca />
            <div className="h-px bg-cw-border" />
            <DesafiosEquipe />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
