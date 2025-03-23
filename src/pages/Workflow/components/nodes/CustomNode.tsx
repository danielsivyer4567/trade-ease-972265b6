import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box } from 'lucide-react';

export function CustomNode({ data }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center gap-2">
        <Box className="h-5 w-5" style={{ color: data.color || '#6B7280' }} />
        <div className="text-sm font-medium">{data.label || 'Custom Node'}</div>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}
