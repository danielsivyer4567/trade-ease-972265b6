import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Eye } from 'lucide-react';

export function VisionNode({ data }) {
  return (
    <div className="bg-white border-2 border-purple-400 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="flex items-center">
        <div className="w-9 h-9 bg-purple-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
          <Eye className="h-5 w-5 text-purple-600" />
        </div>
        <div>
          <div className="font-bold text-sm text-gray-900">{data.label || 'Vision Analysis'}</div>
          {data.subtitle && <div className="text-xs text-gray-500">{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
}
