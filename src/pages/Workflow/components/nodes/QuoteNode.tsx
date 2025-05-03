import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { FileText } from 'lucide-react';

export function QuoteNode({ data }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#f9a8d4',
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: isDarkMode ? darkBg : '#fce7f3' }}>
          <FileText className="h-5 w-5" style={{ color: isDarkMode ? gold : '#db2777' }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>{data.label || 'Quote'}</div>
          {data.subtitle && <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>{data.subtitle}</div>}
        </div>
      </div>
      {data.extractedAmount && (
        <div className="mt-1 p-1 rounded text-xs" style={{ 
          backgroundColor: isDarkMode ? 'rgba(191, 161, 74, 0.2)' : '#ecfdf5',
          color: isDarkMode ? gold : '#047857'
        }}>
          ${data.extractedAmount}
        </div>
      )}
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#db2777' }} />
    </div>
  );
}
