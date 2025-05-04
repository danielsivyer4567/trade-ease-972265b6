import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getArcGISToken, setArcGISToken } from '../utils/arcgisToken';
import { Loader2, MapPin, Key } from 'lucide-react';
import { toast } from 'sonner';

interface TokenInputProps {
  onTokenSet?: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({ onTokenSet }) => {
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasToken, setHasToken] = useState<boolean>(false);
  
  // Check if we already have a token
  useEffect(() => {
    const existingToken = getArcGISToken();
    setHasToken(!!existingToken);
    if (existingToken) {
      setToken(existingToken);
    }
  }, []);
  
  const handleTokenSave = () => {
    if (!token || token.trim().length < 10) {
      toast.error('Please enter a valid token');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate token validation
    setTimeout(() => {
      try {
        setArcGISToken(token.trim());
        setHasToken(true);
        toast.success('Token saved successfully');
        
        if (onTokenSet) {
          onTokenSet();
        }
      } catch (error) {
        console.error('Error saving token:', error);
        toast.error('Failed to save token');
      } finally {
        setIsLoading(false);
      }
    }, 600);
  };
  
  return (
    <Card className="w-full shadow-md">
      <CardHeader className="bg-slate-50 border-b border-slate-100">
        <CardTitle className="text-lg flex items-center gap-2">
          <Key className="h-5 w-5 text-blue-600" />
          ArcGIS Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="arcgis-token">ArcGIS API Token</Label>
            <Input
              id="arcgis-token"
              placeholder="Enter your ArcGIS token here..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            {hasToken ? (
              <div className="p-2 bg-green-50 text-green-700 rounded-md flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Token is set and ready to use</span>
              </div>
            ) : (
              <div className="p-2 bg-amber-50 text-amber-700 rounded-md">
                A valid ArcGIS token is required to view property boundaries on the map.
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t bg-slate-50 flex justify-end gap-2 p-3">
        <Button
          variant="outline"
          onClick={() => setToken('')}
          disabled={isLoading || !token}
        >
          Clear
        </Button>
        <Button
          onClick={handleTokenSave}
          disabled={isLoading || !token || token === getArcGISToken()}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Token'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}; 