
import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmailSettingsTab } from "./EmailSettingsTab";
import { WebEnquiryTab } from "./WebEnquiryTab";

interface SettingsDialogsProps {
  isEmailDialogOpen: boolean;
  setIsEmailDialogOpen: (open: boolean) => void;
  emailNotificationsEnabled: boolean;
  setEmailNotificationsEnabled: (enabled: boolean) => void;
  forwardingEmail: string;
  setForwardingEmail: (email: string) => void;
  saveEmailSettings: () => void;
  isWebEnquiryDialogOpen: boolean;
  setIsWebEnquiryDialogOpen: (open: boolean) => void;
  webEnquiryNotifications: boolean;
  setWebEnquiryNotifications: (enabled: boolean) => void;
  enquiryEmail: string;
  setEnquiryEmail: (email: string) => void;
  saveWebEnquirySettings: () => void;
}

export const SettingsDialogs: React.FC<SettingsDialogsProps> = ({
  isEmailDialogOpen,
  setIsEmailDialogOpen,
  emailNotificationsEnabled,
  setEmailNotificationsEnabled,
  forwardingEmail,
  setForwardingEmail,
  saveEmailSettings,
  isWebEnquiryDialogOpen,
  setIsWebEnquiryDialogOpen,
  webEnquiryNotifications,
  setWebEnquiryNotifications,
  enquiryEmail,
  setEnquiryEmail,
  saveWebEnquirySettings,
}) => {
  return (
    <>
      <Dialog.Root open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Email Settings
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Configure your email notification preferences
              </Dialog.Description>
            </div>
            <div className="py-4">
              <EmailSettingsTab
                emailNotificationsEnabled={emailNotificationsEnabled}
                setEmailNotificationsEnabled={setEmailNotificationsEnabled}
                forwardingEmail={forwardingEmail}
                setForwardingEmail={setForwardingEmail}
                saveEmailSettings={saveEmailSettings}
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="submit" onClick={saveEmailSettings}>
                Save changes
              </Button>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      
      <Dialog.Root open={isWebEnquiryDialogOpen} onOpenChange={setIsWebEnquiryDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 z-50" />
          <Dialog.Content className="fixed left-[50%] top-[50%] z-[51] grid w-full max-w-[425px] translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <Dialog.Title className="text-lg font-semibold leading-none tracking-tight">
                Web Enquiry Settings
              </Dialog.Title>
              <Dialog.Description className="text-sm text-muted-foreground">
                Configure your web enquiry notification preferences
              </Dialog.Description>
            </div>
            <div className="py-4">
              <WebEnquiryTab
                webEnquiryNotifications={webEnquiryNotifications}
                setWebEnquiryNotifications={setWebEnquiryNotifications}
                enquiryEmail={enquiryEmail}
                setEnquiryEmail={setEnquiryEmail}
                saveWebEnquirySettings={saveWebEnquirySettings}
              />
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
              <Button type="submit" onClick={saveWebEnquirySettings}>
                Save changes
              </Button>
            </div>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
};
