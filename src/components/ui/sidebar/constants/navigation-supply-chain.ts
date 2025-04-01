
import {
  Truck,
  Store,
  ShoppingCart,
} from 'lucide-react';
import { NavigationGroup, NavigationLink } from './navigation-types';

// Supply Chain navigation group
export const supplyChainNavigation: NavigationGroup = {
  label: 'Supply Chain',
  items: [
    {
      type: 'link' as const,
      icon: Truck,
      label: 'Suppliers',
      path: '/suppliers',
    },
    {
      type: 'link' as const,
      icon: Store,
      label: 'Inventory',
      path: '/inventory',
    },
    {
      type: 'link' as const,
      icon: ShoppingCart,
      label: 'Purchase Orders',
      path: '/purchase-orders',
    },
  ],
};
