
import React from 'react';
import { Mail, MessageSquare, ExternalLink, Reply, ReplyAll, Forward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';

interface JobNotification {
  id: string;
  jobNumber: string;
  title: string;
  date: string;
  time: string;
  status: string;
  sender: {
    name: string;
    email: string;
  };
  recipients: {
    name: string;
    email: string;
  }[];
  message: string;
  assignedTo?: string;
  caseManager?: string;
}

interface JobNotificationsProps {
  notifications: JobNotification[];
  selectedDate?: Date;
}

export function JobNotifications({ notifications, selectedDate }: JobNotificationsProps) {
  const isMobile = useIsMobile();
  
  const handleSync = (id: string) => {
    toast.success("Job synced to Endata");
  };
  
  const handleReply = (id: string) => {
    toast.info("Reply feature will be implemented soon");
  };
  
  const handleReplyAll = (id: string) => {
    toast.info("Reply All feature will be implemented soon");
  };
  
  const handleForward = (id: string) => {
    toast.info("Forward feature will be implemented soon");
  };
  
  const handleClickJob = (notification: JobNotification) => {
    // Navigate to job details or show more info
    toast.info(`Opening job ${notification.jobNumber}`);
  };
  
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4 my-4">
      {notifications.map(notification => (
        <Card key={notification.id} className="overflow-hidden border-b border-gray-200 bg-sky-50">
          <CardHeader className="flex flex-row items-center justify-between p-3 bg-sky-100">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-blue-600" />
              <span 
                className="font-medium text-blue-800 hover:underline cursor-pointer"
                onClick={() => handleClickJob(notification)}
              >
                {notification.jobNumber} - {notification.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => handleSync(notification.id)} className="text-xs">
                Sync To Endata
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleReply(notification.id)} className="text-xs">
                Reply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleReplyAll(notification.id)} className="text-xs">
                Reply All
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleForward(notification.id)} className="text-xs">
                Forward
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 gap-2">
              <div className="grid grid-cols-[80px_1fr] text-sm">
                <span className="text-gray-500">Date:</span>
                <span>{notification.date} {notification.time}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] text-sm">
                <span className="text-gray-500">Status:</span>
                <span>{notification.status}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] text-sm">
                <span className="text-gray-500">To:</span>
                <span>{notification.recipients.map(r => r.email).join('; ')}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr] text-sm">
                <span className="text-gray-500">From:</span>
                <span>{notification.sender.email}</span>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <p className="text-sm">{notification.message}</p>
                
                {notification.assignedTo && (
                  <p className="mt-4 text-sm">
                    <strong>Assigned:</strong> {notification.assignedTo}
                  </p>
                )}
                
                {notification.caseManager && (
                  <p className="text-sm">
                    <strong>Case Manager:</strong> {notification.caseManager}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
