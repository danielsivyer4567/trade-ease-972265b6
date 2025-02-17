
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
  const { state, toggleSidebar } = useSidebar();

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 lg:hidden"
        onClick={toggleSidebar}
      >
        <Menu />
      </Button>
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-48 bg-white border-r transition-transform lg:translate-x-0",
          state === "collapsed" && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-xl font-bold">Trade Ease</h1>
          </div>
          <nav className="flex-1 p-2 space-y-1">
            <Link
              to="/"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
            <a
              href="/jobs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Briefcase className="w-4 h-4" />
              Jobs
            </a>
            <Link
              to="/customers"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Users className="w-4 h-4" />
              Customers
            </Link>
            <Link
              to="/quotes"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <FileText className="w-4 h-4" />
              Quotes
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 text-gray-700 hover:text-gray-900"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
