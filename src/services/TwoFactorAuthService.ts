import { supabase } from '@/integrations/supabase/client';

// Define types for 2FA data
interface TwoFactorAuthData {
  userId: string;
  phoneNumber: string;
  verificationCode: string;
  verificationLink: string;
  createdAt: Date;
  expiresAt: Date;
  verified: boolean;
}

class TwoFactorAuthService {
  // Store the verification request in the database
  async createVerificationRequest(
    userId: string, 
    phoneNumber: string
  ): Promise<{ verificationLink: string, verificationCode: string } | null> {
    try {
      // Generate a random 6-digit code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Create a unique verification link with the code
      const verificationId = crypto.randomUUID();
      const verificationLink = `${window.location.origin}/auth/verify?id=${verificationId}&code=${verificationCode}`;
      
      // Set expiration to 10 minutes from now
      const now = new Date();
      const expiresAt = new Date(now.getTime() + 10 * 60 * 1000);
      
      // Store the verification data in Supabase
      const { error } = await supabase
        .from('two_factor_auth')
        .insert({
          user_id: userId,
          phone_number: phoneNumber,
          verification_code: verificationCode,
          verification_link: verificationLink,
          verification_id: verificationId,
          created_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
          verified: false
        });
      
      if (error) {
        console.error('Error creating 2FA verification:', error);
        return null;
      }
      
      return { verificationLink, verificationCode };
    } catch (error) {
      console.error('Error in createVerificationRequest:', error);
      return null;
    }
  }
  
  // Send SMS via Twilio (assuming Twilio integration exists in the project)
  async sendVerificationSMS(phoneNumber: string, verificationLink: string): Promise<boolean> {
    try {
      // This would use the existing Twilio integration
      const { error } = await supabase.functions.invoke('send-verification-sms', {
        body: {
          phoneNumber,
          message: `Your Trade Ease verification link: ${verificationLink}`
        }
      });
      
      if (error) {
        console.error('Error sending verification SMS:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in sendVerificationSMS:', error);
      return false;
    }
  }
  
  // Verify the link and code combination
  async verifyCode(verificationId: string, code: string): Promise<boolean> {
    try {
      // Get the verification request
      const { data, error } = await supabase
        .from('two_factor_auth')
        .select('*')
        .eq('verification_id', verificationId)
        .eq('verification_code', code)
        .eq('verified', false)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (error || !data) {
        console.error('Error or no data found in verifyCode:', error);
        return false;
      }
      
      // Mark the verification as used
      const { error: updateError } = await supabase
        .from('two_factor_auth')
        .update({ verified: true })
        .eq('verification_id', verificationId);
      
      if (updateError) {
        console.error('Error updating verification status:', updateError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in verifyCode:', error);
      return false;
    }
  }
  
  // Check if a user has 2FA enabled
  async isEnabled(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('two_factor_enabled, phone_number')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        console.error('Error checking if 2FA is enabled:', error);
        return false;
      }
      
      return data.two_factor_enabled && !!data.phone_number;
    } catch (error) {
      console.error('Error in isEnabled:', error);
      return false;
    }
  }
  
  // Enable 2FA for a user
  async enable(userId: string, phoneNumber: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          two_factor_enabled: true,
          phone_number: phoneNumber
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error enabling 2FA:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in enable:', error);
      return false;
    }
  }
  
  // Disable 2FA for a user
  async disable(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          two_factor_enabled: false
        })
        .eq('user_id', userId);
      
      if (error) {
        console.error('Error disabling 2FA:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in disable:', error);
      return false;
    }
  }
}

export const twoFactorAuthService = new TwoFactorAuthService(); 