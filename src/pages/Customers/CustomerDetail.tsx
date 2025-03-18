import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ArrowLeft, Phone, Mail, MapPin, FileText, Briefcase, Receipt, ListCheck, Plus, ExternalLink, Repeat, Bell, Clipboard } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Customer } from "../Customers/hooks/useCustomers";
import { RecurringJobsTab } from "../Jobs/components/tabs/RecurringJobsTab";
import { ServiceRemindersTab } from "../Jobs/components/tabs/ServiceRemindersTab";
export default function CustomerDetail() {
  const navigate = useNavigate();
  const {
    id
  } = useParams();
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("jobs");
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [jobData, setJobData] = useState<any[]>([]);
  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      if (!id) return;
      try {
        const {
          data,
          error
        } = await supabase.from('customers').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) {
          // Fix case of zipcode -> zipCode for frontend consistency
          const customerData = {
            ...data,
            zipCode: data.zipcode // Map zipcode to zipCode for frontend
          };
          setCustomer(customerData as Customer);

          // Fetch related jobs for this customer
          const {
            data: jobsData,
            error: jobsError
          } = await supabase.from('jobs').select('*').eq('customer', customerData.name);
          if (jobsError) throw jobsError;
          setJobData(jobsData || []);
        }
      } catch (error) {
        console.error('Error fetching customer:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load customer details."
        });
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, toast]);
  const handleJobClick = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };
  if (loading) {
    return <AppLayout>
        <div className="p-6">
          <Button variant="outline" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div className="mt-8 text-center">
            <p className="text-gray-500">Loading customer details...</p>
          </div>
        </div>
      </AppLayout>;
  }
  if (!customer) {
    return <AppLayout>
        <div className="p-6">
          <Button variant="outline" onClick={() => navigate('/customers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Customers
          </Button>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-semibold">Customer not found</h2>
          </div>
        </div>
      </AppLayout>;
  }
  return <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/customers')} className="bg-slate-400 hover:bg-slate-300">
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
              <span>{customer.address}, {customer.city}, {customer.state} {customer.zipCode}</span>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 overflow-x-auto">
            <TabsTrigger value="notes" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300 text-slate-950">
              <Clipboard className="h-4 w-4" />
              <span className="hidden md:inline">Notes</span>
            </TabsTrigger>
            <TabsTrigger value="sites" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300">
              <MapPin className="h-4 w-4" />
              <span className="hidden md:inline">Sites</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300">
              <Briefcase className="h-4 w-4" />
              <span className="hidden md:inline">Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="recurring-jobs" className="flex items-center gap-2 text-slate-950 bg-slate-400 hover:bg-slate-300">
              <Repeat className="h-4 w-4" />
              <span className="hidden md:inline">Recurring Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="service-reminders" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300">
              <Bell className="h-4 w-4" />
              <span className="hidden md:inline">Service Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="invoices" className="flex items-center gap-2 text-slate-950 bg-slate-400 hover:bg-slate-300">
              <Receipt className="h-4 w-4" />
              <span className="hidden md:inline">Invoices</span>
            </TabsTrigger>
            <TabsTrigger value="quotes" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300">
              <FileText className="h-4 w-4" />
              <span className="hidden md:inline">Quotes</span>
            </TabsTrigger>
            <TabsTrigger value="recurring-invoices" className="flex items-center gap-2 bg-slate-400 hover:bg-slate-300">
              <Repeat className="h-4 w-4" />
              <span className="hidden md:inline">Recurring Invoices</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Notes</CardTitle>
                <Button size="sm" onClick={() => toast({
                title: "Adding note",
                description: "This feature is coming soon!"
              })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No notes available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sites">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Sites</CardTitle>
                <Button size="sm" onClick={() => toast({
                title: "Adding site",
                description: "This feature is coming soon!"
              })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Site
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No sites available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between bg-slate-300">
                <CardTitle>Jobs</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast({
                  title: "Creating from template",
                  description: "This feature is coming soon!"
                })} className="bg-slate-500 hover:bg-slate-400">
                    <Plus className="h-4 w-4 mr-2" />
                    From Template
                  </Button>
                  <Button size="sm" onClick={() => navigate("/jobs/new")} className="bg-slate-500 hover:bg-slate-400">
                    <Plus className="h-4 w-4 mr-2" />
                    New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="bg-slate-300">
                {jobData.length > 0 ? <div className="space-y-4">
                    {jobData.map(job => <div key={job.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer" onClick={() => handleJobClick(job.id)}>
                        <div className="flex items-center gap-2">
                          <span>{job.title || job.job_number}</span>
                          <span className="text-sm text-gray-500">({job.status})</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-500">{job.date}</span>
                          <ExternalLink className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>)}
                  </div> : <p className="text-gray-500">No jobs available</p>}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring-jobs">
            <RecurringJobsTab />
          </TabsContent>

          <TabsContent value="service-reminders">
            <ServiceRemindersTab />
          </TabsContent>

          <TabsContent value="invoices">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Invoices</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast({
                  title: "Creating from template",
                  description: "This feature is coming soon!"
                })}>
                    <Plus className="h-4 w-4 mr-2" />
                    From Template
                  </Button>
                  <Button size="sm" onClick={() => navigate("/invoices/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Invoice
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No invoices available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotes">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Quotes</CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => toast({
                  title: "Creating from template",
                  description: "This feature is coming soon!"
                })}>
                    <Plus className="h-4 w-4 mr-2" />
                    From Template
                  </Button>
                  <Button size="sm" onClick={() => navigate("/quotes/new")}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Quote
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No quotes available</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recurring-invoices">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recurring Invoices</CardTitle>
                <Button size="sm" onClick={() => toast({
                title: "Add recurring invoice",
                description: "This feature is coming soon!"
              })}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Recurring Invoice
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">No recurring invoices available</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>;
}