import React, { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap, CheckSquare, XSquare } from 'lucide-react';

export function AutomationNode({ data }) {
  const [status, setStatus] = useState(data.status || 'pending');
  
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  const getStatusColor = () => {
    if (status === 'success') {
      return isDarkMode ? gold : '#22c55e';
    } else if (status === 'error') {
      return isDarkMode ? '#CF6679' : '#ef4444';
    } else {
      return isDarkMode ? '#8e7a3c' : '#f59e0b';
    }
  };

  const getStatusIcon = () => {
    if (status === 'success') {
      return <CheckSquare className="h-4 w-4" style={{ color: isDarkMode ? gold : '#22c55e' }} />;
    } else if (status === 'error') {
      return <XSquare className="h-4 w-4" style={{ color: isDarkMode ? '#CF6679' : '#ef4444' }} />;
    } else {
      return null;
    }
  };

  const bgColor = data.color ? `${data.color}25` : '#f0f9ff'; // Light blue background with 25% opacity
  const borderColor = data.color || '#3b82f6'; // Default blue border
  
  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#fcd34d',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#f59e0b' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fef3c7' }}>
          <Zap className="h-5 w-5" style={{ color: isDarkMode ? gold : '#d97706' }} />
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm flex items-center" style={{ color: isDarkMode ? darkText : '#111827' }}>
            {data.label || 'Automation'}
            {getStatusIcon() && <span className="ml-1">{getStatusIcon()}</span>}
          </div>
          {data.description && (
            <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>
              {data.description}
            </div>
          )}
          {data.automationId && (
            <div className="text-xs mt-1" style={{ color: getStatusColor() }}>
              {status}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#f59e0b' }} />
    </div>
  );
}

export default AutomationNode;
