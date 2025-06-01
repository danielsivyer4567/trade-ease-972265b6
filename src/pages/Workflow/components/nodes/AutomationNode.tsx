import React, { memo, ReactNode } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DARK_BG, DARK_TEXT } from '@/contexts/WorkflowDarkModeContext';

interface NodeData {
  workflowDarkMode?: boolean;
  label?: string;
  description?: string;
  icon?: ReactNode;
  automationId?: string;
  title?: string;
  [key: string]: any;
}

function AutomationNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: workflowDarkMode ? '#c04aff' : '#555' }}
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
          {nodeData.title || nodeData.label || 'Automation'}
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

        {nodeData.automationId && (
          <div 
            className="text-center text-xs mt-1 p-1 rounded"
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(192, 74, 255, 0.2)',
              fontSize: '0.7rem'
            }}
          >
            ID: {nodeData.automationId.substring(0, 8)}
          </div>
        )}
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: workflowDarkMode ? '#c04aff' : '#555' }}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default memo(AutomationNode); 