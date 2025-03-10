
import { useState, useEffect } from 'react';
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const usePhoneNumbers = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedNumbers, setConnectedNumbers] = useState<string[]>([]);

  useEffect(() => {
    loadConnectedNumbers();
  }, []);

  const loadConnectedNumbers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log('No user session found');
        return;
      }
      
      const userId = session.user.id;
      
      const { data: phoneAccounts, error: phoneError } = await supabase
        .from('messaging_accounts')
        .select('phone_number')
        .eq('user_id', userId as string)
        .not('phone_number', 'is', null);
        
      if (phoneError) {
        console.error('Error fetching phone numbers:', phoneError);
      } else if (phoneAccounts && phoneAccounts.length > 0) {
        const numbers = phoneAccounts
          .map(account => account.phone_number)
          .filter(Boolean) as string[];
        setConnectedNumbers(numbers);
      }
    } catch (error) {
      console.error('Error loading connected phone numbers:', error);
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    let formattedValue = value;
    if (value.length > 0) {
      formattedValue = value.match(/.{1,3}/g)?.join('-') || value;
    }
    setPhoneNumber(formattedValue);
  };

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to connect a phone number');
        setIsConnecting(false);
        return;
      }
      
      const userId = session.user.id;
      const cleanNumber = phoneNumber.replace(/\D/g, '');
      
      console.log('Connecting phone number:', cleanNumber);
      
      // Validate the phone number
      const validationResponse = await supabase.functions.invoke('validate-ghl-number', {
        body: { phoneNumber: cleanNumber }
      });
      
      if (validationResponse.error || !validationResponse.data.success) {
        throw new Error(
          validationResponse.error?.message || 
          validationResponse.data?.error || 
          'Failed to validate phone number'
        );
      }
      
      // Insert the phone number into messaging_accounts with type cast for userId
      const { data: accountData, error: accountError } = await supabase
        .from('messaging_accounts')
        .insert({
          user_id: userId as string,
          service_type: 'sms',
          phone_number: phoneNumber,
          enabled: true
        })
        .select('id')
        .single();
        
      if (accountError) {
        throw accountError;
      }
      
      // Enable messaging if not already enabled
      await updateMessagingEnabled(userId);
      
      setConnectedNumbers([...connectedNumbers, phoneNumber]);
      setPhoneNumber('');
      toast.success("Phone number connected successfully");
    } catch (error: any) {
      console.error('Error connecting phone number:', error);
      toast.error(error.message || "Failed to connect to messaging system");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleRemoveNumber = async (index: number) => {
    const numberToRemove = connectedNumbers[index];
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('You must be logged in to remove a phone number');
        return;
      }
      
      const userId = session.user.id;
      
      const { error } = await supabase
        .from('messaging_accounts')
        .delete()
        .eq('user_id', userId as string)
        .eq('phone_number', numberToRemove as string);
        
      if (error) {
        throw error;
      }
      
      const updatedNumbers = [...connectedNumbers];
      updatedNumbers.splice(index, 1);
      setConnectedNumbers(updatedNumbers);
      toast.success("Phone number removed");
    } catch (error: any) {
      console.error('Error removing phone number:', error);
      toast.error('Failed to remove phone number');
    }
  };

  const updateMessagingEnabled = async (userId: string) => {
    try {
      const { data: configData, error: configError } = await supabase
        .from('users_configuration')
        .select('messaging_enabled')
        .eq('id', userId as string)
        .single();
        
      if (configError) {
        console.error('Error fetching user configuration:', configError);
        return;
      }
      
      if (configData && !configData.messaging_enabled) {
        const { error: updateError } = await supabase
          .from('users_configuration')
          .update({ messaging_enabled: true })
          .eq('id', userId as string);
          
        if (updateError) {
          console.error('Error updating messaging configuration:', updateError);
        }
      }
    } catch (error) {
      console.error('Error updating messaging enabled status:', error);
    }
  };

  return {
    phoneNumber,
    isConnecting,
    connectedNumbers,
    handlePhoneNumberChange,
    handleConnect,
    handleRemoveNumber
  };
};
