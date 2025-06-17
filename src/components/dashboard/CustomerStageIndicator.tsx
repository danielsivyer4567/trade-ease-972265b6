import { useState, useEffect } from 'react';
import { customerService } from '@/services/CustomerService';
import { motion, AnimatePresence } from 'framer-motion';

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
  const [prevStage, setPrevStage] = useState(stage);
  
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
        
        setPrevStage(stage);
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

  // Animation variants
  const ringVariants = {
    initial: { scale: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    },
    exit: { scale: 0, rotate: 180 }
  };

  const numberVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    },
    exit: { opacity: 0, y: -20 }
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  };

  return (
    <div className="relative group">
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${stage.team}-${stage.number}`}
          className={`${sizeClasses.ring} ${TEAM_COLORS[stage.team]} rounded-full flex items-center justify-center text-white font-semibold relative`}
          variants={ringVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {/* Pulse effect for stage changes */}
          {prevStage.number !== stage.number && prevStage.number !== 0 && (
            <motion.div
              className={`absolute inset-0 ${TEAM_COLORS[stage.team]} rounded-full`}
              variants={pulseVariants}
              animate="animate"
              style={{ zIndex: -1 }}
            />
          )}
          
          <motion.span 
            key={stage.number}
            className={`${sizeClasses.text}`}
            variants={numberVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {stage.number}
          </motion.span>
        </motion.div>
      </AnimatePresence>
      
      {/* Animated Tooltip */}
      <motion.div 
        className="invisible group-hover:visible absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white rounded px-2 py-1 whitespace-nowrap z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <span className={`${sizeClasses.tooltip}`}>
          Stage {stage.number}: {stage.name}
        </span>
        <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45"></div>
      </motion.div>
    </div>
  );
} 