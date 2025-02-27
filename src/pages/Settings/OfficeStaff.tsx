
import { ArrowLeft, Plus, Search, Users } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

// Example data - would come from an API in a real app
const staffMembers = [
  { id: 1, name: "Jane Smith", email: "jane.smith@tradeease.com", role: "Office Manager", phone: "555-123-4567" },
  { id: 2, name: "John Doe", email: "john.doe@tradeease.com", role: "Administrative Assistant", phone: "555-987-6543" },
  { id: 3, name: "Sarah Johnson", email: "sarah.johnson@tradeease.com", role: "Bookkeeper", phone: "555-456-7890" },
  { id: 4, name: "Michael Brown", email: "michael.brown@tradeease.com", role: "Customer Service", phone: "555-789-0123" },
];

export default function OfficeStaff() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-7 w-7 text-gray-700" />
              <h1 className="text-2xl font-bold">Office Staff</h1>
            </div>
          </div>
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            <span>Add Staff Member</span>
          </Button>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input className="pl-9" placeholder="Search staff members..." />
          </div>
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <select className="border rounded-md p-2">
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Role</option>
              <option>Recently Added</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map(staff => (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="block text-gray-500 text-sm">Role</Label>
                  <p>{staff.role}</p>
                </div>
                <div>
                  <Label className="block text-gray-500 text-sm">Email</Label>
                  <p>{staff.email}</p>
                </div>
                <div>
                  <Label className="block text-gray-500 text-sm">Phone</Label>
                  <p>{staff.phone}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
