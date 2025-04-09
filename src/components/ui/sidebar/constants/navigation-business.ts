
import { CreditCard, DollarSign, FileText, Receipt, ShoppingCart, Store, TrendingUp } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

export const businessNavigation = {
  label: "Business",
  items: [
    {
      type: 'link' as const,
      icon: Store,
      label: 'Customers',
      path: '/customers',
    },
    {
      type: 'link' as const,
      icon: FileText,
      label: 'Quotes',
      path: '/quotes',
    },
    {
      type: 'link' as const,
      icon: DollarSign,
      label: 'Invoices',
      path: '/invoices',
    },
    {
      type: 'link' as const,
      icon: Receipt,
      label: 'Expenses',
      path: '/expenses',
    },
    {
      type: 'link' as const,
      icon: CreditCard,
      label: 'Banking',
      path: '/banking',
    },
    {
      type: 'link' as const,
      icon: ShoppingCart,
      label: 'Trading',
      path: '/trading',
    },
    {
      type: 'link' as const,
      icon: TrendingUp,
      label: 'Trade Dashboard',
      path: '/trade-dashboard',
    },
  ] as NavigationItem[],
};
