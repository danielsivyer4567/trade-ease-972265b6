
import {
  Truck,
  Store,
  ShoppingCart,
  Package2,
} from 'lucide-react';
import type { NavigationItem } from '../navigation/NavigationGroup';

// Supply Chain navigation group
export const supplyChainNavigation = {
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
    {
      type: 'link' as const,
      icon: Package2,
      label: 'Material Ordering',
      path: '/material-ordering',
    },
  ] as NavigationItem[],
};
