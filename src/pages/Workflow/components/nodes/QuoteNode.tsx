import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { DollarSign } from 'lucide-react';

export function QuoteNode({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <DollarSign className="h-5 w-5 text-yellow-500" />
        <div className="text-sm font-medium">{data.label || 'Quote'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
