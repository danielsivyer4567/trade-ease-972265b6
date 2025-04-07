
import React from 'react';
import { 
  Workflow, 
  User, 
  Clock, 
  MessageSquare, 
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-mobile';

export interface NodeSidebarProps {
  handleAddAutomation: (automationNode: any) => void;
}

export const NodeSidebar: React.FC<NodeSidebarProps> = ({ handleAddAutomation }) => {
  const isMobile = useMediaQuery("(max-width: 640px)");

  const handleDragStart = (event: React.DragEvent, nodeType: string, data: any = {}) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  const nodes = [
    { type: 'customer', label: 'Customer', icon: <User className="h-4 w-4 mr-2" /> },
    { type: 'job', label: 'Job', icon: <Workflow className="h-4 w-4 mr-2" /> },
    { type: 'task', label: 'Task', icon: <Clock className="h-4 w-4 mr-2" /> },
    { type: 'quote', label: 'Quote', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { type: 'visionNode', label: 'Vision Analysis', icon: <Eye className="h-4 w-4 mr-2" /> },
  ];

  const addNode = (type: string, label: string) => {
    handleAddAutomation({
      type,
      position: { x: 100, y: 100 },
      data: { label }
    });
  };

  return (
    <div className={`p-2 border-r flex flex-col ${isMobile ? 'w-12' : 'w-48'}`}>
      <div className="text-sm font-medium mb-2 px-1">
        {!isMobile && 'Drag Nodes'}
      </div>
      <div className="space-y-1">
        {nodes.map((node) => (
          <Button
            key={node.type}
            variant="ghost"
            className={`w-full justify-start text-xs ${isMobile ? 'px-1' : ''}`}
            draggable
            onDragStart={(e) => handleDragStart(e, node.type, { label: node.label })}
            onClick={() => addNode(node.type, node.label)}
          >
            {node.icon}
            {!isMobile && node.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
