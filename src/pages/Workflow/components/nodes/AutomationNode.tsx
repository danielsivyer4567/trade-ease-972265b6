import React, { memo, ReactNode } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DARK_BG, DARK_TEXT } from '@/contexts/WorkflowDarkModeContext';
import { Zap } from 'lucide-react';

interface NodeData {
  workflowDarkMode?: boolean;
  label?: string;
  title?: string;
  description?: string;
  automationId?: string;
  icon?: ReactNode;
  iconComponent?: ReactNode;
  [key: string]: any;
}

function AutomationNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  const displayTitle = nodeData.title || nodeData.label || `Automation ${nodeData.automationId || ''}`;
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: workflowDarkMode ? '#c04aff' : '#555' }}
        isConnectable={isConnectable}
      />
      
      <div className="node-content">
        <div className="flex items-center justify-center mb-2">
          {nodeData.icon || nodeData.iconComponent || <Zap className="h-5 w-5 text-white" />}
        </div>
        
        <div 
          className="text-center font-medium"
          style={{ 
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        >
          {displayTitle}
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
        
        {nodeData.automationId && !nodeData.description && (
          <div 
            className="text-center text-xs mt-1"
            style={{ 
              color: 'rgba(255, 255, 255, 0.8)',
            }}
          >
            ID: {nodeData.automationId}
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