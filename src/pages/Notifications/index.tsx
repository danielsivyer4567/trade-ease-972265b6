
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { useNotifications } from "./hooks/useNotifications";
import { useNotificationLayout } from "./hooks/useNotificationLayout";
import { useDialogState } from "./hooks/useDialogState";
import { NotificationHeader } from "./components/NotificationHeader";
import { NotificationsContainer } from "./components/NotificationsContainer";
import { SettingsDialogs } from "./components/SettingsDialogs";

export default function Notifications() {
  const {
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
    isLoading,
  } = useNotifications();

  const { isFullWidth, isButtonPressed, handleLayoutToggle } = useNotificationLayout();
  const { 
    isEmailDialogOpen, 
    setIsEmailDialogOpen,
    isWebEnquiryDialogOpen, 
    setIsWebEnquiryDialogOpen 
  } = useDialogState();

  return (
    <AppLayout>
      <div
        className={cn(
          "h-[calc(100vh-106px)] flex flex-col mx-auto transition-all transform duration-500 ease-in-out",
          isFullWidth
            ? "w-full scale-100 origin-top"
            : "max-w-[1200px] scale-[0.99] hover:scale-100"
        )}
      >
        <NotificationHeader 
          setIsEmailDialogOpen={setIsEmailDialogOpen}
          setIsWebEnquiryDialogOpen={setIsWebEnquiryDialogOpen}
          isFullWidth={isFullWidth}
          handleLayoutToggle={handleLayoutToggle}
          isButtonPressed={isButtonPressed}
        />

        <NotificationsContainer 
          isFullWidth={isFullWidth}
          isButtonPressed={isButtonPressed}
          isLoading={isLoading}
          activeNotifications={activeNotifications}
          sortedLaterNotifications={sortedLaterNotifications}
          completedNotifications={completedNotifications}
          incompleteNotifications={incompleteNotifications}
          handleNotificationClick={handleNotificationClick}
          handleComplete={handleComplete}
          handleSortLater={handleSortLater}
        />

        <SettingsDialogs 
          isEmailDialogOpen={isEmailDialogOpen}
          setIsEmailDialogOpen={setIsEmailDialogOpen}
          emailNotificationsEnabled={emailNotificationsEnabled}
          setEmailNotificationsEnabled={setEmailNotificationsEnabled}
          forwardingEmail={forwardingEmail}
          setForwardingEmail={setForwardingEmail}
          saveEmailSettings={saveEmailSettings}
          isWebEnquiryDialogOpen={isWebEnquiryDialogOpen}
          setIsWebEnquiryDialogOpen={setIsWebEnquiryDialogOpen}
          webEnquiryNotifications={webEnquiryNotifications}
          setWebEnquiryNotifications={setWebEnquiryNotifications}
          enquiryEmail={enquiryEmail}
          setEnquiryEmail={setEnquiryEmail}
          saveWebEnquirySettings={saveWebEnquirySettings}
        />
      </div>
    </AppLayout>
  );
}

// Import missing dependencies
import { cn } from "@/lib/utils";
