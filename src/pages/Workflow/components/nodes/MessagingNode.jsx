import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';

export default function MessagingNode({ data }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div 
      className="border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl"
      style={{
        backgroundColor: isDarkMode ? darkBg : 'white',
        borderColor: isDarkMode ? gold : '#8b5cf6',
        color: isDarkMode ? darkText : 'inherit'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#8b5cf6' }} />
      
      <div className="flex items-center">
        <div 
          className="w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm"
          style={{ backgroundColor: isDarkMode ? darkBg : '#ede9fe' }}
        >
          {data.icon || <MessageSquare className="h-5 w-5" style={{ color: isDarkMode ? gold : '#8b5cf6' }} />}
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>
            {data.label || 'Message'}
          </div>
          {data.subtitle && (
            <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#8b5cf6' }} />
    </div>
  );
} 