
import React from 'react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Upload } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AuthNotice } from './AuthNotice';
import { useState, useEffect } from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  onFileUploadClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  onFileUploadClick 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    checkAuth();
    
    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setIsAuthenticated(!!session);
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="space-y-4">
      <SectionHeader
        title={title}
        description={description}
        rightElement={
          onFileUploadClick && (
            <Button onClick={onFileUploadClick} className="gap-2">
              <Upload className="h-4 w-4" />
              <span>Upload Boundaries</span>
            </Button>
          )
        }
      />
      
      {!isAuthenticated && <AuthNotice />}
    </div>
  );
};
