
import React from 'react';
import { Paperclip } from 'lucide-react';

interface NodeSidebarProps {
  targetData?: {
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null;
}

export function NodeSidebar({ targetData }: NodeSidebarProps) {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-slate-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="font-medium text-sm mb-2">Workflow Nodes</h3>
      
      {targetData?.targetType && targetData?.targetId && (
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Working with:</div>
          <div className="bg-blue-50 border border-blue-200 rounded p-2 flex items-center">
            <Paperclip className="h-3 w-3 text-blue-500 mr-2" />
            <div className="text-xs">
              <span className="font-medium">{targetData.targetType}</span>
              <span className="text-gray-500 mx-1">•</span>
              <span>{targetData.targetId.substring(0, 8)}</span>
            </div>
          </div>
        </div>
      )}
      
      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'customerNode')}
          draggable
        >
          <div className="text-sm font-medium">Customer</div>
          <div className="text-xs text-gray-500">Contact info & history</div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'jobNode')}
          draggable
        >
          <div className="text-sm font-medium">Job</div>
          <div className="text-xs text-gray-500">Schedule & assignments</div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'quoteNode')}
          draggable
        >
          <div className="text-sm font-medium">Quote</div>
          <div className="text-xs text-gray-500">Pricing & approvals</div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'taskNode')}
          draggable
        >
          <div className="text-sm font-medium">Task</div>
          <div className="text-xs text-gray-500">To-dos & assignments</div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'visionNode')}
          draggable
        >
          <div className="text-sm font-medium">Vision Analysis</div>
          <div className="text-xs text-gray-500">Extract financial data</div>
        </div>
      </div>

      <div className="space-y-1">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'customNode')}
          draggable
        >
          <div className="text-sm font-medium">Custom</div>
          <div className="text-xs text-gray-500">Blank node</div>
        </div>
      </div>

      <h3 className="font-medium text-sm mt-6 mb-2">Messaging Nodes</h3>
      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'messagingNode')}
          draggable
        >
          <div className="text-sm font-medium">SMS</div>
          <div className="text-xs text-gray-500">Text notifications</div>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'emailNode')}
          draggable
        >
          <div className="text-sm font-medium">Email</div>
          <div className="text-xs text-gray-500">Email notifications</div>
        </div>
      </div>

      <div className="space-y-1">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'whatsappNode')}
          draggable
        >
          <div className="text-sm font-medium">WhatsApp</div>
          <div className="text-xs text-gray-500">WhatsApp messages</div>
        </div>
      </div>

      <h3 className="font-medium text-sm mt-6 mb-2">Social Media</h3>
      <div className="space-y-1">
        <div
          className="bg-white p-3 border border-gray-200 rounded-md shadow-sm cursor-move"
          onDragStart={(event) => handleDragStart(event, 'socialNode')}
          draggable
        >
          <div className="text-sm font-medium">Social Post</div>
          <div className="text-xs text-gray-500">Facebook & Instagram</div>
        </div>
      </div>
    </aside>
  );
}
