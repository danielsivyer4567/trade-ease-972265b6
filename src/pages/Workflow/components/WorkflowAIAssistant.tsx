import React, { useState, useRef, useEffect } from 'react';
import { Send, X, ChevronDown, ChevronUp, Bot, User, Zap, Loader } from 'lucide-react';
import { useWorkflowDarkMode, DARK_BG, DARK_TEXT, DARK_GOLD, DARK_SECONDARY } from '@/contexts/WorkflowDarkModeContext';

interface WorkflowAIAssistantProps {
  workflowDarkMode?: boolean;
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function WorkflowAIAssistant({ 
  workflowDarkMode = false, 
  onClose, 
  isCollapsed = false,
  onToggleCollapse
}: WorkflowAIAssistantProps) {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'assistant'; message: string; timestamp: Date }[]>([
    { 
      type: 'assistant', 
      message: 'Hi there! I\'m your workflow assistant. I can help you build automations, provide suggestions, and answer questions about workflow features. How can I help you today?', 
      timestamp: new Date()
    }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom whenever chat history changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { type: 'user', message: message.trim(), timestamp: new Date() }]);
    
    // Clear input
    setMessage('');
    
    // Simulate AI thinking
    setIsThinking(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Example responses based on user message content
      let response = '';
      const userMsg = message.toLowerCase();
      
      if (userMsg.includes('automation') || userMsg.includes('automate')) {
        response = 'To create an automation, you can use the nodes from the left sidebar. Start with a trigger node, then add action nodes to define what happens when the trigger fires. Would you like me to recommend specific nodes for your automation?';
      } else if (userMsg.includes('node') || userMsg.includes('connect')) {
        response = 'You can add nodes by dragging them from the left sidebar. To connect nodes, click and drag from the output handle of one node to the input handle of another node. Need help with a specific node type?';
      } else if (userMsg.includes('template') || userMsg.includes('example')) {
        response = 'We have several workflow templates available. You can access them from the Templates tab in the navigation. Would you like me to suggest a template based on your use case?';
      } else if (userMsg.includes('help') || userMsg.includes('how to')) {
        response = 'I can help with building workflows, connecting nodes, setting up automations, and troubleshooting issues. Just tell me more specifically what you need help with.';
      } else {
        response = 'I understand you\'re working on your workflow. Could you tell me more about what you\'re trying to accomplish? I can provide tailored guidance for your specific needs.';
      }
      
      // Add AI response to chat history
      setChatHistory(prev => [...prev, { type: 'assistant', message: response, timestamp: new Date() }]);
      setIsThinking(false);
    }, 1000);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If collapsed, show only the header
  if (isCollapsed) {
    return (
      <div 
        className="flex flex-col shadow-lg z-10"
        style={{
          width: '60px',
          position: 'absolute',
          right: 0,
          top: '120px',
          bottom: '20px',
          backgroundColor: workflowDarkMode ? DARK_SECONDARY : '#fff',
          border: `1px solid ${workflowDarkMode ? DARK_GOLD : '#eaeaea'}`,
          borderRight: 'none',
          borderTopLeftRadius: '8px',
          borderBottomLeftRadius: '8px',
        }}
      >
        <div 
          className="flex items-center justify-center p-3 cursor-pointer"
          onClick={onToggleCollapse}
        >
          <Bot size={24} color={workflowDarkMode ? DARK_TEXT : '#333'} />
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-col shadow-lg z-10"
      style={{
        width: '350px',
        position: 'absolute',
        right: 0,
        top: '120px',
        bottom: '20px',
        backgroundColor: workflowDarkMode ? DARK_SECONDARY : '#fff',
        border: `1px solid ${workflowDarkMode ? DARK_GOLD : '#eaeaea'}`,
        borderRight: 'none',
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
      }}
    >
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3"
        style={{ 
          borderBottom: `1px solid ${workflowDarkMode ? DARK_GOLD : '#eaeaea'}`,
          backgroundColor: workflowDarkMode ? DARK_BG : '#f9f9f9'
        }}
      >
        <div className="flex items-center">
          <Bot size={18} className="mr-2" color={workflowDarkMode ? DARK_TEXT : '#333'} />
          <span style={{ color: workflowDarkMode ? DARK_TEXT : '#333', fontWeight: 500 }}>
            AI Workflow Assistant
          </span>
        </div>
        <div className="flex items-center">
          <button 
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-opacity-10 hover:bg-gray-500 mr-1"
          >
            <ChevronDown size={18} color={workflowDarkMode ? DARK_TEXT : '#555'} />
          </button>
          {onClose && (
            <button 
              onClick={onClose}
              className="p-1 rounded hover:bg-opacity-10 hover:bg-gray-500"
            >
              <X size={18} color={workflowDarkMode ? DARK_TEXT : '#555'} />
            </button>
          )}
        </div>
      </div>
      
      {/* Chat messages area */}
      <div 
        className="flex-1 overflow-y-auto p-4"
        style={{ 
          backgroundColor: workflowDarkMode ? DARK_BG : '#fff',
          borderBottom: `1px solid ${workflowDarkMode ? DARK_GOLD : '#eaeaea'}`
        }}
      >
        {chatHistory.map((chat, index) => (
          <div 
            key={index} 
            className={`mb-4 ${chat.type === 'user' ? 'flex justify-end' : 'flex justify-start'}`}
          >
            <div 
              style={{
                maxWidth: '85%',
                backgroundColor: chat.type === 'assistant' 
                  ? (workflowDarkMode ? 'rgba(160, 160, 160, 0.05)' : 'rgba(235, 235, 235, 0.5)') 
                  : (workflowDarkMode ? '#333333' : '#e9f5ff'),
                padding: '10px 14px',
                borderRadius: '12px',
                color: workflowDarkMode ? DARK_TEXT : '#333',
              }}
            >
              <div className="flex items-center mb-1">
                {chat.type === 'assistant' ? (
                  <Bot size={14} className="mr-1" color={workflowDarkMode ? DARK_GOLD : '#555'} />
                ) : (
                  <User size={14} className="mr-1" color={workflowDarkMode ? DARK_TEXT : '#2563eb'} />
                )}
                <span style={{ 
                  fontSize: '0.7rem', 
                  color: workflowDarkMode ? 'rgba(248, 248, 248, 0.6)' : '#555',
                  marginLeft: '4px'
                }}>
                  {chat.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div style={{ whiteSpace: 'pre-wrap' }}>{chat.message}</div>
            </div>
          </div>
        ))}
        
        {/* Thinking indicator */}
        {isThinking && (
          <div className="flex justify-start mb-4">
            <div 
              style={{
                maxWidth: '85%',
                backgroundColor: workflowDarkMode ? 'rgba(160, 160, 160, 0.1)' : 'rgba(235, 235, 235, 0.5)',
                padding: '10px 14px',
                borderRadius: '12px',
                color: workflowDarkMode ? DARK_TEXT : '#333',
              }}
            >
              <div className="flex items-center">
                <Bot size={14} className="mr-1" color={workflowDarkMode ? DARK_GOLD : '#555'} />
                <Loader size={16} className="animate-spin ml-2" color={workflowDarkMode ? DARK_TEXT : '#555'} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <div 
        className="p-3"
        style={{ backgroundColor: workflowDarkMode ? DARK_SECONDARY : '#f9f9f9' }}
      >
        <div 
          className="flex items-center"
          style={{
            backgroundColor: workflowDarkMode ? DARK_BG : '#fff',
            border: `1px solid ${workflowDarkMode ? DARK_GOLD : '#ddd'}`,
            borderRadius: '8px',
            padding: '8px 12px',
          }}
        >
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 outline-none bg-transparent resize-none"
            style={{ 
              height: '40px',
              maxHeight: '120px',
              color: workflowDarkMode ? DARK_TEXT : 'inherit',
            }}
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isThinking}
            className={`ml-2 p-2 rounded-full ${!message.trim() || isThinking ? 'opacity-50' : 'opacity-100'}`}
            style={{ 
              backgroundColor: workflowDarkMode ? DARK_GOLD : '#2563eb',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Send size={16} color="#fff" />
          </button>
        </div>
        <div 
          className="mt-2 text-xs flex justify-between items-center px-1"
          style={{ color: workflowDarkMode ? 'rgba(248, 248, 248, 0.5)' : '#888' }}
        >
          <span className="flex items-center">
            <Zap size={12} className="mr-1" />
            Suggested: How do I create an automation?
          </span>
          <span>Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
} 