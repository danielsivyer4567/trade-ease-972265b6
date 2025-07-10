import React from 'react';
import { cn } from '@/lib/utils';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'glassmorphic' | 'gradient' | 'minimal' | 'neon' | 'neumorphic';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const ModernButton = React.forwardRef<HTMLButtonElement, ModernButtonProps>(
  ({ 
    className, 
    variant = 'glassmorphic', 
    size = 'md', 
    icon, 
    loading = false, 
    children, 
    disabled,
    ...props 
  }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center font-medium transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm gap-1.5 h-8",
      md: "px-4 py-2 text-sm gap-2 h-10", 
      lg: "px-6 py-3 text-base gap-2.5 h-12"
    };

    const variantStyles = {
      glassmorphic: cn(
        "bg-white/10 backdrop-blur-md border border-white/20 rounded-xl",
        "hover:bg-white/20 hover:border-white/30 hover:shadow-lg hover:shadow-blue-500/20",
        "active:bg-white/30 active:scale-95",
        "text-gray-800 hover:text-gray-900",
        "shadow-sm hover:shadow-md",
        "focus:ring-blue-500/50"
      ),
      gradient: cn(
        "bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl",
        "hover:from-blue-600 hover:to-purple-700 hover:shadow-lg hover:shadow-blue-500/25",
        "active:scale-95",
        "text-white font-semibold",
        "shadow-md hover:shadow-lg",
        "focus:ring-blue-500"
      ),
      minimal: cn(
        "bg-transparent border-2 border-gray-200 rounded-xl",
        "hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm",
        "active:bg-gray-100 active:scale-95",
        "text-gray-700 hover:text-gray-900",
        "focus:ring-gray-500"
      ),
      neon: cn(
        "bg-black/90 border-2 border-cyan-400 rounded-xl",
        "hover:border-cyan-300 hover:shadow-lg hover:shadow-cyan-400/50",
        "active:scale-95",
        "text-cyan-400 hover:text-cyan-300 font-semibold",
        "shadow-md hover:shadow-cyan-400/25",
        "focus:ring-cyan-400"
      ),
      neumorphic: cn(
        "bg-gray-100 rounded-xl",
        "shadow-[inset_0_2px_4px_rgba(0,0,0,0.1),0_8px_16px_rgba(0,0,0,0.1)]",
        "hover:shadow-[inset_0_1px_2px_rgba(0,0,0,0.1),0_12px_24px_rgba(0,0,0,0.15)]",
        "active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.2),0_4px_8px_rgba(0,0,0,0.1)]",
        "active:scale-95",
        "text-gray-700 hover:text-gray-900",
        "focus:ring-gray-500"
      )
    };

    return (
      <button
        className={cn(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          loading && "pointer-events-none opacity-70",
          className
        )}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {loading && (
          <svg 
            className="animate-spin -ml-1 mr-2 h-4 w-4" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="4"
            />
            <path 
              className="opacity-75" 
              fill="currentColor" 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {icon && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="truncate">{children}</span>
      </button>
    );
  }
);

ModernButton.displayName = "ModernButton";

export default ModernButton;