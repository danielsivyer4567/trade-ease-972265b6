
import React from 'react';
import { CustomNodes } from './sidebar/CustomNodes';
import { DefaultNodes } from './sidebar/DefaultNodes';
import { WorkflowInstructions } from './sidebar/WorkflowInstructions';

export function NodeSidebar() {
  return (
    <div className="w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <h3 className="font-medium text-sm mb-3">Workflow Nodes</h3>
        
        {/* Default nodes section */}
        <DefaultNodes />
        
        {/* Custom nodes section */}
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 mb-2">INTEGRATIONS</h4>
          <div 
            className="border border-purple-300 bg-purple-50 p-2 rounded-md mb-2 cursor-grab"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData('application/reactflow', 'visionNode');
            }}
          >
            <div className="flex items-center">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mr-2">
                <span className="text-purple-600 text-xs">🔍</span>
              </div>
              <div>
                <div className="font-semibold text-xs">Vision Analysis</div>
                <div className="text-xs text-gray-500">Extract Data</div>
              </div>
            </div>
          </div>
        </div>

        <CustomNodes />
        
        <WorkflowInstructions />
      </div>
    </div>
  );
}
