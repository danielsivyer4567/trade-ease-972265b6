import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from 'sonner';
import { Wrench, CalendarCheck, Repeat, PlusCircle, ListChecks, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export const MaintenanceWorkflowSection = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [searchTerm, setSearchTerm] = useState("");
  const [plans, setPlans] = useState([]);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch maintenance plans
      const { data: plansData, error: plansError } = await supabase
        .from('maintenance_plans')
        .select(`
          id,
          name,
          description,
          frequency,
          status,
          start_date,
          end_date,
          customers(name)
        `)
        .order('created_at', { ascending: false });

      if (plansError) throw plansError;
      setPlans(plansData || []);

      // Fetch maintenance visits
      const { data: visitsData, error: visitsError } = await supabase
        .from('maintenance_visits')
        .select(`
          id,
          title,
          status,
          scheduled_date,
          completed_date,
          customers(name),
          maintenance_plans(name)
        `)
        .order('scheduled_date', { ascending: true });

      if (visitsError) throw visitsError;
      setVisits(visitsData || []);
    } catch (error) {
      console.error('Error fetching maintenance data:', error);
      toast.error('Failed to load maintenance data');
    } finally {
      setLoading(false);
    }
  };

  const createNewPlan = () => {
    // Navigate to plan creation page or open dialog
    toast.info('Create new maintenance plan feature coming soon');
  };

  const scheduleNewVisit = () => {
    // Navigate to visit scheduling page or open dialog
    toast.info('Schedule new maintenance visit feature coming soon');
  };

  const filteredPlans = plans.filter(plan => 
    plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (plan.description && plan.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (plan.customers && plan.customers.name && plan.customers.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredVisits = visits.filter(visit => 
    visit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (visit.customers && visit.customers.name && visit.customers.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (visit.maintenance_plans && visit.maintenance_plans.name && visit.maintenance_plans.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Maintenance & Follow-up Workflow</CardTitle>
            <CardDescription>Manage maintenance plans and scheduled visits</CardDescription>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={fetchData}>
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search maintenance plans or visits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="plans" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Repeat className="h-4 w-4" />
              <span>Maintenance Plans</span>
            </TabsTrigger>
            <TabsTrigger value="visits" className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4" />
              <span>Scheduled Visits</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="plans" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={createNewPlan} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>New Plan</span>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading maintenance plans...</div>
            ) : filteredPlans.length > 0 ? (
              <div className="space-y-4">
                {filteredPlans.map((plan) => (
                  <Card key={plan.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{plan.name}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(plan.status)}`}>
                            {plan.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {plan.description || 'No description'}
                        </p>
                        <div className="mt-2 text-sm">
                          <div><span className="font-medium">Customer:</span> {plan.customers?.name || 'N/A'}</div>
                          <div><span className="font-medium">Frequency:</span> {plan.frequency}</div>
                          <div><span className="font-medium">Period:</span> {formatDate(plan.start_date)} - {formatDate(plan.end_date)}</div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col justify-end p-4 bg-gray-50">
                        <Button variant="outline" size="sm" className="mb-2 w-full">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          Schedule Visit
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No matching maintenance plans found' : 'No maintenance plans found'}
              </div>
            )}
          </TabsContent>

          <TabsContent value="visits" className="mt-4">
            <div className="flex justify-end mb-4">
              <Button onClick={scheduleNewVisit} className="flex items-center gap-2">
                <PlusCircle className="h-4 w-4" />
                <span>Schedule Visit</span>
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-8">Loading scheduled visits...</div>
            ) : filteredVisits.length > 0 ? (
              <div className="space-y-4">
                {filteredVisits.map((visit) => (
                  <Card key={visit.id} className="overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      <div className="flex-1 p-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-semibold">{visit.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(visit.status)}`}>
                            {visit.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm">
                          <div><span className="font-medium">Customer:</span> {visit.customers?.name || 'N/A'}</div>
                          <div><span className="font-medium">Plan:</span> {visit.maintenance_plans?.name || 'One-time'}</div>
                          <div><span className="font-medium">Scheduled:</span> {formatDate(visit.scheduled_date)}</div>
                          {visit.completed_date && (
                            <div><span className="font-medium">Completed:</span> {formatDate(visit.completed_date)}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col justify-end p-4 bg-gray-50">
                        <Button variant="outline" size="sm" className="mb-2 w-full">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm" className="w-full">
                          <ListChecks className="h-4 w-4 mr-2" />
                          Checklist
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No matching scheduled visits found' : 'No scheduled visits found'}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MaintenanceWorkflowSection; 