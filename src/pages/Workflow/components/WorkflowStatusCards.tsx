
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Check, FileText, Workflow } from "lucide-react";

interface WorkflowStatusCardsProps {
  hasGcpVisionKey: boolean;
  isLoadingKey: boolean;
}

export const WorkflowStatusCards: React.FC<WorkflowStatusCardsProps> = ({
  hasGcpVisionKey,
  isLoadingKey
}) => {
  if (isLoadingKey) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
      {hasGcpVisionKey && (
        <Card>
          <CardHeader className="py-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Key className="h-4 w-4 text-green-500" />
              Google Cloud Vision API Status
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-sm text-green-600 flex items-center">
              <Check className="h-4 w-4 mr-1" />
              Google Cloud Vision API key is configured and ready to use
            </p>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            Financial Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Add a Vision Analysis node to your workflow</li>
            <li>Connect it to a Quote or Custom node</li>
            <li>Save your workflow to enable automated data extraction</li>
            <li>Extracted data will appear in financial sections</li>
          </ol>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="py-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Workflow className="h-4 w-4 text-blue-500" />
            Automation Integration Guide
          </CardTitle>
        </CardHeader>
        <CardContent className="py-2">
          <ol className="text-sm space-y-1 list-decimal pl-4">
            <li>Click "Add Automation" to include existing automations</li>
            <li>Connect automation nodes to jobs, quotes, or customers</li>
            <li>Save your workflow to enable the connected automations</li>
            <li>Manage automations from the Automations page</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
};
