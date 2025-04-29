import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BaseNodeProps {
  data: any;
  id: string;
  selected: boolean;
  type: string;
  color?: string;
  icon?: React.ReactNode;
}

export function BaseNode({ data, id, selected, type, color = '#3b82f6', icon }: BaseNodeProps) {
  const bgColor = data.color ? `${data.color}25` : `${color}25`;
  const borderColor = data.color || color;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      document.dispatchEvent(
        new CustomEvent('delete-node', { detail: { id } })
      );
    }
  };

  return (
    <>
      {selected && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-1 rounded shadow-md border border-gray-200 z-20">
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div
        className="bg-white rounded-md shadow-md p-2 border-2 relative"
        style={{ 
          borderColor,
          minWidth: '160px',
          minHeight: '60px'
        }}
      >
        <Handle type="target" position={Position.Top} className="!bg-gray-400" />
        <div className="flex items-start">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            {icon || <span className="text-xs">⚙️</span>}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">
              {data.label || type}
            </div>
            {data.title && (
              <div className="text-xs text-gray-500 mt-1">
                {data.title}
              </div>
            )}
            {data.assignedRole && (
              <div className="text-xs text-blue-500 mt-1">
                Role: {data.assignedRole}
              </div>
            )}
            {data.description && (
              <div className="text-xs text-gray-600 mt-1">
                {data.description}
              </div>
            )}
          </div>
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
      </div>
    </>
  );
} 