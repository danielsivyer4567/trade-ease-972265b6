import { ReactNode } from 'react';

export interface Automation {
  id: number;
  title: string;
  description: string;
  isActive: boolean;
  triggers: string[];
  actions: string[];
  category: string;
  premium?: boolean;
  createdAt?: string;
}

export interface CategoryOption {
  value: string;
  label: string;
  icon: ReactNode;
}
