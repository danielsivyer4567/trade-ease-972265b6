
export interface PurchaseOrder {
  id: string;
  orderNo: string;
  supplier: string;
  reference: string;
  linkedBill: string;
  status: 'billed' | 'pending' | 'draft';
  job: string;
  orderDate: string;
  deliveryDate: string;
  total: number;
  sent: boolean;
}
