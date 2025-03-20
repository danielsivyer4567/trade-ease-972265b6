import React, { useState, useEffect } from 'react';
import { Search, Plus, User, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Job } from '@/types/job';
import { supabase } from '@/integrations/supabase/client';
import { syncSingleJobToCalendars } from '@/integrations/calendar/syncEvents';
import { useCalendarConnections } from '@/hooks/useCalendarConnections';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface JobSearchProps {
  jobSearchQuery: string;
  setJobSearchQuery: (value: string) => void;
  startDate: Date | undefined;
  startTime: string;
  endDate: Date | undefined;
  endTime: string;
  onSelectJob?: (job: any) => void;
}

export const JobSearch: React.FC<JobSearchProps> = ({
  jobSearchQuery,
  setJobSearchQuery,
  startDate,
  startTime,
  endDate,
  endTime,
  onSelectJob
}) => {
  const navigate = useNavigate();
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isJobDropdownOpen, setIsJobDropdownOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<{
    id: string;
    jobNumber: string;
    customer: string;
    address: string;
    title: string;
  } | null>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [syncToUserCalendar, setSyncToUserCalendar] = useState(false);
  
  const {
    connections,
    userId,
    isConnected
  } = useCalendarConnections();
  
  const [showJobDialog, setShowJobDialog] = useState(false);
  const [existingCustomers, setExistingCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newCustomerEmail, setNewCustomerEmail] = useState('');
  const [newCustomerPhone, setNewCustomerPhone] = useState('');
  const [newCustomerAddress, setNewCustomerAddress] = useState('');
  const [newJobTitle, setNewJobTitle] = useState('');
  const [newJobNumber, setNewJobNumber] = useState('');
  const [activeTab, setActiveTab] = useState('existing');
  const [customerSearchQuery, setCustomerSearchQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchJobs = async () => {
      setJobs([{
        id: "1",
        jobNumber: "PLM-001",
        customer: "John Smith",
        address: "123 Main St",
        title: "Water Heater Installation"
      }, {
        id: "2",
        jobNumber: "HVAC-001",
        customer: "Sarah Johnson",
        address: "456 Elm Ave",
        title: "HVAC Maintenance"
      }, {
        id: "3",
        jobNumber: "ELE-001",
        customer: "Mike Brown",
        address: "789 Oak Dr",
        title: "Electrical Panel Upgrade"
      }, {
        id: "4",
        jobNumber: "PLM-002",
        customer: "Jessica Lee",
        address: "321 Pine Rd",
        title: "Bathroom Renovation"
      }, {
        id: "5",
        jobNumber: "ROOF-001",
        customer: "David Miller",
        address: "654 Cedar Ln",
        title: "Roof Repair"
      }]);
    };
    
    fetchJobs();
  }, []);
  
  useEffect(() => {
    if (showJobDialog) {
      fetchCustomers();
    }
  }, [showJobDialog]);
  
  const fetchCustomers = async () => {
    setExistingCustomers([
      { id: '1', name: 'John Smith', email: 'john@example.com', phone: '555-1234', address: '123 Main St' },
      { id: '2', name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-5678', address: '456 Elm Ave' },
      { id: '3', name: 'Mike Brown', email: 'mike@example.com', phone: '555-9012', address: '789 Oak Dr' },
      { id: '4', name: 'Jessica Lee', email: 'jessica@example.com', phone: '555-3456', address: '321 Pine Rd' },
      { id: '5', name: 'David Miller', email: 'david@example.com', phone: '555-7890', address: '654 Cedar Ln' }
    ]);
  };
  
  useEffect(() => {
    if (customerSearchQuery) {
      const lowercaseQuery = customerSearchQuery.toLowerCase();
      const filtered = existingCustomers.filter(customer => 
        customer.name.toLowerCase().includes(lowercaseQuery) || 
        customer.email.toLowerCase().includes(lowercaseQuery) || 
        customer.phone.includes(lowercaseQuery)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(existingCustomers);
    }
  }, [customerSearchQuery, existingCustomers]);
  
  useEffect(() => {
    if (jobSearchQuery) {
      const lowercaseQuery = jobSearchQuery.toLowerCase();
      const filtered = jobs.filter(job => 
        job.jobNumber.toLowerCase().includes(lowercaseQuery) || 
        job.customer.toLowerCase().includes(lowercaseQuery) || 
        job.address.toLowerCase().includes(lowercaseQuery) || 
        job.title.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredJobs(filtered);
      setIsJobDropdownOpen(filtered.length > 0);
    } else {
      setFilteredJobs([]);
      setIsJobDropdownOpen(false);
    }
  }, [jobSearchQuery, jobs]);
  
  const handleJobSelect = (job: {
    id: string;
    jobNumber: string;
    customer: string;
    address: string;
    title: string;
  }) => {
    setSelectedJob(job);
    setJobSearchQuery(job.title || job.jobNumber);
    setIsJobDropdownOpen(false);

    if (onSelectJob) {
      onSelectJob(job);
    }

    if (syncToUserCalendar && connections.length > 0 && startDate) {
      syncJobToUserCalendars(job);
    }
  };
  
  const syncJobToUserCalendars = async (job: any) => {
    if (!userId || !startDate) return;
    try {
      const jobForSync: Job = {
        id: job.id,
        customer: job.customer,
        title: job.title || `Job #${job.jobNumber}`,
        jobNumber: job.jobNumber,
        status: 'ready',
        type: 'General',
        location: job.location,
        date: startDate.toISOString()
      };

      const result = await syncSingleJobToCalendars(jobForSync, connections, userId);
      if (result.success) {
        toast.success('Job synced to your calendars');
      } else {
        toast.error('Failed to sync with one or more calendars');
      }
    } catch (error) {
      console.error('Error syncing to calendars:', error);
      toast.error('Failed to sync with your calendars');
    }
  };
  
  const handleNewJobClick = () => {
    setShowJobDialog(true);
    setSelectedCustomer(null);
    setNewCustomerName('');
    setNewCustomerEmail('');
    setNewCustomerPhone('');
    setNewCustomerAddress('');
    setNewJobTitle('');
    setNewJobNumber(`JOB-${Math.floor(1000 + Math.random() * 9000)}`);
    setActiveTab('existing');
  };
  
  const handleCustomerSelect = (customer: any) => {
    setSelectedCustomer(customer);
  };
  
  const handleCreateJob = async () => {
    if (activeTab === 'existing' && !selectedCustomer) {
      toast.error('Please select a customer');
      return;
    }
    
    if (activeTab === 'new' && (!newCustomerName || !newCustomerPhone)) {
      toast.error('Please fill in required customer information');
      return;
    }
    
    if (!newJobTitle) {
      toast.error('Please enter a job title');
      return;
    }
    
    try {
      let customerId = selectedCustomer?.id;
      let customerName = selectedCustomer?.name;
      let customerAddress = selectedCustomer?.address;
      
      if (activeTab === 'new') {
        customerId = `new-${Date.now()}`;
        customerName = newCustomerName;
        customerAddress = newCustomerAddress;
        
        toast.success('New customer created');
      }
      
      const newJob = {
        id: `job-${Date.now()}`,
        jobNumber: newJobNumber,
        customer: customerName,
        address: customerAddress,
        title: newJobTitle
      };
      
      setJobs([...jobs, newJob]);
      
      handleJobSelect(newJob);
      
      toast.success('New job created and selected');
      setShowJobDialog(false);
      
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };
  
  return (
    <div className="px-0 mx-0">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-xs font-medium text-gray-500">Job</label>
        <Button onClick={handleNewJobClick} className="h-6 text-xs bg-slate-500 hover:bg-slate-400 text-white flex items-center gap-1 mx-[240px] px-[62px] my-[16px]">
          <Plus className="h-3 w-3" />
          New Job
        </Button>
      </div>
      <div className="flex py-px px-0 my-0 mx-[4px]">
        <div className="relative w-full py-[3px] px-px my-0">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
          <Input 
            placeholder="Search by job #, customer name, address..." 
            value={jobSearchQuery} 
            onChange={e => setJobSearchQuery(e.target.value)} 
            className="pl-7 w-full border-gray-300 h-7 text-xs bg-slate-300 py-[22px] mx-0 my-0 px-[22px]" 
            onFocus={() => jobSearchQuery && setIsJobDropdownOpen(filteredJobs.length > 0)} 
            onBlur={() => setTimeout(() => setIsJobDropdownOpen(false), 200)} 
          />
          
          {isJobDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
              {filteredJobs.map(job => (
                <div 
                  key={job.id} 
                  className={`px-3 py-2 hover:bg-slate-100 cursor-pointer text-xs ${selectedJob?.id === job.id ? 'bg-slate-100' : ''}`}
                  onClick={() => handleJobSelect(job)}
                >
                  <div className="font-medium">{job.jobNumber} - {job.title}</div>
                  <div className="text-gray-500">
                    {job.customer} | {job.address}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 px-[22px] py-[21px] mx-[7px] my-[3px]"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      
      {userId && connections.length > 0 && (
        <div className="flex items-center gap-2 mt-1 ml-1">
          <input 
            type="checkbox" 
            id="syncToCalendar" 
            checked={syncToUserCalendar} 
            onChange={() => setSyncToUserCalendar(!syncToUserCalendar)} 
            className="h-3 w-3" 
          />
          <label htmlFor="syncToCalendar" className="text-xs text-gray-500">
            Sync this job to my calendars
          </label>
        </div>
      )}
      
      <Dialog open={showJobDialog} onOpenChange={setShowJobDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Job</DialogTitle>
            <DialogDescription>
              Create a new job with an existing customer or add a new customer.
            </DialogDescription>
          </DialogHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="existing" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Existing Customer
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                New Customer
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="existing" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Customers</label>
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Search by name, email, or phone..." 
                    value={customerSearchQuery}
                    onChange={e => setCustomerSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              
              <div className="border rounded-md max-h-48 overflow-y-auto">
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map(customer => (
                    <div 
                      key={customer.id}
                      onClick={() => handleCustomerSelect(customer)}
                      className={`p-3 border-b last:border-0 cursor-pointer hover:bg-slate-50 ${selectedCustomer?.id === customer.id ? 'bg-slate-100' : ''}`}
                    >
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-sm text-gray-500">
                        {customer.email} | {customer.phone}
                      </div>
                      <div className="text-xs text-gray-400">{customer.address}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No customers found</div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="new" className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Customer Name*</label>
                  <Input 
                    value={newCustomerName}
                    onChange={e => setNewCustomerName(e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number*</label>
                  <Input 
                    value={newCustomerPhone}
                    onChange={e => setNewCustomerPhone(e.target.value)}
                    placeholder="Phone number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input 
                  type="email"
                  value={newCustomerEmail}
                  onChange={e => setNewCustomerEmail(e.target.value)}
                  placeholder="Email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Address</label>
                <Input 
                  value={newCustomerAddress}
                  onChange={e => setNewCustomerAddress(e.target.value)}
                  placeholder="Full address"
                />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t pt-4 mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Job Number</label>
              <Input 
                value={newJobNumber}
                onChange={e => setNewJobNumber(e.target.value)}
                placeholder="Job number"
                readOnly
                className="bg-slate-50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Job Title*</label>
              <Input 
                value={newJobTitle}
                onChange={e => setNewJobTitle(e.target.value)}
                placeholder="Enter job description or title"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowJobDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateJob}>
              Create Job
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
