import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CrmPipelineType } from '../hooks/useCrmContacts';
import { Check, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddContact: (contactData: any) => void;
}

export const AddContactDialog: React.FC<AddContactDialogProps> = ({
  open,
  onOpenChange,
  onAddContact
}) => {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [pipeline, setPipeline] = React.useState<CrmPipelineType>('pre-quote');
  const [priority, setPriority] = React.useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [platformInput, setPlatformInput] = React.useState('');
  const [platforms, setPlatforms] = React.useState<string[]>(['email']);
  const [tagInput, setTagInput] = React.useState('');
  const [tags, setTags] = React.useState<string[]>([]);

  const getInitialStatus = (pipeline: CrmPipelineType): string => {
    switch(pipeline) {
      case 'pre-quote': return 'new';
      case 'post-quote': return 'accepted';
      case 'complaints': return 'new-complaint';
      default: return 'new';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newContact = {
      id: `new-${Date.now()}`,
      name,
      email,
      phone: phone || undefined,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4299E1&color=fff`,
      status: getInitialStatus(pipeline),
      pipeline,
      platforms,
      last_message: message,
      last_updated: new Date().toISOString(),
      priority,
      tags: tags.length > 0 ? tags : undefined
    };
    
    onAddContact(newContact);
    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
    setPipeline('pre-quote');
    setPriority('medium');
    setPlatformInput('');
    setPlatforms(['email']);
    setTagInput('');
    setTags([]);
  };

  const handleAddPlatform = () => {
    if (platformInput && !platforms.includes(platformInput)) {
      setPlatforms([...platforms, platformInput]);
      setPlatformInput('');
    }
  };

  const handleRemovePlatform = (platform: string) => {
    setPlatforms(platforms.filter(p => p !== platform));
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags([...tags, tagInput]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const availablePlatforms = [
    'email', 'whatsapp', 'facebook', 'linkedin', 'twitter', 
    'instagram', 'tiktok', 'sms', 'phone'
  ].filter(p => !platforms.includes(p));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            Add New Contact
          </DialogTitle>
          <DialogDescription>
            Create a new contact in the CRM system
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="John Doe" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="john@example.com" 
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (optional)</Label>
            <Input 
              id="phone" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="+1 (555) 123-4567" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pipeline">Pipeline</Label>
            <Select 
              value={pipeline} 
              onValueChange={(value) => setPipeline(value as CrmPipelineType)}
            >
              <SelectTrigger id="pipeline">
                <SelectValue placeholder="Select pipeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pre-quote">Pre-Quote</SelectItem>
                <SelectItem value="post-quote">Post-Quote</SelectItem>
                <SelectItem value="complaints">Complaints</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select 
              value={priority} 
              onValueChange={(value) => setPriority(value as any)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Communication Platforms</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {platforms.map(platform => (
                <Badge 
                  key={platform} 
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {platform}
                  <button 
                    type="button" 
                    onClick={() => handleRemovePlatform(platform)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Select 
                value={platformInput} 
                onValueChange={setPlatformInput}
                disabled={availablePlatforms.length === 0}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Add platform" />
                </SelectTrigger>
                <SelectContent>
                  {availablePlatforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddPlatform}
                disabled={!platformInput}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                placeholder="Add new tag"
                className="flex-1"
              />
              <Button 
                type="button" 
                size="sm" 
                onClick={handleAddTag}
                disabled={!tagInput}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Initial Message</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="Enter the initial message from this contact"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              <Check className="h-4 w-4 mr-2" /> Add Contact
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 