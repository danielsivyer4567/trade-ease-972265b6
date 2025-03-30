
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Workflow, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export function AutomationNode({ data, selected }) {
  const bgColor = data.color ? `${data.color}25` : '#f0f9ff'; // Light blue background with 25% opacity
  const borderColor = data.color || '#3b82f6'; // Default blue border
  
  return (
    <div 
      className="bg-white rounded-md shadow-md p-2 border-2"
      style={{ 
        borderColor,
        width: data.width || 200,
        minHeight: '80px'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 rounded-md p-1">
            <Workflow className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-sm font-medium">{data.label || 'Automation'}</div>
          {data.premium && (
            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">
              <span className="mr-1">✨</span> Pro
            </Badge>
          )}
        </div>
        
        {data.description && (
          <div className="text-xs text-gray-600 mb-2">{data.description}</div>
        )}
        
        {data.triggers && data.triggers.length > 0 && (
          <div className="text-xs">
            <div className="font-medium text-amber-600 flex items-center">
              <span className="h-2 w-2 bg-amber-400 mr-1.5 rounded-full"></span>
              Triggers:
            </div>
            <div className="pl-3.5 text-gray-500 mt-0.5">
              {data.triggers[0]}
              {data.triggers.length > 1 && '...'}
            </div>
          </div>
        )}
        
        {data.actions && data.actions.length > 0 && (
          <div className="text-xs mt-1">
            <div className="font-medium text-blue-600 flex items-center">
              <span className="h-2 w-2 bg-blue-400 mr-1.5 rounded-full"></span>
              Actions:
            </div>
            <div className="pl-3.5 text-gray-500 mt-0.5">
              {data.actions[0]}
              {data.actions.length > 1 && '...'}
            </div>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

export default memo(AutomationNode);
