import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Users } from 'lucide-react';

export function CustomerNode({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Users className="h-5 w-5 text-blue-500" />
        <div className="text-sm font-medium">{data.label || 'Customer'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
