import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, AtSign, FileText, Code, FolderOpen, GitBranch, Book, AlertCircle, Check } from 'lucide-react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { v4 as uuidv4 } from 'uuid';
import { WorkflowContextPredictor, ContextLabel, WorkflowContextCategories } from './WorkflowContextPrediction';

// Security and validation constants
const SECURITY_CONSTANTS = {
  MAX_PROMPT_LENGTH: 500,
  MAX_CONTEXT_LENGTH: 200,
  MAX_WORKFLOW_NODES: 50,
  RATE_LIMIT_REQUESTS: 10, // per minute
  MAX_MESSAGES_HISTORY: 100,
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  SUSPICIOUS_ACTIVITY_THRESHOLD: 5,
  MAX_FAILED_ATTEMPTS: 3,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  DEVICE_TRACKING_ENABLED: true,
  REQUEST_TIMEOUT: 10000, // 10 seconds
};

// Extended forbidden patterns
const FORBIDDEN_PATTERNS = {
  SYSTEM_COMMANDS: [
    'sudo', 'exec', 'eval', 'system', 'shell', 'process',
    'require', 'import', 'export', 'module'
  ],
  DATABASE_OPERATIONS: [
    'SELECT', 'INSERT', 'UPDATE', 'DELETE', 'DROP', 'ALTER', 
    'CREATE', 'MODIFY', 'SCHEMA', 'DATABASE'
  ],
  FILE_OPERATIONS: [
    'readFile', 'writeFile', 'unlink', 'fs', 'path',
    'file:', 'data:', 'https:', 'ftp:', '.env'
  ],
  NETWORK_OPERATIONS: [
    'fetch', 'http', 'xhr', 'websocket', 'socket',
    'request', 'response', 'network'
  ],
  SENSITIVE_PATTERNS: [
    'password', 'token', 'secret', 'key', 'auth',
    'admin', 'root', 'superuser', 'config'
  ]
};

// Define allowed workflow operations with strict typing
type WorkflowOperation = 'create' | 'edit' | 'view' | 'delete' | 'search';
type WorkflowContext = 'personal-workflow' | 'task-workflow' | 'project-workflow';

interface WorkflowPermissions {
  operation: WorkflowOperation;
  context: WorkflowContext;
  userId: string;
  timestamp: number;
}

const ALLOWED_WORKFLOW_OPERATIONS: Record<WorkflowOperation, boolean> = {
  create: true,
  edit: true,
  view: true,
  delete: true,
  search: true
};

const WORKFLOW_RESTRICTIONS = {
  SCOPE: 'user-specific',
  ALLOWED_CONTEXTS: ['personal-workflow', 'task-workflow', 'project-workflow'] as WorkflowContext[],
  FORBIDDEN_OPERATIONS: ['system-modification', 'app-structure', 'database-schema', 'security-settings'],
  MAX_DEPTH: 3, // Maximum nested workflow depth
  ALLOWED_NODE_TYPES: ['task', 'condition', 'action', 'timer', 'notification']
};

// Rate limiting implementation
class RateLimiter {
  private requests: number[];
  private windowMs: number;

  constructor(windowMs: number = 60000) { // 1 minute window
    this.requests = [];
    this.windowMs = windowMs;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.windowMs);
    if (this.requests.length >= SECURITY_CONSTANTS.RATE_LIMIT_REQUESTS) {
      return false;
    }
    this.requests.push(now);
    return true;
  }
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  tags?: { type: string; id: string; label: string }[];
  timestamp: number;
  validated: boolean;
}

interface WorkflowAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerateWorkflow: (prompt: string, permissions: WorkflowPermissions) => void;
  onEditWorkflow: (nodeId: string, changes: any, permissions: WorkflowPermissions) => void;
  onDeleteNode: (nodeId: string, permissions: WorkflowPermissions) => void;
  messages: Message[];
  onUpdateMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  availableNodes: { id: string; type: string; label: string }[];
  userId: string;
  userRole: string;
}

// Session management
interface SessionData {
  sessionId: string;
  startTime: number;
  lastActivity: number;
  deviceInfo: DeviceInfo;
  csrfToken: string;
}

interface DeviceInfo {
  id: string;
  userAgent: string;
  screenResolution: string;
  timezone: string;
  language: string;
  platform: string;
}

// Activity monitoring
interface ActivityLog {
  timestamp: number;
  action: string;
  userId: string;
  deviceInfo: DeviceInfo;
  status: 'success' | 'failure' | 'blocked';
  details?: string;
}

// Security monitoring class
class SecurityMonitor {
  private static instance: SecurityMonitor;
  private activityLogs: ActivityLog[] = [];
  private failedAttempts: Map<string, number> = new Map();
  private lockedUsers: Map<string, number> = new Map();

  private constructor() {}

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor();
    }
    return SecurityMonitor.instance;
  }

  logActivity(activity: ActivityLog) {
    this.activityLogs.push(activity);
    this.detectSuspiciousActivity(activity);
  }

  private detectSuspiciousActivity(activity: ActivityLog) {
    if (activity.status === 'failure') {
      const currentFails = (this.failedAttempts.get(activity.userId) || 0) + 1;
      this.failedAttempts.set(activity.userId, currentFails);

      if (currentFails >= SECURITY_CONSTANTS.MAX_FAILED_ATTEMPTS) {
        this.lockUser(activity.userId);
      }
    }
  }

  private lockUser(userId: string) {
    this.lockedUsers.set(userId, Date.now() + SECURITY_CONSTANTS.LOCKOUT_DURATION);
    // Implement notification system here
  }

  isUserLocked(userId: string): boolean {
    const lockExpiry = this.lockedUsers.get(userId);
    if (lockExpiry && lockExpiry > Date.now()) {
      return true;
    }
    this.lockedUsers.delete(userId);
    return false;
  }

  clearFailedAttempts(userId: string) {
    this.failedAttempts.delete(userId);
  }
}

// Session management class
class SessionManager {
  private static instance: SessionManager;
  private sessions: Map<string, SessionData> = new Map();

  private constructor() {}

  static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  createSession(userId: string): SessionData {
    const deviceInfo = this.getDeviceInfo();
    const sessionData: SessionData = {
      sessionId: uuidv4(),
      startTime: Date.now(),
      lastActivity: Date.now(),
      deviceInfo,
      csrfToken: uuidv4(),
    };
    this.sessions.set(userId, sessionData);
    return sessionData;
  }

  private getDeviceInfo(): DeviceInfo {
    return {
      id: uuidv4(),
      userAgent: window.navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: window.navigator.language,
      platform: window.navigator.platform,
    };
  }

  updateActivity(userId: string) {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = Date.now();
    }
  }

  isSessionValid(userId: string): boolean {
    const session = this.sessions.get(userId);
    if (!session) return false;

    const isExpired = Date.now() - session.lastActivity > SECURITY_CONSTANTS.SESSION_TIMEOUT;
    if (isExpired) {
      this.sessions.delete(userId);
      return false;
    }
    return true;
  }

  validateCsrfToken(userId: string, token: string): boolean {
    const session = this.sessions.get(userId);
    return session?.csrfToken === token;
  }
}

// Export the WorkflowAIModal component
export function WorkflowAIModal({ 
  isOpen, 
  onClose, 
  onGenerateWorkflow,
  onEditWorkflow,
  onDeleteNode,
  messages,
  onUpdateMessages,
  availableNodes,
  userId,
  userRole
}: WorkflowAIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [contextQuery, setContextQuery] = useState('');
  const [selectedContext, setSelectedContext] = useState<ContextLabel | null>(null);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextSuggestions, setContextSuggestions] = useState<ContextLabel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const contextPredictor = useRef(new WorkflowContextPredictor());
  const rateLimiter = useRef(new RateLimiter());
  const securityMonitor = useRef(SecurityMonitor.getInstance());
  const sessionManager = useRef(SessionManager.getInstance());
  
  // Initialize session
  useEffect(() => {
    if (isOpen && userId) {
      const session = sessionManager.current.createSession(userId);
      setSessionData(session);
    }
  }, [isOpen, userId]);

  // Session activity monitoring
  useEffect(() => {
    if (!userId || !sessionData) return;

    const checkSession = setInterval(() => {
      if (!sessionManager.current.isSessionValid(userId)) {
        onClose();
        setError('Session expired. Please refresh the page.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSession);
  }, [userId, sessionData]);

  // Update suggestions when context query changes
  useEffect(() => {
    const suggestions = contextPredictor.current.getSuggestions(contextQuery, userId);
    setContextSuggestions(suggestions);
  }, [contextQuery, userId]);

  // Handle context selection
  const handleContextSelect = (label: ContextLabel) => {
    setSelectedContext(label);
    setContextQuery(label.label);
    contextPredictor.current.recordUsage(label, userId);
    setShowContextMenu(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Handle context interaction
  const handleContextInteraction = () => {
    setShowContextMenu(true);
    if (!contextQuery.trim()) {
      const allSuggestions = contextPredictor.current.getSuggestions('', userId);
      setContextSuggestions(allSuggestions);
    }
  };

  // Sample context items (replace with actual data)
  const contextItems = [
    {
      group: "Recent Files",
      items: [
        { id: 'index', icon: <FileText className="h-4 w-4" />, label: 'index.new.tsx', path: 'src/pages/Workflow' },
        { id: 'main', icon: <FileText className="h-4 w-4" />, label: 'MainContent.tsx', path: 'src/components/ui' },
        { id: 'supabase', icon: <FileText className="h-4 w-4" />, label: 'supabase.ts', path: 'src/config' },
      ]
    },
    {
      group: "Categories",
      items: [
        { id: 'files', icon: <FolderOpen className="h-4 w-4" />, label: 'Files & Folders', shortcut: '⌘P' },
        { id: 'code', icon: <Code className="h-4 w-4" />, label: 'Code' },
        { id: 'docs', icon: <Book className="h-4 w-4" />, label: 'Docs' },
        { id: 'git', icon: <GitBranch className="h-4 w-4" />, label: 'Git' },
      ]
    }
  ];

  // Input sanitization
  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  // Content validation
  const validateContent = (content: string): boolean => {
    if (!content.trim()) return false;
    
    // Check for forbidden patterns
    for (const category in FORBIDDEN_PATTERNS) {
      const patterns = FORBIDDEN_PATTERNS[category as keyof typeof FORBIDDEN_PATTERNS];
      if (patterns.some(pattern => content.toLowerCase().includes(pattern.toLowerCase()))) {
        setError(`Content contains forbidden pattern from category: ${category}`);
        return false;
      }
    }
    return true;
  };

  // Workflow operation validation
  const validateWorkflowOperation = (
    operation: WorkflowOperation,
    context: WorkflowContext,
    content: string
  ): boolean => {
    // Check if operation is allowed
    if (!ALLOWED_WORKFLOW_OPERATIONS[operation]) {
      setError(`Operation ${operation} is not allowed`);
      return false;
    }

    // Check context restrictions
    if (!WORKFLOW_RESTRICTIONS.ALLOWED_CONTEXTS.includes(context)) {
      setError(`Context ${context} is not allowed`);
      return false;
    }

    // Validate content length
    if (content.length > SECURITY_CONSTANTS.MAX_PROMPT_LENGTH) {
      setError(`Content exceeds maximum length of ${SECURITY_CONSTANTS.MAX_PROMPT_LENGTH} characters`);
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Check rate limiting
      if (!rateLimiter.current.canMakeRequest()) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Check session validity
      if (!sessionManager.current.isSessionValid(userId)) {
        throw new Error('Session expired. Please refresh the page.');
      }

      // Sanitize and validate input
      const sanitizedPrompt = sanitizeInput(prompt);
      if (!validateContent(sanitizedPrompt)) {
        throw new Error('Invalid content');
      }

      // Create workflow permissions
      const permissions: WorkflowPermissions = {
        operation: 'create',
        context: selectedContext?.id as WorkflowContext || 'personal-workflow',
        userId,
        timestamp: Date.now()
      };

      // Validate workflow operation
      if (!validateWorkflowOperation(permissions.operation, permissions.context, sanitizedPrompt)) {
        throw new Error('Invalid workflow operation');
      }

      // Log successful activity
      securityMonitor.current.logActivity({
        timestamp: Date.now(),
        action: 'create_workflow',
        userId,
        deviceInfo: sessionData?.deviceInfo || {
          id: 'unknown',
          userAgent: '',
          screenResolution: '',
          timezone: '',
          language: '',
          platform: ''
        },
        status: 'success',
        details: 'Workflow creation initiated'
      });

      // Create user message
      const userMessage: Message = {
        role: 'user',
        content: sanitizedPrompt,
        timestamp: Date.now(),
        validated: true
      };

      // Update messages
      onUpdateMessages(prev => {
        const newMessages = [...prev, userMessage].slice(-SECURITY_CONSTANTS.MAX_MESSAGES_HISTORY);
        return newMessages;
      });

      // Generate workflow with timeout
      await Promise.race([
        onGenerateWorkflow(sanitizedPrompt, permissions),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), SECURITY_CONSTANTS.REQUEST_TIMEOUT)
        )
      ]);

      // Reset state on success
      setPrompt('');
      securityMonitor.current.clearFailedAttempts(userId);

    } catch (err: any) {
      const errorMessage = err?.message || 'An error occurred while processing your request';
      logFailedAttempt(errorMessage);
    }
  };

  // Log failed attempts
  const logFailedAttempt = (details: string) => {
    securityMonitor.current.logActivity({
      timestamp: Date.now(),
      action: 'create_workflow',
      userId,
      deviceInfo: sessionData?.deviceInfo || {
        id: 'unknown',
        userAgent: '',
        screenResolution: '',
        timezone: '',
        language: '',
        platform: ''
      },
      status: 'failure',
      details
    });
    setError(details);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setPrompt('');
      setContextQuery('');
      setError(null);
      setSessionData(null);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'p') {
        e.preventDefault();
        setShowContextMenu(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Personal Workflow Assistant
          </DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-400">
          Plan, search, build your personal workflows
        </p>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm bg-red-100/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        <div className="flex flex-1 gap-4">
          {/* Left side - Conversation History */}
          <div className="flex-1">
            <ScrollArea className="h-full px-4 py-2 border rounded-md">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  <div
                    className={`inline-block max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Right side - Triggers and Context */}
          <div className="w-64 border-l pl-4">
            <h3 className="text-sm font-semibold mb-2">Quick Triggers</h3>
            <div className="space-y-2">
              {contextItems.map((group) => (
                <div key={group.group} className="space-y-1">
                  <h4 className="text-xs text-gray-500 uppercase tracking-wider">{group.group}</h4>
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setContextQuery(item.label);
                        setShowContextMenu(true);
                      }}
                      className="w-full flex items-center gap-2 p-2 text-sm rounded hover:bg-gray-100 transition-colors"
                    >
                      {item.icon}
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.shortcut && (
                        <span className="text-xs text-gray-500">{item.shortcut}</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Input Section */}
        <div className="space-y-2">
          {/* Context Search with Predictions */}
          <div className="relative">
            <Popover open={showContextMenu} onOpenChange={setShowContextMenu}>
              <PopoverTrigger asChild>
                <div className="relative">
                  <Input
                    value={contextQuery}
                    onChange={(e) => setContextQuery(e.target.value)}
                    onFocus={handleContextInteraction}
                    onClick={handleContextInteraction}
                    placeholder="Add workflow context"
                    className="w-full bg-gray-100/10 hover:bg-gray-100/15 focus:bg-gray-100/20 transition-colors pl-8"
                  />
                  <AtSign className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
              </PopoverTrigger>
              
              <PopoverContent className="w-[400px] p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search workflow contexts..." 
                    value={contextQuery}
                    onValueChange={setContextQuery}
                  />
                  <CommandList>
                    <CommandEmpty>No matching contexts found.</CommandEmpty>
                    {Object.entries(WorkflowContextCategories).map(([category, value]) => (
                      <CommandGroup key={category} heading={category}>
                        {contextSuggestions
                          .filter(label => label.category === value)
                          .map(label => (
                            <CommandItem
                              key={`${label.id}-${label.category}`}
                              value={label.id}
                              onSelect={() => handleContextSelect(label)}
                              className="flex items-center justify-between cursor-pointer"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{label.label}</span>
                                <span className="text-xs text-gray-500">{label.description}</span>
                              </div>
                              {selectedContext?.id === label.id && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </CommandItem>
                          ))}
                      </CommandGroup>
                    ))}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit}>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  ref={inputRef}
                  placeholder="e.g., Create a workflow for managing my construction projects..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="flex-1 bg-gray-100/5"
                />
              </div>
              <Button 
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={!prompt.trim()}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Workflow
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 