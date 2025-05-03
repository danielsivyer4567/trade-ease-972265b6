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
  const darkSecondary = '#211c15';

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
        className={`border-2 rounded-xl shadow-md p-3 transition-transform duration-150 ${selected ? 'ring-2 ring-offset-1' : ''}`}
        style={{
          backgroundColor: isDarkMode ? darkBg : 'white',
          borderColor: isDarkMode ? gold : '#cbd5e1',
          color: isDarkMode ? darkText : 'inherit',
          width: expanded ? '280px' : '200px',
          boxShadow: isDarkMode 
            ? (selected ? '0 0 0 2px ' + gold + ', 0 4px 20px rgba(0, 0, 0, 0.7)' : '0 4px 12px rgba(0, 0, 0, 0.5)') 
            : (selected ? '0 0 0 2px #3b82f6, 0 4px 8px rgba(59, 130, 246, 0.2)' : '0 2px 5px rgba(0, 0, 0, 0.1)'),
          borderWidth: selected ? '2px' : '1px',
          transform: selected ? 'scale(1.02)' : 'scale(1)'
        }}
      >
        <Handle 
          type="target" 
          position={Position.Top} 
          style={{ 
            backgroundColor: isDarkMode ? gold : '#64748b',
            width: '10px',
            height: '10px',
            border: isDarkMode ? `2px solid ${gold}` : '2px solid #64748b',
            top: '-6px'
          }} 
        />
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3`}
              style={{ 
                backgroundColor: isDarkMode ? darkSecondary : '#f1f5f9',
                border: isDarkMode ? `1px solid ${gold}` : '1px solid #e2e8f0'
              }}
            >
              <Settings className="h-5 w-5" style={{ color: isDarkMode ? gold : '#64748b' }} />
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
          <div 
            className="text-xs mb-2 px-2 py-1 rounded" 
            style={{ 
              color: isDarkMode ? '#8e7a3c' : '#64748b',
              backgroundColor: isDarkMode ? 'rgba(191, 161, 74, 0.07)' : 'rgba(241, 245, 249, 0.7)'
            }}
          >
            {description}
          </div>
        )}
        
        {expanded && message && (
          <div 
            className="text-xs mt-3 p-2 rounded"
            style={{ 
              backgroundColor: isDarkMode ? 'rgba(191, 161, 74, 0.1)' : '#f1f5f9',
              color: isDarkMode ? darkText : '#334155',
              border: isDarkMode ? `1px solid ${gold}` : '1px solid #e2e8f0',
              opacity: 0.9
            }}
          >
            {message}
          </div>
        )}
        
        <div className="mt-2 border-t pt-2" style={{ borderColor: isDarkMode ? `rgba(191, 161, 74, 0.2)` : '#f1f5f9' }}>
          <div className="text-xs flex items-center" style={{ color: isDarkMode ? `rgba(191, 161, 74, 0.6)` : '#94a3b8' }}>
            <GripVertical className="h-3 w-3 mr-1" />
            <span>{expanded ? 'Drag to move' : 'Item'}</span>
          </div>
        </div>
        
        <Handle 
          type="source" 
          position={Position.Bottom} 
          style={{ 
            backgroundColor: isDarkMode ? gold : '#64748b',
            width: '10px',
            height: '10px',
            border: isDarkMode ? `2px solid ${gold}` : '2px solid #64748b',
            bottom: '-6px'
          }}
        />
      </div>
    </>
  );
}
