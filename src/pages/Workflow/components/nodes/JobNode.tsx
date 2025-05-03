import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Briefcase } from 'lucide-react';

export function JobNode({ data }) {
  return (
    <div className="bg-white border-2 border-green-300 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl">
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center">
        <div className="w-9 h-9 bg-green-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
          <Briefcase className="h-5 w-5 text-green-600" />
        </div>
        <div>
          <div className="font-bold text-sm text-gray-900">{data.label || 'Job'}</div>
          {data.subtitle && <div className="text-xs text-gray-500">{data.subtitle}</div>}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
}
