
import React from 'react';
import { Pin, PinOff, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Notification } from '@/pages/Notifications/types';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';

interface NotificationPanelProps {
  open: boolean;
  isPinned: boolean;
  notifications: Notification[];
  onOpenChange: (open: boolean) => void;
  onTogglePin: () => void;
  onNotificationClick: (id: number) => void;
}

export function NotificationPanel({
  open,
  isPinned,
  notifications,
  onOpenChange,
  onTogglePin,
  onNotificationClick
}: NotificationPanelProps) {
  return <Sheet open={open || isPinned} onOpenChange={onOpenChange}>
      <SheetContent side="right" className={cn(
        "sm:max-w-md w-[92vw] sm:w-[400px] p-0 transition-all duration-300",
        isPinned && "border-l-2 border-blue-500 shadow-lg"
      )}>
        <div className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-2 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl">Notifications</SheetTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={onTogglePin} 
                  title={isPinned ? "Unpin notifications" : "Pin notifications"} 
                  className="rounded-full h-8 w-8 flex items-center justify-center"
                >
                  {isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                </Button>
                {!isPinned && (
                  <SheetClose className="rounded-full h-8 w-8 flex items-center justify-center">
                    <X className="h-4 w-4" />
                  </SheetClose>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Recent updates and messages</p>
          </SheetHeader>

          <Tabs defaultValue="all" className="flex-1 flex flex-col">
            <div className="px-4 pt-2">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="all" className="rounded-md">All Notifications</TabsTrigger>
                <TabsTrigger value="team" className="rounded-md">Team Notifications</TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto px-4">
              <TabsContent value="all" className="mt-0 space-y-4">
                {notifications.map(notification => <NotificationItem key={notification.id} notification={notification} onClick={onNotificationClick} />)}
                
                <div className="flex justify-center pt-2 pb-6">
                  <Button variant="ghost" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50">
                    View all notifications
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="team" className="mt-0">
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No team notifications yet</p>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>;
}
