import React from 'react';
import { Handle, Position } from '@xyflow/react';

export function AutomationNode({ data }) {
  return (
    <div className="min-w-[150px] border rounded p-3">
      <div className="text-sm font-medium">{data.label}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
} 