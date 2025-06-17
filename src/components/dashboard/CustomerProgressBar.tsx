import { useState, useEffect } from 'react';
import { 
  FileSearch, 
  FileText, 
  ClipboardList, 
  ReceiptText, 
  CheckCircle2
} from 'lucide-react';
import { customerService } from '@/services/CustomerService';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomerProgressBarProps {
  customerId: string;
}

export function CustomerProgressBar({ customerId }: CustomerProgressBarProps) {
  const [progress, setProgress] = useState({
    hasAudits: false,
    hasQuotes: false,
    hasJobs: false,
    hasInvoices: false
  });

  useEffect(() => {
    async function loadCustomerProgress() {
      try {
        const journey = await customerService.getCustomerJourney(customerId);
        
        setProgress({
          hasAudits: (journey.audits || []).length > 0,
          hasQuotes: (journey.quotes || []).length > 0,
          hasJobs: (journey.jobs || []).length > 0,
          hasInvoices: (journey.invoices || []).length > 0
        });
      } catch (error) {
        console.error('Error loading customer progress:', error);
      }
    }
    
    loadCustomerProgress();
  }, [customerId]);

  // Calculate how many steps have been completed
  const stepsCompleted = [
    progress.hasAudits,
    progress.hasQuotes,
    progress.hasJobs,
    progress.hasInvoices
  ].filter(Boolean).length;

  // Calculate progress percentage
  const progressPercentage = (stepsCompleted / 4) * 100;

  // Animation variants for stage items
  const stageVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    })
  };

  const iconVariants = {
    incomplete: { scale: 1, rotate: 0 },
    complete: { 
      scale: [1, 1.2, 1],
      rotate: [0, 360, 360],
      transition: {
        duration: 0.6,
        times: [0, 0.6, 1]
      }
    }
  };

  const checkVariants = {
    initial: { scale: 0, opacity: 0, rotate: -180 },
    animate: { 
      scale: 1, 
      opacity: 1, 
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
        delay: 0.3
      }
    }
  };

  const stages = [
    { key: 'hasAudits', icon: FileSearch, label: 'Site Audit', completed: progress.hasAudits },
    { key: 'hasQuotes', icon: FileText, label: 'Quote', completed: progress.hasQuotes },
    { key: 'hasJobs', icon: ClipboardList, label: 'Job', completed: progress.hasJobs },
    { key: 'hasInvoices', icon: ReceiptText, label: 'Invoice', completed: progress.hasInvoices }
  ];

  return (
    <div>
      <motion.div 
        className="flex justify-between items-center mb-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h3 className="text-sm font-medium">Customer Journey Progress</h3>
        <motion.span 
          className="text-sm text-gray-500"
          key={stepsCompleted}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {stepsCompleted} of 4 steps completed
        </motion.span>
      </motion.div>
      
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ 
              duration: 0.8, 
              ease: "easeOut",
              delay: 0.2 
            }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"
          >
            {/* Progress bar shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{
                x: ['-100%', '100%']
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1
              }}
            />
          </motion.div>
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {stages.map((stage, index) => (
          <motion.div 
            key={stage.key}
            className={`flex flex-col items-center ${stage.completed ? 'text-blue-600' : 'text-gray-400'}`}
            variants={stageVariants}
            initial="initial"
            animate="animate"
            custom={index}
          >
            <motion.div 
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300 ${
                stage.completed ? 'bg-blue-100' : 'bg-gray-100'
              }`}
              animate={stage.completed ? "complete" : "incomplete"}
              variants={iconVariants}
            >
              <stage.icon className="h-4 w-4" />
            </motion.div>
            <motion.span 
              className="text-xs mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.3 }}
            >
              {stage.label}
            </motion.span>
            <AnimatePresence>
              {stage.completed && (
                <motion.div
                  variants={checkVariants}
                  initial="initial"
                  animate="animate"
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <CheckCircle2 className="h-3 w-3 mt-1 text-green-500" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 