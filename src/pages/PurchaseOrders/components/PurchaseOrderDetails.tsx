
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Edit, Printer, Mail, Download } from "lucide-react";
import { format } from "date-fns";
import { PurchaseOrder } from "../types";
import { toast } from "sonner";

interface PurchaseOrderDetailsProps {
  order?: PurchaseOrder;
  isLoading?: boolean;
}

export function PurchaseOrderDetails({ 
  order, 
  isLoading = false 
}: PurchaseOrderDetailsProps) {
  const navigate = useNavigate();
  const [sending, setSending] = useState(false);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col space-y-3">
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!order) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Purchase order not found.</p>
          <Button 
            onClick={() => navigate("/purchase-orders")}
            className="mt-4"
          >
            Back to Purchase Orders
          </Button>
        </CardContent>
      </Card>
    );
  }

  const handleSendEmail = () => {
    setSending(true);
    
    // Simulate sending email
    setTimeout(() => {
      setSending(false);
      toast.success("Purchase order email sent successfully");
    }, 1500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "billed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate("/purchase-orders")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/purchase-orders/edit/${order.id}`)}>
            <Edit size={16} className="mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Printer size={16} className="mr-2" />
            Print
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendEmail} 
            disabled={sending}
          >
            <Mail size={16} className="mr-2" />
            {sending ? "Sending..." : "Email"}
          </Button>
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Purchase Order: {order.orderNo}</CardTitle>
          <Badge className={`${getStatusColor(order.status)} capitalize`}>
            {order.status}
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
              <p className="mt-1 font-medium">{order.supplier}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Job</h3>
              <p className="mt-1 font-medium">{order.job}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
              <p className="mt-1">{order.orderDate}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Delivery Date</h3>
              <p className="mt-1">{order.deliveryDate}</p>
            </div>
            
            {order.reference && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Reference</h3>
                <p className="mt-1">{order.reference}</p>
              </div>
            )}
            
            {order.linkedBill && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Linked Bill</h3>
                <p className="mt-1">{order.linkedBill}</p>
              </div>
            )}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Order Items</h3>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-center font-medium text-gray-500">Quantity</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Unit Price</th>
                    <th className="px-4 py-2 text-right font-medium text-gray-500">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {/* Simulated items since we don't have actual items in the data model yet */}
                  <tr>
                    <td className="px-4 py-3">Materials for Job {order.job}</td>
                    <td className="px-4 py-3 text-center">1</td>
                    <td className="px-4 py-3 text-right">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${order.total.toFixed(2)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-right font-medium">Total:</td>
                    <td className="px-4 py-3 text-right font-bold">${order.total.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          
          <div className="mt-8 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {order.sent ? "Sent to supplier" : "Not yet sent to supplier"}
            </p>
            
            {!order.sent && (
              <Button className="bg-[#00A3BE] hover:bg-[#008CA3]">
                Send to Supplier
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
