
import React from 'react';
import { CustomNodeItem } from './CustomNodeItem';
import { CustomNodeCreator } from './CustomNodeCreator';

interface CustomNodesProps {
  customNodes: Array<{
    id: string;
    name: string;
    icon: string;
    color: string;
  }>;
  newNodeName: string;
  setNewNodeName: (name: string) => void;
  newNodeIcon: string;
  setNewNodeIcon: (icon: string) => void;
  newNodeColor: string;
  setNewNodeColor: (color: string) => void;
  addCustomNode: () => void;
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string, data?: any) => void;
}

export function CustomNodes({
  customNodes,
  newNodeName,
  setNewNodeName,
  newNodeIcon,
  setNewNodeIcon,
  newNodeColor,
  setNewNodeColor,
  addCustomNode,
  onDragStart
}: CustomNodesProps) {
  return (
    <div className="space-y-3">
      {customNodes.map((node) => (
        <CustomNodeItem key={node.id} node={node} onDragStart={onDragStart} />
      ))}
      
      <CustomNodeCreator
        nodeName={newNodeName}
        setNodeName={setNewNodeName}
        nodeIcon={newNodeIcon}
        setNodeIcon={setNewNodeIcon}
        nodeColor={newNodeColor}
        setNodeColor={setNewNodeColor}
        addCustomNode={addCustomNode}
      />
    </div>
  );
}
