import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const PropertyBoundariesFallback: React.FC = () => {
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Property Boundaries</h1>
            <p className="text-muted-foreground">Simple emergency mode</p>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="bg-amber-50 border-b border-amber-100">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              <CardTitle>Limited Functionality Mode</CardTitle>
            </div>
            <CardDescription>
              The Property Boundaries page encountered a loading error.
              This is a fallback page with reduced functionality.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="mb-4">
              The Property Boundaries feature is currently experiencing technical difficulties.
              You can try reloading the page or return to the dashboard.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <Button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return to Dashboard
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => window.location.reload()}
                className="flex items-center gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Loading
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Why am I seeing this?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                There was a problem loading the Property Boundaries page.
                This could be due to:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Temporary API connection issues</li>
                <li>Browser compatibility problems</li>
                <li>Map rendering conflicts</li>
                <li>Authentication token expiration</li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Suggested Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1">
                <li>Clear your browser cache and reload</li>
                <li>Try using a different browser</li>
                <li>Check your internet connection</li>
                <li>Log out and log back in</li>
                <li>Contact support if the issue persists</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default PropertyBoundariesFallback; 