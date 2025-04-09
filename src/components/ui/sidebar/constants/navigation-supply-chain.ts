
import {
  Truck,
  Store,
  ShoppingCart,
  Package2,
} from 'lucide-react';

// Supply Chain navigation group
export const supplyChainNavigation = {
  label: 'Supply Chain',
  items: [
    {
      type: 'link',
      icon: Truck,
      label: 'Suppliers',
      path: '/suppliers',
    },
    {
      type: 'link',
      icon: Store,
      label: 'Inventory',
      path: '/inventory',
    },
    {
      type: 'link',
      icon: ShoppingCart,
      label: 'Purchase Orders',
      path: '/purchase-orders',
    },
    {
      type: 'link',
      icon: Package2,
      label: 'Material Ordering',
      path: '/material-ordering',
    },
  ],
};
