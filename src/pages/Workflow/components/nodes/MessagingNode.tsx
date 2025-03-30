
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { MessageSquare } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export function MessagingNode({ data, selected }) {
  const messageType = data.messageType || 'sms';
  const bgColor = '#f0f9ff'; // Light blue background
  const borderColor = '#3b82f6'; // Blue border
  
  const getIcon = () => {
    switch (messageType) {
      case 'email':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      case 'sms':
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };
  
  return (
    <div 
      className="bg-white rounded-md shadow-md p-2 border-2"
      style={{ 
        borderColor,
        width: data.width || 200,
        minHeight: '80px'
      }}
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400" />
      
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-100 rounded-md p-1">
            {getIcon()}
          </div>
          <div className="text-sm font-medium">{data.label || messageType.toUpperCase() + ' Message'}</div>
          <Badge variant="outline" className="text-xs">
            {messageType}
          </Badge>
        </div>
        
        {data.description && (
          <div className="text-xs text-gray-600 mb-2">{data.description}</div>
        )}
        
        {data.template && (
          <div className="text-xs">
            <div className="font-medium text-blue-600 flex items-center">
              <span className="h-2 w-2 bg-blue-400 mr-1.5 rounded-full"></span>
              Template:
            </div>
            <div className="pl-3.5 text-gray-500 mt-0.5">
              {data.template}
            </div>
          </div>
        )}
        
        {data.recipients && (
          <div className="text-xs mt-1">
            <div className="font-medium text-gray-600 flex items-center">
              <span className="h-2 w-2 bg-gray-400 mr-1.5 rounded-full"></span>
              Recipients:
            </div>
            <div className="pl-3.5 text-gray-500 mt-0.5">
              {typeof data.recipients === 'string' ? data.recipients : 'Multiple recipients'}
            </div>
          </div>
        )}
      </div>
      
      <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
    </div>
  );
}

export default memo(MessagingNode);
