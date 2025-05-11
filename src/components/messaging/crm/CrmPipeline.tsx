import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Facebook, Linkedin, MessageSquare, Plus, Info } from "lucide-react";
import { useCrmContacts } from "../hooks/useCrmContacts";

const STAGES = [
  { id: 'new', label: 'New' },
  { id: 'needs-reply', label: 'Needs Reply' },
  { id: 'responded', label: 'Responded' },
  { id: 'follow-up', label: 'Follow Up' },
  { id: 'done', label: 'Done' },
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

  if (loading) return <div className="p-8 text-center text-lg">Loading CRM contacts...</div>;

  const moveContact = (contactId: string, targetStatus: string) => {
    updateContactStatus(contactId, targetStatus);
  };

  const handleDragStart = (contactId: string) => {
    setDraggedContact(contactId);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStatus: string) => {
    e.preventDefault();
    if (draggedContact) {
      moveContact(draggedContact, targetStatus);
      setDraggedContact(null);
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
    <div>
      {showTooltip && (
        <div className="mb-4 flex items-center gap-2 bg-blue-100 border border-blue-300 rounded p-2">
          <Info className="h-5 w-5 text-blue-500" />
          <span>Drag cards to move them between stages! Select multiple to message in bulk.</span>
          <Button size="sm" variant="ghost" onClick={() => setShowTooltip(false)}>Dismiss</Button>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-2">
        {STAGES.map(stage => (
          <div
            key={stage.id}
            className="bg-gray-100 rounded-lg p-4 min-w-[260px] flex-1"
            onDragOver={handleDragOver}
            onDrop={e => handleDrop(e, stage.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg">{stage.label}</h3>
              <Button size="sm" variant="ghost" onClick={() => handleSelectAll(stage.id)}>
                Select All
              </Button>
            </div>
            {contacts.filter(c => c.status === stage.id).map(contact => (
              <div
                key={contact.id}
                className="bg-white rounded shadow p-3 mb-3 flex flex-col gap-2 cursor-move border-2 border-transparent hover:border-blue-400"
                draggable
                onDragStart={() => handleDragStart(contact.id)}
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selected.includes(contact.id)}
                    onChange={() => handleSelect(contact.id)}
                  />
                  <img src={contact.avatar} alt={contact.name} className="w-8 h-8 rounded-full" />
                  <span className="font-medium text-base">{contact.name}</span>
                  <div className="flex gap-1 ml-auto">
                    {contact.platforms && contact.platforms.map(p => (
                      <span key={p}>{PLATFORM_ICONS[p]}</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm text-gray-600">{contact.last_message}</div>
                <Button
                  className="w-full" size="sm" variant="secondary"
                  onClick={() => updateContactStatus(contact.id, 'needs-reply')}
                >
                  <MessageSquare className="h-4 w-4 mr-1" /> Send Message
                </Button>
                <Button
                  className="w-full mt-1" size="sm" variant="outline"
                  onClick={() => updateContactStatus(contact.id, 'responded')}
                >
                  Simulate Reply
                </Button>
                {/* Overdue badge and auto-move to Follow Up */}
                {contact.status === 'needs-reply' && contact.last_updated && (Date.now() - new Date(contact.last_updated).getTime() > 2 * DAY) && (
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="destructive">Overdue</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => updateContactStatus(contact.id, 'follow-up')}
                    >
                      Move to Follow Up
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Button className="bg-blue-600 text-white" onClick={handleBulkMessage} disabled={selected.length === 0}>
          Send Message to Selected
        </Button>
        <Button className="bg-green-600 text-white" onClick={handleBulkResponded} disabled={selected.length === 0}>
          Mark as Responded
        </Button>
        <Button className="bg-gray-300" onClick={() => setSelected([])} disabled={selected.length === 0}>
          Clear Selection
        </Button>
      </div>
    </div>
  );
};
