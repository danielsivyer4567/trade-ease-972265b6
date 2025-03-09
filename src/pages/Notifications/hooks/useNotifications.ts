
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Notification } from '../types';
import { supabase } from "@/integrations/supabase/client";

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
    // Load user settings from database
    const loadSettings = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('user_settings')
          .select('*')
          .in('setting_name', ['web_enquiry_notifications_enabled', 'web_enquiry_email', 'email_notifications_enabled', 'email_forwarding']);
        
        if (error) throw error;
        
        if (data) {
          data.forEach(setting => {
            if (setting.setting_name === 'web_enquiry_notifications_enabled') {
              setWebEnquiryNotifications(setting.setting_value === 'true');
            } else if (setting.setting_name === 'web_enquiry_email') {
              setEnquiryEmail(setting.setting_value);
            } else if (setting.setting_name === 'email_notifications_enabled') {
              setEmailNotificationsEnabled(setting.setting_value === 'true');
            } else if (setting.setting_name === 'email_forwarding') {
              setForwardingEmail(setting.setting_value);
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
      // Update email notifications settings
      const { error: error1 } = await supabase
        .from('user_settings')
        .upsert({
          setting_name: 'email_notifications_enabled',
          setting_value: emailNotificationsEnabled.toString()
        });

      if (error1) throw error1;

      // Update email forwarding
      const { error: error2 } = await supabase
        .from('user_settings')
        .upsert({
          setting_name: 'email_forwarding',
          setting_value: forwardingEmail
        });

      if (error2) throw error2;

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
      // Update web enquiry notifications enabled setting
      const { error: error1 } = await supabase
        .from('user_settings')
        .upsert({
          setting_name: 'web_enquiry_notifications_enabled',
          setting_value: webEnquiryNotifications.toString()
        });

      if (error1) throw error1;

      // Update web enquiry email
      const { error: error2 } = await supabase
        .from('user_settings')
        .upsert({
          setting_name: 'web_enquiry_email',
          setting_value: enquiryEmail
        });

      if (error2) throw error2;

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
