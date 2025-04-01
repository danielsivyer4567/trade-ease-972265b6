
import {
  Users,
  CircleDollarSign,
  Receipt,
  Landmark,
  Share,
  BarChart,
  Calculator,
  Plus,
} from 'lucide-react';
import { NavigationGroup, NavigationDropdown, NavigationLink } from './navigation-types';

// Business navigation group
export const businessNavigation: NavigationGroup = {
  label: 'Business',
  items: [
    {
      type: 'link' as const,
      icon: Users,
      label: 'Customers',
      path: '/customers',
    },
    {
      type: 'link' as const,
      icon: CircleDollarSign,
      label: 'Quotes & Invoices',
      path: '/quotes-invoices',
    },
    {
      type: 'link' as const,
      icon: Receipt,
      label: 'Expenses',
      path: '/expenses',
    },
    {
      type: 'link' as const,
      icon: Landmark,
      label: 'Banking',
      path: '/banking',
    },
    {
      type: 'link' as const,
      icon: Share,
      label: 'Referrals',
      path: '/referrals',
    },
    {
      type: 'link' as const,
      icon: BarChart,
      label: 'Statistics',
      path: '/statistics',
    },
    {
      type: 'dropdown' as const,
      icon: Calculator,
      label: 'Calculators',
      items: [
        {
          icon: Plus,
          label: 'Markup Calculator',
          path: '/calculators/markup',
        },
        {
          icon: Plus,
          label: 'Job Cost Calculator',
          path: '/calculators/job-cost',
        },
      ],
    },
  ],
};
