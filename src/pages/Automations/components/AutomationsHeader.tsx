import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Workflow, ClipboardList } from 'lucide-react';
import { AutomationWorkflowButton } from '@/components/automation/AutomationWorkflowButton';
import { useNavigate } from 'react-router-dom';

interface AutomationsHeaderProps {
  selectedCategory: string;
}

const AutomationsHeader = ({ selectedCategory }: AutomationsHeaderProps) => {
  const navigate = useNavigate();

  const navigateToForms = () => {
    navigate('/forms');
  };

  const navigateToCreateAutomation = () => {
    navigate('/workflow?create=true');
  };

  return (
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
      <div className="flex gap-2">
        {selectedCategory === 'forms' && (
          <Button variant="outline" className="flex items-center gap-2" onClick={navigateToForms}>
            <ClipboardList className="h-4 w-4" />
            <span>Manage Forms</span>
          </Button>
        )}
        <AutomationWorkflowButton>
          <span>Open in Workflow Builder</span>
        </AutomationWorkflowButton>
        <Button className="flex items-center gap-2" onClick={navigateToCreateAutomation}>
          <Plus className="h-4 w-4" />
          <span>Create Automation</span>
        </Button>
      </div>
    </div>
  );
};

export default AutomationsHeader;
