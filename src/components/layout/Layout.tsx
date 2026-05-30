import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <div className="min-h-screen flex bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile navigation - only shown on small screens */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around py-2 px-4 z-50">
        {/* Simplified mobile nav - logic can be added later if needed */}
        <div className="text-xs text-slate-400">Mobile navigation placeholder</div>
      </nav>
    </div>
  );
}
