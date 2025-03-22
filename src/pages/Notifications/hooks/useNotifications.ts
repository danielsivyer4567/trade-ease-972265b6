import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Notification } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export function useNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Quote Request",
      description: "Customer John Doe requested a quote for roof repair",
      date: "2024-03-20",
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: false
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Payment received for Invoice #1234",
      date: "2024-03-19",
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: false
    },
    {
      id: 3,
      title: "Task Overdue",
      description: "Task 'Site inspection' is overdue",
      date: "2024-03-18",
      isCompleted: false,
      isSortedLater: false,
      isIncomplete: false
    }
  ]);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [forwardingEmail, setForwardingEmail] = useState("");
  const [webEnquiryNotifications, setWebEnquiryNotifications] = useState(true);
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // Derived states
  const activeNotifications = notifications.filter(n => !n.isCompleted && !n.isSortedLater && !n.isIncomplete);
  const sortedLaterNotifications = notifications.filter(n => n.isSortedLater);
  const completedNotifications = notifications.filter(n => n.isCompleted);
  const incompleteNotifications = notifications.filter(n => n.isIncomplete);

  useEffect(() => {
    // Load user settings from user automations table
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_automations')
          .select('*')
          .in('automation_type', ['web_enquiry_notifications', 'email_notifications']);
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          data.forEach(automation => {
            // Type guard to ensure settings is an object
            const settings = automation.settings as { enabled?: boolean; email?: string } | null;
            
            if (automation.automation_type === 'web_enquiry_notifications') {
              if (settings && typeof settings === 'object') {
                setWebEnquiryNotifications(settings.enabled ?? false);
                setEnquiryEmail(settings.email ?? '');
              }
            } else if (automation.automation_type === 'email_notifications') {
              if (settings && typeof settings === 'object') {
                setEmailNotificationsEnabled(settings.enabled ?? false);
                setForwardingEmail(settings.email ?? '');
              }
            }
          });
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleNotificationClick = (notificationId: number) => {
    console.log('Notification clicked:', notificationId);
  };

  const handleComplete = (notificationId: number) => {
    setNotifications(notifications.map(notification => {
      if (notification.id !== notificationId) return notification;
      
      // If notification is already completed, mark as incomplete
      if (notification.isCompleted) {
        return { 
          ...notification, 
          isCompleted: false, 
          isIncomplete: true,
          isSortedLater: false 
        };
      }
      
      // Otherwise mark as completed
      return { 
        ...notification, 
        isCompleted: true, 
        isIncomplete: false,
        isSortedLater: false 
      };
    }));
  };

  const handleSortLater = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { 
            ...notification, 
            isSortedLater: !notification.isSortedLater,
            isCompleted: false,
            isIncomplete: false
          }
        : notification
    ));
  };

  const saveEmailSettings = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Your email notification settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save email settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebEnquirySettings = async () => {
    setIsLoading(true);
    try {
      // Simulated API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Settings saved",
        description: "Your web enquiry settings have been updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save web enquiry settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    notifications,
    activeNotifications,
    sortedLaterNotifications,
    completedNotifications,
    incompleteNotifications,
    handleNotificationClick,
    handleComplete,
    handleSortLater,
    // Email settings
    forwardingEmail,
    setForwardingEmail,
    emailNotificationsEnabled,
    setEmailNotificationsEnabled,
    saveEmailSettings,
    // Web enquiry settings
    webEnquiryNotifications,
    setWebEnquiryNotifications,
    enquiryEmail,
    setEnquiryEmail,
    saveWebEnquirySettings,
    // Loading state
    isLoading
  };
}
