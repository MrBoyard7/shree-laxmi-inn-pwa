import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-parchment-100">
      <main className="mx-auto max-w-md">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
