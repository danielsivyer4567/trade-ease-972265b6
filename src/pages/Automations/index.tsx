import React, { useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Workflow, 
  Plus, 
  ArrowRight, 
  Clock, 
  Zap, 
  RefreshCcw, 
  CalendarClock, 
  Banknote, 
  FileSearch, 
  ShieldAlert, 
  UsersRound, 
  Truck, 
  Star, 
  Flame,
  MessageSquare,
  Wrench,
  Package,
  Gauge,
  Receipt,
  ClipboardCheck,
  CalendarRange,
  Hammer,
  Landmark,
  AlertTriangle,
  CloudRain,
  PaintBucket,
  Thermometer,
  Tags,
  Map,
  BarChart2,
  FileText,
  Briefcase,
  Award,
  ClipboardList
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from "sonner";

const Automations = () => {
  const isMobile = useIsMobile();
  const [automations, setAutomations] = useState([
    {
      id: 1,
      title: 'New Job Alert',
      description: 'Send a notification to team members when a new job is assigned',
      isActive: true,
      triggers: ['New job created', 'Job assignment changed'],
      actions: ['Send notification', 'Update calendar'],
      category: 'team'
    },
    {
      id: 2,
      title: 'Document Expiry Reminder',
      description: 'Remind customers when their documents are about to expire',
      isActive: true,
      triggers: ['Document expiry <= 30 days'],
      actions: ['Send email reminder', 'Create follow-up task'],
      category: 'customer'
    },
    {
      id: 3,
      title: 'Quote Follow-up',
      description: 'Send a follow-up message if quote hasn\'t been accepted after 3 days',
      isActive: false,
      triggers: ['Quote created > 3 days', 'Quote status = pending'],
      actions: ['Send follow-up email', 'Create reminder for sales team'],
      category: 'sales'
    },
    {
      id: 4,
      title: 'Weather Alert',
      description: 'Notify team if bad weather is forecasted for scheduled outdoor jobs',
      isActive: true,
      triggers: ['Weather forecast = rain/storm', 'Job type = outdoor'],
      actions: ['Send SMS alert', 'Suggest reschedule options'],
      category: 'team'
    },
    {
      id: 5,
      title: 'Material Shortage Detection',
      description: 'Monitor inventory and proactively order supplies before projects are affected',
      isActive: true,
      triggers: ['Inventory level <= threshold', 'Job requires material'],
      actions: ['Create purchase order', 'Notify procurement team'],
      category: 'inventory',
      premium: true
    },
    {
      id: 6,
      title: 'Customer Review Automation',
      description: 'Request reviews from satisfied customers to boost your online reputation',
      isActive: true,
      triggers: ['Job marked as complete', 'Customer satisfaction = high'],
      actions: ['Send review request', 'Offer discount on next service'],
      category: 'marketing'
    },
    {
      id: 7,
      title: 'Late Payment Follow-up',
      description: 'Automatically chase overdue invoices with escalating messages',
      isActive: false,
      triggers: ['Invoice overdue > 7 days', 'Payment status = pending'],
      actions: ['Send payment reminder', 'Escalate to accounts team'],
      category: 'finance'
    },
    {
      id: 8,
      title: 'Compliance Documentation',
      description: 'Ensure all regulatory requirements are met before job completion',
      isActive: true,
      triggers: ['Job nearing completion', 'Required documents missing'],
      actions: ['Notify site manager', 'Generate compliance checklist'],
      category: 'compliance',
      premium: true
    },
    {
      id: 9,
      title: 'Subcontractor Management',
      description: 'Automate subcontractor scheduling and documentation verification',
      isActive: false,
      triggers: ['Job requires specialty trade', 'Subcontractor availability = true'],
      actions: ['Send job details', 'Request qualification documents'],
      category: 'team'
    },
    {
      id: 10,
      title: 'Equipment Maintenance',
      description: 'Schedule preventative maintenance based on usage hours',
      isActive: true,
      triggers: ['Equipment hours > threshold', 'No scheduled maintenance'],
      actions: ['Create maintenance task', 'Order replacement parts if needed'],
      category: 'equipment',
      premium: true
    },
    {
      id: 11,
      title: 'Client Communication',
      description: 'Keep clients informed with automated progress updates',
      isActive: true,
      triggers: ['Job status changed', 'Milestone completed'],
      actions: ['Send progress update', 'Share photos of completed work'],
      category: 'customer'
    },
    {
      id: 12,
      title: 'Lead Qualification',
      description: 'Score and prioritize leads based on custom criteria',
      isActive: true,
      triggers: ['New lead received', 'Budget matches criteria'],
      actions: ['Assign priority score', 'Route to appropriate salesperson'],
      category: 'sales',
      premium: true
    },
    {
      id: 13,
      title: 'Smart Tool Tracking',
      description: 'Track tools between job sites and automatically assign responsibility',
      isActive: true,
      triggers: ['Tool scanned at job site', 'Tool assigned to team member'],
      actions: ['Update tool location', 'Notify team member of responsibility'],
      category: 'equipment'
    },
    {
      id: 14,
      title: 'Safety Certification Monitor',
      description: 'Track team certification expirations and schedule necessary training',
      isActive: true,
      triggers: ['Certification < 60 days to expiry', 'Required certification missing'],
      actions: ['Schedule training courses', 'Send renewal notifications'],
      category: 'compliance',
      premium: true
    },
    {
      id: 15,
      title: 'Weather Risk Assessment',
      description: 'Automatically evaluate weather forecasts to assess job site risks',
      isActive: true,
      triggers: ['Severe weather alert issued', 'High heat days forecasted'],
      actions: ['Send safety protocol reminders', 'Adjust work schedule if needed'],
      category: 'team'
    },
    {
      id: 16,
      title: 'Trade Waste Management',
      description: 'Schedule waste collection and recycling for different material types',
      isActive: false,
      triggers: ['Job completion form submitted', 'Waste bins nearing capacity'],
      actions: ['Schedule pickup service', 'Document disposal compliance'],
      category: 'compliance'
    },
    {
      id: 17,
      title: 'Material Cost Fluctuation',
      description: 'Monitor supplier pricing and alert when material costs change significantly',
      isActive: true,
      triggers: ['Price increase > 5%', 'Material shortage reported'],
      actions: ['Alert procurement team', 'Suggest alternative suppliers'],
      category: 'inventory',
      premium: true
    },
    {
      id: 18,
      title: 'Permit & License Tracker',
      description: 'Monitor all required permits and licenses for active jobs',
      isActive: true,
      triggers: ['Permit expiring < 30 days', 'New job requires specific permits'],
      actions: ['Create renewal tasks', 'Escalate to compliance manager'],
      category: 'compliance'
    },
    {
      id: 19,
      title: 'Seasonal Maintenance Reminder',
      description: 'Schedule recurring seasonal maintenance for customer retention',
      isActive: true,
      triggers: ['Season change detected', 'Customer due for maintenance'],
      actions: ['Generate outreach campaign', 'Create follow-up tasks'],
      category: 'customer'
    },
    {
      id: 20,
      title: 'Vehicle Fleet Maintenance',
      description: 'Schedule preventative maintenance based on mileage and usage',
      isActive: true,
      triggers: ['Vehicle mileage threshold', 'Service due based on calendar'],
      actions: ['Create service appointment', 'Assign temporary vehicle if needed'],
      category: 'equipment'
    },
    {
      id: 21,
      title: 'Project Timeline Monitoring',
      description: 'Detect potential schedule slippage and alert project managers',
      isActive: true,
      triggers: ['Task completion delay > 2 days', 'Critical path affected'],
      actions: ['Notify project manager', 'Suggest resource reallocation'],
      category: 'team',
      premium: true
    },
    {
      id: 22,
      title: 'Supplier Performance Tracking',
      description: 'Evaluate supplier reliability and product quality over time',
      isActive: false,
      triggers: ['Late delivery detected', 'Quality issue reported'],
      actions: ['Update supplier rating', 'Suggest alternative vendors'],
      category: 'inventory'
    },
    {
      id: 23,
      title: 'Cross-Selling Opportunties',
      description: 'Identify additional service opportunities based on job type',
      isActive: true,
      triggers: ['Job completed successfully', 'Customer satisfaction high'],
      actions: ['Generate related service suggestions', 'Schedule follow-up call'],
      category: 'sales'
    },
    {
      id: 24,
      title: 'Warranty Period Monitor',
      description: 'Track warranty periods for completed jobs and schedule check-ins',
      isActive: true,
      triggers: ['Warranty nearing expiration', 'Seasonal check-in due'],
      actions: ['Schedule maintenance reminder', 'Generate customer communication'],
      category: 'customer'
    },
    {
      id: 25,
      title: 'Trade Efficiency Analysis',
      description: 'Compare planned vs. actual time spent on jobs to improve estimates',
      isActive: true,
      triggers: ['Job completed', 'Actual hours > estimated hours by 20%'],
      actions: ['Generate efficiency report', 'Update estimation templates'],
      category: 'finance',
      premium: true
    },
    {
      id: 26,
      title: 'Site Safety Checklist',
      description: 'Automatically generate site-specific safety checklists based on job type',
      isActive: true,
      triggers: ['New job created', 'High-risk task scheduled'],
      actions: ['Generate safety checklist', 'Assign team review tasks'],
      category: 'compliance'
    },
    {
      id: 27,
      title: 'Client Property Protection',
      description: 'Generate protection requirements for client property before work begins',
      isActive: true,
      triggers: ['Indoor job scheduled', 'High-value property noted'],
      actions: ['Create property protection list', 'Add to job preparation tasks'],
      category: 'customer'
    },
    {
      id: 28,
      title: 'Smart Parts Ordering',
      description: 'Automatically order common parts when inventory falls below threshold',
      isActive: false,
      triggers: ['Inventory level < minimum threshold', 'Part used frequently'],
      actions: ['Generate purchase order', 'Track shipment status'],
      category: 'inventory',
      premium: true
    },
    {
      id: 29,
      title: 'Job Completion Form',
      description: 'Automatically send job completion forms when a job is marked as finished',
      isActive: true,
      triggers: ['Job status changed to completed', 'Customer email available'],
      actions: ['Generate job completion form', 'Send form to customer'],
      category: 'forms'
    },
    {
      id: 30,
      title: 'Site Inspection Form',
      description: 'Schedule and send site inspection forms to team members before job starts',
      isActive: true,
      triggers: ['Job scheduled', '48 hours before job start'],
      actions: ['Generate site inspection form', 'Assign to responsible team member'],
      category: 'forms'
    },
    {
      id: 31,
      title: 'Customer Feedback Form',
      description: 'Send customer feedback forms after job completion to gather insights',
      isActive: true,
      triggers: ['Job marked as complete', '24 hours after completion'],
      actions: ['Send feedback form to customer', 'Create follow-up task if no response'],
      category: 'forms'
    },
    {
      id: 32,
      title: 'Material Request Form',
      description: 'Enable team members to submit material requests that require approval',
      isActive: false,
      triggers: ['Material request submitted', 'Inventory level below threshold'],
      actions: ['Send approval request to manager', 'Create purchase order when approved'],
      category: 'forms'
    }
  ]);

  const [selectedCategory, setSelectedCategory] = useState('all');

  const toggleAutomation = (id: number) => {
    setAutomations(prevAutomations => 
      prevAutomations.map(automation => 
        automation.id === id ? {...automation, isActive: !automation.isActive} : automation
      )
    );
    
    const automation = automations.find(a => a.id === id);
    if (automation) {
      toast.success(
        automation.isActive 
          ? `${automation.title} disabled` 
          : `${automation.title} enabled`
      );
    }
  };

  const categoryOptions = [
    { value: 'all', label: 'All', icon: <Workflow className="h-4 w-4" /> },
    { value: 'team', label: 'Team', icon: <UsersRound className="h-4 w-4" /> },
    { value: 'customer', label: 'Customer', icon: <MessageSquare className="h-4 w-4" /> },
    { value: 'sales', label: 'Sales', icon: <Banknote className="h-4 w-4" /> },
    { value: 'finance', label: 'Finance', icon: <Banknote className="h-4 w-4" /> },
    { value: 'inventory', label: 'Inventory', icon: <Package className="h-4 w-4" /> },
    { value: 'compliance', label: 'Compliance', icon: <ShieldAlert className="h-4 w-4" /> },
    { value: 'equipment', label: 'Equipment', icon: <Wrench className="h-4 w-4" /> },
    { value: 'marketing', label: 'Marketing', icon: <Star className="h-4 w-4" /> },
    { value: 'forms', label: 'Forms', icon: <ClipboardList className="h-4 w-4" /> },
  ];

  const filteredAutomations = selectedCategory === 'all' 
    ? automations 
    : automations.filter(automation => automation.category === selectedCategory);

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Workflow className="mr-2 h-6 w-6" />
              Trade Automations
            </h1>
            <p className="text-muted-foreground mt-1">
              Powerful automation workflows designed specifically for trade businesses
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Automation</span>
          </Button>
        </div>
        
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2">
            {categoryOptions.map((category) => (
              <Button 
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.value)}
                className="flex items-center gap-1 whitespace-nowrap"
              >
                {category.icon}
                <span>{category.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          {filteredAutomations.map((automation) => (
            <Card key={automation.id} className={`hover:shadow-md transition-shadow duration-200 ${!automation.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{automation.title}</CardTitle>
                      {automation.premium && (
                        <Badge variant="default" className="bg-gradient-to-r from-amber-400 to-orange-500">
                          <Flame className="h-3 w-3 mr-1" /> Pro
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="mt-1">{automation.description}</CardDescription>
                  </div>
                  <Switch 
                    checked={automation.isActive} 
                    onCheckedChange={() => toggleAutomation(automation.id)} 
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium flex items-center text-amber-600">
                      <Clock className="h-4 w-4 mr-1" /> Triggers:
                    </p>
                    <ul className="mt-1 text-sm space-y-1">
                      {automation.triggers.map((trigger, index) => (
                        <li key={index} className="flex items-center">
                          <span className="h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                          {trigger}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex justify-center">
                    <ArrowRight className="h-5 w-5 text-slate-400" />
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium flex items-center text-blue-600">
                      <Zap className="h-4 w-4 mr-1" /> Actions:
                    </p>
                    <ul className="mt-1 text-sm space-y-1">
                      {automation.actions.map((action, index) => (
                        <li key={index} className="flex items-center">
                          <span className="h-1 w-1 bg-slate-400 rounded-full mr-2"></span>
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-4 border-t">
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <RefreshCcw className="h-3 w-3" />
                  <span>Run Now</span>
                </Button>
                <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        
        {filteredAutomations.length === 0 && (
          <div className="text-center p-10 border border-dashed rounded-md">
            <p className="text-muted-foreground">No automations found in this category.</p>
          </div>
        )}
        
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <Flame className="h-4 w-4 inline text-orange-500 mr-1" /> 
            Pro automations require a premium subscription. 
            <Button variant="link" className="p-0 h-auto text-sm">Upgrade now</Button>
          </p>
        </div>
      </div>
    </BaseLayout>
  );
};

export default Automations;
