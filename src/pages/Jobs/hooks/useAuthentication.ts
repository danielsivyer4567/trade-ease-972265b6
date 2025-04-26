import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAuthentication() {
  const navigate = useNavigate();
  const toast = useToast();

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error checking authentication:", error);
      }
      setIsAuthenticated(!!data.session);
      setIsCheckingAuth(false);
    };
    
    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated) {
      if (toast) {
        toast({
          title: "Authentication Required",
          description: "You need to be logged in to create jobs",
          variant: "destructive"
        });
      }
      navigate("/auth");
    }
  }, [isAuthenticated, isCheckingAuth, navigate, toast]);
  
  return { isAuthenticated, isCheckingAuth };
}
