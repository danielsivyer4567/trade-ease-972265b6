import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Zap,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Stage {
  id: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  completed: boolean;
  active?: boolean;
  date?: string;
}

interface AnimatedStageProgressProps {
  stages: Stage[];
  layout?: 'horizontal' | 'vertical' | 'circular' | 'cards';
  showConnectors?: boolean;
  animationSpeed?: 'slow' | 'normal' | 'fast';
  colorScheme?: 'blue' | 'green' | 'purple' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  onStageClick?: (stageId: string) => void;
}

export function AnimatedStageProgress({
  stages,
  layout = 'horizontal',
  showConnectors = true,
  animationSpeed = 'normal',
  colorScheme = 'blue',
  size = 'md',
  onStageClick
}: AnimatedStageProgressProps) {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const controls = useAnimation();

  // Animation speed mapping
  const speedMap = {
    slow: 1.5,
    normal: 1,
    fast: 0.5
  };

  const speed = speedMap[animationSpeed];

  // Color scheme mapping
  const colorMap = {
    blue: {
      active: 'bg-blue-500',
      completed: 'bg-blue-600',
      inactive: 'bg-gray-300',
      text: 'text-blue-600',
      border: 'border-blue-500',
      glow: 'shadow-blue-500/50'
    },
    green: {
      active: 'bg-green-500',
      completed: 'bg-green-600',
      inactive: 'bg-gray-300',
      text: 'text-green-600',
      border: 'border-green-500',
      glow: 'shadow-green-500/50'
    },
    purple: {
      active: 'bg-purple-500',
      completed: 'bg-purple-600',
      inactive: 'bg-gray-300',
      text: 'text-purple-600',
      border: 'border-purple-500',
      glow: 'shadow-purple-500/50'
    },
    gradient: {
      active: 'bg-gradient-to-r from-blue-500 to-purple-500',
      completed: 'bg-gradient-to-r from-green-500 to-blue-500',
      inactive: 'bg-gray-300',
      text: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600',
      border: 'border-gradient-to-r from-blue-500 to-purple-500',
      glow: 'shadow-purple-500/50'
    }
  };

  const colors = colorMap[colorScheme];

  // Size mapping
  const sizeMap = {
    sm: {
      node: 'w-8 h-8',
      text: 'text-xs',
      connector: 'h-0.5',
      spacing: 'gap-2'
    },
    md: {
      node: 'w-12 h-12',
      text: 'text-sm',
      connector: 'h-1',
      spacing: 'gap-4'
    },
    lg: {
      node: 'w-16 h-16',
      text: 'text-base',
      connector: 'h-1.5',
      spacing: 'gap-6'
    }
  };

  const sizes = sizeMap[size];

  // Animation variants
  const stageVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: (custom: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.1 * speed,
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }),
    hover: {
      scale: 1.1,
      transition: { duration: 0.2 }
    },
    tap: {
      scale: 0.95
    }
  };

  const connectorVariants = {
    initial: { scaleX: 0, opacity: 0 },
    animate: (custom: number) => ({
      scaleX: 1,
      opacity: 1,
      transition: {
        delay: custom * 0.1 * speed + 0.2,
        duration: 0.4 * speed,
        ease: "easeOut"
      }
    })
  };

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 0 0 rgba(59, 130, 246, 0)",
        "0 0 0 10px rgba(59, 130, 246, 0.1)",
        "0 0 0 20px rgba(59, 130, 246, 0)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "loop" as const
      }
    }
  };

  const sparkleVariants = {
    initial: { scale: 0, rotate: 0 },
    animate: {
      scale: [0, 1, 0],
      rotate: [0, 180, 360],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatDelay: 3
      }
    }
  };

  // Render horizontal layout
  const renderHorizontalLayout = () => (
    <div className={cn("flex items-center", sizes.spacing)}>
      {stages.map((stage, index) => (
        <div key={stage.id} className="flex items-center">
          <motion.div
            className="relative"
            variants={stageVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            custom={index}
            onClick={() => onStageClick?.(stage.id)}
            onHoverStart={() => setHoveredStage(stage.id)}
            onHoverEnd={() => setHoveredStage(null)}
          >
            {/* Glow effect for active stages */}
            {stage.active && (
              <motion.div
                className={cn(
                  "absolute inset-0 rounded-full",
                  colors.active,
                  colors.glow
                )}
                variants={glowVariants}
                animate="animate"
              />
            )}

            {/* Stage node */}
            <div
              className={cn(
                sizes.node,
                "rounded-full flex items-center justify-center cursor-pointer relative overflow-hidden",
                stage.completed ? colors.completed : stage.active ? colors.active : colors.inactive,
                "transition-all duration-300"
              )}
            >
              {/* Sparkle effect for completed stages */}
              {stage.completed && (
                <motion.div
                  className="absolute top-0 right-0"
                  variants={sparkleVariants}
                  initial="initial"
                  animate="animate"
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              )}

              {stage.completed ? (
                <CheckCircle2 className="w-1/2 h-1/2 text-white" />
              ) : stage.active ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Zap className="w-1/2 h-1/2 text-white" />
                </motion.div>
              ) : (
                <Circle className="w-1/2 h-1/2 text-white" />
              )}
            </div>

            {/* Stage label */}
            <motion.div
              className={cn(
                "absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap",
                sizes.text,
                stage.completed || stage.active ? colors.text : "text-gray-500"
              )}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 * speed + 0.3 }}
            >
              {stage.title}
            </motion.div>

            {/* Hover tooltip */}
            <AnimatePresence>
              {hoveredStage === stage.id && stage.description && (
                <motion.div
                  className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-3 py-2 rounded text-xs whitespace-nowrap z-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  {stage.description}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Connector */}
          {showConnectors && index < stages.length - 1 && (
            <motion.div
              className={cn(
                "mx-2",
                sizes.connector,
                "bg-gray-300 origin-left",
                layout === 'horizontal' ? 'w-12' : 'h-12'
              )}
              variants={connectorVariants}
              initial="initial"
              animate="animate"
              custom={index}
            >
              {/* Animated fill for completed connectors */}
              {stage.completed && (
                <motion.div
                  className={cn("h-full", colors.completed)}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: index * 0.1 * speed + 0.4, duration: 0.3 }}
                  style={{ transformOrigin: 'left' }}
                />
              )}
            </motion.div>
          )}
        </div>
      ))}
    </div>
  );

  // Render vertical layout
  const renderVerticalLayout = () => (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          className="flex items-start gap-4"
          variants={stageVariants}
          initial="initial"
          animate="animate"
          custom={index}
        >
          {/* Vertical connector */}
          {showConnectors && index < stages.length - 1 && (
            <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-300">
              {stage.completed && (
                <motion.div
                  className={cn("w-full", colors.completed)}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ delay: index * 0.1 * speed + 0.4, duration: 0.3 }}
                  style={{ transformOrigin: 'top' }}
                />
              )}
            </div>
          )}

          {/* Stage node */}
          <motion.div
            className={cn(
              sizes.node,
              "rounded-full flex items-center justify-center cursor-pointer relative z-10",
              stage.completed ? colors.completed : stage.active ? colors.active : colors.inactive
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onStageClick?.(stage.id)}
          >
            {stage.completed ? (
              <CheckCircle2 className="w-1/2 h-1/2 text-white" />
            ) : stage.active ? (
              <Zap className="w-1/2 h-1/2 text-white" />
            ) : (
              <Circle className="w-1/2 h-1/2 text-white" />
            )}
          </motion.div>

          {/* Stage content */}
          <div className="flex-1">
            <h3 className={cn(
              "font-medium",
              sizes.text,
              stage.completed || stage.active ? colors.text : "text-gray-700"
            )}>
              {stage.title}
            </h3>
            {stage.description && (
              <p className="text-xs text-gray-500 mt-1">{stage.description}</p>
            )}
            {stage.date && (
              <p className="text-xs text-gray-400 mt-1">{stage.date}</p>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  // Render cards layout
  const renderCardsLayout = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stages.map((stage, index) => (
        <motion.div
          key={stage.id}
          className={cn(
            "p-4 rounded-lg border-2 cursor-pointer",
            stage.completed ? colors.border : stage.active ? colors.border : "border-gray-200",
            "hover:shadow-lg transition-shadow"
          )}
          variants={stageVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
          whileTap="tap"
          custom={index}
          onClick={() => onStageClick?.(stage.id)}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center",
              stage.completed ? colors.completed : stage.active ? colors.active : colors.inactive
            )}>
              {stage.completed ? (
                <CheckCircle2 className="w-5 h-5 text-white" />
              ) : stage.active ? (
                <Zap className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white text-sm">{index + 1}</span>
              )}
            </div>
            {stage.active && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className={cn("w-4 h-4", colors.text)} />
              </motion.div>
            )}
          </div>
          <h3 className={cn(
            "font-medium mb-1",
            stage.completed || stage.active ? colors.text : "text-gray-700"
          )}>
            {stage.title}
          </h3>
          {stage.description && (
            <p className="text-xs text-gray-500">{stage.description}</p>
          )}
        </motion.div>
      ))}
    </div>
  );

  // Main render
  switch (layout) {
    case 'vertical':
      return renderVerticalLayout();
    case 'cards':
      return renderCardsLayout();
    case 'horizontal':
    default:
      return renderHorizontalLayout();
  }
} 