import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Facebook, Linkedin, MessageSquare, Plus, Info, Check, Clock, AlertTriangle } from "lucide-react";
import { useCrmContacts } from "../hooks/useCrmContacts";
import { motion } from "framer-motion";

const STAGES = [
  { id: 'new', label: 'New', color: 'bg-gradient-to-b from-blue-500 to-blue-600', icon: <Plus className="h-4 w-4 text-white" /> },
  { id: 'needs-reply', label: 'Needs Reply', color: 'bg-gradient-to-b from-amber-500 to-amber-600', icon: <Clock className="h-4 w-4 text-white" /> },
  { id: 'responded', label: 'Responded', color: 'bg-gradient-to-b from-green-500 to-green-600', icon: <Check className="h-4 w-4 text-white" /> },
  { id: 'follow-up', label: 'Follow Up', color: 'bg-gradient-to-b from-purple-500 to-purple-600', icon: <AlertTriangle className="h-4 w-4 text-white" /> },
  { id: 'done', label: 'Done', color: 'bg-gradient-to-b from-gray-500 to-gray-600', icon: <Check className="h-4 w-4 text-white" /> },
];

const PLATFORM_ICONS = {
  whatsapp: <MessageSquare className="h-4 w-4 text-green-500" />,
  email: <Mail className="h-4 w-4 text-blue-500" />,
  facebook: <Facebook className="h-4 w-4 text-blue-700" />,
  linkedin: <Linkedin className="h-4 w-4 text-blue-600" />,
};

export const CrmPipeline: React.FC = () => {
  const { contacts, loading, updateContactStatus } = useCrmContacts();
  const [draggedContact, setDraggedContact] = React.useState<string | null>(null);
  const [showTooltip, setShowTooltip] = React.useState(true);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [activeStage, setActiveStage] = React.useState<string | null>(null);

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
  const handleBulkResponded = () => {
    selected.forEach(id => updateContactStatus(id, 'responded'));
    setSelected([]);
  };

  const DAY = 24 * 60 * 60 * 1000;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {showTooltip && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex items-center gap-2 bg-gradient-to-r from-blue-100 to-indigo-100 border border-blue-300 rounded-lg p-3 shadow-sm"
        >
          <Info className="h-5 w-5 text-blue-500" />
          <span className="text-blue-800">Drag cards to move them between stages! Select multiple to message in bulk.</span>
          <Button size="sm" variant="ghost" onClick={() => setShowTooltip(false)} className="ml-auto text-blue-700 hover:text-blue-900 hover:bg-blue-200/50">
            Dismiss
          </Button>
        </motion.div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-2 px-2">
        {STAGES.map(stage => (
          <motion.div
            key={stage.id}
            className={`${activeStage === stage.id ? 'bg-blue-100 ring-2 ring-blue-400' : 'bg-gray-50'} rounded-lg p-4 min-w-[260px] flex-1 shadow-md transition-all duration-300 ease-in-out`}
            onDragOver={(e) => handleDragOver(e, stage.id)}
            onDragLeave={handleDragLeave}
            onDrop={e => handleDrop(e, stage.id)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: STAGES.findIndex(s => s.id === stage.id) * 0.1 }}
          >
            <div className={`flex items-center justify-between mb-3 p-2 rounded-lg ${stage.color} text-white`}>
              <h3 className="font-medium text-base flex items-center gap-1">
                {stage.icon}
                {stage.label}
              </h3>
              <Button size="sm" variant="ghost" onClick={() => handleSelectAll(stage.id)} className="text-white/90 hover:text-white hover:bg-white/10">
                Select All
              </Button>
            </div>
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-1 custom-scrollbar">
              {contacts.filter(c => c.status === stage.id).map((contact, index) => (
                <motion.div
                  key={contact.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md p-3 flex flex-col gap-2 cursor-move border border-transparent hover:border-blue-400 transition-all duration-200"
                  draggable
                  onDragStart={() => handleDragStart(contact.id)}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selected.includes(contact.id)}
                      onChange={() => handleSelect(contact.id)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <div className="relative">
                      <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full ring-2 ring-gray-200" />
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                    </div>
                    <span className="font-medium text-base text-gray-800">{contact.name}</span>
                    <div className="flex gap-1 ml-auto">
                      {contact.platforms && contact.platforms.map(p => (
                        <span key={p} className="bg-gray-100 p-1 rounded-full">{PLATFORM_ICONS[p]}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded-md">{contact.last_message}</div>
                  <div className="flex flex-col gap-1">
                    <Button
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all" 
                      size="sm"
                      onClick={() => updateContactStatus(contact.id, 'needs-reply')}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" /> Send Message
                    </Button>
                    <Button
                      className="w-full" size="sm" variant="outline"
                      onClick={() => updateContactStatus(contact.id, 'responded')}
                    >
                      Simulate Reply
                    </Button>
                  </div>
                  {/* Overdue badge and auto-move to Follow Up */}
                  {contact.status === 'needs-reply' && contact.last_updated && (Date.now() - new Date(contact.last_updated).getTime() > 2 * DAY) && (
                    <div className="flex items-center gap-2 mt-1 bg-red-50 p-2 rounded-md">
                      <Badge variant="destructive" className="bg-gradient-to-r from-red-500 to-red-600">Overdue</Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-red-600 hover:text-red-700 hover:bg-red-100"
                        onClick={() => updateContactStatus(contact.id, 'follow-up')}
                      >
                        Move to Follow Up
                      </Button>
                    </div>
                  )}
                </motion.div>
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
      <motion.div 
        className="mt-4 flex gap-2 flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Button 
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all" 
          onClick={handleBulkMessage} 
          disabled={selected.length === 0}
        >
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message to Selected ({selected.length})
        </Button>
        <Button 
          className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg transition-all" 
          onClick={handleBulkResponded} 
          disabled={selected.length === 0}
        >
          <Check className="h-4 w-4 mr-2" />
          Mark as Responded
        </Button>
        <Button 
          className="bg-gray-200 text-gray-800 hover:bg-gray-300" 
          onClick={() => setSelected([])} 
          disabled={selected.length === 0}
        >
          Clear Selection
        </Button>
      </motion.div>
    </motion.div>
  );
};
