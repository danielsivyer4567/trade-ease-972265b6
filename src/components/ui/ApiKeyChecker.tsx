import React, { useState } from 'react';

export const ApiKeyChecker: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      setTestResult('❌3f7376da1b1c68b39b3664144825a12d');
      return;
    }

    setIsLoading(true);
    setTestResult('');

    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=-27.4698&lon=153.0251&appid=${apiKey}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API Key works! Current weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          setTestResult('❌ Invalid API key. Check your OpenWeatherMap account and make sure the key is activated.');
        } else {
          setTestResult(`❌ API Error: ${errorData.message || response.statusText}`);
        }
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md border max-w-md mx-auto">
      <h3 className="font-bold text-lg text-gray-800 mb-4">🔑 API Key Tester</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter your OpenWeatherMap API Key:
        </label>
        <input
          type="text"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Your API key here..."
          className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
      
      <button
        onClick={testApiKey}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded font-medium text-white ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Testing...' : 'Test API Key'}
      </button>
      
      {testResult && (
        <div className="mt-4 p-3 rounded-md bg-gray-50 border">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-gray-500">
        <p><strong>Current Key in .env.local:</strong> {import.meta.env.VITE_OPENWEATHERMAP_API_KEY || 'Not configured'}</p>
        <p className="mt-2">
          <strong>Need help?</strong> Visit{' '}
          <a 
            href="https://openweathermap.org/faq#error401" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            OpenWeatherMap FAQ
          </a>
        </p>
      </div>
    </div>
  );
};

export default ApiKeyChecker; 