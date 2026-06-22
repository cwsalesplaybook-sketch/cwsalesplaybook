import { Outlet } from 'react-router-dom';
import { GestorSidebar } from './GestorSidebar';

export function GestorLayout() {
  return (
    <div className="dark flex h-screen w-full overflow-hidden bg-cw-bg text-cw-text">
      <GestorSidebar />
      <main className="flex-1 overflow-y-auto scrollbar-cw">
        <Outlet />
      </main>
    </div>
  );
}
