
import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function VisionNode({ data }) {
  return (
    <div className="bg-white border-2 border-purple-400 rounded-md shadow-md p-2 w-40">
      <Handle type="target" position={Position.Top} className="!bg-purple-500" />
      <div className="flex items-center">
        <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
          <span className="text-purple-600 text-xs">🔍</span>
        </div>
        <div>
          <div className="font-semibold text-xs">Vision Analysis</div>
          <div className="text-xs text-gray-500">{data.label || 'Extract Data'}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-purple-500" />
    </div>
  );
}
