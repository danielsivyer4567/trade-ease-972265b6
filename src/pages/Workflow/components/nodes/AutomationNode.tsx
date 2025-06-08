import React, { memo, ReactNode, useMemo, useEffect } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { DARK_BG, DARK_TEXT, DARK_GOLD } from '@/contexts/WorkflowDarkModeContext';
import { Zap } from 'lucide-react';

interface NodeData {
  workflowDarkMode?: boolean;
  label?: string;
  description?: string;
  icon?: ReactNode;
  iconComponent?: ReactNode;
  automationId?: string | number;
  title?: string;
  [key: string]: any;
}

function AutomationNode({ data, isConnectable, id }: NodeProps) {
  const nodeData = data as NodeData;
  const workflowDarkMode = nodeData?.workflowDarkMode || false;
  
  // Get node label from either title, label, or default
  const displayLabel = nodeData.title || nodeData.label || 'Automation';
  const displayDescription = nodeData.description || `Automation ID: ${nodeData.automationId || 'Unknown'}`;
  
  // Debug logging on mount and updates
  useEffect(() => {
    console.log('DEBUG: AutomationNode rendered:', { 
      id, 
      displayLabel, 
      displayDescription,
      workflowDarkMode,
      data: nodeData
    });
  }, [id, displayLabel, displayDescription, workflowDarkMode, nodeData]);
  
  // Fixed style for debugging
  return (
    <div style={{
      position: 'absolute',
      width: '200px',
      height: '100px',
      backgroundColor: 'purple',
      color: 'white',
      padding: '10px',
      border: '3px solid yellow',
      borderRadius: '8px',
      zIndex: 1000,
      boxShadow: '0 0 10px rgba(0,0,0,0.5)'
    }}>
      <div>ID: {id}</div>
      <div>Label: {displayLabel}</div>
      <div>Description: {displayDescription}</div>
      
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: 'yellow',
          width: 15,
          height: 15
        }}
        isConnectable={isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: 'yellow',
          width: 15,
          height: 15
        }}
        isConnectable={isConnectable}
      />
    </div>
  );
}

// Use a more effective comparison function for memo
export default memo(AutomationNode, (prevProps, nextProps) => {
  const prevData = prevProps.data as NodeData;
  const nextData = nextProps.data as NodeData;
  
  const areEqual = (
    prevData.label === nextData.label &&
    prevData.title === nextData.title &&
    prevData.description === nextData.description &&
    prevData.automationId === nextData.automationId &&
    prevData.workflowDarkMode === nextData.workflowDarkMode &&
    prevProps.isConnectable === nextProps.isConnectable
  );
  
  if (!areEqual) {
    console.log('DEBUG: AutomationNode will re-render due to props change', {
      prevData,
      nextData,
      changes: {
        label: prevData.label !== nextData.label,
        title: prevData.title !== nextData.title,
        description: prevData.description !== nextData.description,
        automationId: prevData.automationId !== nextData.automationId,
        workflowDarkMode: prevData.workflowDarkMode !== nextData.workflowDarkMode,
        isConnectable: prevProps.isConnectable !== nextProps.isConnectable
      }
    });
  }
  
  return areEqual;
}); 