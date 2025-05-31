import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Workflow, ListChecks, ArrowLeft, History, Activity, LayoutTemplate, Zap, Bot } from "lucide-react";
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

interface WorkflowNavigationProps {
  workflowDarkMode?: boolean;
  onToggleAIAssistant?: () => void;
  showAIAssistant?: boolean;
}

export function WorkflowNavigation({ 
  workflowDarkMode = true,
  onToggleAIAssistant,
  showAIAssistant = true
}: WorkflowNavigationProps) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Use the global colors from context
  const darkBg = DARK_BG;
  const darkText = DARK_TEXT;
  const darkGold = DARK_GOLD;
  const darkSecondary = DARK_SECONDARY;
  
  return (
    <div 
      className="flex flex-wrap items-center gap-2 mb-4"
      style={{ 
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", 
        padding: '8px 12px',
        borderBottom: `1px solid ${darkGold}`,
        backgroundColor: darkBg
      }}
    >
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)}
        className="mr-2"
        style={{
          borderColor: darkGold,
          color: darkText,
          backgroundColor: 'transparent',
          borderRadius: '4px'
        }}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant={isActive('/workflow') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow')}
        className="flex items-center gap-2"
        style={
          isActive('/workflow') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold,
            borderRadius: '4px'
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent',
            borderRadius: '4px'
          }
        }
      >
        <Workflow className="h-4 w-4" />
        Editor
      </Button>
      
      <Button
        variant={isActive('/workflow/list') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/list')}
        className="flex items-center gap-2"
        style={
          isActive('/workflow/list') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent'
          }
        }
      >
        <ListChecks className="h-4 w-4" />
        My Workflows
      </Button>

      <Button
        variant={isActive('/workflow/templates') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/templates')}
        className="flex items-center gap-2"
        style={
          isActive('/workflow/templates') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent'
          }
        }
      >
        <LayoutTemplate className="h-4 w-4" />
        Templates
      </Button>

      <Button
        variant={isActive('/workflow/enrollment-history') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/enrollment-history')}
        className="flex items-center gap-2"
        style={
          isActive('/workflow/enrollment-history') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent'
          }
        }
      >
        <History className="h-4 w-4" />
        Enrollment History
      </Button>
      
      <Button
        variant={isActive('/workflow/automations') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/automations')}
        className="flex items-center gap-2 min-w-[130px] bg-blue-100 border-blue-300 hover:bg-blue-200"
        style={
          isActive('/workflow/automations') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent'
          }
        }
      >
        <Zap className="h-4 w-4 text-blue-600" />
        Automations
      </Button>

      <Button
        variant={isActive('/workflow/execution-logs') ? "default" : "outline"}
        size="sm"
        onClick={() => navigate('/workflow/execution-logs')}
        className="flex items-center gap-2"
        style={
          isActive('/workflow/execution-logs') ? {
            backgroundColor: darkGold,
            color: darkBg,
            borderColor: darkGold
          } : {
            borderColor: darkGold,
            color: darkText,
            backgroundColor: 'transparent'
          }
        }
      >
        <Activity className="h-4 w-4" />
        Execution Logs
      </Button>
      
      <div className="ml-auto flex gap-2">
        {onToggleAIAssistant && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleAIAssistant}
            className="flex items-center gap-2"
            style={{
              borderColor: darkGold,
              color: darkText,
              backgroundColor: showAIAssistant ? 'rgba(160, 160, 160, 0.1)' : 'transparent',
              borderRadius: '4px'
            }}
            title={showAIAssistant ? "Hide AI Assistant" : "Show AI Assistant"}
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
        )}
      </div>
    </div>
  );
}
