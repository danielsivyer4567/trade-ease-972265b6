
import React from 'react';
import { Briefcase, FileText, User, ClipboardList, Workflow, FileSearch } from 'lucide-react';

export function DefaultNodes({ onDragStart }) {
  return (
    <div className="space-y-2 mb-4">
      <h4 className="text-xs font-medium text-gray-500 mb-2">STANDARD NODES</h4>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'customerNode')}
      >
        <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
          <User className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm">Customer</span>
      </div>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'jobNode')}
      >
        <div className="w-8 h-8 rounded-md bg-green-100 flex items-center justify-center">
          <Briefcase className="h-5 w-5 text-green-600" />
        </div>
        <span className="text-sm">Job</span>
      </div>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'taskNode')}
      >
        <div className="w-8 h-8 rounded-md bg-amber-100 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-amber-600" />
        </div>
        <span className="text-sm">Task</span>
      </div>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'quoteNode')}
      >
        <div className="w-8 h-8 rounded-md bg-purple-100 flex items-center justify-center">
          <FileText className="h-5 w-5 text-purple-600" />
        </div>
        <span className="text-sm">Quote</span>
      </div>

      <h4 className="text-xs font-medium text-gray-500 mt-4 mb-2">INTEGRATIONS</h4>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'visionNode')}
      >
        <div className="w-8 h-8 rounded-md bg-cyan-100 flex items-center justify-center">
          <FileSearch className="h-5 w-5 text-cyan-600" />
        </div>
        <span className="text-sm">Vision Analysis</span>
      </div>
      
      <div 
        className="flex items-center gap-2 p-2 border border-gray-200 rounded-md cursor-move bg-white hover:bg-gray-50"
        draggable
        onDragStart={(e) => onDragStart(e, 'automationNode')}
      >
        <div className="w-8 h-8 rounded-md bg-blue-100 flex items-center justify-center">
          <Workflow className="h-5 w-5 text-blue-600" />
        </div>
        <span className="text-sm">Automation</span>
      </div>
    </div>
  );
}
