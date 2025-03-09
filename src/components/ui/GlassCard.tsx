import React from 'react';
import { cn } from '@/lib/utils';
interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}
export function GlassCard({
  children,
  className
}: GlassCardProps) {
  return <div className="bg-slate-200">
      {children}
    </div>;
}