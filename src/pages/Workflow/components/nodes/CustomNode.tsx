import React, { memo, ReactNode } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DARK_BG, DARK_TEXT } from '@/contexts/WorkflowDarkModeContext';

interface NodeData {
  workflowDarkMode?: boolean;
  label?: string;
  description?: string;
  icon?: ReactNode;
  [key: string]: any;
}

function CustomNode({ data, isConnectable, selected }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: workflowDarkMode ? '#a595ff' : '#555' }}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      
      <div className="node-content">
        {nodeData.icon && (
          <div className="flex items-center justify-center mb-2">
            {nodeData.icon}
          </div>
        )}
        
        <div 
          className="text-center font-medium"
          style={{ 
            color: workflowDarkMode ? DARK_TEXT : '#333',
            fontSize: '0.9rem'
          }}
        >
          {nodeData.label || 'Custom Node'}
        </div>
        
        {nodeData.description && (
          <div 
            className="text-center text-xs mt-1"
            style={{ 
              color: workflowDarkMode ? 'rgba(248, 248, 248, 0.7)' : '#666',
            }}
          >
            {nodeData.description}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: workflowDarkMode ? '#a595ff' : '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default memo(CustomNode); 