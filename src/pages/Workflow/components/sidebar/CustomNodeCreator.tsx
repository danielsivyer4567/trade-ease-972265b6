
import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NodeIconSelector } from './NodeIconSelector';
import { NodeColorSelector } from './NodeColorSelector';

// Define the constants for icon and color options
const iconOptions = ['👤', '🔧', '💰', '📋', '🏠', '📱', '🚗', '⚙️', '📝', '🔔'];
const colorOptions = [
  '#4CAF50', // green
  '#2196F3', // blue
  '#FFC107', // amber
  '#9C27B0', // purple
  '#F44336', // red
  '#FF9800', // orange
  '#03A9F4', // light blue
  '#E91E63', // pink
  '#00BCD4', // cyan
  '#8BC34A', // light green
];

interface CustomNodeCreatorProps {
  nodeName: string;
  setNodeName: (name: string) => void;
  nodeIcon: string;
  setNodeIcon: (icon: string) => void;
  nodeColor: string;
  setNodeColor: (color: string) => void;
  addCustomNode: () => void;
}

export function CustomNodeCreator({
  nodeName,
  setNodeName,
  nodeIcon,
  setNodeIcon,
  nodeColor,
  setNodeColor,
  addCustomNode
}: CustomNodeCreatorProps) {
  return (
    <div className="p-3 bg-white border border-dashed border-gray-300 rounded-md">
      <div className="space-y-3">
        <div>
          <Label className="text-xs">Node Name</Label>
          <Input 
            placeholder="Enter node name" 
            value={nodeName}
            onChange={(e) => setNodeName(e.target.value)}
            className="h-8 text-xs"
          />
        </div>
        
        <NodeIconSelector 
          selectedIcon={nodeIcon}
          setSelectedIcon={setNodeIcon}
          icons={iconOptions}
        />
        
        <NodeColorSelector 
          selectedColor={nodeColor}
          setSelectedColor={setNodeColor}
          colors={colorOptions}
        />
        
        <Button 
          onClick={addCustomNode} 
          className="w-full h-8" 
          size="sm"
          disabled={!nodeName.trim()}
        >
          <Plus className="h-3.5 w-3.5 mr-1" />
          <span className="text-xs">Add Custom Node</span>
        </Button>
      </div>
    </div>
  );
}
