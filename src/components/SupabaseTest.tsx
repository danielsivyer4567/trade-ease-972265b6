import { useEffect, useState } from 'react';
import { supabase } from '../integrations/supabase/client';

export const SupabaseTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        // Try to fetch the current user session to test the connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        setStatus('success');
      } catch (err) {
        console.error('Supabase connection test failed:', err);
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
        setStatus('error');
      }
    };

    testConnection();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h2 className="text-lg font-semibold mb-2">Supabase Connection Test</h2>
      <div className="space-y-2">
        <p>Status: 
          <span className={`ml-2 font-medium ${
            status === 'loading' ? 'text-yellow-600' :
            status === 'success' ? 'text-green-600' :
            'text-red-600'
          }`}>
            {status.toUpperCase()}
          </span>
        </p>
        {error && (
          <p className="text-red-600">Error: {error}</p>
        )}
        <div className="text-sm text-gray-600">
          <p>Environment Variables:</p>
          <pre className="mt-1 p-2 bg-gray-100 rounded">
            {`VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL ? '✓ Set' : '✗ Not Set'}`}
            {'\n'}
            {`VITE_SUPABASE_ANON_KEY: ${import.meta.env.VITE_SUPABASE_ANON_KEY ? '✓ Set' : '✗ Not Set'}`}
          </pre>
        </div>
      </div>
    </div>
  );
}; 