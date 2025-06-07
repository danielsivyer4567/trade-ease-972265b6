import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Phone,
  Calendar,
  Mail,
  Send,
  Check,
  Star,
  Search,
  Paperclip,
  Clock,
  MoreVertical,
  CheckCircle2,
  Trash2,
  Clock3,
  ThumbsUp,
  ChevronDown,
  Smile,
  BellRing,
  User
} from "lucide-react";
import { useCrmContacts, CrmPipelineType, CrmContact } from "../hooks/useCrmContacts";
import { motion, AnimatePresence } from "framer-motion";
import { ChannelIcon } from '../ChannelIcons';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import './CrmPipeline.css';

export const CrmPipeline: React.FC = () => {
  const { 
    contacts, 
    loading, 
    activePipeline, 
    setActivePipeline
  } = useCrmContacts();
  
  const [selectedContact, setSelectedContact] = useState<CrmContact | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchText, setSearchText] = useState('');

  // Mock appointment data
  const appointments = [
    {
      id: 1,
      date: "28 May 2025",
      time: "10:30 am (AEST)",
      status: "Confirmed",
      location: "Centre of Gold Coast (Zone 2)",
      assignedUser: "Chef Account"
    }
  ];

  // Mock conversation data
  const conversations = [
    { id: 5, sender: 'customer', message: 'Look forward to you coming on site', time: '20:48' },
    { id: 6, sender: 'agent', message: 'I\'ll book a date for you next for a a quote - chat will come out if its not suitable let me know :-)', time: '20:49' },
    { id: 7, sender: 'customer', message: 'Great stuff mate.\nI would appreciate that', time: '20:50' },
    { id: 8, sender: 'system', message: 'New appointment created', time: '20:51', appointment: {
      date: 'May 28, 2025',
      time: '10:30 AM (AEST)'
    }}
  ];

  if (loading) return (
    <div className="p-8 text-center flex justify-center items-center h-[80vh]">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 animate-spin flex items-center justify-center">
          <Clock className="h-6 w-6 text-white animate-reverse-spin" />
        </div>
        <p className="text-lg font-medium text-gray-700">Loading CRM contacts...</p>
      </div>
    </div>
  );

  const handleSelectContact = (contact: CrmContact) => {
    setSelectedContact(contact);
  };

  const handleSendMessage = () => {
    if (messageText.trim()) {
      console.log('Sending message:', messageText);
      
      // Only attempt to send the message if we have a selected contact
      if (selectedContact && selectedContact.phone) {
        sendMessageToContact(selectedContact, messageText.trim())
          .then(() => {
            // Add the message to the conversation immediately for UI feedback
            console.log('Message sent successfully to', selectedContact.name);
            // Clear the input field
            setMessageText('');
          })
          .catch(error => {
            console.error('Error sending message:', error);
            alert('Failed to send message. Please try again.');
          });
      } else {
        console.error('Cannot send message: No contact selected or contact has no phone number');
        setMessageText('');
      }
    }
  };

  // Function to send a message to a contact
  const sendMessageToContact = async (contact: CrmContact, message: string) => {
    // In a production app, this would call a secure backend endpoint
    // For testing, we'll just simulate success
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically make an API call to your backend:
    // const response = await fetch('/api/send-message', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     to: contact.phone,
    //     message: message,
    //     contactId: contact.id
    //   })
    // });
    
    // return response.json();
    
    // For now, just return success
    return { success: true };
  };

  const filterContacts = () => {
    if (!searchText) return contacts;
    return contacts.filter(c => 
      c.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (c.last_message && c.last_message.toLowerCase().includes(searchText.toLowerCase()))
    );
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] bg-gray-50">
      {/* Left sidebar - contacts */}
      <div className="w-80 border-r border-gray-300 border-r-2 bg-white flex flex-col">
        <div className="p-3 border-b border-gray-300 border-b-2">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-gray-800">Contacts</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Contact</DropdownMenuItem>
                <DropdownMenuItem>Import Contacts</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search contacts..." 
              className="pl-8 h-8 bg-gray-50 border-gray-200"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex px-6 py-3 border-b border-gray-300 border-b-2 bg-white">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="w-full grid grid-cols-4 h-10 bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-1 rounded-lg shadow-sm overflow-visible">
                <TabsTrigger 
                  value="all" 
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-md h-8 px-3 font-medium"
                >
                  All
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-md h-8 px-3 font-medium"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger 
                  value="starred" 
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-md h-8 px-3 font-medium"
                >
                  Starred
                </TabsTrigger>
                <TabsTrigger 
                  value="recent" 
                  className="text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-indigo-600 data-[state=active]:text-white transition-all duration-300 rounded-md h-8 px-3 font-medium"
                >
                  Recent
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <AnimatePresence>
            {filterContacts().map((contact, index) => (
              <motion.div
                key={contact.id}
                className={`p-1 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${selectedContact?.id === contact.id ? 'bg-blue-50' : ''}`}
                onClick={() => handleSelectContact(contact)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarImage src={contact.avatar} alt={contact.name} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                      {contact.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between">
                      <p className="font-medium text-gray-900 truncate">{contact.name}</p>
                      <p className="text-xs text-gray-500">3m</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{contact.last_message}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Main content - conversation */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        {selectedContact ? (
          <div className="flex flex-col h-full">
            {/* Conversation header */}
            <div className="bg-white border-b border-gray-300 border-b-2 py-1 px-3 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-xs">
                    {selectedContact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium text-gray-900">{selectedContact.name}</h2>
                    {selectedContact.priority === 'high' && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">High Priority</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      Online
                    </span>
                    <span>•</span>
                    <span>Last active: Just now</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost">
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </Button>
              </div>
            </div>
            
            {/* Conversation area - matching middle sections height */}
            <div className="flex-grow overflow-y-auto scrollbar-hide" style={{ height: 'calc(100% - 110px)' }}>
              <div className="p-2 space-y-2 max-w-4xl mx-auto">
                {conversations.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.sender === 'agent' ? 'justify-end' : msg.sender === 'system' ? 'justify-center' : 'justify-start'}`}>
                    {msg.sender === 'system' ? (
                      <div className="bg-white rounded-lg shadow-sm p-2 inline-block border border-gray-200 my-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">New</Badge>
                          <span className="font-medium text-gray-700">{msg.message}</span>
                        </div>
                        {msg.appointment && (
                          <div className="mt-2 bg-gray-50 rounded p-2 text-sm">
                            <div className="flex items-center gap-1 text-gray-700">
                              <Calendar className="h-4 w-4 text-blue-600" />
                              <span>{msg.appointment.date}</span>
                              <span className="px-1">•</span>
                              <Clock className="h-4 w-4 text-blue-600" />
                              <span>{msg.appointment.time}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="max-w-[80%]">
                        {msg.sender === 'customer' && (
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-xs text-white">
                                {selectedContact.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium text-gray-700">{selectedContact.name}</span>
                            <span className="text-xs text-gray-500">{msg.time}</span>
                          </div>
                        )}
                        <div className={`p-1.5 rounded-lg ${
                          msg.sender === 'agent' 
                            ? 'bg-blue-600 text-white ml-auto rounded-br-none' 
                            : 'bg-white border border-gray-200 mr-auto rounded-tl-none'
                        }`}>
                          <p className="whitespace-pre-line">{msg.message}</p>
                          {msg.sender === 'agent' && (
                            <div className="flex justify-end items-center mt-1 gap-1">
                              <span className="text-xs text-blue-100">{msg.time}</span>
                              <Check className="h-3 w-3 text-blue-100" />
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Message input - aligned with Tags section */}
            <div className="bg-white border-t border-gray-300 border-t-2 p-3 z-10 flex-shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <Input 
                    placeholder="Type a message..." 
                    className="pr-10"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                    <Button size="icon" variant="ghost" className="h-6 w-6 text-gray-400 hover:text-gray-600">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <Button size="icon" variant="ghost" className="h-9 w-9 text-gray-400 hover:text-gray-600">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button 
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700 text-white h-9 w-9"
                  onClick={handleSendMessage}
                  disabled={!messageText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30" 
              style={{ 
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzM2ODJmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNzgzNGY5IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjQ0MzM2IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjlmMDAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDBkMmZmIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDdkZmYiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iMzAwIiByPSIxMjAiIGZpbGw9IiMxMTEiIGZpbGwtb3BhY2l0eT0iMC4xIiAvPgogIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSIjMTExIiBmaWxsLW9wYWNpdHk9IjAuMiIgLz4KICA8Y2lyY2xlIGN4PSI0MDAiIGN5PSIzMDAiIHI9IjgwIiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMyIgLz4KICA8dGV4dCB4PSI0MDAiIHk9IjMwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzNSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAyMHB4OyBmb250LXdlaWdodDogYm9sZDsiPk1FU1NBR0lORyBIVUI8L3RleHQ+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0idXJsKCNncmFkMSkiIC8+CiAgICA8dGV4dCB4PSIyMDAiIHk9IjE1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWw7IGZvbnQtc2l6ZTogMTJweDsgZm9udC13ZWlnaHQ6IGJvbGQ7Ij5TT0NJQUw8L3RleHQ+CiAgICA8cGF0aCBkPSJNMjUwIDE3NSBMIDMzMCAyNTAiIHN0cm9rZT0idXJsKCNncmFkMSkiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0idXJsKCNncmFkMikiIC8+CiAgICA8dGV4dCB4PSI2MDAiIHk9IjE1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWw7IGZvbnQtc2l6ZTogMTJweDsgZm9udC13ZWlnaHQ6IGJvbGQ7Ij5FTUFJTFM8L3RleHQ+CiAgICA8cGF0aCBkPSJNNTUwIDE3NSBMIDQ3MCAyNTAiIHN0cm9rZT0idXJsKCNncmFkMikiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iMTAwIiByPSI0MCIgZmlsbD0idXJsKCNncmFkMykiIC8+CiAgICA8dGV4dCB4PSI0MDAiIHk9IjEwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWw7IGZvbnQtc2l6ZTogMTJweDsgZm9udC13ZWlnaHQ6IGJvbGQ7Ij5TTVMvTU1TPC90ZXh0PgogICAgPHBhdGggZD0iTTQwMCAxNTAgTCA0MDAgMjQwIiBzdHJva2U9InVybCgjZ3JhZDMpIiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgogIAogIDxnPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iNDUwIiByPSI0MCIgZmlsbD0iIzQ0YyIgLz4KICAgIDx0ZXh0IHg9IjIwMCIgeT0iNDU1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsiPldIQVRTQVBQPC90ZXh0PgogICAgPHBhdGggZD0iTTI1MCA0MjUgTCAzMzAgMzUwIiBzdHJva2U9IiM0NGMiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iNDUwIiByPSI0MCIgZmlsbD0iIzYzYSIgLz4KICAgIDx0ZXh0IHg9IjYwMCIgeT0iNDU1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsiPlRFTEVHUkFNPC90ZXh0PgogICAgPHBhdGggZD0iTTU1MCA0MjUgTCA0NzAgMzUwIiBzdHJva2U9IiM2M2EiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iNTAwIiByPSI0MCIgZmlsbD0iIzRiNCIgLz4KICAgIDx0ZXh0IHg9IjQwMCIgeT0iNTA1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsiPldFQ0hBVDwvdGV4dD4KICAgIDxwYXRoIGQ9Ik00MDAgNDUwIEwgNDAwIDM2MCIgc3Ryb2tlPSIjNGI0IiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgo8L3N2Zz4=');"
              }}
            ></div>
            <div className="relative z-10 bg-white/70 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Messaging Hub</h3>
              <p className="text-gray-700 max-w-md">
                Select a contact from the list to start messaging across multiple channels.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Right sidebar - contact details */}
      <div className="w-80 border-l border-gray-300 border-l-2 bg-white flex flex-col overflow-hidden">
        {selectedContact ? (
          <>
            <div className="p-1.5 border-b border-gray-300 border-b-2">
              <h3 className="font-medium text-gray-800 mb-1.5">Contact</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={selectedContact.avatar} alt={selectedContact.name} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-sm">
                    {selectedContact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">{selectedContact.name}</h4>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
                
                <div className="flex items-center gap-1 ml-auto">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Phone className="h-4 w-4 text-gray-500" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Email</span>
                  <ChevronDown className="h-3 w-3 text-gray-400 ml-auto" />
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">+61 413 583 063</span>
                  <ChevronDown className="h-3 w-3 text-gray-400 ml-auto" />
                </div>
              </div>
            </div>
            
            <div className="p-1.5 border-b border-gray-300 border-b-2">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-medium text-gray-800">Appointments</h3>
                <Button size="sm" variant="outline" className="h-8 text-xs">
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              
              <div className="space-y-2">
                {appointments.map((appointment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                    <div className="flex justify-between mb-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium">{appointment.date}, {appointment.time}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <CheckCircle2 className="h-3.5 w-3.5 text-gray-400" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6">
                          <Trash2 className="h-3.5 w-3.5 text-gray-400" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <Badge className={
                        appointment.status === "Confirmed" 
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-100"
                      }>
                        {appointment.status}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">
                        Calendar: {appointment.location}
                      </div>
                      <div className="text-xs text-gray-500">
                        Assigned User: {appointment.assignedUser}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-1.5 border-b border-gray-300 border-b-2">
              <div className="flex items-center justify-between mb-1.5">
                <h3 className="font-medium text-gray-800">Tags</h3>
                <Button size="sm" variant="ghost">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer">
                  stop koi
                </Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100 cursor-pointer">
                  + Add Tag
                </Badge>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <div className="p-1.5">
                <h3 className="font-medium text-gray-800 mb-1">Activity</h3>
                
                <div className="space-y-1">
                  <div className="flex gap-2">
                    <div className="bg-blue-100 rounded-full p-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                      <BellRing className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-800">Appointment scheduled</p>
                      <p className="text-xs text-gray-500">3 Apr 2023, 9:15 AM</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <div className="bg-green-100 rounded-full p-0.5 h-5 w-5 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-800">Quote accepted</p>
                      <p className="text-xs text-gray-500">1 Apr 2023, 2:30 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gray-100 rounded-full p-4 mb-4">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">Contact details</h3>
            <p className="text-gray-500 max-w-sm">
              Select a contact to view their details, appointments, and activity history.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
