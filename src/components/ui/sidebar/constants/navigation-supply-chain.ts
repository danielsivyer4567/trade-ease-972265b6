import { Database, Truck, PackageOpen, ShoppingCart } from 'lucide-react';
import { NavigationItem } from '../navigation/NavigationGroup';

// Supply Chain navigation group
export const supplyChainNavigation = {
  label: "",  // No label as shown in the image
  items: [
    {
      type: 'link' as const,
      icon: Database,
      label: 'Database',
      path: '/database-supply',
    },
    {
      type: 'link' as const,
      icon: Truck,
      label: 'Suppliers',
      path: '/suppliers',
    },
    {
      type: 'link' as const,
      icon: PackageOpen,
      label: 'Inventory',
      path: '/inventory',
    },
    {
      type: 'link' as const,
      icon: ShoppingCart,
      label: 'Purchase Orders',
      path: '/purchase-orders',
    },
  ] as NavigationItem[],
};
