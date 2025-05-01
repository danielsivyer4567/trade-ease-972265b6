import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Workflow, ListChecks, ArrowLeft, History } from "lucide-react";

export function WorkflowNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mr-2"
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant={isActive('/workflow') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow')}
        className="flex items-center gap-2"
      >
        <Workflow className="h-4 w-4" />
        Editor
      </Button>
      
      <Button
        variant={isActive('/workflow/list') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/list')}
        className="flex items-center gap-2"
      >
        <ListChecks className="h-4 w-4" />
        My Workflows
      </Button>

      <Button
        variant={isActive('/workflow/enrollment-history') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/enrollment-history')}
        className="flex items-center gap-2"
      >
        <History className="h-4 w-4" />
        Enrollment History
      </Button>
    </div>
  );
}
