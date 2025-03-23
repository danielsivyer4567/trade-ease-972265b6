import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';

export function WorkflowInstructions() {
  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Info className="h-4 w-4 text-blue-500" />
          <h4 className="text-xs font-medium">Instructions</h4>
        </div>
        <ol className="text-xs space-y-1 list-decimal pl-4 text-gray-600">
          <li>Drag nodes from above to create your workflow</li>
          <li>Connect nodes by dragging from one handle to another</li>
          <li>Configure Vision Analysis to extract data from documents</li>
          <li>Save your workflow when finished</li>
        </ol>
      </CardContent>
    </Card>
  );
}
