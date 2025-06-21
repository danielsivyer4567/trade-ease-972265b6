import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';

interface GeminiDebugProps {
  apiKey: string;
}

export const GeminiDebug: React.FC<GeminiDebugProps> = ({ apiKey }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testGeminiAPI = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: "Hello! Please respond with 'Gemini is working!' if you can hear me."
              }]
            }]
          })
        }
      );

      const data = await res.json();
      setResponse(data);

      if (!res.ok) {
        setError(`API Error: ${data.error?.message || res.statusText}`);
      }
    } catch (err) {
      setError(`Network Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Gemini API Debug</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm space-y-1">
          <p><strong>API Key:</strong> {apiKey ? `${apiKey.substring(0, 10)}...${apiKey.substring(apiKey.length - 4)}` : 'Not set'}</p>
          <p><strong>Endpoint:</strong> gemini-1.5-flash</p>
        </div>

        <Button 
          onClick={testGeminiAPI} 
          disabled={isLoading || !apiKey}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            'Test Gemini API'
          )}
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {response && (
          <div className="space-y-2">
            <h3 className="font-semibold">Response:</h3>
            {response.candidates?.[0]?.content?.parts?.[0]?.text ? (
              <Alert>
                <AlertDescription>
                  {response.candidates[0].content.parts[0].text}
                </AlertDescription>
              </Alert>
            ) : (
              <pre className="text-xs bg-muted p-2 rounded overflow-auto max-h-40">
                {JSON.stringify(response, null, 2)}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 