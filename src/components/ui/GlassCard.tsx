
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div className={cn(
      "bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-4",
      className
    )}>
      {children}
    </div>
  );
}
