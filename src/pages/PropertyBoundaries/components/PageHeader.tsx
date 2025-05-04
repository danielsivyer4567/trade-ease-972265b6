import React from 'react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Upload, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { AuthNotice } from './AuthNotice';
import { useState, useEffect } from 'react';
import { getArcGISToken } from '../utils/arcgisToken';

interface PageHeaderProps {
  title: string;
  description?: string;
  onFileUploadClick?: () => void;
  onConfigureTokenClick?: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description,
  onFileUploadClick,
  onConfigureTokenClick
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };
    
    // Check if we have an ArcGIS token
    const token = getArcGISToken();
    setHasToken(!!token);
    
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
          <div className="flex items-center gap-2">
            {onConfigureTokenClick && (
              <Button 
                onClick={onConfigureTokenClick} 
                variant="outline" 
                size="sm"
                className={`gap-2 ${!hasToken ? 'border-amber-500 text-amber-700' : ''}`}
              >
                <Settings className="h-4 w-4" />
                <span>Configure ArcGIS</span>
                {!hasToken && (
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                    Required
                  </span>
                )}
              </Button>
            )}
            
            {onFileUploadClick && (
              <Button onClick={onFileUploadClick} className="gap-2">
                <Upload className="h-4 w-4" />
                <span>Upload Boundaries</span>
              </Button>
            )}
          </div>
        }
      />
      
      {!isAuthenticated && <AuthNotice />}
    </div>
  );
};
