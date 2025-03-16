import React, { useState } from 'react';
import { CustomNodes } from './sidebar/CustomNodes';
import { DefaultNodes } from './sidebar/DefaultNodes';
import { WorkflowInstructions } from './sidebar/WorkflowInstructions';
export function NodeSidebar() {
  // State for custom nodes
  const [customNodes, setCustomNodes] = useState([]);
  const [newNodeName, setNewNodeName] = useState('');
  const [newNodeIcon, setNewNodeIcon] = useState('📋');
  const [newNodeColor, setNewNodeColor] = useState('#6B7280');

  // Function to handle drag start for nodes
  const handleDragStart = (event, nodeType, data = {}) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Function to add a custom node
  const handleAddCustomNode = () => {
    if (!newNodeName.trim()) return;
    const newNode = {
      id: `custom-${Date.now()}`,
      name: newNodeName,
      icon: newNodeIcon,
      color: newNodeColor
    };
    setCustomNodes([...customNodes, newNode]);
    setNewNodeName('');
  };
  return <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-medium text-sm mb-3">Workflow Nodes</h3>
        
        {/* Default nodes section */}
        <DefaultNodes onDragStart={handleDragStart} />
        
        {/* Note about Vision Analysis feature */}
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">VISION ANALYSIS</h4>
          
        </div>

        {/* Custom nodes section */}
        <CustomNodes customNodes={customNodes} newNodeName={newNodeName} setNewNodeName={setNewNodeName} newNodeIcon={newNodeIcon} setNewNodeIcon={setNewNodeIcon} newNodeColor={newNodeColor} setNewNodeColor={setNewNodeColor} addCustomNode={handleAddCustomNode} onDragStart={handleDragStart} />
        
        <WorkflowInstructions />
      </div>
    </div>;
}