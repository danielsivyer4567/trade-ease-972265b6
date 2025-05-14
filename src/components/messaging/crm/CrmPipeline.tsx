import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Info, 
  Check, 
  Clock, 
  AlertTriangle, 
  MessageCircle, 
  ShieldAlert, 
  Hourglass, 
  UserCheck, 
  ReceiptText, 
  Truck, 
  PackageOpen, 
  HeartHandshake, 
  Star, 
  ThumbsUp,
  Search,
  Trash2,
  Filter,
  MoreHorizontal,
  Phone,
  Calendar,
  Tag,
  ArrowRight,
  Settings,
  Bell,
  RefreshCw
} from "lucide-react";
import { useCrmContacts, CrmPipelineType, CrmContact } from "../hooks/useCrmContacts";
import { motion, AnimatePresence } from "framer-motion";
import { ChannelIcon } from '../ChannelIcons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddContactDialog } from './AddContactDialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import './CrmPipeline.css';

// Define all pipeline stages with updated modern colors
const PRE_QUOTE_STAGES = [
  { id: 'new', label: 'New', color: 'bg-gradient-to-br from-blue-500 to-blue-600', icon: <Plus className="h-4 w-4 text-white" /> },
  { id: 'needs-reply', label: 'Needs Reply', color: 'bg-gradient-to-br from-amber-500 to-amber-600', icon: <Clock className="h-4 w-4 text-white" /> },
  { id: 'responded', label: 'Responded', color: 'bg-gradient-to-br from-green-500 to-green-600', icon: <MessageCircle className="h-4 w-4 text-white" /> },
  { id: 'follow-up', label: 'Follow Up', color: 'bg-gradient-to-br from-purple-500 to-purple-600', icon: <Hourglass className="h-4 w-4 text-white" /> },
  { id: 'done', label: 'Done', color: 'bg-gradient-to-br from-gray-500 to-gray-600', icon: <Check className="h-4 w-4 text-white" /> },
];

const POST_QUOTE_STAGES = [
  { id: 'accepted', label: 'Quote Accepted', color: 'bg-gradient-to-br from-green-500 to-green-600', icon: <UserCheck className="h-4 w-4 text-white" /> },
  { id: 'processing', label: 'Processing', color: 'bg-gradient-to-br from-blue-500 to-blue-600', icon: <ReceiptText className="h-4 w-4 text-white" /> },
  { id: 'shipped', label: 'Shipped', color: 'bg-gradient-to-br from-indigo-500 to-indigo-600', icon: <Truck className="h-4 w-4 text-white" /> },
  { id: 'delivered', label: 'Delivered', color: 'bg-gradient-to-br from-purple-500 to-purple-600', icon: <PackageOpen className="h-4 w-4 text-white" /> },
  { id: 'feedback', label: 'Feedback', color: 'bg-gradient-to-br from-amber-500 to-amber-600', icon: <Star className="h-4 w-4 text-white" /> },
  { id: 'completed', label: 'Completed', color: 'bg-gradient-to-br from-teal-500 to-teal-600', icon: <HeartHandshake className="h-4 w-4 text-white" /> },
];

const COMPLAINT_STAGES = [
  { id: 'new-complaint', label: 'New Complaint', color: 'bg-gradient-to-br from-red-500 to-red-600', icon: <ShieldAlert className="h-4 w-4 text-white" /> },
  { id: 'investigating', label: 'Investigating', color: 'bg-gradient-to-br from-amber-500 to-amber-600', icon: <AlertTriangle className="h-4 w-4 text-white" /> },
  { id: 'responding', label: 'Responding', color: 'bg-gradient-to-br from-blue-500 to-blue-600', icon: <MessageCircle className="h-4 w-4 text-white" /> },
  { id: 'resolved', label: 'Resolved', color: 'bg-gradient-to-br from-green-500 to-green-600', icon: <ThumbsUp className="h-4 w-4 text-white" /> },
];

// Map platform names to icons
const PLATFORM_ICONS = {
  whatsapp: <ChannelIcon name="whatsapp" size="sm" className="drop-shadow-md" />,
  email: <ChannelIcon name="email" size="sm" className="drop-shadow-md" />,
  facebook: <ChannelIcon name="facebook" size="sm" className="drop-shadow-md" />,
  linkedin: <ChannelIcon name="linkedin" size="sm" className="drop-shadow-md" />,
  tiktok: <ChannelIcon name="tiktok" size="sm" className="drop-shadow-md" />,
  sms: <ChannelIcon name="sms" size="sm" className="drop-shadow-md" />,
  phone: <ChannelIcon name="phone" size="sm" className="drop-shadow-md" />,
  twitter: <ChannelIcon name="twitter" size="sm" className="drop-shadow-md" />,
  instagram: <ChannelIcon name="instagram" size="sm" className="drop-shadow-md" />,
};

// Priority colors with updated styling
const PRIORITY_COLORS = {
  low: 'bg-blue-50 text-blue-800 border border-blue-200',
  medium: 'bg-yellow-50 text-yellow-800 border border-yellow-200',
  high: 'bg-orange-50 text-orange-800 border border-orange-200',
  urgent: 'bg-red-50 text-red-800 border border-red-200',
};

export const CrmPipeline: React.FC = () => {
  const { 
    contacts, 
    allContacts,
    loading, 
    activePipeline, 
    setActivePipeline,
    searchTerm,
    searchContacts,
    addContact,
    deleteContact,
    updateContactStatus,
    updateContactPipeline,
    updateContactPriority 
  } = useCrmContacts();
  
  const [draggedContact, setDraggedContact] = React.useState<string | null>(null);
  const [showTooltip, setShowTooltip] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [activeStage, setActiveStage] = React.useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState<string | null>(null);
  const [viewType, setViewType] = React.useState<'kanban' | 'list'>('kanban');

  // Get stages based on active pipeline
  const getStages = () => {
    switch (activePipeline) {
      case 'pre-quote':
        return PRE_QUOTE_STAGES;
      case 'post-quote':
        return POST_QUOTE_STAGES;
      case 'complaints':
        return COMPLAINT_STAGES;
      default:
        return PRE_QUOTE_STAGES;
    }
  };

  const stages = getStages();

  if (loading) return (
    <div className="p-8 text-center flex justify-center items-center h-[80vh]">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-spin flex items-center justify-center">
          <RefreshCw className="h-6 w-6 text-white animate-reverse-spin" />
        </div>
        <p className="text-lg font-medium text-gray-700">Loading CRM contacts...</p>
      </div>
    </div>
  );

  const moveContact = (contactId: string, targetStatus: string) => {
    updateContactStatus(contactId, targetStatus);
  };

  const handleDragStart = (contactId: string) => {
    setDraggedContact(contactId);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, stageId: string) => {
    e.preventDefault();
    setActiveStage(stageId);
  };
  
  const handleDragLeave = () => {
    setActiveStage(null);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    if (draggedContact) {
      moveContact(draggedContact, targetStatus);
      setDraggedContact(null);
      setActiveStage(null);
    }
  };

  // Bulk actions
  const handleSelect = (id: string) => {
    setSelected(sel => sel.includes(id) ? sel.filter(s => s !== id) : [...sel, id]);
  };
  
  const handleSelectAll = (status: string) => {
    const ids = contacts.filter(c => c.status === status).map(c => c.id);
    setSelected(sel => {
      const allSelected = ids.every(id => sel.includes(id));
      return allSelected ? sel.filter(id => !ids.includes(id)) : [...sel, ...ids.filter(id => !sel.includes(id))];
    });
  };
  
  const handleBulkMessage = () => {
    alert(`Send message to: ${selected.join(', ')}`);
  };
  
  const handleBulkMove = (targetStatus: string) => {
    selected.forEach(id => updateContactStatus(id, targetStatus));
    setSelected([]);
  };

  const handlePipelineChange = (value: CrmPipelineType) => {
    setActivePipeline(value);
    setSelected([]);
  };

  const handleMoveToPipeline = (contactId: string, pipeline: CrmPipelineType) => {
    updateContactPipeline(contactId, pipeline);
  };

  const handlePriorityChange = (contactId: string, priority: 'low' | 'medium' | 'high' | 'urgent') => {
    updateContactPriority(contactId, priority);
  };

  const handleDeleteContact = (id: string) => {
    if (confirmDelete === id) {
      deleteContact(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      // Auto-reset confirmation after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };

  const handleAddContact = (contactData: CrmContact) => {
    addContact(contactData);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    searchContacts(event.target.value);
  };

  const DAY = 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4 max-w-full px-1"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          {/* Header Section */}
          <div className="p-4 sm:p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Messaging CRM</span>
                  <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 font-normal">
                    {contacts.length} Contacts
                  </Badge>
                </h1>
                <p className="text-gray-500 mt-1">Manage your customer relationships and conversations</p>
              </div>
              
              <div className="flex items-center gap-3 self-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700">
                        <Bell className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Notifications</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button size="icon" variant="ghost" className="text-gray-500 hover:text-gray-700">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Settings</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  onClick={() => setAddDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Contact
                </Button>
              </div>
            </div>
            
            {/* Tabs and Search */}
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <Tabs 
                defaultValue={activePipeline}
                className="w-auto"
                onValueChange={(value) => handlePipelineChange(value as CrmPipelineType)}
              >
                <TabsList className="bg-gray-100/70 p-1 rounded-lg">
                  <TabsTrigger 
                    value="pre-quote" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
                  >
                    Pre-Quote
                  </TabsTrigger>
                  <TabsTrigger 
                    value="post-quote" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
                  >
                    Post-Quote
                  </TabsTrigger>
                  <TabsTrigger 
                    value="complaints" 
                    className="data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-md"
                  >
                    Complaints
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative flex-1 min-w-[200px] sm:min-w-[300px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Search contacts..." 
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 border-gray-200 rounded-lg bg-gray-50 focus:bg-white transition-all duration-200"
                  />
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-lg border-gray-200">
                      <Filter className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Filter by date</DropdownMenuItem>
                    <DropdownMenuItem>Filter by priority</DropdownMenuItem>
                    <DropdownMenuItem>Filter by platform</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        
          {/* Main Content */}
          <div className="p-4 sm:p-6">
            {showTooltip && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3 shadow-sm"
              >
                <Info className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-blue-800">Drag contacts between stages to update status. Select multiple to perform bulk actions.</span>
                <Button size="sm" variant="ghost" onClick={() => setShowTooltip(false)} className="ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-100/50">
                  Dismiss
                </Button>
              </motion.div>
            )}

            <div className="flex gap-4 overflow-x-auto pb-6 -mx-2 px-2 snap-x custom-scrollbar">
              {stages.map(stage => (
                <motion.div
                  key={stage.id}
                  className={`${
                    activeStage === stage.id 
                      ? 'bg-blue-50 ring-2 ring-blue-400 drop-target' 
                      : 'bg-white border border-gray-200 hover:border-blue-300'
                  } rounded-xl p-4 min-w-[300px] flex-1 shadow-sm hover:shadow-md transition-all duration-300 ease-in-out snap-start`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, stage.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: stages.findIndex(s => s.id === stage.id) * 0.1 }}
                >
                  <div className={`flex items-center justify-between mb-4 p-3 rounded-lg ${stage.color} shadow-md`}>
                    <h3 className="font-medium text-base flex items-center gap-2">
                      {stage.icon}
                      {stage.label}
                    </h3>
                    <div className="flex items-center gap-1">
                      <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                        {contacts.filter(c => c.status === stage.id).length}
                      </Badge>
                      <Button size="sm" variant="ghost" onClick={() => handleSelectAll(stage.id)} className="text-white/90 hover:text-white hover:bg-white/10">
                        Select All
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3 max-h-[calc(100vh-350px)] overflow-y-auto pr-1 custom-scrollbar">
                    <AnimatePresence>
                      {contacts.filter(c => c.status === stage.id).map((contact, index) => (
                        <ContactCard 
                          key={contact.id}
                          contact={contact}
                          index={index}
                          isSelected={selected.includes(contact.id)}
                          onSelect={() => handleSelect(contact.id)}
                          onDragStart={() => handleDragStart(contact.id)}
                          onStatusChange={(status) => updateContactStatus(contact.id, status)}
                          onPipelineChange={(pipeline) => handleMoveToPipeline(contact.id, pipeline)}
                          onPriorityChange={(priority) => handlePriorityChange(contact.id, priority)}
                          onDelete={() => handleDeleteContact(contact.id)}
                          confirmDelete={confirmDelete === contact.id}
                          stages={stages}
                          activePipeline={activePipeline}
                        />
                      ))}
                    </AnimatePresence>
                    {contacts.filter(c => c.status === stage.id).length === 0 && (
                      <div className="text-center py-6 text-gray-400 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                        <p>No contacts in this stage</p>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="mt-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => setAddDialogOpen(true)}
                        >
                          <Plus className="h-3 w-3 mr-1" /> Add Contact
                        </Button>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bulk actions toolbar */}
            {selected.length > 0 && (
              <motion.div 
                className="mt-6 p-3 bg-white border border-gray-200 rounded-lg shadow-lg fixed bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all" 
                  onClick={handleBulkMessage} 
                >
                  <ChannelIcon name="sms" size="sm" className="mr-2" />
                  Message Selected ({selected.length})
                </Button>
                
                <Select onValueChange={(value) => handleBulkMove(value)}>
                  <SelectTrigger className="w-auto border-gray-200">
                    <SelectValue placeholder="Move to stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stage.color.replace('bg-gradient-to-br', 'bg')}`}></div>
                          {stage.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  className="border-gray-200 hover:bg-gray-100" 
                  variant="outline"
                  onClick={() => setSelected([])} 
                >
                  Clear Selection
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <AddContactDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen}
        onAddContact={handleAddContact}
      />
    </motion.div>
  );
};

// Contact card component
interface ContactCardProps {
  contact: CrmContact;
  index: number;
  isSelected: boolean;
  confirmDelete: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onStatusChange: (status: string) => void;
  onPipelineChange: (pipeline: CrmPipelineType) => void;
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | 'urgent') => void;
  onDelete: () => void;
  stages: { id: string; label: string; color: string; icon: JSX.Element }[];
  activePipeline: CrmPipelineType;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  index,
  isSelected,
  confirmDelete,
  onSelect,
  onDragStart,
  onStatusChange,
  onPipelineChange,
  onPriorityChange,
  onDelete,
  stages,
  activePipeline
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [showActions, setShowActions] = React.useState(false);
  const [showActionMenu, setShowActionMenu] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Format timestamp (just for display purposes)
  const getTimeAgo = () => {
    const options: Intl.DateTimeFormatOptions = { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(Date.now()).toLocaleString('en-US', options);
  };

  // Get appropriate icon based on priority
  const getPriorityIcon = () => {
    switch (contact.priority) {
      case 'urgent':
        return <AlertTriangle className="h-3 w-3 text-red-600" />;
      case 'high':
        return <ArrowRight className="h-3 w-3 text-orange-600" />;
      case 'medium':
        return <ArrowRight className="h-3 w-3 text-yellow-600" />;
      case 'low':
        return <ArrowRight className="h-3 w-3 text-blue-600" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`${
        isSelected ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50/80'
      } ${isDragging ? 'dragging' : ''} rounded-xl shadow-sm hover:shadow p-3 flex flex-col gap-2 cursor-move border border-gray-200 transition-all duration-200 highlight-new`}
      draggable
      onDragStart={() => {
        setIsDragging(true);
        onDragStart();
      }}
      onDragEnd={() => setIsDragging(false)}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="rounded text-blue-600 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          />
        </div>
        
        <div className="relative">
          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
            <AvatarImage src={contact.avatar} alt={contact.name} />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              {contact.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          {/* Online indicator would go here if we had that property */}
        </div>
        
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            <span className="font-medium text-gray-900 truncate">{contact.name}</span>
            {getPriorityIcon()}
          </div>
          
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Phone className="h-3 w-3" />
            <span>{contact.phone || "+1 (415) 555-0123"}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2 ml-auto">
          {contact.platforms && contact.platforms.map(p => (
            <span key={p} className="bg-gray-100 p-1.5 rounded-full flex items-center justify-center shadow-sm">
              {PLATFORM_ICONS[p]}
            </span>
          ))}
          
          {showActions && (
            <DropdownMenu open={showActionMenu} onOpenChange={setShowActionMenu}>
              <DropdownMenuTrigger asChild>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 p-0 rounded-full" 
                >
                  <MoreHorizontal className="h-4 w-4 text-gray-500" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => {}}>
                  <MessageCircle className="h-4 w-4 mr-2" /> Start conversation
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Calendar className="h-4 w-4 mr-2" /> Schedule follow-up
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Tag className="h-4 w-4 mr-2" /> Add tags
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onDelete}
                  className={confirmDelete ? "text-red-600 bg-red-50" : "text-red-600 hover:bg-red-50"}
                >
                  <Trash2 className="h-4 w-4 mr-2" /> 
                  {confirmDelete ? "Confirm delete" : "Delete contact"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      
      {/* Last message bubble */}
      <div className="flex gap-2 mt-1">
        <div className="w-6"></div> {/* Spacer to align with avatar */}
        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-xl rounded-tl-none border border-gray-100 flex-1">
          {contact.last_message.length > 80 && !expanded 
            ? `${contact.last_message.substring(0, 80)}...` 
            : contact.last_message}
          {contact.last_message.length > 80 && (
            <button 
              type="button"
              onClick={() => setExpanded(!expanded)} 
              className="text-blue-600 hover:text-blue-700 ml-1 font-medium text-xs"
            >
              {expanded ? 'Show less' : 'Show more'}
            </button>
          )}
          <div className="text-xs text-gray-400 mt-1 flex items-center justify-end">
            {getTimeAgo()} 
            <Check className="h-3 w-3 ml-1 text-blue-600" />
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex flex-col gap-2 mt-1">
        <div className="flex gap-2">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all" 
            size="sm"
            onClick={() => {}}
          >
            <ChannelIcon name="sms" size="sm" className="mr-1" /> Message
          </Button>
          
          <Select onValueChange={onPriorityChange} defaultValue={contact.priority}>
            <SelectTrigger className="flex-1 h-9 border-gray-200">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  Low
                </div>
              </SelectItem>
              <SelectItem value="medium">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  Medium
                </div>
              </SelectItem>
              <SelectItem value="high">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  High
                </div>
              </SelectItem>
              <SelectItem value="urgent">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  Urgent
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Select onValueChange={onStatusChange}>
            <SelectTrigger className="flex-1 h-9 border-gray-200">
              <SelectValue placeholder="Change Stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color.replace('bg-gradient-to-br', 'bg')}`}></div>
                    {stage.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {activePipeline === 'pre-quote' && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white shadow-sm"
              onClick={() => {
                onPipelineChange('post-quote');
                onStatusChange('accepted');
              }}
            >
              <Check className="h-4 w-4 mr-1" /> Accept Quote
            </Button>
          )}
          
          {activePipeline !== 'complaints' && (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
              onClick={() => {
                onPipelineChange('complaints');
                onStatusChange('new-complaint');
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-1" /> Issue
            </Button>
          )}
        </div>
      </div>
      
      {/* Tags section */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100/70 text-gray-700 hover:bg-gray-200/70 transition-colors">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};
