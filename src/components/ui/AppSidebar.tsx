import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { SidebarNavLinks } from './sidebar/SidebarNavLinks';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Menu } from 'lucide-react';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { sidebarVariants } from './sidebar/theme/sidebarTheme';
import { useSidebarTheme } from './sidebar/theme/SidebarThemeContext';

interface AppSidebarProps {
  className?: string;
  isExpanded: boolean;
  onToggle: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export function AppSidebar({ className, isExpanded, onToggle, isDarkMode, onToggleDarkMode }: AppSidebarProps) {
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { theme } = useSidebarTheme();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={cn(
        sidebarVariants({ 
          theme: theme, 
          size: isExpanded ? "expanded" : "collapsed" 
        }),
        className
      )}>
        <SidebarHeader
          isExpanded={isExpanded}
          onToggle={onToggle}
        />
        <ScrollArea className="flex-1 overflow-y-auto">
          <SidebarNavLinks isExpanded={isExpanded} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
        </ScrollArea>
      </aside>

      {/* Mobile Sidebar Toggle Button */}
      <div className="fixed top-4 left-4 z-50 md:hidden">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="bg-white/90 hover:bg-white">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[280px] p-0">
            <SheetHeader className="h-16 bg-black border-b px-4 flex items-center">
              <SheetTitle className="flex items-center text-white">
                Trade Ease
              </SheetTitle>
            </SheetHeader>
            <ScrollArea className="flex-1 py-2 h-[calc(100vh-4rem)]">
              <SidebarNavLinks isExpanded={true} isDarkMode={isDarkMode} onToggleDarkMode={onToggleDarkMode} />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
