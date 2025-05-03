import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare, Mail, MessageCircle } from 'lucide-react';

export function MessagingNode({ data, type = "messagingNode" }) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  // Determine icon based on type
  let Icon = MessageSquare;
  let color = isDarkMode ? gold : '#2563eb';
  let bgColor = isDarkMode ? darkBg : '#dbeafe';
  let borderColor = isDarkMode ? gold : '#93c5fd';

  if (type === 'emailNode' || data.messageType === 'email') {
    Icon = Mail;
    color = isDarkMode ? gold : '#2563eb';
    bgColor = isDarkMode ? darkBg : '#dbeafe';
    borderColor = isDarkMode ? gold : '#93c5fd';
  } else if (type === 'whatsappNode' || data.messageType === 'whatsapp') {
    Icon = MessageCircle;
    color = isDarkMode ? gold : '#16a34a';
    bgColor = isDarkMode ? darkBg : '#dcfce7';
    borderColor = isDarkMode ? gold : '#86efac';
  }

  return (
    <div className={`border-2 rounded-xl shadow-md p-3 w-44 transition-transform duration-150 hover:scale-105 hover:shadow-xl`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: borderColor,
          color: isDarkMode ? darkText : 'inherit'
        }}>
      <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : color }} />
      <div className="flex items-center">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 shadow-sm`}
             style={{ backgroundColor: bgColor }}>
          <Icon className="h-5 w-5" style={{ color: color }} />
        </div>
        <div>
          <div className="font-bold text-sm" style={{ color: isDarkMode ? darkText : '#111827' }}>
            {data.label || data.messageType || 'Message'}
          </div>
          {data.subtitle && (
            <div className="text-xs" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : color }} />
    </div>
  );
}
