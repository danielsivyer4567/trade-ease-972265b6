
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className }: SectionHeaderProps) {
  return (
    <h2 className={cn("text-2xl font-semibold mb-4 px-4 py-2 border-2 border-gray-300 inline-block bg-white", className)}>
      {title}
    </h2>
  );
}
