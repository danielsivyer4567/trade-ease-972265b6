import React from 'react';
import { Users, Briefcase, CheckSquare, DollarSign, Eye } from 'lucide-react';

export interface DefaultNodesProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string, data?: any) => void;
}

export function DefaultNodes({ onDragStart }: DefaultNodesProps) {
  const defaultNodes = [
    { type: 'customerNode', label: 'Customer', icon: <Users className="h-4 w-4 text-blue-500" /> },
    { type: 'jobNode', label: 'Job', icon: <Briefcase className="h-4 w-4 text-green-500" /> },
    { type: 'taskNode', label: 'Task', icon: <CheckSquare className="h-4 w-4 text-purple-500" /> },
    { type: 'quoteNode', label: 'Quote', icon: <DollarSign className="h-4 w-4 text-yellow-500" /> },
    { type: 'visionNode', label: 'Vision Analysis', icon: <Eye className="h-4 w-4 text-indigo-500" /> }
  ];

  return (
    <div className="space-y-2">
      {defaultNodes.map((node) => (
        <div
          key={node.type}
          className="flex items-center gap-2 p-2 rounded-md border border-gray-200 bg-white cursor-move hover:bg-gray-50 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, node.type)}
        >
          {node.icon}
          <span className="text-sm">{node.label}</span>
        </div>
      ))}
    </div>
  );
}
