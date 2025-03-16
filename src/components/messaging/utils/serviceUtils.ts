
import { MessageSquare, Facebook, Instagram, Youtube, Store } from "lucide-react";
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
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: { icon: Facebook, props: { className: "h-5 w-5 text-blue-800" } },
    isConnected: false,
    syncEnabled: false,
    serviceType: "facebook"
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: { icon: Instagram, props: { className: "h-5 w-5 text-pink-600" } },
    isConnected: false,
    syncEnabled: false,
    serviceType: "instagram"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: { icon: Youtube, props: { className: "h-5 w-5 text-black" } },
    isConnected: false,
    syncEnabled: false,
    serviceType: "tiktok"
  },
  {
    id: "google_business",
    name: "Google Business",
    icon: { icon: Store, props: { className: "h-5 w-5 text-red-600" } },
    isConnected: false,
    syncEnabled: false,
    serviceType: "google_business"
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
    case 'facebook':
      return { icon: Facebook, props: { className: "h-5 w-5 text-blue-800" } };
    case 'instagram':
      return { icon: Instagram, props: { className: "h-5 w-5 text-pink-600" } };
    case 'tiktok':
      return { icon: Youtube, props: { className: "h-5 w-5 text-black" } };
    case 'google_business':
      return { icon: Store, props: { className: "h-5 w-5 text-red-600" } };
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
    case 'facebook':
      return "Facebook";
    case 'instagram':
      return "Instagram";
    case 'tiktok':
      return "TikTok";
    case 'google_business':
      return "Google My Business";
    default:
      return "Custom API Integration";
  }
};
