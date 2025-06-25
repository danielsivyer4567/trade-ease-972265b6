import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, AlertCircle, CheckCircle } from 'lucide-react';

export default function GoogleCloudFixPage() {
  return (
    <BaseLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 mt-0.5" />
              <div>
                <h1 className="text-2xl font-bold text-red-900">Google Maps API is Blocked</h1>
                <p className="text-red-700 mt-1">Your API key is being rejected. Follow these steps to fix it.</p>
              </div>
            </div>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 1: Open Google Cloud Console</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full" 
                onClick={() => window.open('https://console.cloud.google.com/apis/credentials', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Google Cloud Console - Credentials
              </Button>
              <p className="text-sm text-gray-600 mt-2">
                Log in with the Google account that created the API key
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 2: Find Your API Key</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-3 bg-gray-100 rounded-md font-mono text-sm mb-3">
<<<<<<< HEAD
                AIzaSyBFVIiAURNyUiIR_2dRQmud98q9sCn5ONI
=======
                AIzaSyCVHBYlen8sLxyI69WC67znnfi9SU4J0BY
>>>>>>> 36fe2b8b6a4c5197b88aa6f671b0288a98028ae7
              </div>
              <p className="text-sm text-gray-600">
                Click on this API key in the credentials list
              </p>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 3: Configure HTTP Referrers</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                <li>
                  <strong>1.</strong> Under "Application restrictions", select <strong>HTTP referrers</strong>
                </li>
                <li>
                  <strong>2.</strong> Click "ADD AN ITEM" and add each of these (one per line):
                  <div className="mt-2 space-y-1">
                    <code className="block bg-gray-100 p-2 rounded text-sm">localhost:5173/*</code>
                    <code className="block bg-gray-100 p-2 rounded text-sm">localhost:5174/*</code>
                    <code className="block bg-gray-100 p-2 rounded text-sm">http://localhost:*</code>
                    <code className="block bg-gray-100 p-2 rounded text-sm">https://localhost:*</code>
                  </div>
                </li>
                <li>
                  <strong>3.</strong> For production, also add your domain:
                  <code className="block bg-gray-100 p-2 rounded text-sm mt-1">https://yourdomain.com/*</code>
                </li>
              </ol>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 4: Enable Required APIs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3">Make sure these APIs are enabled:</p>
              <div className="space-y-2">
                <Button 
                  variant="outline"
                  className="w-full justify-start" 
                  onClick={() => window.open('https://console.cloud.google.com/apis/library/maps-backend.googleapis.com', '_blank')}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Maps JavaScript API (REQUIRED)
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start" 
                  onClick={() => window.open('https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com', '_blank')}
                >
                  <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                  Geocoding API
                </Button>
                <Button 
                  variant="outline"
                  className="w-full justify-start" 
                  onClick={() => window.open('https://console.cloud.google.com/apis/library/places-backend.googleapis.com', '_blank')}
                >
                  Places API (Optional)
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Step 5: Check Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => window.open('https://console.cloud.google.com/billing', '_blank')}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Check Billing Status
              </Button>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Google Maps requires a billing account, but you get $200 free credit per month which is more than enough for development.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Step 6: Save and Wait</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-green-800">
                <li>1. Click <strong>SAVE</strong> at the bottom of the API key page</li>
                <li>2. Wait 5-10 minutes for changes to propagate</li>
                <li>3. Clear your browser cache (Ctrl+Shift+R)</li>
                <li>4. Try the map again</li>
              </ol>
              <Button 
                className="w-full mt-4" 
                onClick={() => window.location.href = '/'}
              >
                Go Back to Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-900">Alternative: Use a New API Key</CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-800">
              <p className="mb-3">If the above doesn't work, create a new API key:</p>
              <ol className="space-y-2 text-sm">
                <li>1. In Google Cloud Console, click "+ CREATE CREDENTIALS"</li>
                <li>2. Select "API key"</li>
                <li>3. Configure it with the settings above</li>
                <li>4. Update your .env file with the new key</li>
                <li>5. Restart your development server</li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
} 