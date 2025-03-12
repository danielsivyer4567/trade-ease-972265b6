
import React from 'react';

export interface DefaultNodesProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, nodeType: string, data?: any) => void;
}

export function DefaultNodes({ onDragStart }: DefaultNodesProps) {
  return (
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
  );
}
