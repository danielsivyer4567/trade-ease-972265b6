import { BaseLayout } from "@/components/ui/BaseLayout";
import { GoogleMapsDebug } from "@/components/debug/GoogleMapsDebug";

export default function DebugMapsPage() {
  return (
    <BaseLayout>
      <div className="min-h-screen p-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Google Maps API Debug</h1>
          <GoogleMapsDebug />
          
          <div className="mt-8 p-6 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Troubleshooting Steps</h2>
            <ol className="space-y-3 list-decimal list-inside">
              <li>
                <strong>Check Browser Console:</strong> Press F12 and look for specific error messages
              </li>
              <li>
                <strong>Verify API Key:</strong> Make sure the API key in your .env file is correct
              </li>
              <li>
                <strong>Google Cloud Console:</strong>
                <ul className="ml-6 mt-2 space-y-1 list-disc">
                  <li>Go to <a href="https://console.cloud.google.com" target="_blank" className="text-blue-600 underline">console.cloud.google.com</a></li>
                  <li>Select your project</li>
                  <li>Enable "Maps JavaScript API"</li>
                  <li>Enable billing (required for Maps API)</li>
                  <li>Check API key restrictions</li>
                </ul>
              </li>
              <li>
                <strong>Clear Browser Cache:</strong> Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
              </li>
              <li>
                <strong>Test in Incognito Mode:</strong> Rule out browser extensions
              </li>
            </ol>
          </div>
          
          <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</h3>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Google Maps requires a valid billing account (even for free tier usage)</li>
              <li>• API keys need to be properly configured with allowed referrers</li>
              <li>• Some features require specific APIs to be enabled separately</li>
              <li>• Changes to API key settings can take up to 5 minutes to propagate</li>
            </ul>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
} 