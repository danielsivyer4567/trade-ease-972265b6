import React from 'react';
import ApiKeyChecker from '@/components/ui/ApiKeyChecker';
import WeatherTestButton from '@/components/ui/WeatherTestButton';

const ApiKeyTest: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌤️ Weather API Key Testing
          </h1>
          <p className="text-gray-600">
            Test your OpenWeatherMap API key to ensure weather overlays work correctly
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔍 Test Any API Key
            </h2>
            <ApiKeyChecker />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              ⚡ Test Current Environment Key
            </h2>
            <WeatherTestButton />
          </div>
        </div>
        
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">
            📋 Troubleshooting Steps
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">1</span>
              <div>
                <h4 className="font-medium text-gray-800">Check API Key Status</h4>
                <p className="text-sm text-gray-600">
                  Go to{' '}
                  <a 
                    href="https://home.openweathermap.org/api_keys" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    OpenWeatherMap API Keys
                  </a>
                  {' '}and verify your key is "Active"
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">2</span>
              <div>
                <h4 className="font-medium text-gray-800">Wait for Activation</h4>
                <p className="text-sm text-gray-600">
                  New API keys can take up to 2 hours to activate after signup
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">3</span>
              <div>
                <h4 className="font-medium text-gray-800">Update .env.local</h4>
                <p className="text-sm text-gray-600">
                  Replace the placeholder in your .env.local file with your actual API key
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">4</span>
              <div>
                <h4 className="font-medium text-gray-800">Restart Development Server</h4>
                <p className="text-sm text-gray-600">
                  After updating .env.local, restart your dev server for changes to take effect
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyTest; 