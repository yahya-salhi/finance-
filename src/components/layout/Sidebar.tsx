import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Repeat, 
  BarChart2, 
  MessageSquare, 
  Settings as SettingsIcon 
} from 'lucide-react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/income', label: 'Income', icon: TrendingUp },
  { to: '/expenses', label: 'Expenses', icon: TrendingDown },
  { to: '/subscriptions', label: 'Subscriptions', icon: Repeat },
  { to: '/portfolio', label: 'Portfolio', icon: BarChart2 },
  { to: '/assistant', label: 'Assistant', icon: MessageSquare },
  { to: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          <span>Finance Tracker</span>
        </h1>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="text-xs text-slate-400 text-center">
          Finance Tracker v1.0
        </div>
      </div>
    </aside>
  );
}
