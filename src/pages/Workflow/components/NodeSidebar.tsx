
import React, { useState } from 'react';
import { Plus, Settings, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

export function NodeSidebar() {
  const [customNodes, setCustomNodes] = useState([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeIcon, setNewNodeIcon] = useState('🔧');
  const [newNodeColor, setNewNodeColor] = useState('#4CAF50');
  const [expandedSection, setExpandedSection] = useState('default'); // 'default', 'custom', 'none'

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? 'none' : section);
  };

  const onDragStart = (event, nodeType, data = {}) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const addCustomNode = () => {
    if (newNodeName.trim()) {
      const newNode = {
        id: `custom-${Date.now()}`,
        name: newNodeName,
        icon: newNodeIcon,
        color: newNodeColor,
      };
      setCustomNodes([...customNodes, newNode]);
      setNewNodeName('');
    }
  };

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

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Workflow Nodes</h3>
      
      {/* Default Nodes Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-gray-600">Default Nodes</h4>
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={() => toggleSection('default')}
          >
            {expandedSection === 'default' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {expandedSection === 'default' && (
          <div className="space-y-2">
            <div
              className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
              onDragStart={(e) => onDragStart(e, 'customerNode', { label: 'Customer' })}
              draggable
            >
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-blue-600">👤</span>
              </div>
              <span className="text-sm">Customer</span>
            </div>
            
            <div
              className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
              onDragStart={(e) => onDragStart(e, 'jobNode', { label: 'Job' })}
              draggable
            >
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-green-600">🔧</span>
              </div>
              <span className="text-sm">Job</span>
            </div>
            
            <div
              className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
              onDragStart={(e) => onDragStart(e, 'quoteNode', { label: 'Quote' })}
              draggable
            >
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-yellow-600">💰</span>
              </div>
              <span className="text-sm">Quote</span>
            </div>
            
            <div
              className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
              onDragStart={(e) => onDragStart(e, 'taskNode', { label: 'Task' })}
              draggable
            >
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-purple-600">📋</span>
              </div>
              <span className="text-sm">Task</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Nodes Section */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-medium text-gray-600">Custom Nodes</h4>
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={() => toggleSection('custom')}
          >
            {expandedSection === 'custom' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
        
        {expandedSection === 'custom' && (
          <div className="space-y-3">
            {customNodes.map((node) => (
              <div
                key={node.id}
                className="flex items-center p-2 bg-white border border-gray-200 rounded-md cursor-grab hover:bg-gray-50"
                onDragStart={(e) => onDragStart(e, 'customNode', { 
                  label: node.name, 
                  icon: node.icon, 
                  color: node.color,
                  id: node.id 
                })}
                draggable
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center mr-2"
                  style={{ backgroundColor: `${node.color}25` }} // 25 is for 25% opacity
                >
                  <span className="text-sm">{node.icon}</span>
                </div>
                <span className="text-sm">{node.name}</span>
              </div>
            ))}
            
            <div className="p-3 bg-white border border-dashed border-gray-300 rounded-md">
              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Node Name</Label>
                  <Input 
                    placeholder="Enter node name" 
                    value={newNodeName}
                    onChange={(e) => setNewNodeName(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                
                <div>
                  <Label className="text-xs">Icon</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => setNewNodeIcon(icon)}
                        className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 ${newNodeIcon === icon ? 'bg-gray-200' : ''}`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setNewNodeColor(color)}
                        className={`w-6 h-6 rounded-full border ${newNodeColor === color ? 'border-gray-800 border-2' : 'border-gray-300'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
                
                <Button 
                  onClick={addCustomNode} 
                  className="w-full h-8" 
                  size="sm"
                  disabled={!newNodeName.trim()}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  <span className="text-xs">Add Custom Node</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Separator className="my-4" />
      
      <h3 className="text-sm font-semibold mt-2 mb-3">Instructions</h3>
      <ol className="text-xs space-y-2 text-gray-600 list-decimal pl-4">
        <li>Drag nodes from above onto the canvas</li>
        <li>Connect nodes by dragging from the handles</li>
        <li>Click on nodes to edit their properties</li>
        <li>Create custom nodes with your own icons and colors</li>
        <li>Save your workflow when finished</li>
      </ol>
    </aside>
  );
}
