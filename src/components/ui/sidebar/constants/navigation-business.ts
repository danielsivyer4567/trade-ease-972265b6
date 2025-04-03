
import {
  Users,
  CircleDollarSign,
  Receipt,
  Landmark,
  Share,
  BarChart,
  Calculator,
  Percent,
  Gauge,
  Ruler,
  Square,
  FileCode,
} from 'lucide-react';

// Business navigation group
export const businessNavigation = {
  label: 'Business',
  items: [
    {
      type: 'link',
      icon: Users,
      label: 'Customers',
      path: '/customers',
    },
    {
      type: 'link',
      icon: CircleDollarSign,
      label: 'Quotes & Invoices',
      path: '/quotes-invoices',
    },
    {
      type: 'link',
      icon: Receipt,
      label: 'Expenses',
      path: '/expenses',
    },
    {
      type: 'link',
      icon: Landmark,
      label: 'Banking',
      path: '/banking',
    },
    {
      type: 'link',
      icon: Share,
      label: 'Referrals',
      path: '/referrals',
    },
    {
      type: 'link',
      icon: BarChart,
      label: 'Statistics',
      path: '/statistics',
    },
    {
      type: 'dropdown',
      icon: Calculator,
      label: 'Calculators',
      items: [
        {
          icon: Percent,
          label: 'Markup Calculator',
          path: '/calculators/markup',
        },
        {
          icon: Gauge,
          label: 'Job Cost Calculator',
          path: '/calculators/job-cost',
        },
        {
          icon: Ruler,
          label: 'Loads & Spans Calculator',
          path: '/calculators/loads-spans',
        },
        {
          icon: Square,
          label: 'Fencing Calculator',
          path: '/calculators/fencing',
        },
        {
          icon: FileCode,
          label: 'NCC Codes Reference',
          path: '/calculators/ncc-codes',
        },
      ],
    },
  ],
};
