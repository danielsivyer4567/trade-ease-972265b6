import { useState, useEffect } from 'react';
import { customerService } from '@/services/CustomerService';

interface CustomerStageIndicatorProps {
  customerId: string;
  size?: 'sm' | 'md' | 'lg';
}

// Define team colors
const TEAM_COLORS = {
  sales: 'bg-blue-500',
  audit: 'bg-amber-500',
  installation: 'bg-green-500',
  billing: 'bg-purple-500',
  default: 'bg-gray-400'
};

export function CustomerStageIndicator({ customerId, size = 'md' }: CustomerStageIndicatorProps) {
  const [stage, setStage] = useState({
    number: 0,
    name: '',
    team: 'default' as keyof typeof TEAM_COLORS
  });
  
  useEffect(() => {
    async function loadCustomerStage() {
      try {
        const journey = await customerService.getCustomerJourney(customerId);
        
        // Determine which stage the customer is at
        let currentStage = {
          number: 0,
          name: 'New',
          team: 'sales' as keyof typeof TEAM_COLORS
        };
        
        if ((journey.invoices || []).length > 0) {
          currentStage = { number: 4, name: 'Invoiced', team: 'billing' };
        } else if ((journey.jobs || []).length > 0) {
          currentStage = { number: 3, name: 'Job', team: 'installation' };
        } else if ((journey.quotes || []).length > 0) {
          currentStage = { number: 2, name: 'Quote', team: 'sales' };
        } else if ((journey.audits || []).length > 0) {
          currentStage = { number: 1, name: 'Audit', team: 'audit' };
        }
        
        setStage(currentStage);
      } catch (error) {
        console.error('Error loading customer stage:', error);
      }
    }
    
    loadCustomerStage();
  }, [customerId]);

  // Calculate size classes based on size prop
  const sizeClasses = {
    sm: {
      ring: 'w-5 h-5',
      text: 'text-xs',
      tooltip: 'text-xs'
    },
    md: {
      ring: 'w-7 h-7',
      text: 'text-sm',
      tooltip: 'text-sm'
    },
    lg: {
      ring: 'w-9 h-9', 
      text: 'text-base',
      tooltip: 'text-base'
    }
  }[size];

  return (
    <div className="relative group">
      <div 
        className={`${sizeClasses.ring} ${TEAM_COLORS[stage.team]} rounded-full flex items-center justify-center text-white font-semibold`}
      >
        <span className={`${sizeClasses.text}`}>{stage.number}</span>
      </div>
      
      {/* Tooltip */}
      <div className="invisible group-hover:visible absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded px-2 py-1 whitespace-nowrap z-10">
        <span className={`${sizeClasses.tooltip}`}>
          Stage {stage.number}: {stage.name}
        </span>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </div>
    </div>
  );
} 