
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  FileText, 
  Settings, 
  Menu,
} from 'lucide-react';
import { useSidebar } from './sidebar';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function AppSidebar() {
  const { isOpen, toggle } = useSidebar();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 lg:hidden"
        onClick={toggle}
      >
        <Menu />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white border-r transition-transform lg:translate-x-0",
          !isOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Trade Ease</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="/jobs"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Briefcase className="w-5 h-5" />
              Jobs
            </Link>
            <Link
              to="/customers"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Users className="w-5 h-5" />
              Customers
            </Link>
            <Link
              to="/quotes"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <FileText className="w-5 h-5" />
              Quotes
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
