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
  
  // Proper styling matching other workflow nodes
  return (
    <div className="node-content" style={{
      width: '200px',
      minHeight: '100px',
      background: workflowDarkMode 
        ? 'linear-gradient(135deg, rgba(192, 74, 255, 0.8), rgba(126, 74, 255, 0.8))'
        : 'linear-gradient(135deg, #c04aff, #7e4aff)',
      color: '#ffffff',
      padding: '16px',
      border: workflowDarkMode 
        ? '1px solid rgba(192, 74, 255, 0.5)'
        : '1px solid #c04aff',
      borderRadius: '8px',
      boxShadow: workflowDarkMode 
        ? '0 0 20px rgba(192, 74, 255, 0.3)'
        : '0 4px 12px rgba(192, 74, 255, 0.3)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      position: 'relative',
      backdropFilter: 'blur(2px)',
      fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
    }}>
      {/* Icon */}
      <div style={{ marginBottom: '8px' }}>
        {nodeData.iconComponent || nodeData.icon || <Zap className="h-6 w-6 text-white" />}
      </div>
      
      {/* Label */}
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        marginBottom: '4px',
        textShadow: '0 1px 2px rgba(0,0,0,0.3)'
      }}>
        {displayLabel}
      </div>
      
      {/* Description */}
      <div style={{
        fontSize: '11px',
        opacity: 0.9,
        textShadow: '0 1px 2px rgba(0,0,0,0.3)',
        lineHeight: '1.3'
      }}>
        {displayDescription}
      </div>
      
      <Handle
        type="target"
        position={Position.Left}
        style={{
          background: workflowDarkMode ? DARK_GOLD : 'rgba(230, 100, 255, 0.7)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          width: 12,
          height: 12,
          left: -6
        }}
        isConnectable={isConnectable}
      />
      
      <Handle
        type="source"
        position={Position.Right}
        style={{
          background: workflowDarkMode ? DARK_GOLD : 'rgba(230, 100, 255, 0.7)',
          border: '2px solid rgba(255, 255, 255, 0.8)',
          width: 12,
          height: 12,
          right: -6
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