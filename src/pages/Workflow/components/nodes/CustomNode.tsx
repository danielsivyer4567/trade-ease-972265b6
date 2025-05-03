import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash, Edit, GripVertical, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";

export function CustomNode({ data, id, selected }) {
  const [isClicked, setIsClicked] = useState(false);
  const [width, setWidth] = useState(data.width || 160);
  const [height, setHeight] = useState(data.height || 80);
  const [expanded, setExpanded] = useState(false);
  
  // Check if we're in dark mode
  const isDarkMode = data.workflowDarkMode;
  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  const bgColor = data.color ? `${data.color}25` : '#f0f9ff';
  const borderColor = data.color || '#3b82f6';
  
  // Reset click state when selection changes
  useEffect(() => {
    if (!selected) {
      setIsClicked(false);
    }
  }, [selected]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      document.dispatchEvent(
        new CustomEvent('delete-node', { detail: { id } })
      );
    }
  };

  // Default data
  const title = data.title || 'Custom Node';
  const description = data.description || '';
  const message = data.message || '';

  return (
    <>
      {isClicked && (
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
        className={`border-2 rounded-xl shadow-md p-3 transition-transform duration-150`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#cbd5e1',
          color: isDarkMode ? darkText : 'inherit',
          width: expanded ? '280px' : '180px',
        }}
      >
        <Handle type="target" position={Position.Top} style={{ backgroundColor: isDarkMode ? gold : '#64748b' }} />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center mr-2`}
              style={{ backgroundColor: isDarkMode ? darkBg : '#f1f5f9' }}
            >
              <Settings className="h-4 w-4" style={{ color: isDarkMode ? gold : '#64748b' }} />
            </div>
            <div className="font-semibold text-sm" style={{ color: isDarkMode ? darkText : '#334155' }}>
              {title}
            </div>
          </div>
          
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="p-1 rounded"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(191, 161, 74, 0.1)' : 'rgba(100, 116, 139, 0.1)',
              color: isDarkMode ? gold : '#64748b'
            }}
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
        
        {description && (
          <div className="text-xs mb-2" style={{ color: isDarkMode ? '#8e7a3c' : '#64748b' }}>
            {description}
          </div>
        )}
        
        {expanded && message && (
          <div 
            className="text-xs mt-2 p-2 rounded"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(191, 161, 74, 0.1)' : '#f1f5f9',
              color: isDarkMode ? darkText : '#334155' 
            }}
          >
            {message}
          </div>
        )}
        
        <Handle type="source" position={Position.Bottom} style={{ backgroundColor: isDarkMode ? gold : '#64748b' }} />
      </div>
    </>
  );
}
