
import { MessageSquare } from "lucide-react";
import { ServiceInfo } from "../types";

export const createIconProps = (color: string) => ({
  icon: MessageSquare,
  props: { className: `h-5 w-5 text-${color}-500` }
});

export const getDefaultServices = (): ServiceInfo[] => [
  {
    id: "sms",
    name: "SMS Messages",
    icon: createIconProps("blue"),
    isConnected: false,
    syncEnabled: false,
    serviceType: "sms"
  },
  {
    id: "voicemail",
    name: "Voicemail",
    icon: createIconProps("green"),
    isConnected: false,
    syncEnabled: false,
    serviceType: "voicemail"
  },
  {
    id: "email",
    name: "Email Inquiries",
    icon: createIconProps("purple"),
    isConnected: false,
    syncEnabled: false,
    serviceType: "email"
  }
];

export const getServiceIconByType = (serviceType: string) => {
  switch (serviceType) {
    case 'twilio':
      return createIconProps("red");
    case 'whatsapp':
      return createIconProps("green");
    case 'messenger':
      return createIconProps("blue");
    case 'gcpvision':
      return createIconProps("amber");
    default:
      return createIconProps("amber");
  }
};

export const getServiceNameByType = (serviceType: string): string => {
  switch (serviceType) {
    case 'twilio':
      return "Twilio SMS";
    case 'whatsapp':
      return "WhatsApp Business";
    case 'messenger':
      return "Facebook Messenger";
    case 'gcpvision':
      return "Google Cloud Vision API";
    default:
      return "Custom API Integration";
  }
};
