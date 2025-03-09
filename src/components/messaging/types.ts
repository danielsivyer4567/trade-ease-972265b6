
export interface ServiceInfo {
  id: string;
  name: string;
  icon: React.ReactNode;
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
  };
}
