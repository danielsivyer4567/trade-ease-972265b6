import React, { memo, ReactNode, useMemo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DARK_BG, DARK_TEXT } from '@/contexts/WorkflowDarkModeContext';
import { User } from 'lucide-react';

interface NodeData {
  workflowDarkMode?: boolean;
  label?: string;
  description?: string;
  icon?: ReactNode;
  iconComponent?: ReactNode;
  [key: string]: any;
}

function CustomerNode({ data, isConnectable }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  // Memoize the node content to prevent unnecessary re-renders
  const nodeContent = useMemo(() => {
    return (
      <div className="node-content">
        <div className="flex items-center justify-center mb-2">
          {nodeData.icon || nodeData.iconComponent || <User className="h-5 w-5 text-white" />}
        </div>
        
        <div 
          className="text-center font-medium"
          style={{ 
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        >
          {nodeData.label || 'Customer'}
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
    );
  }, [nodeData.icon, nodeData.iconComponent, nodeData.label, nodeData.description]);
  
  // Pre-compute styles for handles to ensure they're stable
  const handleStyle = useMemo(() => ({
    background: workflowDarkMode ? '#ff56e1' : '#555',
    border: '2px solid white',
  }), [workflowDarkMode]);
  
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        style={handleStyle}
        isConnectable={isConnectable}
      />
      
      {nodeContent}
      
      <Handle
        type="source"
        position={Position.Right}
        style={handleStyle}
        isConnectable={isConnectable}
      />
    </>
  );
}

// Use a more effective comparison function for memo
export default memo(CustomerNode, (prevProps, nextProps) => {
  const prevData = prevProps.data as NodeData;
  const nextData = nextProps.data as NodeData;
  
  // Only re-render if these specific properties change
  return (
    prevData.label === nextData.label &&
    prevData.description === nextData.description &&
    prevData.workflowDarkMode === nextData.workflowDarkMode &&
    prevProps.isConnectable === nextProps.isConnectable
  );
});
