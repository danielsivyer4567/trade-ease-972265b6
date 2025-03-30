
import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  className?: string;
  rightElement?: React.ReactNode;
  icon?: React.ReactNode;
}

export function SectionHeader({
  title,
  description,
  className,
  rightElement,
  icon
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-4", className)}>
      <div className="flex items-center gap-2">
        {icon && icon}
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      {rightElement && (
        <div className="mt-2 md:mt-0">
          {rightElement}
        </div>
      )}
    </div>
  );
}
