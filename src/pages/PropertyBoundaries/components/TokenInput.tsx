import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { saveArcGISToken } from '../utils/arcgisToken';
import { toast } from 'sonner';

interface TokenInputProps {
  onTokenSet: () => void;
}

export const TokenInput: React.FC<TokenInputProps> = ({ onTokenSet }) => {
  const [token, setToken] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast.error('Please enter a valid token');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Save the token
      saveArcGISToken(token);
      toast.success('ArcGIS token saved successfully');
      onTokenSet();
    } catch (error) {
      console.error('Error saving token:', error);
      toast.error('Failed to save token');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full mb-4">
      <CardHeader>
        <CardTitle>ArcGIS Token Configuration</CardTitle>
        <CardDescription>
          Enter your ArcGIS token to access property boundary data
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">ArcGIS Token</Label>
              <Input 
                id="token"
                type="text" 
                value={token} 
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your ArcGIS token"
                disabled={isSubmitting}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onTokenSet()}
            disabled={isSubmitting}
          >
            Skip
          </Button>
          <Button 
            type="submit"
            disabled={!token.trim() || isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Token'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}; 