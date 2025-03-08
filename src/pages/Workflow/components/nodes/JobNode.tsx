
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function JobNode({ data }) {
  return (
    <div className="bg-white border-2 border-green-300 rounded-md shadow-md p-2 w-40">
      <Handle type="target" position={Position.Top} className="!bg-green-500" />
      <div className="flex items-center">
        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
          <span className="text-green-600 text-xs">🔧</span>
        </div>
        <div>
          <div className="font-semibold text-xs">Job</div>
          <div className="text-xs text-gray-500">{data.label}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-green-500" />
    </div>
  );
}
