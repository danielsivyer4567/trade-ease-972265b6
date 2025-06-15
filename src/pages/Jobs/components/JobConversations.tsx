import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Phone, 
  Play, 
  Save, 
  Share2, 
  MessageSquare, 
  Facebook,
  Instagram,
  Globe,
  Mail,
  Smartphone,
  MessageCircle,
  ArrowDown,
  Send,
  Trash2,
  Search,
  PlusCircle,
  Link2
} from "lucide-react";
import type { Job } from "@/types/job";

interface JobConversationsProps {
  job: Job;
}

// Mock quote type
type Quote = {
  id: string;
  quoteNumber: string;
  customerName: string;
  amount: number;
};

export const JobConversations: React.FC<JobConversationsProps> = ({ job }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("communications");
  const [messageText, setMessageText] = useState("");
  const [fromNumber, setFromNumber] = useState("0491388575");
  const [toNumber, setToNumber] = useState("0491388575");
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Quote[]>([]);
  const [attachedQuotes, setAttachedQuotes] = useState<Quote[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const conversations = [
    {
      id: 1,
      type: "outgoing",
      duration: "12:45",
      date: "2 days ago",
      time: "15:23 EAST",
      status: "completed"
    },
    {
      id: 2,
      type: "incoming", 
      duration: "05:12",
      date: "1 week ago",
      time: "08:45 EAST",
      status: "completed"
    }
  ];

  const smsMessages = [
    {
      id: 1,
      sender: "AR",
      message: "Hi Sajad. This is Ana from Affordable Fencing Gold Coast. I need to confirm which colour sleeper you would like for your retaining wall?",
      time: "15:52 EAST",
      date: "9th May, 2025",
      type: "received",
      hasImage: true
    },
    {
      id: 2,
      sender: "N",
      message: "Hi, could we please get monument? thanks",
      time: "17:07 EAST", 
      date: "9th May, 2025",
      type: "sent"
    },
    {
      id: 3,
      sender: "AR",
      message: "You sure can. Thank you",
      time: "17:41 EAST",
      date: "9th May, 2025", 
      type: "received"
    }
  ];

  const quickActions = [
    { label: "new client form", type: "form" },
    { label: "basic contract", type: "form" },
    { label: "defect form", type: "form" },
    { label: "variation approval", type: "form" },
    { label: "job preference form", type: "form" }
  ];

  const communicationChannels = [
    { icon: MessageSquare, label: "SMS", active: true },
    { icon: Smartphone, label: "WhatsApp" },
    { icon: Mail, label: "Email" },
    { icon: Facebook, label: "Facebook" },
    { icon: Instagram, label: "TikTok" },
    { icon: Instagram, label: "Instagram" },
    { icon: Globe, label: "GBP" },
    { icon: Globe, label: "Website" }
  ];

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    // Add logic to send message
    setMessageText("");
  };

  const handleCallCustomer = () => {
    // Add logic to initiate call
    console.log("Calling customer...");
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    // Mock search delay
    setTimeout(() => {
      setSearchResults([
        { id: 'q1', quoteNumber: 'Q-2025-001', customerName: 'John Doe', amount: 1500 },
        { id: 'q2', quoteNumber: 'Q-2025-002', customerName: job.customer, amount: 2500 },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const attachQuote = (quote: Quote) => {
    if (!attachedQuotes.find(q => q.id === quote.id)) {
      setAttachedQuotes(prev => [...prev, quote]);
      // Remove from search results to avoid duplication
      setSearchResults(prev => prev.filter(r => r.id !== quote.id));
    }
  };

  const handleAddNewQuote = () => {
    // Navigate to a new quote page, passing the job ID to link it back
    navigate(`/quotes/new?jobId=${job.id}`);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="bg-white border-b mb-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full bg-transparent h-12 p-0 border-b-0">
            <TabsTrigger 
              value="communications" 
              className="flex-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none h-full"
            >
              Communications
            </TabsTrigger>
            <TabsTrigger 
              value="quotes"
              className="flex-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none h-full"
            >
              Quotes
            </TabsTrigger>
            <TabsTrigger 
              value="jobs"
              className="flex-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none h-full"
            >
              Jobs
            </TabsTrigger>
            <TabsTrigger 
              value="documents"
              className="flex-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none h-full"
            >
              Documents
            </TabsTrigger>
            <TabsTrigger 
              value="notes"
              className="flex-1 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:bg-transparent rounded-none h-full"
            >
              Notes
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="communications" className="space-y-6 max-h-96 overflow-y-auto">
            
            {/* Call Records */}
            {conversations.map((call) => (
              <Card key={call.id} className="shadow-sm">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {call.type === 'outgoing' ? 'Outgoing Call' : 'Incoming Call'}
                        </p>
                        <p className="text-sm text-gray-500">
                          Duration: {call.duration} • {call.date}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-500 font-medium">
                      {call.time}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-3">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Play className="h-4 w-4" />
                      Play Recording
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Save className="h-4 w-4" />
                      Save to Vault
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Share2 className="h-4 w-4" />
                      Share
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Date Separator */}
            <div className="flex items-center justify-center py-4">
              <div className="bg-gray-200 rounded-full px-4 py-2">
                <p className="text-sm font-medium text-gray-600">9th May, 2025</p>
              </div>
            </div>

            {/* SMS Messages */}
            <div className="space-y-4">
              {smsMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'sent' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`flex items-start gap-2 max-w-md ${message.type === 'sent' ? 'flex-row' : 'flex-row-reverse'}`}>
                    <Avatar className="h-6 w-6 text-xs">
                      <AvatarFallback className="bg-gray-300 text-gray-700">
                        {message.sender}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className={`rounded-lg px-4 py-3 ${
                      message.type === 'sent' 
                        ? 'bg-gray-100 text-gray-900' 
                        : 'bg-blue-500 text-white'
                    }`}>
                      <p className="text-sm">{message.message}</p>
                      {message.hasImage && (
                        <Button variant="link" className="text-blue-200 p-0 h-auto text-xs underline mt-1">
                          View Image
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2 ml-2">
                    {message.time} {message.sender}
                  </div>
                </div>
              ))}
            </div>

          </TabsContent>

          <TabsContent value="quotes">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attach Existing Quote</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Search by customer name or job number..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button onClick={handleSearch} disabled={isSearching}>
                      <Search className="h-4 w-4 mr-2" />
                      {isSearching ? 'Searching...' : 'Search'}
                    </Button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="border rounded-md p-2 space-y-2">
                      {searchResults.map(quote => (
                        <div key={quote.id} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-50">
                          <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">{quote.customerName} - ${quote.amount}</p>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => attachQuote(quote)}>
                            <Link2 className="h-4 w-4 mr-2" />
                            Attach
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attached Quotes</CardTitle>
                </CardHeader>
                <CardContent>
                  {attachedQuotes.length > 0 ? (
                    <div className="space-y-2">
                      {attachedQuotes.map(quote => (
                        <div key={quote.id} className="flex justify-between items-center p-3 border rounded-md bg-gray-50">
                           <div>
                            <p className="font-medium">{quote.quoteNumber}</p>
                            <p className="text-sm text-gray-500">{quote.customerName} - ${quote.amount}</p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No quotes attached to this job yet.</p>
                  )}
                </CardContent>
              </Card>

              <div>
                <Button className="w-full" variant="outline" onClick={handleAddNewQuote}>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Add New Quote
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="jobs">
            <div className="text-center text-gray-500 py-8">
              Jobs content will go here
            </div>
          </TabsContent>

          <TabsContent value="documents">
            <div className="text-center text-gray-500 py-8">
              Documents content will go here
            </div>
          </TabsContent>

          <TabsContent value="notes">
            <div className="text-center text-gray-500 py-8">
              Notes content will go here
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Bottom Communication Interface */}
      {activeTab === 'communications' && (
        <div className="bg-white border-t p-4 mt-4">
          <div className="space-y-4">
            
            {/* Communication Channel Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {communicationChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <Button
                    key={index}
                    variant={channel.active ? "default" : "outline"}
                    size="sm"
                    className={`gap-2 ${channel.active ? 'bg-blue-500 hover:bg-blue-600' : ''}`}
                  >
                    <Icon className="h-4 w-4" />
                    {channel.label}
                  </Button>
                );
              })}
            </div>

            {/* Phone Number Inputs */}
            <div className="flex gap-4 items-center justify-center text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">From:</span>
                <Input 
                  value={fromNumber} 
                  onChange={(e) => setFromNumber(e.target.value)}
                  className="w-32 h-8 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">To:</span>
                <Input 
                  value={toNumber} 
                  onChange={(e) => setToNumber(e.target.value)}
                  className="w-32 h-8 text-sm"
                />
              </div>
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <Button variant="outline" size="icon">
                <MessageCircle className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <ArrowDown className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap gap-2 justify-center">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  {action.label}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={handleCallCustomer}
                variant="outline"
                className="gap-2"
              >
                Call Customer
              </Button>
              <Button 
                variant="outline"
              >
                Clear
              </Button>
              <Button 
                onClick={handleSendMessage}
                className="bg-blue-500 hover:bg-blue-600 gap-2"
              >
                <Send className="h-4 w-4" />
                Send
              </Button>
            </div>

            {/* Internal Comment */}
            <div className="text-center">
              <span className="text-xs text-gray-400">Internal Comment</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 