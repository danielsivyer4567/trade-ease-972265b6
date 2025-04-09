
import { CreditCard, DollarSign, FileText, Receipt, ShoppingCart, Store, TrendingUp } from 'lucide-react';

export const businessNavigation = {
  label: "Business",
  items: [
    {
      type: 'link',
      icon: Store,
      label: 'Customers',
      path: '/customers',
    },
    {
      type: 'link',
      icon: FileText,
      label: 'Quotes',
      path: '/quotes',
    },
    {
      type: 'link',
      icon: DollarSign,
      label: 'Invoices',
      path: '/invoices',
    },
    {
      type: 'link',
      icon: Receipt,
      label: 'Expenses',
      path: '/expenses',
    },
    {
      type: 'link',
      icon: CreditCard,
      label: 'Banking',
      path: '/banking',
    },
    {
      type: 'link',
      icon: ShoppingCart,
      label: 'Trading',
      path: '/trading',
    },
    {
      type: 'link',
      icon: TrendingUp,
      label: 'Trade Dashboard',
      path: '/trade-dashboard',
    },
  ],
};
