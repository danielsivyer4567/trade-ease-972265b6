import React from 'react';
import { Paperclip, User, Briefcase, ClipboardList, FileText, Eye, Settings, MessageSquare, Share2, Zap, Calendar, Bell } from 'lucide-react';
import { DARK_BG, DARK_TEXT, DARK_GOLD } from '@/contexts/WorkflowDarkModeContext';
import { MiniMap } from '@xyflow/react';

interface NodeSidebarProps {
  targetData?: {
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null;
  workflowDarkMode?: boolean;
  nodes?: any[];
  edges?: any[];
}

// Node type definitions with vibrant colors from the image
const nodeTypes = [
  {
    type: 'customerNode',
    label: 'Customer',
    description: 'Contact info & history',
    icon: User,
    gradient: 'linear-gradient(135deg, #ff56e1, #a152ff)',
    color: '#ff56e1'
  },
  {
    type: 'jobNode',
    label: 'Job',
    description: 'Schedule & assignments',
    icon: Briefcase,
    gradient: 'linear-gradient(135deg, #ff56e1, #6d42fc)',
    color: '#c04aff'
  },
  {
    type: 'quoteNode',
    label: 'Quote',
    description: 'Pricing & approvals',
    icon: FileText,
    gradient: 'linear-gradient(135deg, #6e8cff, #3b5afc)',
    color: '#6e8cff'
  },
  {
    type: 'taskNode',
    label: 'Task',
    description: 'To-dos & assignments',
    icon: ClipboardList,
    gradient: 'linear-gradient(135deg, #6a47ff, #4290ff)',
    color: '#6a47ff'
  },
  {
    type: 'visionNode',
    label: 'Vision',
    description: 'Extract financial data',
    icon: Eye,
    gradient: 'linear-gradient(135deg, #ff56c1, #ff4d9a)',
    color: '#ff56c1'
  },
  {
    type: 'customNode',
    label: 'Custom',
    description: 'Blank node',
    icon: Settings,
    gradient: 'linear-gradient(135deg, #b156ff, #8c56ff)',
    color: '#b156ff'
  },
  {
    type: 'messagingNode',
    label: 'SMS',
    description: 'Text notifications',
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #ff56aa, #ff707a)',
    color: '#ff56aa'
  },
  {
    type: 'emailNode',
    label: 'Email',
    description: 'Email notifications',
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #4a6aff, #56baff)',
    color: '#4a6aff'
  },
  {
    type: 'whatsappNode',
    label: 'WhatsApp',
    description: 'WhatsApp messages',
    icon: MessageSquare,
    gradient: 'linear-gradient(135deg, #4affae, #56ffca)',
    color: '#4affae'
  },
  {
    type: 'socialNode',
    label: 'Social',
    description: 'Facebook & Instagram',
    icon: Share2,
    gradient: 'linear-gradient(135deg, #ff5677, #ff7c56)',
    color: '#ff5677'
  },
  {
    type: 'automationNode',
    label: 'Automation',
    description: 'Automated workflows',
    icon: Zap,
    gradient: 'linear-gradient(135deg, #c04aff, #7e4aff)',
    color: '#c04aff'
  },
  {
    type: 'calendarNode',
    label: 'Calendar',
    description: 'Schedule events',
    icon: Calendar,
    gradient: 'linear-gradient(135deg, #4a56ff, #56c2ff)',
    color: '#4a56ff'
  }
];

export function NodeSidebar({ targetData, workflowDarkMode = false, nodes, edges }: NodeSidebarProps) {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div 
      className="w-64 border-r border-[#a595ff] overflow-y-auto"
      style={{ 
        backgroundColor: workflowDarkMode ? DARK_BG : '',
        backgroundImage: workflowDarkMode ? 'linear-gradient(to bottom, rgba(23, 25, 57, 0.8), rgba(14, 14, 32, 0.95))' : '',
        color: workflowDarkMode ? DARK_TEXT : '',
        fontFamily: "'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        padding: '12px'
      }}
    >
      <h3
        className="font-medium text-sm mb-2"
        style={{ color: workflowDarkMode ? DARK_GOLD : '#333' }}
      >
        Workflow Nodes
      </h3>
      
      {targetData?.targetType && targetData?.targetId && (
        <div className="mb-4">
          <div className="text-xs mb-1" style={{ color: workflowDarkMode ? 'rgba(165, 149, 255, 0.6)' : '#6b7280' }}>Working with:</div>
          <div className="border rounded p-2 flex items-center" style={{ 
            backgroundColor: workflowDarkMode ? 'rgba(165, 149, 255, 0.1)' : '#e0f2fe',
            borderColor: workflowDarkMode ? 'rgba(165, 149, 255, 0.3)' : '#bfdbfe',
            color: workflowDarkMode ? DARK_TEXT : 'inherit'
          }}>
            <Paperclip className="h-3 w-3 mr-2" style={{ color: workflowDarkMode ? DARK_GOLD : '#3b82f6' }} />
            <div className="text-xs">
              <span className="font-medium" style={{ color: workflowDarkMode ? DARK_GOLD : 'inherit' }}>{targetData.targetType}</span>
              <span className="mx-1" style={{ color: workflowDarkMode ? 'rgba(165, 149, 255, 0.6)' : '#6b7280' }}>•</span>
              <span style={{ color: workflowDarkMode ? DARK_TEXT : '#6b7280' }}>{targetData.targetId.substring(0, 8)}</span>
            </div>
          </div>
        </div>
      )}
      
      {/* Grid layout for 2D nodes - two columns */}
      <div className="grid grid-cols-2 gap-3">
        {nodeTypes.map((node) => (
          <div 
            key={node.type}
            className="node-item"
            draggable
            onDragStart={(event) => handleDragStart(event, node.type)}
            style={{
              cursor: 'move',
            }}
          >
            <div 
              className="node-card"
              style={{
                background: node.gradient,
                borderRadius: '8px',
                padding: '10px',
                boxShadow: `0 4px 12px ${node.color}40`,
                border: `1px solid ${node.color}50`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '70px',
                transition: 'all 0.2s ease',
              }}
            >
              <node.icon className="h-5 w-5 text-white drop-shadow-md" style={{ filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.2))' }} />
              <div 
                className="text-center mt-2"
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  color: '#ffffff',
                  textShadow: '0 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                {node.label}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* MiniMap below nodes */}
      <div className="mt-6">
        <MiniMap
          className="w-full h-32"
          style={{
            background: workflowDarkMode ? DARK_BG : '#fff',
            borderColor: workflowDarkMode ? DARK_GOLD : '#ccc',
            borderWidth: '2px',
            borderStyle: 'solid',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            borderRadius: '8px',
            margin: '0 auto',
            display: 'block',
          }}
          nodeColor={workflowDarkMode ? DARK_GOLD : undefined}
          maskColor={workflowDarkMode ? 'rgba(24, 20, 12, 0.6)' : undefined}
        />
      </div>
    </div>
  );
}
