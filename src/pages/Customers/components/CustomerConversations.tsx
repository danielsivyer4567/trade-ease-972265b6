import React, { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Phone, MessageSquare, Smartphone, Facebook, Twitter, Instagram, MessageCircle, Search, Plus } from "lucide-react";
import { ClientContactNote } from '@/components/team/ClientContactNote';

interface CustomerConversationsProps {
  customerId: string;
}

export function CustomerConversations({ customerId }: CustomerConversationsProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState('');
  const [filterChannel, setFilterChannel] = useState('all');
  
  // Mock conversation data (in a real app, this would come from an API)
  const mockConversations = [
    {
      id: '1',
      channel: 'email',
      date: '2024-06-15',
      time: '14:30',
      content: 'I wanted to follow up on the quote you sent last week. Are there any other options we can consider?',
      from: 'Customer',
      subject: 'Re: Quote Follow-up'
    },
    {
      id: '2',
      channel: 'sms',
      date: '2024-06-10',
      time: '09:15',
      content: 'Can you provide an update on when the job will be completed?',
      from: 'Customer'
    },
    {
      id: '3',
      channel: 'phone',
      date: '2024-06-05',
      time: '11:45',
      content: 'Called to discuss project timeline. Customer is satisfied with progress but requested weekly updates.',
      from: 'Staff'
    },
    {
      id: '4',
      channel: 'whatsapp',
      date: '2024-05-28',
      time: '16:20',
      content: 'Sent photos of the project progress. Customer approved the current stage.',
      from: 'Staff'
    },
    {
      id: '5',
      channel: 'facebook',
      date: '2024-05-20',
      time: '13:05',
      content: 'Messaged us on Facebook to inquire about additional services.',
      from: 'Customer'
    }
  ];
  
  // Filter conversations based on search query and channel filter
  const filteredConversations = mockConversations.filter(conv => {
    const matchesSearch = conv.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (conv.subject && conv.subject.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesChannel = filterChannel === 'all' || conv.channel === filterChannel;
    return matchesSearch && matchesChannel;
  });
  
  // Get icon based on conversation channel
  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />;
      case 'phone':
        return <Phone className="h-4 w-4" />;
      case 'sms':
        return <MessageSquare className="h-4 w-4" />;
      case 'whatsapp':
        return <Smartphone className="h-4 w-4" />;
      case 'facebook':
        return <Facebook className="h-4 w-4" />;
      case 'twitter':
        return <Twitter className="h-4 w-4" />;
      case 'instagram':
        return <Instagram className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={filterChannel} onValueChange={setFilterChannel}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by channel" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Channels</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Phone</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="facebook">Facebook</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className="flex items-center gap-1">
            <Plus className="h-4 w-4" />
            New Conversation
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-white overflow-x-auto mb-4">
          <TabsTrigger value="all">All Communications</TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-1" /> Email
          </TabsTrigger>
          <TabsTrigger value="messaging">
            <MessageSquare className="h-4 w-4 mr-1" /> Messaging
          </TabsTrigger>
          <TabsTrigger value="phone">
            <Phone className="h-4 w-4 mr-1" /> Phone
          </TabsTrigger>
          <TabsTrigger value="social">
            <Facebook className="h-4 w-4 mr-1" /> Social
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-0">
          {filteredConversations.length > 0 ? (
            <div className="space-y-4">
              {filteredConversations.map(conv => (
                <ClientContactNote 
                  key={conv.id}
                  id={conv.id}
                  date={conv.date}
                  time={conv.time}
                  noteText={conv.content}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-md border">
              <MessageCircle className="h-12 w-12 text-gray-300 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-700">No conversations found</h3>
              <p className="text-gray-500">Try changing your search or filter criteria</p>
            </div>
          )}
        </TabsContent>
        
        {/* Other tabs content would be similar but filtered by type */}
        <TabsContent value="email" className="mt-0">
          {/* Email-specific content */}
          <div className="space-y-4">
            {filteredConversations
              .filter(conv => conv.channel === 'email')
              .map(conv => (
                <ClientContactNote 
                  key={conv.id}
                  id={conv.id}
                  date={conv.date}
                  time={conv.time}
                  noteText={conv.content}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="messaging" className="mt-0">
          {/* Messaging-specific content (SMS, WhatsApp) */}
          <div className="space-y-4">
            {filteredConversations
              .filter(conv => ['sms', 'whatsapp'].includes(conv.channel))
              .map(conv => (
                <ClientContactNote 
                  key={conv.id}
                  id={conv.id}
                  date={conv.date}
                  time={conv.time}
                  noteText={conv.content}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="phone" className="mt-0">
          {/* Phone call records */}
          <div className="space-y-4">
            {filteredConversations
              .filter(conv => conv.channel === 'phone')
              .map(conv => (
                <ClientContactNote 
                  key={conv.id}
                  id={conv.id}
                  date={conv.date}
                  time={conv.time}
                  noteText={conv.content}
                />
              ))}
          </div>
        </TabsContent>
        
        <TabsContent value="social" className="mt-0">
          {/* Social media communications */}
          <div className="space-y-4">
            {filteredConversations
              .filter(conv => ['facebook', 'twitter', 'instagram'].includes(conv.channel))
              .map(conv => (
                <ClientContactNote 
                  key={conv.id}
                  id={conv.id}
                  date={conv.date}
                  time={conv.time}
                  noteText={conv.content}
                />
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
