import React from 'react';
import { Paperclip, User, Briefcase, ClipboardList, FileText, Eye, Settings, MessageSquare, Share2 } from 'lucide-react';

interface NodeSidebarProps {
  targetData?: {
    targetType?: 'job' | 'quote' | 'customer' | 'message' | 'social' | 'calendar';
    targetId?: string;
    createAutomationNode?: boolean;
  } | null;
  workflowDarkMode?: boolean;
}

export function NodeSidebar({ targetData, workflowDarkMode = false }: NodeSidebarProps) {
  const handleDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <aside
      className={`w-64 p-4 overflow-y-auto border ${workflowDarkMode ? 'border-[3px] border-gold-600' : 'border-black'} ${workflowDarkMode ? '' : 'bg-slate-50'}`}
      style={workflowDarkMode ? {
        background: darkBg,
        color: darkText,
        borderColor: gold,
        borderWidth: '3px'
      } : {
        background: '#f8fafc', // Light slate color
        borderColor: 'black'
      }}
    >
      <h3
        className={`font-medium text-sm mb-2 ${workflowDarkMode ? 'text-gold-400' : ''}`}
        style={workflowDarkMode ? { color: gold } : {}}
      >
        Workflow Nodes
      </h3>
      
      {targetData?.targetType && targetData?.targetId && (
        <div className="mb-4">
          <div className="text-xs mb-1" style={{ color: workflowDarkMode ? '#8e7a3c' : '#6b7280' }}>Working with:</div>
          <div className="border rounded p-2 flex items-center" style={{ 
            backgroundColor: workflowDarkMode ? 'rgba(191, 161, 74, 0.1)' : '#e0f2fe',
            borderColor: workflowDarkMode ? gold : '#bfdbfe',
            color: workflowDarkMode ? darkText : 'inherit'
          }}>
            <Paperclip className="h-3 w-3 mr-2" style={{ color: workflowDarkMode ? gold : '#3b82f6' }} />
            <div className="text-xs">
              <span className="font-medium" style={{ color: workflowDarkMode ? gold : 'inherit' }}>{targetData.targetType}</span>
              <span className="mx-1" style={{ color: workflowDarkMode ? '#8e7a3c' : '#6b7280' }}>•</span>
              <span style={{ color: workflowDarkMode ? darkText : '#6b7280' }}>{targetData.targetId.substring(0, 8)}</span>
            </div>
          </div>
        </div>
      )}
      
      <div
        className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}
      >
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'customerNode')}
          draggable
        >
          <User className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-stone-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Customer</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Contact info & history</div>
          </div>
        </div>
      </div>

      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'jobNode')}
          draggable
        >
          <Briefcase className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-green-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Job</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Schedule & assignments</div>
          </div>
        </div>
      </div>

      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'quoteNode')}
          draggable
        >
          <FileText className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-purple-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Quote</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Pricing & approvals</div>
          </div>
        </div>
      </div>

      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'taskNode')}
          draggable
        >
          <ClipboardList className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-blue-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Task</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>To-dos & assignments</div>
          </div>
        </div>
      </div>

      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'visionNode')}
          draggable
        >
          <Eye className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-indigo-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Vision Analysis</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Extract financial data</div>
          </div>
        </div>
      </div>

      <div className={`space-y-1 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'customNode')}
          draggable
        >
          <Settings className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-gray-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Custom</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Blank node</div>
          </div>
        </div>
      </div>

      <h3 className={`font-medium text-sm mt-6 mb-2 ${workflowDarkMode ? 'text-gold-400' : ''}`}>Messaging Nodes</h3>
      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'messagingNode')}
          draggable
        >
          <MessageSquare className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-yellow-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>SMS</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Text notifications</div>
          </div>
        </div>
      </div>
      <div className={`space-y-1 mb-4 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'emailNode')}
          draggable
        >
          <MessageSquare className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-blue-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Email</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Email notifications</div>
          </div>
        </div>
      </div>
      <div className={`space-y-1 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'whatsappNode')}
          draggable
        >
          <MessageSquare className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-green-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>WhatsApp</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>WhatsApp messages</div>
          </div>
        </div>
      </div>
      <h3 className={`font-medium text-sm mt-6 mb-2 ${workflowDarkMode ? 'text-gold-400' : ''}`}>Social Media</h3>
      <div className={`space-y-1 ${workflowDarkMode ? '' : ''}`}>
        <div
          className={`p-3 rounded-md shadow-sm cursor-move flex items-center gap-2 border ${workflowDarkMode ? 'bg-[#18140c] border-gold-600 text-gold-200' : 'bg-white border-gray-200'}`}
          style={workflowDarkMode ? { borderColor: gold, color: darkText } : {}}
          onDragStart={(event) => handleDragStart(event, 'socialNode')}
          draggable
        >
          <Share2 className={`h-5 w-5 mr-2 ${workflowDarkMode ? 'text-gold-400' : 'text-pink-600'}`} />
          <div>
            <div className={`text-sm font-medium ${workflowDarkMode ? 'text-gold-300' : ''}`}>Social Post</div>
            <div className={`text-xs ${workflowDarkMode ? 'text-gold-500' : 'text-gray-500'}`}>Facebook & Instagram</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
