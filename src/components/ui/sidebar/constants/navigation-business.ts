import { Scroll, DollarSign, Receipt, CreditCard } from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';
import { lazy } from 'react';

const NotificationsPage = lazy(() => import('@/pages/Notifications'));

export const businessNavigation = {
  label: "Business",
  items: [
    {
      type: 'link' as const,
      icon: Scroll,
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
  ] as NavigationItem[],
};
