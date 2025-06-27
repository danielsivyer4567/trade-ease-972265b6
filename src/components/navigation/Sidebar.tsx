import React from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Briefcase, 
  Calendar, 
  Settings, 
  FileCheck,
  Boxes,
  Wallet,
  Network,
  Mail
} from 'lucide-react';
import { NavLink } from './NavLink';
import { useActiveRoute } from '@/hooks/useActiveRoute';
import { cn } from '@/lib/utils';

export const Sidebar = () => {
  // Define navigation items
  const navItems = [
    { path: '/', title: 'Dashboard', icon: <Home className="w-5 h-5" /> },
    { path: '/customers', title: 'Customers', icon: <Users className="w-5 h-5" /> },
    { path: '/jobs', title: 'Jobs', icon: <Briefcase className="w-5 h-5" /> },
    { path: '/quotes', title: 'Quotes', icon: <FileText className="w-5 h-5" /> },
    { path: '/calendar', title: 'Calendar', icon: <Calendar className="w-5 h-5" /> },
    { path: '/calculators', title: 'Tricks of the Trade', icon: <FileCheck className="w-5 h-5" /> },
    { path: '/inventory', title: 'Inventory', icon: <Boxes className="w-5 h-5" /> },
    { path: '/payments', title: 'Payments', icon: <Wallet className="w-5 h-5" /> },
    { path: '/networks', title: 'Networks', icon: <Network className="w-5 h-5" /> },
    { path: '/email', title: 'Email', icon: <Mail className="w-5 h-5" /> },
    { path: '/settings', title: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ];

  // Use the hook at the component level, not inside a function
  const activeRouteFn = useActiveRoute;

  return (
    <aside className="min-w-60 w-60 h-screen bg-white border-r border-gray-200 py-6 flex flex-col overflow-y-auto">
      <div className="px-4 mb-6 flex items-center">
        <img src="/images/logooooo.png" alt="Trade Ease Logo" className="h-8 w-auto" />
        <span className="ml-2 text-xl font-bold">Trade Ease</span>
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-0.5 px-2">
          {navItems.map(item => {
            const isActive = activeRouteFn(item.path, { exact: item.path === '/' });
            
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  title={item.title}
                  active={isActive}
                  icon={item.icon}
                  className={cn(
                    "w-full text-sm",
                    isActive ? "text-primary" : "text-gray-600"
                  )}
                >
                  {item.title}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="mt-auto px-4 py-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
            U
          </div>
          <div className="ml-2">
            <p className="text-sm font-medium">User Name</p>
            <p className="text-xs text-gray-500">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}; 