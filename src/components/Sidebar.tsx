
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { ChevronLeft, LayoutDashboard, Briefcase, BarChart3, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Holdings', path: '/holdings', icon: <Briefcase size={20} /> },
    { name: 'Performance', path: '/performance', icon: <BarChart3 size={20} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={20} /> },
  ];

  return (
    <div
      className={cn(
        'h-screen sticky top-0 bg-sidebar transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex items-center justify-between p-4 text-sidebar-foreground">
        <div className={cn('flex items-center', collapsed && 'justify-center w-full')}>
          {!collapsed && (
            <span className="text-xl font-bold ml-2">ValuePilot</span>
          )}
          {collapsed && (
            <span className="text-xl font-bold">VP</span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ChevronLeft className={cn(
            'h-5 w-5 transition-all',
            collapsed && 'rotate-180'
          )} />
        </Button>
      </div>
      
      <nav className="mt-8 px-2">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-accent'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                )}
              >
                <span>{item.icon}</span>
                {!collapsed && <span>{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-4 w-full px-4">
        {!collapsed && (
          <div className="px-3 py-2 bg-sidebar-accent/30 rounded-lg text-sidebar-foreground">
            <p className="text-xs">ValuePilot v1.0</p>
            <p className="text-xs opacity-70">Portfolio Manager</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
