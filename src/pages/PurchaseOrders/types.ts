
export interface PurchaseOrderItem {
  id?: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface PurchaseOrderAttachment {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  uploadedAt: string;
}

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
  items?: PurchaseOrderItem[];
  attachments?: PurchaseOrderAttachment[];
}
