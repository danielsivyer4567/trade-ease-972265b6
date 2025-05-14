import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  ThumbsUp
} from "lucide-react";
import { useCrmContacts, CrmPipelineType, CrmContact } from "../hooks/useCrmContacts";
import { motion } from "framer-motion";
import { ChannelIcon } from '../ChannelIcons';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Define all pipeline stages
const PRE_QUOTE_STAGES = [
  { id: 'new', label: 'New', color: 'bg-gradient-to-b from-blue-500 to-blue-600', icon: <Plus className="h-4 w-4 text-white" /> },
  { id: 'needs-reply', label: 'Needs Reply', color: 'bg-gradient-to-b from-amber-500 to-amber-600', icon: <Clock className="h-4 w-4 text-white" /> },
  { id: 'responded', label: 'Responded', color: 'bg-gradient-to-b from-green-500 to-green-600', icon: <MessageCircle className="h-4 w-4 text-white" /> },
  { id: 'follow-up', label: 'Follow Up', color: 'bg-gradient-to-b from-purple-500 to-purple-600', icon: <Hourglass className="h-4 w-4 text-white" /> },
  { id: 'done', label: 'Done', color: 'bg-gradient-to-b from-gray-500 to-gray-600', icon: <Check className="h-4 w-4 text-white" /> },
];

const POST_QUOTE_STAGES = [
  { id: 'accepted', label: 'Quote Accepted', color: 'bg-gradient-to-b from-green-500 to-green-600', icon: <UserCheck className="h-4 w-4 text-white" /> },
  { id: 'processing', label: 'Processing', color: 'bg-gradient-to-b from-blue-500 to-blue-600', icon: <ReceiptText className="h-4 w-4 text-white" /> },
  { id: 'shipped', label: 'Shipped', color: 'bg-gradient-to-b from-indigo-500 to-indigo-600', icon: <Truck className="h-4 w-4 text-white" /> },
  { id: 'delivered', label: 'Delivered', color: 'bg-gradient-to-b from-purple-500 to-purple-600', icon: <PackageOpen className="h-4 w-4 text-white" /> },
  { id: 'feedback', label: 'Feedback', color: 'bg-gradient-to-b from-amber-500 to-amber-600', icon: <Star className="h-4 w-4 text-white" /> },
  { id: 'completed', label: 'Completed', color: 'bg-gradient-to-b from-teal-500 to-teal-600', icon: <HeartHandshake className="h-4 w-4 text-white" /> },
];

const COMPLAINT_STAGES = [
  { id: 'new-complaint', label: 'New Complaint', color: 'bg-gradient-to-b from-red-500 to-red-600', icon: <ShieldAlert className="h-4 w-4 text-white" /> },
  { id: 'investigating', label: 'Investigating', color: 'bg-gradient-to-b from-amber-500 to-amber-600', icon: <AlertTriangle className="h-4 w-4 text-white" /> },
  { id: 'responding', label: 'Responding', color: 'bg-gradient-to-b from-blue-500 to-blue-600', icon: <MessageCircle className="h-4 w-4 text-white" /> },
  { id: 'resolved', label: 'Resolved', color: 'bg-gradient-to-b from-green-500 to-green-600', icon: <ThumbsUp className="h-4 w-4 text-white" /> },
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

// Priority colors
const PRIORITY_COLORS = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

export const CrmPipeline: React.FC = () => {
  const { 
    contacts, 
    allContacts,
    loading, 
    activePipeline, 
    setActivePipeline,
    updateContactStatus,
    updateContactPipeline,
    updateContactPriority 
  } = useCrmContacts();
  
  const [draggedContact, setDraggedContact] = React.useState<string | null>(null);
  const [showTooltip, setShowTooltip] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [activeStage, setActiveStage] = React.useState<string | null>(null);

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
    <div className="p-8 text-center flex justify-center items-center">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 animate-spin"></div>
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

  const DAY = 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex items-center justify-between">
        <Card className="w-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>Messaging CRM</CardTitle>
              <Tabs 
                defaultValue={activePipeline}
                className="w-auto"
                onValueChange={(value) => handlePipelineChange(value as CrmPipelineType)}
              >
                <TabsList>
                  <TabsTrigger value="pre-quote">Pre-Quote</TabsTrigger>
                  <TabsTrigger value="post-quote">Post-Quote</TabsTrigger>
                  <TabsTrigger value="complaints">Complaints</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent>
            {showTooltip && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-3 shadow-sm"
              >
                <Info className="h-5 w-5 text-blue-500" />
                <span className="text-blue-800">Drag cards between stages to update status. Select multiple to perform bulk actions.</span>
                <Button size="sm" variant="ghost" onClick={() => setShowTooltip(false)} className="ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-200/50">
                  Dismiss
                </Button>
              </motion.div>
            )}

            <div className="flex gap-3 overflow-x-auto pb-4 -mx-2 px-2">
              {stages.map(stage => (
                <motion.div
                  key={stage.id}
                  className={`${activeStage === stage.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'} rounded-lg p-3 min-w-[260px] flex-1 shadow-md transition-all duration-300 ease-in-out`}
                  onDragOver={(e) => handleDragOver(e, stage.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={e => handleDrop(e, stage.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: stages.findIndex(s => s.id === stage.id) * 0.1 }}
                >
                  <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${stage.color} text-white`}>
                    <h3 className="font-medium text-base flex items-center gap-1">
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
                  <div className="space-y-3 max-h-[calc(100vh-380px)] overflow-y-auto pr-1 custom-scrollbar">
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
                        stages={stages}
                        activePipeline={activePipeline}
                      />
                    ))}
                    {contacts.filter(c => c.status === stage.id).length === 0 && (
                      <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                        <p>No contacts in this stage</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Bulk actions toolbar */}
            {selected.length > 0 && (
              <motion.div 
                className="mt-4 flex gap-2 flex-wrap"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Button 
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all" 
                  onClick={handleBulkMessage} 
                >
                  <ChannelIcon name="sms" size="sm" className="mr-2" />
                  Message Selected ({selected.length})
                </Button>
                
                <Select onValueChange={(value) => handleBulkMove(value)}>
                  <SelectTrigger className="w-auto">
                    <SelectValue placeholder="Move to stage..." />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map(stage => (
                      <SelectItem key={stage.id} value={stage.id}>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stage.color.replace('bg-gradient-to-b', 'bg')}`}></div>
                          {stage.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button 
                  className="bg-gray-200 text-gray-800 hover:bg-gray-300" 
                  onClick={() => setSelected([])} 
                >
                  Clear Selection
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

// Contact card component
interface ContactCardProps {
  contact: CrmContact;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: () => void;
  onStatusChange: (status: string) => void;
  onPipelineChange: (pipeline: CrmPipelineType) => void;
  onPriorityChange: (priority: 'low' | 'medium' | 'high' | 'urgent') => void;
  stages: { id: string; label: string; color: string; icon: JSX.Element }[];
  activePipeline: CrmPipelineType;
}

const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  index,
  isSelected,
  onSelect,
  onDragStart,
  onStatusChange,
  onPipelineChange,
  onPriorityChange,
  stages,
  activePipeline
}) => {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm hover:shadow-md p-3 flex flex-col gap-2 cursor-move border border-transparent hover:border-blue-400 transition-all duration-200"
      draggable
      onDragStart={onDragStart}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="rounded text-blue-600 focus:ring-blue-500"
        />
        <Avatar className="h-8 w-8">
          <AvatarImage src={contact.avatar} alt={contact.name} />
          <AvatarFallback>{contact.name.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-medium text-sm text-gray-800">{contact.name}</span>
          {contact.priority && (
            <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[contact.priority]}`}>
              {contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1)}
            </Badge>
          )}
        </div>
        <div className="flex gap-1 ml-auto">
          {contact.platforms && contact.platforms.map(p => (
            <span key={p} className="bg-gray-100 p-1 rounded-full">
              {PLATFORM_ICONS[p]}
            </span>
          ))}
        </div>
      </div>
      
      <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded-md">
        {contact.last_message.length > 80 && !expanded 
          ? `${contact.last_message.substring(0, 80)}...` 
          : contact.last_message}
        {contact.last_message.length > 80 && (
          <button 
            onClick={() => setExpanded(!expanded)} 
            className="text-blue-500 hover:text-blue-700 ml-1"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      <div className="flex flex-col gap-1">
        <div className="flex gap-1">
          <Button
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all" 
            size="sm"
            onClick={() => {}}
          >
            <ChannelIcon name="sms" size="sm" className="mr-1" /> Message
          </Button>
          
          <Select onValueChange={onPriorityChange} defaultValue={contact.priority}>
            <SelectTrigger className="flex-1 h-8">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-1">
          <Select onValueChange={onStatusChange}>
            <SelectTrigger className="flex-1 h-8">
              <SelectValue placeholder="Change Stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map(stage => (
                <SelectItem key={stage.id} value={stage.id}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color.replace('bg-gradient-to-b', 'bg')}`}></div>
                    {stage.label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {activePipeline === 'pre-quote' && (
            <Button
              size="sm"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                onPipelineChange('post-quote');
                onStatusChange('accepted');
              }}
            >
              Accept Quote
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
              Issue
            </Button>
          )}
        </div>
      </div>
      
      {/* Tags section */}
      {contact.tags && contact.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {contact.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs bg-gray-100">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </motion.div>
  );
};
