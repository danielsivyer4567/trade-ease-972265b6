
export interface MessagingService {
  id: string;
  name: string;
  type: string;
  isConnected: boolean;
  syncEnabled: boolean;
  lastSynced?: string;
  connectionDetails?: {
    // Twilio specific
    accountSid?: string;
    authToken?: string;
    phoneNumber?: string;
    
    // Generic
    apiKey?: string;
    accountId?: string;
    url?: string;
  };
}
