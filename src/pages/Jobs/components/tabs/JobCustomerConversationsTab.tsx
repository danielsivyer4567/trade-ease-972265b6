
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ClientContactNote } from '@/components/team/ClientContactNote';
import { JobNotifications } from '@/components/team/JobNotifications';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, Mail, Phone, RotateCw } from 'lucide-react';
import { format } from 'date-fns';

interface JobCustomerConversationsTabProps {
  jobId: string;
  customerName?: string;
}

export function JobCustomerConversationsTab({ jobId, customerName = "Customer" }: JobCustomerConversationsTabProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [activeTab, setActiveTab] = useState('emails');
  
  // Sample data - in a real app, this would come from an API
  const [emailNotifications, setEmailNotifications] = useState([
    {
      id: "1",
      jobNumber: jobId.substring(0, 8),
      title: "Job Update",
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm:ss a'),
      status: "Delivered",
      sender: {
        name: "Kara Phillips",
        email: "kara.phillips@aizer.com.au"
      },
      recipients: [
        {
          name: customerName,
          email: `${customerName.toLowerCase().replace(/\s/g, '.')}@example.com`
        }
      ],
      message: "We've scheduled your job for next Tuesday. Please let us know if this works for you.",
      assignedTo: "Rachel Mauger",
      caseManager: "Rachel Mauger"
    }
  ]);
  
  const [clientNotes, setClientNotes] = useState([
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm:ss a'),
      noteText: `Hi ${customerName}, signed contract received. Supervisor to provide an update on repairs when ready. Thanks`,
      clientName: customerName
    }
  ]);
  
  const [smsMessages, setSmsMessages] = useState([
    {
      id: '1',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: format(new Date(), 'h:mm:ss a'),
      noteText: `Hi ${customerName}, your technician is on the way and should arrive within 30 minutes.`,
      clientName: customerName
    }
  ]);
  
  const handleSync = () => {
    setIsSyncing(true);
    
    // Simulate API call to sync conversations
    setTimeout(() => {
      setIsSyncing(false);
      toast.success("All customer conversations synced successfully");
    }, 1500);
  };
  
  const handleAddNewNote = () => {
    toast.info("Add new note feature will be implemented soon");
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Customer Conversations</h2>
        <Button 
          variant="outline" 
          onClick={handleSync} 
          disabled={isSyncing} 
          className="flex items-center gap-2"
        >
          <RotateCw className={`h-4 w-4 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? 'Syncing...' : 'Sync All Communications'}
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="emails" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Emails
          </TabsTrigger>
          <TabsTrigger value="sms" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            SMS
          </TabsTrigger>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="emails">
          <Card className="p-4 bg-white">
            <JobNotifications 
              notifications={emailNotifications} 
            />
          </Card>
        </TabsContent>
        
        <TabsContent value="sms">
          <Card className="p-4 bg-white">
            {smsMessages.map(message => (
              <ClientContactNote
                key={message.id}
                id={message.id}
                date={message.date}
                time={message.time}
                noteText={message.noteText}
                clientName={message.clientName}
              />
            ))}
            
            <Button 
              className="w-full mt-3 bg-slate-500 hover:bg-slate-400 flex items-center justify-center gap-2"
              onClick={handleAddNewNote}
            >
              Send New SMS
            </Button>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card className="p-4 bg-white">
            {clientNotes.map(note => (
              <ClientContactNote
                key={note.id}
                id={note.id}
                date={note.date}
                time={note.time}
                noteText={note.noteText}
                clientName={note.clientName}
              />
            ))}
            
            <Button 
              className="w-full mt-3 bg-slate-500 hover:bg-slate-400 flex items-center justify-center gap-2"
              onClick={handleAddNewNote}
            >
              Add New Note
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
