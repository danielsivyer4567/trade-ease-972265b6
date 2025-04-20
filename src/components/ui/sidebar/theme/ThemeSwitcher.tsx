import React from 'react';
import { Check, PaintBucket } from 'lucide-react';
import { Button } from '../../button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../../dropdown-menu';
import { useSidebarTheme } from './SidebarThemeContext';
import { SidebarTheme } from './sidebarTheme';
import { cn } from '@/lib/utils';

interface ThemeSwitcherProps {
  className?: string;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ className }) => {
  const { theme, setTheme } = useSidebarTheme();

  const themes: { value: SidebarTheme; label: string; color: string }[] = [
    { value: 'default', label: 'Default', color: 'bg-[#E2E8F0]' },
    { value: 'dark', label: 'Dark', color: 'bg-gray-900' },
    { value: 'light', label: 'Light', color: 'bg-white border border-gray-200' },
    { value: 'blue', label: 'Blue', color: 'bg-blue-50' },
    { value: 'purple', label: 'Purple', color: 'bg-purple-50' },
    { value: 'green', label: 'Green', color: 'bg-green-50' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={cn("flex items-center justify-center", className)}
        >
          <PaintBucket className="h-4 w-4 text-white" />
          <span className="sr-only">Change theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="p-2 text-xs font-medium text-muted-foreground">
          Sidebar Theme
        </div>
        <DropdownMenuSeparator />
        {themes.map((item) => (
          <DropdownMenuItem
            key={item.value}
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setTheme(item.value)}
          >
            <div className="flex items-center gap-2">
              <div className={cn('h-4 w-4 rounded', item.color)} />
              <span>{item.label}</span>
            </div>
            {theme === item.value && <Check className="h-4 w-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
