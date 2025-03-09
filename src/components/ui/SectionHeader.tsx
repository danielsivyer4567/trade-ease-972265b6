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
  return <h2 className="text-gray-950 text-center my-[3px] mx-[2px] px-[4px] py-[12px]">
      {title}
    </h2>;
}