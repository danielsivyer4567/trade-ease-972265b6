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
  private async checkTableExists(tableName: string): Promise<boolean> {
    try {
      // Try a simple query to check if table exists
      const { error } = await supabase.from(tableName).select('*').limit(1);
      return !error || !error.message.includes('relation') && !error.message.includes('does not exist');
    } catch {
      return false;
    }
  }

  // Store the verification request in the database
  async createVerificationRequest(
    userId: string, 
    phoneNumber: string
  ): Promise<{ verificationLink: string, verificationCode: string } | null> {
    try {
      // Check if table exists first
      const tableExists = await this.checkTableExists('two_factor_auth');
      if (!tableExists) {
        console.warn('2FA: two_factor_auth table does not exist, falling back to in-memory storage');
        return this.createInMemoryVerification(userId, phoneNumber);
      }

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
        return this.createInMemoryVerification(userId, phoneNumber);
      }
      
      return { verificationLink, verificationCode };
    } catch (error) {
      console.error('Error in createVerificationRequest:', error);
      return this.createInMemoryVerification(userId, phoneNumber);
    }
  }

  // Fallback in-memory verification (for development)
  private createInMemoryVerification(userId: string, phoneNumber: string) {
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationId = crypto.randomUUID();
    const verificationLink = `${window.location.origin}/auth/verify?id=${verificationId}&code=${verificationCode}`;
    
    // Store in localStorage for development
    const verificationData = {
      userId,
      phoneNumber,
      verificationCode,
      verificationId,
      verificationLink,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      verified: false
    };
    
    localStorage.setItem(`2fa_verification_${verificationId}`, JSON.stringify(verificationData));
    
    console.log('2FA: Created in-memory verification:', verificationData);
    return { verificationLink, verificationCode };
  }
  
  // Send SMS via Supabase Edge Function or fallback
  async sendVerificationSMS(phoneNumber: string, verificationLink: string): Promise<boolean> {
    try {
      // Try to use Supabase Edge Function
      const { error } = await supabase.functions.invoke('send-verification-sms', {
        body: {
          phoneNumber,
          message: `Your Trade Ease verification link: ${verificationLink}`
        }
      });
      
      if (error) {
        console.warn('Edge function failed, using simulation:', error);
        return this.simulateSMS(phoneNumber, verificationLink);
      }
      
      return true;
    } catch (error) {
      console.warn('SMS sending failed, using simulation:', error);
      return this.simulateSMS(phoneNumber, verificationLink);
    }
  }

  // Simulate SMS sending for development
  private simulateSMS(phoneNumber: string, verificationLink: string): boolean {
    console.log(`📱 SMS Simulation - To: ${phoneNumber}`);
    console.log(`📱 Message: Your Trade Ease verification link: ${verificationLink}`);
    
    // Show a browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('SMS Sent (Simulated)', {
        body: `Verification link sent to ${phoneNumber}`,
        icon: '/favicon.png'
      });
    }
    
    return true;
  }
  
  // Verify the link and code combination
  async verifyCode(verificationId: string, code: string): Promise<boolean> {
    try {
      // First try database
      const tableExists = await this.checkTableExists('two_factor_auth');
      if (tableExists) {
        const { data, error } = await supabase
          .from('two_factor_auth')
          .select('*')
          .eq('verification_id', verificationId)
          .eq('verification_code', code)
          .eq('verified', false)
          .gt('expires_at', new Date().toISOString())
          .single();
        
        if (data && !error) {
          // Mark as verified
          await supabase
            .from('two_factor_auth')
            .update({ verified: true })
            .eq('verification_id', verificationId);
          
          return true;
        }
      }
      
      // Fallback to localStorage
      return this.verifyInMemoryCode(verificationId, code);
    } catch (error) {
      console.error('Error in verifyCode:', error);
      return this.verifyInMemoryCode(verificationId, code);
    }
  }

  // Verify code from localStorage
  private verifyInMemoryCode(verificationId: string, code: string): boolean {
    try {
      const stored = localStorage.getItem(`2fa_verification_${verificationId}`);
      if (!stored) return false;
      
      const data = JSON.parse(stored);
      const now = new Date();
      const expiresAt = new Date(data.expiresAt);
      
      if (data.verificationCode === code && !data.verified && now < expiresAt) {
        data.verified = true;
        localStorage.setItem(`2fa_verification_${verificationId}`, JSON.stringify(data));
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  }
  
  // Check if a user has 2FA enabled
  async isEnabled(userId: string): Promise<boolean> {
    try {
      const tableExists = await this.checkTableExists('user_profiles');
      if (!tableExists) {
        console.warn('2FA: user_profiles table does not exist, returning false');
        return false;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('two_factor_enabled, phone_number')
        .eq('user_id', userId)
        .single();
      
      if (error || !data) {
        console.warn('2FA: Error checking if 2FA is enabled or no data found:', error);
        return false;
      }
      
      return data.two_factor_enabled && !!data.phone_number;
    } catch (error) {
      console.warn('2FA: Error in isEnabled, returning false:', error);
      return false;
    }
  }
  
  // Enable 2FA for a user
  async enable(userId: string, phoneNumber: string): Promise<boolean> {
    try {
      const tableExists = await this.checkTableExists('user_profiles');
      if (!tableExists) {
        console.warn('2FA: user_profiles table does not exist, cannot enable 2FA');
        return false;
      }

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
      const tableExists = await this.checkTableExists('user_profiles');
      if (!tableExists) {
        console.warn('2FA: user_profiles table does not exist, cannot disable 2FA');
        return false;
      }

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