import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function XeroCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the authorization code and state from URL parameters
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const storedState = localStorage.getItem("xeroAuthState");

        // Validate state to prevent CSRF attacks
        if (!state || state !== storedState) {
          throw new Error("Invalid state parameter");
        }

        // Clear the stored state
        localStorage.removeItem("xeroAuthState");

        if (!code) {
          throw new Error("No authorization code received");
        }

        // Exchange the code for tokens
        const response = await supabase.functions.invoke('xero-token-exchange', {
          body: { code }
        });

        if (response.error) {
          throw new Error(response.error.message || 'Failed to exchange authorization code');
        }

        toast.success("Successfully connected to Xero!");
        
        // Redirect back to integrations page
        navigate("/settings/integrations");
      } catch (error) {
        console.error("Error in Xero callback:", error);
        setError(error.message);
        toast.error("Failed to complete Xero connection");
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 max-w-md w-full">
          <h1 className="text-red-800 font-semibold mb-2">Connection Error</h1>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => navigate("/settings/integrations")}
            className="mt-4 text-sm text-red-700 hover:text-red-800 underline"
          >
            Return to Integrations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md w-full">
        <h1 className="text-blue-800 font-semibold mb-2">Connecting to Xero</h1>
        <p className="text-blue-600">Please wait while we complete your connection...</p>
      </div>
    </div>
  );
} 