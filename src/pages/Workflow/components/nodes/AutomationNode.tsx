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
  
  // Memoize the node content to prevent unnecessary re-renders
  const nodeContent = useMemo(() => {
    console.log('DEBUG: AutomationNode content memo recalculated', { id });
    
    return (
      <div 
        className="node-content border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl"
        style={{
          backgroundColor: workflowDarkMode ? DARK_BG : 'white',
          borderColor: workflowDarkMode ? DARK_GOLD : '#c04aff',
          color: workflowDarkMode ? DARK_TEXT : '#111827'
        }}
      >
        <div className="flex items-center">
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm"
            style={{ 
              backgroundColor: workflowDarkMode ? DARK_BG : '#f4f4f5',
              border: `2px solid ${workflowDarkMode ? DARK_GOLD : '#c04aff'}`
            }}
          >
            {nodeData.icon || nodeData.iconComponent || <Zap className="h-5 w-5" style={{ color: workflowDarkMode ? DARK_GOLD : '#c04aff' }} />}
          </div>
          <div>
            <div 
              className="font-bold text-sm"
              style={{ color: workflowDarkMode ? DARK_TEXT : '#111827' }}
            >
              {displayLabel}
            </div>
            <div 
              className="text-xs"
              style={{ color: workflowDarkMode ? 'rgba(255, 224, 130, 0.9)' : '#6b7280' }}
            >
              {displayDescription}
            </div>
          </div>
        </div>
      </div>
    );
  }, [nodeData.icon, nodeData.iconComponent, displayLabel, displayDescription, workflowDarkMode]);
  
  // Pre-compute styles for handles to ensure they're stable
  const handleStyle = useMemo(() => ({
    background: workflowDarkMode ? DARK_GOLD : '#c04aff',
    border: '2px solid white',
    width: 12,
    height: 12
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