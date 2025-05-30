import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

export const AuthDebugger = () => {
  const [loading, setLoading] = useState(true);
  const [authStatus, setAuthStatus] = useState<{
    isAuthenticated: boolean;
    user: any;
    session: any;
    userProfile: any;
    error: string | null;
  }>({
    isAuthenticated: false,
    user: null,
    session: null,
    userProfile: null,
    error: null
  });
  const [tablesStatus, setTablesStatus] = useState<{
    userProfilesExists: boolean;
    customersExists: boolean;
    loading: boolean;
    error: string | null;
  }>({
    userProfilesExists: false,
    customersExists: false,
    loading: true,
    error: null
  });

  const checkAuth = async () => {
    setLoading(true);
    try {
      // Check session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          session: null,
          userProfile: null,
          error: sessionError.message
        });
        return;
      }
      
      const session = sessionData?.session;
      const user = session?.user;
      
      // If no user, return early
      if (!user) {
        setAuthStatus({
          isAuthenticated: false,
          user: null,
          session: null,
          userProfile: null,
          error: 'No authenticated user found'
        });
        return;
      }
      
      // Check user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      
      setAuthStatus({
        isAuthenticated: !!session,
        user,
        session,
        userProfile: profileData || null,
        error: profileError ? profileError.message : null
      });
    } catch (error) {
      setAuthStatus({
        isAuthenticated: false,
        user: null,
        session: null,
        userProfile: null,
        error: error instanceof Error ? error.message : 'Unknown error checking auth status'
      });
    } finally {
      setLoading(false);
    }
  };

  const checkTables = async () => {
    setTablesStatus(prev => ({ ...prev, loading: true }));
    try {
      // Check if user_profiles table exists
      let userProfilesExists = false;
      let userProfilesError = null;
      
      try {
        const result = await supabase
          .rpc('check_table_exists', { table_name: 'user_profiles' });
        userProfilesExists = !!result.data;
        userProfilesError = result.error;
      } catch (err) {
        userProfilesError = err instanceof Error ? err.message : 'Unknown error';
      }
      
      // Check if customers table exists
      let customersExists = false;
      let customersError = null;
      
      try {
        const result = await supabase
          .rpc('check_table_exists', { table_name: 'customers' });
        customersExists = !!result.data;
        customersError = result.error;
      } catch (err) {
        customersError = err instanceof Error ? err.message : 'Unknown error';
      }
      
      setTablesStatus({
        userProfilesExists,
        customersExists,
        loading: false,
        error: userProfilesError || customersError ? 'Error checking tables' : null
      });
    } catch (error) {
      setTablesStatus({
        userProfilesExists: false,
        customersExists: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error checking tables'
      });
    }
  };

  const createUserProfile = async () => {
    if (!authStatus.user) {
      alert('No authenticated user found');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: authStatus.user.id,
          email: authStatus.user.email,
          name: authStatus.user.user_metadata?.name || authStatus.user.email,
          two_factor_enabled: false,
          created_at: new Date().toISOString()
        });
        
      if (error) throw error;
      
      alert('User profile created successfully');
      checkAuth();
    } catch (error) {
      alert(`Error creating user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const createCheckTableFunction = async () => {
    try {
      // SQL to create the function
      const functionSQL = `
      CREATE OR REPLACE FUNCTION check_table_exists(table_name text)
      RETURNS boolean
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
        table_exists boolean;
      BEGIN
        SELECT EXISTS (
          SELECT FROM pg_tables 
          WHERE schemaname = 'public' 
          AND tablename = table_name
        ) INTO table_exists;
        
        RETURN table_exists;
      END;
      $$;
      `;
      
      // Execute the SQL via RPC
      const { error } = await supabase.rpc('exec_sql', { sql: functionSQL });
      
      if (error) throw error;
      
      alert('check_table_exists function created successfully');
      checkTables();
    } catch (error) {
      alert(`Error creating function: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  useEffect(() => {
    checkAuth();
    checkTables();
  }, []);

  return (
    <Card className="w-full max-w-2xl mx-auto mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Authentication Debugger
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Auth Status */}
        <div>
          <h3 className="text-lg font-medium mb-2">Auth Status</h3>
          <div className="flex items-center gap-2 mb-2">
            <span>Authentication:</span>
            {authStatus.isAuthenticated ? (
              <Badge className="bg-green-100 text-green-800">Authenticated</Badge>
            ) : (
              <Badge variant="destructive">Not Authenticated</Badge>
            )}
          </div>
          
          {authStatus.error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{authStatus.error}</AlertDescription>
            </Alert>
          )}
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="user">
              <AccordionTrigger className="text-sm font-medium">
                User Details
                {authStatus.user ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 ml-2" />
                )}
              </AccordionTrigger>
              <AccordionContent>
                <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                  {JSON.stringify(authStatus.user, null, 2)}
                </pre>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="profile">
              <AccordionTrigger className="text-sm font-medium">
                User Profile
                {authStatus.userProfile ? (
                  <CheckCircle className="h-4 w-4 text-green-500 ml-2" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500 ml-2" />
                )}
              </AccordionTrigger>
              <AccordionContent>
                {authStatus.userProfile ? (
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-60">
                    {JSON.stringify(authStatus.userProfile, null, 2)}
                  </pre>
                ) : (
                  <div className="flex flex-col gap-2">
                    <p className="text-sm text-red-500">No user profile found</p>
                    {authStatus.user && (
                      <Button size="sm" onClick={createUserProfile}>
                        Create User Profile
                      </Button>
                    )}
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        
        {/* Database Status */}
        <div>
          <h3 className="text-lg font-medium mb-2">Database Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>user_profiles table:</span>
              {tablesStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : tablesStatus.userProfilesExists ? (
                <Badge className="bg-green-100 text-green-800">Exists</Badge>
              ) : (
                <Badge variant="destructive">Missing</Badge>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <span>customers table:</span>
              {tablesStatus.loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : tablesStatus.customersExists ? (
                <Badge className="bg-green-100 text-green-800">Exists</Badge>
              ) : (
                <Badge variant="destructive">Missing</Badge>
              )}
            </div>
            
            {tablesStatus.error && (
              <Alert variant="destructive" className="mt-2">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Database Error</AlertTitle>
                <AlertDescription>{tablesStatus.error}</AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button onClick={() => { checkAuth(); checkTables(); }} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Checking...
            </>
          ) : (
            'Refresh Status'
          )}
        </Button>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={createCheckTableFunction}>
            Create Table Check Function
          </Button>
          <Button variant="outline" onClick={() => window.location.href = '/auth'}>
            Go to Auth Page
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}; 