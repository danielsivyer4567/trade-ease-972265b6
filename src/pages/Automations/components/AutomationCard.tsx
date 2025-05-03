import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ArrowRight, Clock, Zap, RefreshCcw, Flame } from 'lucide-react';
import { AutomationWorkflowButton } from '@/components/automation/AutomationWorkflowButton';
import { toast } from "sonner";
import { Automation } from '../types';
import { AutomationIntegrationService } from '@/services/AutomationIntegrationService';
import { useNavigate } from 'react-router-dom';

interface AutomationCardProps {
  automation: Automation;
  toggleAutomation: (id: number) => void;
}

const AutomationCard = ({ automation, toggleAutomation }: AutomationCardProps) => {
  const navigate = useNavigate();

  const handleRunNow = () => {
    navigate('/workflow', { 
      state: { 
        addAutomation: true,
        automationId: automation.id,
        automationTitle: automation.title,
        automationDescription: automation.description,
        preserveExisting: true
      } 
    });
  };

  return (
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
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          onClick={handleRunNow}
        >
          <RefreshCcw className="h-3 w-3" />
          <span>Run Now</span>
        </Button>
        <div className="flex gap-2">
          <AutomationWorkflowButton automationId={automation.id} variant="ghost" size="sm">
            Add to Workflow
          </AutomationWorkflowButton>
          <Button variant="ghost" size="sm" className="text-blue-600">Edit</Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default AutomationCard;
