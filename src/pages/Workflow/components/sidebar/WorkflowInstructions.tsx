
import React from 'react';

export function WorkflowInstructions() {
  return (
    <div>
      <h3 className="text-sm font-semibold mt-2 mb-3">Instructions</h3>
      <ol className="text-xs space-y-2 text-gray-600 list-decimal pl-4">
        <li>Drag nodes from above onto the canvas</li>
        <li>Connect nodes by dragging from the handles</li>
        <li>Click on nodes to edit their properties</li>
        <li>Create custom nodes with your own icons and colors</li>
        <li>Save your workflow when finished</li>
      </ol>
    </div>
  );
}
