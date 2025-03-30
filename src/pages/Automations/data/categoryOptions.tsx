
import React from 'react';
import { 
  Workflow, UsersRound, MessageSquare, Banknote, 
  Package, ShieldAlert, Wrench, Star, ClipboardList
} from 'lucide-react';
import { CategoryOption } from '../types';

export const categoryOptions: CategoryOption[] = [
  { value: 'all', label: 'All', icon: <Workflow className="h-4 w-4" /> },
  { value: 'team', label: 'Team', icon: <UsersRound className="h-4 w-4" /> },
  { value: 'customer', label: 'Customer', icon: <MessageSquare className="h-4 w-4" /> },
  { value: 'sales', label: 'Sales', icon: <Banknote className="h-4 w-4" /> },
  { value: 'finance', label: 'Finance', icon: <Banknote className="h-4 w-4" /> },
  { value: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
  { value: 'compliance', label: 'Compliance', icon: <ShieldAlert className="h-4 w-4" /> },
  { value: 'equipment', label: 'Equipment', icon: <Wrench className="h-4 w-4" /> },
  { value: 'marketing', label: 'Marketing', icon: <Star className="h-4 w-4" /> },
  { value: 'forms', label: 'Forms', icon: <ClipboardList className="h-4 w-4" /> },
];
