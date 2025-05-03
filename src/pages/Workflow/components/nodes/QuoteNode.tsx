import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { DollarSign } from 'lucide-react';

export function QuoteNode({ data }) {
  return (
    <div className="bg-white border-2 border-yellow-300 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl">
      <Handle type="target" position={Position.Top} className="!bg-yellow-500" />
      <div className="flex items-center">
        <div className="w-9 h-9 bg-yellow-100 rounded-full flex items-center justify-center mr-3 shadow-sm">
          <DollarSign className="h-5 w-5 text-yellow-600" />
        </div>
        <div>
          <div className="font-bold text-sm text-gray-900">{data.label || 'Quote'}</div>
          {data.subtitle && <div className="text-xs text-gray-500">{data.subtitle}</div>}
        </div>
      </div>
      {data.extractedAmount && (
        <div className="mt-1 p-1 bg-green-50 rounded text-xs text-green-700">
          ${data.extractedAmount}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-yellow-500" />
    </div>
  );
}
