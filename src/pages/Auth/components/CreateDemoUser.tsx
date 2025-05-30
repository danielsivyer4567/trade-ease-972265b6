import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export function CreateDemoUser() {
  const [loading, setLoading] = useState(false);

  const createDemoUser = async () => {
    setLoading(true);
    try {
      // Check if the demo user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('auth.users')
        .select('*')
        .eq('email', 'demo@tradeease.com')
        .maybeSingle();

      if (checkError) {
        console.error('Error checking for demo user:', checkError);
      }

      // If the user doesn't exist, create them
      if (!existingUser) {
        // Sign up the demo user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: 'demo@tradeease.com',
          password: 'Password123!'
        });

        if (signUpError) {
          throw signUpError;
        }

        if (authData?.user) {
          // Create a user profile for the demo user
          const { error: profileError } = await supabase
            .from('user_profiles')
            .upsert({
              user_id: authData.user.id,
              email: 'demo@tradeease.com',
              name: 'Demo User',
              two_factor_enabled: false,
              phone_number: '+15555555555',
              created_at: new Date().toISOString()
            });

          if (profileError) {
            console.error('Error creating user profile:', profileError);
            throw profileError;
          }

          // Create a demo customer for the user
          const { error: customerError } = await supabase
            .from('customers')
            .upsert({
              user_id: authData.user.id,
              name: 'Demo Customer',
              email: 'customer@example.com',
              phone: '555-123-4567',
              address: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipcode: '12345',
              status: 'active',
              customer_code: 'DEMO-001'
            });

          if (customerError) {
            console.error('Error creating demo customer:', customerError);
            throw customerError;
          }

          toast.success('Demo user created! Email: demo@tradeease.com, Password: Password123!');
        }
      } else {
        toast.info('Demo user already exists! Email: demo@tradeease.com, Password: Password123!');
      }

      // Sign in the demo user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: 'demo@tradeease.com',
        password: 'Password123!'
      });

      if (signInError) {
        throw signInError;
      }

      toast.success('Signed in as demo user!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error creating demo user:', error);
      toast.error('Failed to create demo user. See console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8">
      <CardHeader>
        <CardTitle>Quick Demo Login</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-gray-600">
          Having trouble accessing the customers page? Create a demo user with sample data for testing.
        </p>
        <Button 
          onClick={createDemoUser} 
          className="w-full" 
          disabled={loading}
        >
          {loading ? 'Creating Demo User...' : 'Create & Login as Demo User'}
        </Button>
      </CardContent>
    </Card>
  );
} 