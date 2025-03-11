export interface PhoneNumberForSale {
  id: string;
  phone_number: string;
  price: number;
  status: string;
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface TwilioPhoneNumber {
  phoneNumber: string;
  friendlyName: string;
  locality?: string;
  region?: string;
  isoCountry?: string;
  capabilities?: {
    voice: boolean;
    sms: boolean;
    mms: boolean;
  };
}

export interface TwilioOrderNumberDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  accountSid: string;
  authToken: string;
}
