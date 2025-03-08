import React from 'react';
import { cn } from '@/lib/utils';
interface SectionHeaderProps {
  title: string;
  className?: string;
}
export function SectionHeader({
  title,
  className
}: SectionHeaderProps) {
  return <h2 className="text-slate-400">
      {title}
    </h2>;
}