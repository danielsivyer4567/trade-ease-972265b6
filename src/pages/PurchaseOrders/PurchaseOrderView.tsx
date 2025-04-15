
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { PurchaseOrderDetails } from "./components/PurchaseOrderDetails";
import { PurchaseOrder } from "./types";
import { useTabNavigation } from "@/hooks/useTabNavigation";

// Mock function to get a purchase order by ID (in a real app, this would be an API call)
const getPurchaseOrderById = (id: string): Promise<PurchaseOrder | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockOrders = [
        {
          id: '1',
          orderNo: 'PO00005',
          supplier: 'Aaa Timber And Hardware',
          reference: '',
          linkedBill: 'Aaa Timber And Hardware',
          status: 'billed',
          job: 'JB00763',
          orderDate: '21 Jan 2025',
          deliveryDate: '21 Jan 2025',
          total: 500.00,
          sent: true
        },
        {
          id: '2',
          orderNo: 'PO00004',
          supplier: 'Jackson Ryan',
          reference: '',
          linkedBill: 'Jackson Ryan - 18 Jan 2025',
          status: 'billed',
          job: 'JB00764',
          orderDate: '18 Jan 2025',
          deliveryDate: '18 Jan 2025',
          total: 0.00,
          sent: true
        },
        {
          id: '3',
          orderNo: 'PO00003',
          supplier: 'China',
          reference: '',
          linkedBill: 'China - 18 Jan 2025',
          status: 'billed',
          job: 'JB00764',
          orderDate: '18 Jan 2025',
          deliveryDate: '18 Jan 2025',
          total: 1100.00,
          sent: true
        }
      ];
      
      const order = mockOrders.find(o => o.id === id);
      resolve(order);
    }, 500);
  });
};

export default function PurchaseOrderView() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<PurchaseOrder | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const { openInTab } = useTabNavigation();
  
  useEffect(() => {
    async function loadPurchaseOrder() {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await getPurchaseOrderById(id);
        setOrder(data);
        
        // Create a tab for this order
        if (data) {
          openInTab(
            `/purchase-orders/${id}`, 
            `PO: ${data.orderNo}`, 
            `po-${id}`
          );
        }
      } catch (error) {
        console.error("Error loading purchase order:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadPurchaseOrder();
  }, [id, openInTab]);
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="max-w-[1200px] mx-auto">
          <PurchaseOrderDetails 
            order={order} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </AppLayout>
  );
}
