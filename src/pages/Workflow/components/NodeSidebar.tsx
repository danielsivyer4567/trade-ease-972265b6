
import React from 'react';

export function NodeSidebar() {
  const onDragStart = (event, nodeType, data = {}) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/data', JSON.stringify(data));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-gray-50 border-r border-gray-200 p-4 overflow-y-auto">
      <h3 className="text-sm font-semibold mb-3">Workflow Nodes</h3>
      
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
      
      <h3 className="text-sm font-semibold mt-6 mb-3">Instructions</h3>
      <ol className="text-xs space-y-2 text-gray-600 list-decimal pl-4">
        <li>Drag nodes from above onto the canvas</li>
        <li>Connect nodes by dragging from the handles</li>
        <li>Click on nodes to edit their properties</li>
        <li>Save your workflow when finished</li>
      </ol>
    </aside>
  );
}
