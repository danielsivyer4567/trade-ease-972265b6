
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Notification } from '../types';

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

  const saveEmailSettings = () => {
    toast({
      title: "Email notification settings saved",
      description: `Forwarding email set to ${forwardingEmail}`,
    });
  };

  const saveWebEnquirySettings = () => {
    toast({
      title: "Web enquiry notification settings saved",
      description: `Notifications will ${webEnquiryNotifications ? "" : "not"} be sent to ${enquiryEmail}`,
    });
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
    saveWebEnquirySettings
  };
};
