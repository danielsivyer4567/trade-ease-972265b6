
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PurchaseOrder } from "../types";

interface PurchaseOrderTableProps {
  purchaseOrders: PurchaseOrder[];
}

export function PurchaseOrderTable({ purchaseOrders }: PurchaseOrderTableProps) {
  return (
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
        {purchaseOrders.map((order) => (
          <TableRow key={order.id} className="hover:bg-muted/50 cursor-pointer">
            <TableCell>{order.orderNo}</TableCell>
            <TableCell>{order.supplier}</TableCell>
            <TableCell>{order.reference}</TableCell>
            <TableCell>{order.linkedBill}</TableCell>
            <TableCell>
              <Badge variant="outline" className="bg-[#61BD4F] text-white">
                {order.status}
              </Badge>
            </TableCell>
            <TableCell>{order.job}</TableCell>
            <TableCell>{order.orderDate}</TableCell>
            <TableCell>{order.deliveryDate}</TableCell>
            <TableCell className="text-right">{order.total.toFixed(2)}</TableCell>
            <TableCell>{order.sent ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
