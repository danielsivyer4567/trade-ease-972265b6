
import React from 'react';

interface CustomNodeItemProps {
  node: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string, data?: any) => void;
}

export function CustomNodeItem({ node, onDragStart }: CustomNodeItemProps) {
  return (
    <div
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
  );
}
