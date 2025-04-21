import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Workflow, ListChecks, FileText, ArrowLeft } from "lucide-react";
import { ButtonGroup, ButtonGroupItem } from "@/components/ui/button-group";
import { LayoutTemplate, ListTodo, BarChart3 } from "lucide-react";

export function WorkflowNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <ButtonGroup>
      <ButtonGroupItem 
        to="/workflow/templates" 
        active={path === '/workflow/templates'}
        icon={<LayoutTemplate className="w-4 h-4" />}
      >
        Templates
      </ButtonGroupItem>
      <ButtonGroupItem 
        to="/workflow/list" 
        active={path === '/workflow/list'}
        icon={<ListTodo className="w-4 h-4" />}
      >
        My Workflows
      </ButtonGroupItem>
      <ButtonGroupItem 
        to="/workflow/metrics" 
        active={path === '/workflow/metrics'}
        icon={<BarChart3 className="w-4 h-4" />}
      >
        Metrics
      </ButtonGroupItem>
    </ButtonGroup>
  );
}
