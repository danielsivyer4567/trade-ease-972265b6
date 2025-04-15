
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder } from "../types";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
  onRowClick?: (order: PurchaseOrder) => void;
}

export function PurchaseOrderTable({ 
  purchaseOrders,
  onRowClick
}: PurchaseOrderTableProps) {
  // Function to determine badge color based on status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'billed':
        return "bg-[#61BD4F] text-white";
      case 'pending':
        return "bg-[#F2D600] text-black";
      case 'draft':
        return "bg-[#C377E0] text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order No</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Reference</TableHead>
            <TableHead>Linked Bill</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Job</TableHead>
            <TableHead>Order Date</TableHead>
            <TableHead>Delivery Date</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10} className="text-center py-8 text-gray-500">
                No purchase orders found
              </TableCell>
            </TableRow>
          ) : (
            purchaseOrders.map((order) => (
              <TableRow 
                key={order.id} 
                className="hover:bg-muted/50 cursor-pointer"
                onClick={() => onRowClick && onRowClick(order)}
              >
                <TableCell>{order.orderNo}</TableCell>
                <TableCell>{order.supplier}</TableCell>
                <TableCell>{order.reference || '-'}</TableCell>
                <TableCell>{order.linkedBill || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusBadgeClass(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>{order.job}</TableCell>
                <TableCell>{order.orderDate}</TableCell>
                <TableCell>{order.deliveryDate}</TableCell>
                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                <TableCell>{order.sent ? "Yes" : "No"}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
