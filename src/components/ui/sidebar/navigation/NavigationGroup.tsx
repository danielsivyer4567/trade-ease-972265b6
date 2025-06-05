import React from 'react';
import { NavItem } from './NavItem';
import { DropdownMenu } from './DropdownMenu';
import { LogoutButton } from './LogoutButton';
import { LucideIcon } from 'lucide-react';
import { ThemeSwitcher } from '../theme/ThemeSwitcher';

// Define strict literal types for navigation items
export interface NavItemType {
  type: 'link';
  icon: LucideIcon;
  label: string;
  path: string;
}
export interface ButtonItemType {
  type: 'button';
  icon: LucideIcon;
  label: string;
  action: string;
}
export interface DropdownItemType {
  type: 'dropdown';
  icon: LucideIcon;
  label: string;
  items?: {
    icon: LucideIcon;
    label: string;
    path: string;
  }[];
}
export type NavigationItem = NavItemType | ButtonItemType | DropdownItemType;
interface NavigationGroupProps {
  label?: string;
  items: NavigationItem[];
  isExpanded: boolean;
  onLogout: () => void;
}
export const NavigationGroup: React.FC<NavigationGroupProps> = ({
  label,
  items,
  isExpanded,
  onLogout
}) => {
  return <div className="grid gap-0.25 w-full my-0.5 pt-0.5 border-t border-white/30 first:border-0 first:pt-0 first:mt-0">
      {/* Group Label - Only show if it exists and sidebar is expanded */}
      {isExpanded && label && <h4 className="text-white font-bold text-xs px-2 mb-0.5">
          {label}
        </h4>}

      {items.map((item, index) => {
      // Use type guards to ensure type safety
      if (item.type === 'link') {
        return <NavItem key={`${item.path}-${index}`} 
          path={item.path} 
          title={item.label} // Pass label as title
          icon={item.icon} 
          sidebarExpanded={isExpanded} />; // Use sidebarExpanded instead of isExpanded
      }
      if (item.type === 'button' && item.action === 'logout') {
        return (
          <div key={`logout-theme-container-${index}`} className="flex items-center gap-2 px-2">
            <div className="flex-grow">
              <LogoutButton isExpanded={isExpanded} onLogout={onLogout} />
            </div>
            <ThemeSwitcher />
          </div>
        );
      }
      if (item.type === 'dropdown' && item.items) {
        return <DropdownMenu key={`dropdown-${item.label}-${index}`} label={item.label} icon={item.icon} items={item.items} isExpanded={isExpanded} />;
      }
      return null;
    })}
    </div>;
};
