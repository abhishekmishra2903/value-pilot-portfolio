
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Wallet,
  Home,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'My Investments', href: '/investments', icon: Wallet },
  { name: 'Holdings', href: '/holdings', icon: PieChart },
  { name: 'Performance', href: '/performance', icon: TrendingUp },
  { name: 'Reports', href: '/reports', icon: FileText },
];

const Sidebar = () => {
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow bg-slate-900 pt-5 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <BarChart3 className="h-8 w-8 text-emerald-400" />
          <span className="ml-2 text-xl font-bold text-white">ValuePilot</span>
        </div>
        <div className="mt-8 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  cn(
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  )
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
