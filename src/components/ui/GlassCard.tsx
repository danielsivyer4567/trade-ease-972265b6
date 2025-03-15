
import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({
  children,
  className
}: GlassCardProps) {
  const isMobile = useIsMobile();
  
  return (
    <div className={cn(
      "bg-slate-200 rounded-lg shadow-lg backdrop-blur-sm",
      isMobile ? "p-2" : "p-4",
      className
    )}>
      {children}
    </div>
  );
}
