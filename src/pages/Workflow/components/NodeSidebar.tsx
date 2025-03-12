
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";
import { NodeSection } from './sidebar/NodeSection';
import { DefaultNodes } from './sidebar/DefaultNodes';
import { CustomNodes } from './sidebar/CustomNodes';
import { WorkflowInstructions } from './sidebar/WorkflowInstructions';

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

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Workflow Nodes</h3>
      
      {/* Default Nodes Section */}
      <NodeSection 
        title="Default Nodes"
        isExpanded={expandedSection === 'default'}
        toggleSection={toggleSection}
        sectionKey="default"
      >
        <DefaultNodes onDragStart={onDragStart} />
      </NodeSection>
      
      {/* Custom Nodes Section */}
      <NodeSection 
        title="Custom Nodes"
        isExpanded={expandedSection === 'custom'}
        toggleSection={toggleSection}
        sectionKey="custom"
      >
        <CustomNodes 
          customNodes={customNodes}
          newNodeName={newNodeName}
          setNewNodeName={setNewNodeName}
          newNodeIcon={newNodeIcon}
          setNewNodeIcon={setNewNodeIcon}
          newNodeColor={newNodeColor}
          setNewNodeColor={setNewNodeColor}
          addCustomNode={addCustomNode}
          onDragStart={onDragStart}
        />
      </NodeSection>
      
      <Separator className="my-4" />
      
      <WorkflowInstructions />
    </aside>
  );
}
