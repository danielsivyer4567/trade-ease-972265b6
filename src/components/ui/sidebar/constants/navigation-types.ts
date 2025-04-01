
import { LucideIcon } from "lucide-react";

// Define types for navigation items
export type NavigationLink = {
  type: 'link';
  icon: LucideIcon;
  label: string;
  path: string;
};

export type NavigationButton = {
  type: 'button';
  icon: LucideIcon;
  label: string;
  action: string;
};

export type NavigationDropdownItem = {
  icon: LucideIcon;
  label: string;
  path: string;
};

export type NavigationDropdown = {
  type: 'dropdown';
  icon: LucideIcon;
  label: string;
  items: NavigationDropdownItem[];
};

export type NavigationItem = NavigationLink | NavigationButton | NavigationDropdown;

export type NavigationGroup = {
  label?: string; // Make label optional
  items: NavigationItem[];
};
