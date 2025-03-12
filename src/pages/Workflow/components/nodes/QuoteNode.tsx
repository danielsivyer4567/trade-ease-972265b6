
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function QuoteNode({ data }) {
  return (
    <div className="bg-white border-2 border-yellow-300 rounded-md shadow-md p-2 w-40">
      <Handle type="target" position={Position.Top} className="!bg-yellow-500" />
      <div className="flex items-center">
        <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
          <span className="text-yellow-600 text-xs">💰</span>
        </div>
        <div>
          <div className="font-semibold text-xs">Quote</div>
          <div className="text-xs text-gray-500">{data.label}</div>
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
