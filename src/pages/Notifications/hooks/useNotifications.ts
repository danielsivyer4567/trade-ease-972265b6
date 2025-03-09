
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Notification } from '../types';
import { supabase } from "@/integrations/supabase/client";
import { Json } from "@/integrations/supabase/types";

export const useNotifications = () => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Quote Request",
      description: "Customer John Doe requested a quote for roof repair",
      date: "2024-03-20",
      isCompleted: false,
      isSortedLater: false
    },
    {
      id: 2,
      title: "Payment Received",
      description: "Payment received for Invoice #1234",
      date: "2024-03-19",
      isCompleted: false,
      isSortedLater: false
    },
    {
      id: 3,
      title: "Task Overdue",
      description: "Task 'Site inspection' is overdue",
      date: "2024-03-18",
      isCompleted: false,
      isSortedLater: false
    }
  ]);

  // Email settings state
  const [forwardingEmail, setForwardingEmail] = useState("");
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  
  // Web enquiry settings state
  const [webEnquiryNotifications, setWebEnquiryNotifications] = useState(true);
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    console.log("Navigate to notification details:", notificationId);
  };

  const handleComplete = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isCompleted: !notification.isCompleted, isSortedLater: false }
        : notification
    ));
  };

  const handleSortLater = (notificationId: number) => {
    setNotifications(notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, isSortedLater: !notification.isSortedLater, isCompleted: false }
        : notification
    ));
  };

  const saveEmailSettings = async () => {
    setIsLoading(true);
    try {
      // Update email notifications settings in user_automations table
      const { error } = await supabase
        .from('user_automations')
        .upsert({
          automation_type: 'email_notifications',
          settings: {
            enabled: emailNotificationsEnabled,
            email: forwardingEmail
          }
        });

      if (error) throw error;

      toast({
        title: "Email notification settings saved",
        description: `Forwarding email set to ${forwardingEmail}`,
      });
    } catch (error) {
      console.error('Error saving email settings:', error);
      toast({
        title: "Failed to save settings",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const saveWebEnquirySettings = async () => {
    setIsLoading(true);
    try {
      // Update web enquiry notifications in user_automations table
      const { error } = await supabase
        .from('user_automations')
        .upsert({
          automation_type: 'web_enquiry_notifications',
          settings: {
            enabled: webEnquiryNotifications,
            email: enquiryEmail
          }
        });

      if (error) throw error;

      toast({
        title: "Web enquiry notification settings saved",
        description: `Notifications will ${webEnquiryNotifications ? "" : "not"} be sent to ${enquiryEmail}`,
      });
    } catch (error) {
      console.error('Error saving web enquiry settings:', error);
      toast({
        title: "Failed to save settings",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter notifications by their status
  const activeNotifications = notifications.filter(n => !n.isCompleted && !n.isSortedLater);
  const sortedLaterNotifications = notifications.filter(n => n.isSortedLater);
  const completedNotifications = notifications.filter(n => n.isCompleted);

  return {
    notifications,
    activeNotifications,
    sortedLaterNotifications,
    completedNotifications,
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
};
