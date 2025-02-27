
import { Receipt, Plus, Search } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Example data - would come from an API in a real app
const purchaseOrders = [
  { id: 'PO-001', vendor: 'Supplier Co.', amount: 1250.00, status: 'Pending', date: '2024-02-15' },
  { id: 'PO-002', vendor: 'Hardware Plus', amount: 850.00, status: 'Approved', date: '2024-02-14' },
  { id: 'PO-003', vendor: 'Tools Direct', amount: 2100.00, status: 'Completed', date: '2024-02-13' },
];

export default function BillsPurchaseOrders() {
  return (
    <SettingsPageTemplate title="Bills & Purchase Orders" icon={<Receipt className="h-7 w-7 text-gray-700" />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage your bills and purchase orders</p>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Purchase Order
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input className="pl-9" placeholder="Search purchase orders..." />
          </div>
          <div className="flex items-center gap-2">
            <Label>Status:</Label>
            <select className="border rounded-md p-2">
              <option>All</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Completed</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4">
          {purchaseOrders.map(po => (
            <Card key={po.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {po.id}
                    <span className={`text-sm px-2 py-1 rounded ${
                      po.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      po.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {po.status}
                    </span>
                  </CardTitle>
                  <span className="text-lg font-semibold">${po.amount.toFixed(2)}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <div>
                      <Label className="block text-gray-500">Vendor</Label>
                      <p>{po.vendor}</p>
                    </div>
                    <div className="text-right">
                      <Label className="block text-gray-500">Date</Label>
                      <p>{po.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Details</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                    {po.status === 'Pending' && (
                      <Button variant="outline" size="sm" className="text-green-600">Approve</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </SettingsPageTemplate>
  );
}
