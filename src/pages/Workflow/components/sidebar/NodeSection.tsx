
import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface NodeSectionProps {
  title: string;
  isExpanded: boolean;
  toggleSection: (section: string) => void;
  sectionKey: string;
  children: React.ReactNode;
}

export function NodeSection({ title, isExpanded, toggleSection, sectionKey, children }: NodeSectionProps) {
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-medium text-gray-600">{title}</h4>
        <button 
          className="text-gray-500 hover:text-gray-700" 
          onClick={() => toggleSection(sectionKey)}
        >
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}
