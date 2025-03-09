
import { LucideIcon } from 'lucide-react';

export interface ServiceInfo {
  id: string;
  name: string;
  icon: {
    icon: LucideIcon;
    props: { className: string };
  };
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
  serviceType: string;
  connectionDetails?: {
    apiKey?: string;
    accountId?: string;
    url?: string;
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
    gcpVisionKey?: string;
  };
}
