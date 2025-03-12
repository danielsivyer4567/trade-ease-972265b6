
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function CustomNode({ data }) {
  const bgColor = data.color ? `${data.color}25` : '#f0f9ff'; // Default light blue with 25% opacity
  const borderColor = data.color || '#3b82f6'; // Default blue

  return (
    <div 
      className="bg-white rounded-md shadow-md p-2 w-40 border-2"
      style={{ borderColor }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      <div className="flex items-center">
        <div 
          className="w-6 h-6 rounded-full flex items-center justify-center mr-2"
          style={{ backgroundColor: bgColor }}
        >
          <span className="text-xs">{data.icon || '⚙️'}</span>
        </div>
        <div>
          <div className="font-semibold text-xs">Custom</div>
          <div className="text-xs text-gray-500">{data.label || 'Node'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}
