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
  User,
  Play,
  Save,
  Share2,
  MessageSquare
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
            <h2 className="text-base font-semibold text-gray-800">Conversations</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>New Message</DropdownMenuItem>
                <DropdownMenuItem>New Call</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Search conversations..." 
              className="pl-8 h-8 bg-gray-50 border-gray-200"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
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
            {/* Conversation with Dave */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "dave1",
                name: "Dave",
                avatar: "",
                last_message: "Hi, as the site inspection is complet..",
                phone: "+61411000001",
                email: "dave@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["sms"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                      D
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">Dave</p>
                      <p className="text-sm text-gray-500">2:32 PM</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">Hi, as the site inspection is complet..</p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with Mitchell Bloxsom */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "mitchell1",
                name: "Mitchell Bloxsom",
                avatar: "",
                last_message: "Call",
                phone: "+61422000002",
                email: "mitchell@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["phone"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-medium">
                      MB
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Phone className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">Mitchell Bloxsom</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" /> Call
                    </p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with 0466 092 630 */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "0466092630",
                name: "0466 092 630",
                avatar: "",
                last_message: "Ok thank you",
                phone: "0466092630",
                email: "contact@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["sms"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      06
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">0466 092 630</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">Ok thank you</p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with 0401 029 857 */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "0401029857",
                name: "0401 029 857",
                avatar: "",
                last_message: "Call",
                phone: "0401029857",
                email: "contact@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["phone"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.15 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-amber-500 flex items-center justify-center text-white font-medium">
                      08
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Phone className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">0401 029 857</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" /> Call
                    </p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with Gwen */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "gwen1",
                name: "Gwen",
                avatar: "",
                last_message: "All that information was given to cha..",
                phone: "+61422000003",
                email: "gwen@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["sms"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.2 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-medium">
                      G
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">Gwen</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">All that information was given to cha..</p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with Tanja */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "tanja1",
                name: "Tanja",
                avatar: "",
                last_message: "Tanjahill@me.com tanja hill Thanks",
                phone: "+61422000004",
                email: "tanjahill@me.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["sms"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.25 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                      T
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">Tanja</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">Tanjahill@me.com tanja hill Thanks</p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      1
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with 0411 048 009 */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "0411048009",
                name: "0411 048 009",
                avatar: "",
                last_message: "Call",
                phone: "0411048009",
                email: "contact@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["phone"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.3 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-medium">
                      00
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <Phone className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">0411 048 009</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate flex items-center">
                      <Phone className="h-3 w-3 mr-1 text-gray-400" /> Call
                    </p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            
            {/* Conversation with 0418 637 449 */}
            <motion.div
              className="border-b border-gray-100 cursor-pointer hover:bg-gray-50"
              onClick={() => handleSelectContact({
                id: "0418637449",
                name: "0418 637 449",
                avatar: "",
                last_message: "Hi Daniel Enquiring about sliding el..",
                phone: "0418637449",
                email: "contact@example.com",
                status: "active",
                pipeline: "pre-quote",
                platforms: ["sms"],
                last_updated: new Date().toISOString(),
                priority: "medium"
              })}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.35 }}
            >
              <div className="p-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-12 w-12 rounded-full bg-rose-500 flex items-center justify-center text-white font-medium">
                      04
                    </div>
                    <div className="absolute -top-1 -left-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <MessageSquare className="h-3 w-3 text-gray-500" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium text-gray-900">0418 637 449</p>
                      <p className="text-sm text-gray-500">Jun 06</p>
                    </div>
                    <p className="text-sm text-gray-500 truncate">Hi Daniel Enquiring about sliding el..</p>
                  </div>
                  
                  <div className="ml-2">
                    <div className="h-6 w-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">
                      2
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Main content - conversation */}
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        {selectedContact ? (
          <div className="flex flex-col h-full">
            {/* Conversation header */}
            <div className="bg-white border-b border-gray-300 border-b-2 py-3 px-4 flex items-center justify-between flex-shrink-0">
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

            {/* Tab Navigation */}
            <div className="flex bg-white border-b border-gray-200">
              <div className="px-4 py-2 border-b-2 border-blue-500 text-blue-600 font-medium">Communications</div>
              <div className="px-4 py-2 text-gray-500">Quotes</div>
              <div className="px-4 py-2 text-gray-500">Jobs</div>
              <div className="px-4 py-2 text-gray-500">Documents</div>
              <div className="px-4 py-2 text-gray-500">Notes</div>
            </div>
            
            {/* Conversation area - matching middle sections height */}
            <div className="flex-grow overflow-y-auto scrollbar-hide" style={{ height: 'calc(100% - 160px)' }}>
              <div className="p-4 space-y-6 max-w-4xl mx-auto">
                {/* Call Record */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">Outgoing Call</p>
                        <p className="text-sm text-gray-500">Duration: 12:45 • 2 days ago</p>
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium">15:23 EAST</div>
                  </div>
                  <div className="border-t border-gray-200 flex divide-x divide-gray-200">
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Play className="h-4 w-4" /> Play Recording
                    </button>
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Save className="h-4 w-4" /> Save to Vault
                    </button>
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>

                {/* Date Marker */}
                <div className="flex justify-center">
                  <div className="bg-gray-200 text-gray-600 px-4 py-1 rounded-full text-sm">
                    9th May, 2025
                  </div>
                </div>

                {/* Actual Messages */}
                <div className="space-y-4">
                  {/* Agent Message */}
                  <div className="flex justify-end items-end">
                    <div className="max-w-[80%] flex flex-col items-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-none">
                        <p>Hi Sajad. This is Ana from Affordable Fencing Gold Coast. I need to confirm which colour sleeper you would like for your retaining wall?</p>
                        <div className="mt-2 text-blue-100 underline text-sm">View Image</div>
                      </div>
                      <div className="flex mt-1 items-center">
                        <span className="text-xs text-gray-500 mr-1">15:52 EAST</span>
                        <Badge className="bg-blue-100 text-blue-600 text-xs">SMS</Badge>
                      </div>
                    </div>
                    <div className="ml-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                      AR
                    </div>
                  </div>

                  {/* Customer Message */}
                  <div className="flex items-end">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium mr-2">
                      N
                    </div>
                    <div className="max-w-[80%] flex flex-col">
                      <div className="bg-white border border-gray-200 p-3 rounded-lg rounded-tl-none">
                        <p>Hi, could we please get monument? thanks</p>
                      </div>
                      <div className="flex mt-1 items-center">
                        <Badge className="bg-gray-100 text-gray-600 text-xs mr-1">SMS</Badge>
                        <span className="text-xs text-gray-500">17:07 EAST</span>
                      </div>
                    </div>
                  </div>

                  {/* Agent Message */}
                  <div className="flex justify-end items-end">
                    <div className="max-w-[80%] flex flex-col items-end">
                      <div className="bg-blue-500 text-white p-3 rounded-lg rounded-br-none">
                        <p>You sure can. Thank you</p>
                      </div>
                      <div className="flex mt-1 items-center">
                        <span className="text-xs text-gray-500 mr-1">17:41 EAST</span>
                        <Badge className="bg-blue-100 text-blue-600 text-xs">SMS</Badge>
                      </div>
                    </div>
                    <div className="ml-2 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 font-medium">
                      AR
                    </div>
                  </div>
                </div>

                {/* Call Record */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Phone className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-900">Incoming Call</p>
                        <p className="text-sm text-gray-500">Duration: 05:12 • 1 week ago</p>
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium">08:45 EAST</div>
                  </div>
                  <div className="border-t border-gray-200 flex divide-x divide-gray-200">
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Play className="h-4 w-4" /> Play Recording
                    </button>
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Save className="h-4 w-4" /> Save to Vault
                    </button>
                    <button className="flex-1 p-2 flex items-center justify-center gap-1 text-sm text-gray-600 hover:bg-gray-50">
                      <Share2 className="h-4 w-4" /> Share
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Message input - aligned with Tags section */}
            <div className="bg-white border-t border-gray-300 border-t-2 p-3 z-10 flex-shrink-0">
              {/* Channel tabs */}
              <div className="mb-3 flex border-b border-gray-200">
                <div className="px-3 py-1.5 border-b-2 border-blue-500 text-blue-500 text-sm font-medium">SMS</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">WhatsApp</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">Email</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">Facebook</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">TikTok</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">Instagram</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">GBP</div>
                <div className="px-3 py-1.5 text-gray-500 text-sm">Website</div>
              </div>

              {/* Phone numbers */}
              <div className="flex mb-2 text-sm">
                <div className="mr-3">
                  <span className="text-gray-500">From:</span>
                  <span className="ml-2 text-gray-700">0491388575</span>
                </div>
                <div>
                  <span className="text-gray-500">To:</span>
                  <span className="ml-2 text-gray-700">0491388575</span>
                </div>
              </div>

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

              {/* Quick actions */}
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer py-1.5">new client form</Badge>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer py-1.5">basic contract</Badge>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer py-1.5">defect form</Badge>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer py-1.5">variation approval</Badge>
                <Badge className="bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer py-1.5">job preference form</Badge>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 relative">
            <div 
              className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-30" 
              style={{ 
                backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgdmlld0JveD0iMCAwIDgwMCA2MDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzM2ODJmNCIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjNzgzNGY5IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZDIiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjQ0MzM2IiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNmZjlmMDAiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkMyIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjMDBkMmZmIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwMDdkZmYiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KCiAgPGNpcmNsZSBjeD0iNDAwIiBjeT0iMzAwIiByPSIxMjAiIGZpbGw9IiMxMTEiIGZpbGwtb3BhY2l0eT0iMC4xIiAvPgogIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjMwMCIgcj0iMTAwIiBmaWxsPSIjMTExIiBmaWxsLW9wYWNpdHk9IjAuMiIgLz4KICA8Y2lyY2xlIGN4PSI0MDAiIGN5PSIzMDAiIHI9IjgwIiBmaWxsPSIjMjIyIiBmaWxsLW9wYWNpdHk9IjAuMyIgLz4KICA8dGV4dCB4PSI0MDAiIHk9IjMwNSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzMzNSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAyMHB4OyBmb250LXdlaWdodDogYm9sZDsiPk1FU1NBR0lORyBIVUI8L3RleHQ+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iMjAwIiBjeT0iMTUwIiByPSI0MCIgZmlsbD0idXJsKCNncmFkMSkiIC8+CiAgICA8dGV4dCB4PSIyMDAiIHk9IjE1NSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0id2hpdGUiIHN0eWxlPSJmb250LWZhbWlseTogQXJpYWw7IGZvbnQtc2l6ZTogMTJweDsgZm9udC13ZWlnaHQ6IGJvbGQ7Ij5TT0NJQUw8L3RleHQ+CiAgICA8cGF0aCBkPSJNMjUwIDE3NSBMIDMzMCAyNTAiIHN0cm9rZT0idXJsKCNncmFkMSkiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjE1MCIgY3I9IjQwIiBmaWxsPSIjZjQ0MzM2IiAvPgogICAgPHRleHQgeD0iNjAwIiB5PSIxNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+RU1BUkxTPC90ZXh0PgogICAgPHBhdGggZD0iTTU1MCAxNzUgTCA0NzAgMjUwIiBzdHJva2U9InVybCgjZ3JhZDIpIiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgogIAogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjEwMCIgY3I9IjQwIiBmaWxsPSIjNGI0IiAvPgogICAgPHRleHQgeD0iNDAwIiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+U1RTL01NUzwvdGV4dD4KICAgIDxwYXRoIGQ9Ik00MDAgMTUwIEwgNDAwIDI0MCIgc3Ryb2tlPSIjNGI0IiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgogIAogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjQ1MCIgY3I9IjQwIiBmaWxsPSIjNGNjIiAvPgogICAgPHRleHQgeD0iMjAwIiB5PSI0NTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+V0hBVFNBUFA8L3RleHQ+CgogICAgPHBhdGggZD0iTTI1MCA0MjUgTCAzMzAgMzUwIiBzdHJva2U9IiM0NGMiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjYwMCIgY3k9IjE1MCIgY3I9IjQwIiBmaWxsPSIjZjQ0MzM2IiAvPgogICAgPHRleHQgeD0iNjAwIiB5PSIxNTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+RU1BUkxTPC90ZXh0PgoKICAgIDxwYXRoIGQ9Ik01NTAgMTc1IEwgNDcwIDI1MCIgc3Ryb2tlPSIjZjQ0MzM2IiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgoKICAgIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjEwMCIgY3I9IjQwIiBmaWxsPSIjNGI0IiAvPgogICAgPHRleHQgeD0iNDAwIiB5PSIxMDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+U1RTL01NUzwvdGV4dD4KICAgIDxwYXRoIGQ9Ik00MDAgMTUwIEwgNDAwIDI0MCIgc3Ryb2tlPSIjNGI0IiBzdHJva2Utd2lkdGg9IjMiIC8+CiAgPC9nPgogIAogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjIwMCIgY3k9IjQ1MCIgY3I9IjQwIiBmaWxsPSIjNGNjIiAvPgogICAgPHRleHQgeD0iMjAwIiB5PSI0NTUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+V0hBVFNBUFA8L3RleHQ+CgogICAgPHBhdGggZD0iTTI1MCA0MjUgTCAzMzAgMzUwIiBzdHJva2U9IiM0Y2MiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPgogICAgPGNpcmNsZSBjeD0iNjAwIiBjeT0iNDUwIiByPSI0MCIgZmlsbD0iIzYzYSIgLz4KICAgIDx0ZXh0IHg9IjYwMCIgeT0iNDU1IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSJ3aGl0ZSIgc3R5bGU9ImZvbnQtZmFtaWx5OiBBcmlhbDsgZm9udC1zaXplOiAxMnB4OyBmb250LXdlaWdodDogYm9sZDsiPlRFTEVHUkFNPC90ZXh0PgogICAgPHBhdGggZD0iTTU1MCA0MjUgTCA0NzAgMzUwIiBzdHJva2U9IiM2M2EiIHN0cm9rZS13aWR0aD0iMyIgLz4KICA8L2c+CgogIDxnPiAgICAKICAgIDxjaXJjbGUgY3g9IjQwMCIgY3k9IjUwMCIgY3I9IjQwIiBmaWxsPSIjNGI0IiAvPgogICAgPHRleHQgeD0iNDAwIiB5PSI1MDUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IndoaXRlIiBzdHlsZT0iZm9udC1mYW1pbHk6IEFyaWFsOyBmb250LXNpemU6IDEycHg7IGZvbnQtd2VpZ2h0OiBib2xkOyI+V0VDSEFUPC90ZXh0PgogICAgPHBhdGggZD0iTTQwMCA0NTAiIHN0cm9rZT0iIzRiNCIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0ic3F1YXJlIiBzdHJva2UtbGluZWpvaW49InN0cm9rZSIgLz4KICA8L2c+Cjwvc3ZnPg==');"
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
