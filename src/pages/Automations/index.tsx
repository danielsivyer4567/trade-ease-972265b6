
import React, { useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Plus, ArrowRight, Clock, Zap, RefreshCcw } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const Automations = () => {
  const [automations, setAutomations] = useState([
    {
      id: 1,
      title: 'New Job Alert',
      description: 'Send a notification to team members when a new job is assigned',
      isActive: true,
      triggers: ['New job created', 'Job assignment changed'],
      actions: ['Send notification', 'Update calendar']
    },
    {
      id: 2,
      title: 'Document Expiry Reminder',
      description: 'Remind customers when their documents are about to expire',
      isActive: true,
      triggers: ['Document expiry <= 30 days'],
      actions: ['Send email reminder', 'Create follow-up task']
    },
    {
      id: 3,
      title: 'Quote Follow-up',
      description: 'Send a follow-up message if quote hasn\'t been accepted after 3 days',
      isActive: false,
      triggers: ['Quote created > 3 days', 'Quote status = pending'],
      actions: ['Send follow-up email', 'Create reminder for sales team']
    },
    {
      id: 4,
      title: 'Weather Alert',
      description: 'Notify team if bad weather is forecasted for scheduled outdoor jobs',
      isActive: true,
      triggers: ['Weather forecast = rain/storm', 'Job type = outdoor'],
      actions: ['Send SMS alert', 'Suggest reschedule options']
    },
  ]);

  const toggleAutomation = (id: number) => {
    setAutomations(prevAutomations => 
      prevAutomations.map(automation => 
        automation.id === id ? {...automation, isActive: !automation.isActive} : automation
      )
    );
  };

  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Workflow className="mr-2 h-6 w-6" />
              Automations
            </h1>
            <p className="text-muted-foreground mt-1">
              Create automatic workflows to save time and reduce manual tasks
            </p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>Create Automation</span>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {automations.map((automation) => (
            <Card key={automation.id} className={`hover:shadow-md transition-shadow duration-200 ${!automation.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{automation.title}</CardTitle>
                  <Switch 
                    checked={automation.isActive} 
                    onCheckedChange={() => toggleAutomation(automation.id)} 
                  />
                </div>
                <CardDescription>{automation.description}</CardDescription>
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
      </div>
    </BaseLayout>
  );
};

export default Automations;
