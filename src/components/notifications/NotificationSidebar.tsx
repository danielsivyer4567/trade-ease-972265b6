import React, { useState } from 'react';
import { X, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { NotificationItem } from './NotificationItem';
import { cn } from '@/lib/utils';
import { useNotifications } from './NotificationContextProvider';

interface NotificationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSidebar = ({
  isOpen,
  onClose
}: NotificationSidebarProps) => {
  const [activeTab, setActiveTab] = useState<'all' | 'team'>('all');
  const { notifications, markAllAsRead } = useNotifications();
  
  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/20 z-40" onClick={onClose} aria-hidden="true" />}

      {/* Sidebar */}
      <div className={cn("fixed right-0 top-0 h-screen bg-white z-50 shadow-lg w-[350px] transform transition-transform duration-300 ease-in-out", isOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-slate-300">
            <h2 className="text-xl font-bold">Notifications</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Subtitle */}
          <div className="px-4 py-2 border-b">
            <p className="text-gray-500">Recent updates and messages</p>
          </div>

          {/* Tabs */}
          <div className="flex rounded-lg bg-gray-100 p-1 mx-4 my-3">
            <button 
              className={cn("flex-1 text-center py-2 rounded-md transition-all", activeTab === 'all' ? "bg-white shadow" : "hover:bg-gray-200")} 
              onClick={() => setActiveTab('all')}
            >
              All Notifications
            </button>
            <button 
              className={cn("flex-1 text-center py-2 rounded-md transition-all", activeTab === 'team' ? "bg-white shadow" : "hover:bg-gray-200")} 
              onClick={() => setActiveTab('team')}
            >
              Team Notifications
            </button>
          </div>

          {/* Notification List */}
          <div className="flex-1 overflow-y-auto divide-y">
            {activeTab === 'all' && notifications.length > 0 && 
              notifications.map(notification => 
                <NotificationItem key={notification.id} {...notification} />
              )
            }
            
            {activeTab === 'all' && notifications.length === 0 && 
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p className="mb-2">No notifications yet</p>
                <p className="text-sm">New notifications will appear here</p>
              </div>
            }
            
            {activeTab === 'team' && 
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                <Bell className="h-12 w-12 mb-4 opacity-20" />
                <p className="mb-2">No team notifications yet</p>
                <p className="text-sm">Team notifications will appear here when available</p>
              </div>
            }
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <Link to="/notifications" className="text-blue-500 text-center block w-full hover:underline" onClick={onClose}>
              View all notifications
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
