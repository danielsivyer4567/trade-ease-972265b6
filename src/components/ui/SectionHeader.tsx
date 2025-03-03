
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h2 className={cn("text-2xl font-semibold mb-4", className)}>
      {title}
    </h2>
  );
}
