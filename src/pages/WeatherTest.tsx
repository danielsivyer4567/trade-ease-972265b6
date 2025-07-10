import React, { useState } from 'react';
import WeatherDataComponent from '@/components/ui/WeatherDataComponent';
import ApiKeyChecker from '@/components/ui/ApiKeyChecker';

const WeatherTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const currentApiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  const testCurrentApiKey = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test with Brisbane coordinates
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=-27.4698&lon=153.0251&appid=${currentApiKey}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API Key works! Current weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`);
      } else {
        const errorData = await response.json().catch(() => null);
        setTestResult(`❌ API Key failed: ${response.status} - ${errorData?.message || 'Unknown error'}`);
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testOneCallAPI = async () => {
    setIsLoading(true);
    setTestResult('');

    try {
      // Test One Call API 3.0
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=-27.4698&lon=153.0251&appid=${currentApiKey}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ One Call API 3.0 works! Current: ${data.current.temp}°C, ${data.current.weather[0].description}`);
      } else {
        const errorData = await response.json().catch(() => null);
        if (response.status === 401) {
          setTestResult(`❌ One Call API 3.0 requires subscription. Error: ${errorData?.message || '401 Unauthorized'}`);
        } else {
          setTestResult(`❌ One Call API failed: ${response.status} - ${errorData?.message || 'Unknown error'}`);
        }
      }
    } catch (error) {
      setTestResult(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🌤️ OpenWeatherMap API Test
          </h1>
          <p className="text-gray-600">
            Test your OpenWeatherMap API key to ensure weather services work correctly
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current API Key Status */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔑 Current API Key Status
            </h2>
            
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 rounded font-mono text-sm">
                <strong>API Key:</strong> {currentApiKey || 'Not configured'}
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={testCurrentApiKey}
                  disabled={isLoading || !currentApiKey}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Testing...' : 'Test Basic Weather API'}
                </button>
                
                <button
                  onClick={testOneCallAPI}
                  disabled={isLoading || !currentApiKey}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Testing...' : 'Test One Call API 3.0'}
                </button>
              </div>

              {testResult && (
                <div className={`p-4 rounded border ${
                  testResult.includes('✅') 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <div className="font-mono text-sm">{testResult}</div>
                </div>
              )}
            </div>
          </div>

          {/* API Key Tester */}
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🔍 Test Different API Key
            </h2>
            <ApiKeyChecker />
          </div>
        </div>

        {/* Weather Data Components */}
        <div className="mt-8 grid lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🌡️ Basic Weather API (Free)
            </h2>
            <WeatherDataComponent lat={-27.4698} lon={153.0251} useOneCallAPI={false} />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              🌤️ One Call API 3.0 (Subscription)
            </h2>
            <WeatherDataComponent lat={-27.4698} lon={153.0251} useOneCallAPI={true} />
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            🆘 Need Help?
          </h3>
          <div className="space-y-2 text-sm text-blue-800">
            <p><strong>401 Invalid API Key:</strong> API key not activated (wait 2 hours) or email not confirmed</p>
            <p><strong>One Call API 3.0:</strong> Requires subscription even for free tier</p>
            <p><strong>Weather Overlays:</strong> Work with basic API key (no subscription needed)</p>
            <p><strong>Get API Key:</strong> <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" className="underline">openweathermap.org/api</a></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherTest; 