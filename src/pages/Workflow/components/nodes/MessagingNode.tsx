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

function MessagingNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: workflowDarkMode ? '#ff56aa' : '#555' }}
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
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        >
          {nodeData.label || 'Message'}
        </div>
        
        {nodeData.description && (
          <div 
            className="text-center text-xs mt-1"
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            {nodeData.description}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: workflowDarkMode ? '#ff56aa' : '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default memo(MessagingNode); 