
import React, { useState, useEffect } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Trash, Edit, GripVertical } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

export function CustomNode({ data, id, selected }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nodeLabel, setNodeLabel] = useState(data.label || '');
  const [nodeIcon, setNodeIcon] = useState(data.icon || '⚙️');
  const [isClicked, setIsClicked] = useState(false);
  const [width, setWidth] = useState(data.width || 160); // Default width: 160px (40 * 4)
  const [height, setHeight] = useState(data.height || 80); // Default height
  
  const bgColor = data.color ? `${data.color}25` : '#f0f9ff'; // Default light blue with 25% opacity
  const borderColor = data.color || '#3b82f6'; // Default blue
  
  const iconOptions = ['👤', '🔧', '💰', '📋', '🏠', '📱', '🚗', '⚙️', '📝', '🔔'];
  
  // Reset click state when selection changes
  useEffect(() => {
    if (selected) {
      setIsClicked(true);
    }
  }, [selected]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      document.dispatchEvent(
        new CustomEvent('delete-node', { detail: { id } })
      );
    }
  };
  
  const handleSave = () => {
    document.dispatchEvent(
      new CustomEvent('update-node', { 
        detail: { 
          id,
          data: {
            ...data,
            label: nodeLabel,
            icon: nodeIcon,
            width,
            height
          }
        }
      })
    );
    setIsEditing(false);
  };

  const handleNodeClick = (e) => {
    // Prevent click event from propagating to the canvas
    e.stopPropagation();
    setIsClicked(true);
  };

  return (
    <>
      {(selected || isClicked) && (
        <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white p-1 rounded shadow-md border border-gray-200 z-20">
          <Popover open={isEditing} onOpenChange={setIsEditing}>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Node Label</Label>
                  <Input 
                    value={nodeLabel} 
                    onChange={(e) => setNodeLabel(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="Enter label text"
                  />
                </div>
                <div>
                  <Label className="text-xs">Icon</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNodeIcon(icon)}
                        className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 ${nodeIcon === icon ? 'bg-gray-200' : ''}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="text-xs flex justify-between">
                    <span>Width: {width}px</span>
                  </Label>
                  <Slider
                    value={[width]}
                    min={120}
                    max={400}
                    step={20}
                    onValueChange={(values) => setWidth(values[0])}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs flex justify-between">
                    <span>Height: {height}px</span>
                  </Label>
                  <Slider
                    value={[height]}
                    min={60}
                    max={300}
                    step={20}
                    onValueChange={(values) => setHeight(values[0])}
                    className="mt-2"
                  />
                </div>
                <Button 
                  className="w-full h-8 text-xs" 
                  size="sm" 
                  onClick={handleSave}
                >
                  Save Changes
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="h-8 w-8 p-0" onClick={handleDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      )}
      <div 
        className="bg-white rounded-md shadow-md p-2 border-2 relative"
        style={{ 
          borderColor,
          width: `${width}px`,
          height: `${height}px`,
          minHeight: '60px',
          overflow: 'auto'
        }}
        onClick={handleNodeClick}
      >
        <Handle type="target" position={Position.Top} className="!bg-gray-400" />
        <div className="flex items-start h-full">
          <div 
            className="w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0"
            style={{ backgroundColor: bgColor }}
          >
            <span className="text-xs">{data.icon || '⚙️'}</span>
          </div>
          <div className="flex-1 overflow-auto">
            <div className="text-xs text-gray-700 break-words whitespace-pre-wrap">
              {data.label || ''}
            </div>
          </div>
          {selected && (
            <div className="absolute bottom-1 right-1 cursor-nwse-resize opacity-50 text-gray-400">
              <GripVertical size={12} />
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} className="!bg-gray-400" />
      </div>
    </>
  );
}
