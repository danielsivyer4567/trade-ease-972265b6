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
  return <h2 className="text-center my-[3px] mx-[2px] px-[4px] py-[12px] text-gray-950 text-2xl">
      {title}
    </h2>;
}