import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface BaseNodeProps {
  data: any;
  id: string;
  selected: boolean;
  type: string;
  color?: string;
  icon?: React.ReactNode;
}

export function BaseNode({ data, id, selected, type, color = '#3b82f6', icon }: BaseNodeProps) {
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  
  // Debugging - log when a node is rendered to see if dark mode flag is present
  console.log(`BaseNode rendering for ${id} of type ${type}:`, {
    isDarkMode,
    workflowDarkMode: data.workflowDarkMode,
    data
  });
  
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';
  
  const bgColor = isDarkMode ? darkBg : (data.color ? `${data.color}25` : `${color}25`);
  const borderColor = isDarkMode ? gold : (data.color || color);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      document.dispatchEvent(
        new CustomEvent('delete-node', { detail: { id } })
      );
    }
  };

  return (
    <>
      {selected && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 flex gap-2 z-20"
             style={{ 
               backgroundColor: isDarkMode ? darkBg : 'white',
               borderColor: isDarkMode ? gold : '#e5e7eb',
               color: isDarkMode ? darkText : 'inherit',
               borderWidth: '1px',
               borderStyle: 'solid',
               borderRadius: '0.375rem',
               padding: '0.25rem',
               boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
             }}>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleDelete}
            style={{ 
              backgroundColor: isDarkMode ? darkBg : 'white',
              color: isDarkMode ? gold : 'inherit',
              borderColor: isDarkMode ? gold : 'inherit'
            }}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
      
      <div
        className="rounded-md shadow-md p-2 border-2 relative"
        style={{ 
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor,
          minWidth: '160px',
          minHeight: '60px',
          color: isDarkMode ? darkText : 'inherit'
        }}
      >
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ backgroundColor: isDarkMode ? gold : '#9ca3af' }} 
        />
        <div className="flex items-start">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
            style={{ backgroundColor: isDarkMode ? darkBg : bgColor }}
          >
            {icon || <span className="text-xs" style={{ color: isDarkMode ? gold : 'inherit' }}>⚙️</span>}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium" style={{ color: isDarkMode ? darkText : '#374151' }}>
              {data.label || type}
            </div>
            {data.title && (
              <div className="text-xs mt-1" style={{ color: isDarkMode ? '#8e7a3c' : '#6b7280' }}>
                {data.title}
              </div>
            )}
            {data.assignedRole && (
              <div className="text-xs mt-1" style={{ color: isDarkMode ? gold : '#3b82f6' }}>
                Role: {data.assignedRole}
              </div>
            )}
            {data.description && (
              <div className="text-xs mt-1" style={{ color: isDarkMode ? '#8e7a3c' : '#4b5563' }}>
                {data.description}
              </div>
            )}
          </div>
        </div>
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ backgroundColor: isDarkMode ? gold : '#9ca3af' }} 
        />
      </div>
    </>
  );
} 