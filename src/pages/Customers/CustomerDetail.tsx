
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Phone, Mail, MapPin, FileText, Briefcase, Receipt, ListCheck, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// This would normally come from an API or database
const customers = [
  {
    id: 1,
    name: "John Smith",
    phone: "+1 234 567 8901",
    email: "john.smith@email.com",
    address: "123 Main St, City",
    status: "active",
    recentJobs: [
      { id: "j1", title: "Bathroom Renovation", status: "completed", date: "2024-02-15" },
      { id: "j2", title: "Kitchen Plumbing", status: "in-progress", date: "2024-02-20" }
    ],
    totalSpent: "5,280.00",
    lastService: "2024-02-20"
  },
  // ... other customers
];

export default function CustomerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const customer = customers.find(c => c.id === Number(id));
  const { toast } = useToast();

  if (!customer) {
    return (
      <AppLayout>
        <div className="p-6">
          <Button variant="outline" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold">Customer not found</h2>
          </div>
        </div>
      </AppLayout>
    );
  }

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
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{customer.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-500" />
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
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

          <TabsContent value="quotes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quotes</CardTitle>
                <Button size="sm" onClick={() => toast({ title: "Creating new quote", description: "This feature is coming soon!" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Quote
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No quotes available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Jobs</CardTitle>
                <Button size="sm" onClick={() => toast({ title: "Creating new job", description: "This feature is coming soon!" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Job
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customer.recentJobs.map(job => (
                    <div key={job.id} className="flex justify-between items-center">
                      <span>{job.title}</span>
                      <span className="text-sm text-gray-500">{job.date}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Invoices</CardTitle>
                <Button size="sm" onClick={() => toast({ title: "Creating new invoice", description: "This feature is coming soon!" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No invoices available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Tasks</CardTitle>
                <Button size="sm" onClick={() => toast({ title: "Creating new task", description: "This feature is coming soon!" })}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
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
