import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface HealthStatus {
  name: string;
  status: 'success' | 'error' | 'warning' | 'loading';
  message: string;
}

export function AppHealthCheck() {
  const [healthChecks, setHealthChecks] = useState<HealthStatus[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { user } = useAuth();

  const runHealthChecks = async () => {
    setIsRunning(true);
    const checks: HealthStatus[] = [];

    // Check Environment Variables
    try {
      const hasSupabaseUrl = !!import.meta.env.VITE_SUPABASE_URL;
      const hasSupabaseKey = !!import.meta.env.VITE_SUPABASE_ANON_KEY;
      const hasGoogleMapsKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      checks.push({
        name: 'Environment Variables',
        status: hasSupabaseUrl && hasSupabaseKey ? 'success' : 'error',
        message: hasSupabaseUrl && hasSupabaseKey ? 'All required variables configured' : 'Missing required environment variables'
      });

      checks.push({
        name: 'Google Maps API',
        status: hasGoogleMapsKey ? 'success' : 'warning',
        message: hasGoogleMapsKey ? 'Google Maps API key configured' : 'Google Maps API key not configured'
      });
    } catch (error) {
      checks.push({
        name: 'Environment Variables',
        status: 'error',
        message: 'Error checking environment variables'
      });
    }

    // Check Supabase Connection
    try {
      const { data, error } = await supabase.from('customers').select('count', { count: 'exact', head: true });
      checks.push({
        name: 'Database Connection',
        status: error ? 'warning' : 'success',
        message: error ? 'Database connection issues (app will still work)' : 'Database connected successfully'
      });
    } catch (error) {
      checks.push({
        name: 'Database Connection',
        status: 'warning',
        message: 'Database connection failed (app will still work)'
      });
    }

    // Check Authentication
    checks.push({
      name: 'Authentication',
      status: user ? 'success' : 'warning',
      message: user ? 'User authenticated' : 'Not authenticated (expected for public pages)'
    });

    // Check Router
    try {
      const currentPath = window.location.pathname;
      checks.push({
        name: 'Navigation',
        status: 'success',
        message: `Currently at: ${currentPath}`
      });
    } catch (error) {
      checks.push({
        name: 'Navigation',
        status: 'error',
        message: 'Navigation system error'
      });
    }

    setHealthChecks(checks);
    setIsRunning(false);
  };

  useEffect(() => {
    runHealthChecks();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <RefreshCw className="h-4 w-4 animate-spin" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const overallStatus = healthChecks.length > 0 ? (
    healthChecks.some(check => check.status === 'error') ? 'error' :
    healthChecks.some(check => check.status === 'warning') ? 'warning' : 'success'
  ) : 'loading';

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {getStatusIcon(overallStatus)}
          App Health Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <Badge variant={getStatusVariant(overallStatus)}>
            {overallStatus === 'success' ? 'All Systems Operational' :
             overallStatus === 'warning' ? 'Minor Issues Detected' :
             overallStatus === 'error' ? 'Issues Detected' : 'Checking...'}
          </Badge>
          <Button 
            onClick={runHealthChecks} 
            disabled={isRunning}
            size="sm"
            variant="outline"
          >
            {isRunning ? <RefreshCw className="h-4 w-4 animate-spin" /> : 'Refresh'}
          </Button>
        </div>
        
        <div className="space-y-2">
          {healthChecks.map((check, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getStatusIcon(check.status)}
                <span className="font-medium">{check.name}</span>
              </div>
              <span className="text-sm text-gray-600">{check.message}</span>
            </div>
          ))}
        </div>
        
        {healthChecks.length === 0 && (
          <div className="text-center py-4">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2" />
            <p>Running health checks...</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 