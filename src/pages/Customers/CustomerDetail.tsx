
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ArrowLeft, Mail, Phone, MapPin, FileText, Briefcase, Receipt, ListCheck } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock data - in a real app, fetch based on id
  const customer = mockCustomers.find(c => c.id.toString() === id) || mockCustomers[0];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <h1 className="text-2xl font-semibold">{customer.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{customer.address}</span>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="quotes" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="quotes" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quotes
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              Invoices
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListCheck className="h-4 w-4" />
              Tasks
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quotes" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No quotes available</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="jobs" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Jobs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No jobs available</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="invoices" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoices</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No invoices available</p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="tasks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No tasks available</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
