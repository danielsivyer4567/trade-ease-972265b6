
import React from 'react';
import AutomationCard from './AutomationCard';
import { Automation } from '../types';

interface AutomationGridProps {
  automations: Automation[];
  toggleAutomation: (id: number) => void;
}

const AutomationGrid = ({ automations, toggleAutomation }: AutomationGridProps) => {
  if (automations.length === 0) {
    return (
      <div className="text-center p-10 border border-dashed rounded-md">
        <p className="text-muted-foreground">No automations found in this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
      {automations.map((automation) => (
        <AutomationCard 
          key={automation.id} 
          automation={automation} 
          toggleAutomation={toggleAutomation} 
        />
      ))}
    </div>
  );
};

export default AutomationGrid;
