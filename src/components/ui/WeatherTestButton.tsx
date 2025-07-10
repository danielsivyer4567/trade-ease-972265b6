import React, { useState } from 'react';

export const WeatherTestButton: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testWeatherAPI = async () => {
    setIsLoading(true);
    setTestResult('');

    const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
    
    if (!apiKey || apiKey === 'your-actual-api-key-here') {
      setTestResult('❌ API Key not configured. Please add your OpenWeatherMap API key to .env.local');
      setIsLoading(false);
      return;
    }

    try {
      // Test with Brisbane coordinates
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=-27.4698&lon=153.0251&appid=${apiKey}&units=metric`
      );
      
      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ API Key works! Current weather in ${data.name}: ${data.main.temp}°C, ${data.weather[0].description}`);
      } else {
        const errorData = await response.json();
        setTestResult(`❌ API Error: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm border">
      <h3 className="font-semibold text-gray-800 mb-3">Test OpenWeatherMap API</h3>
      
      <button
        onClick={testWeatherAPI}
        disabled={isLoading}
        className={`px-4 py-2 rounded text-white font-medium ${
          isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isLoading ? 'Testing...' : 'Test API Key'}
      </button>
      
      {testResult && (
        <div className="mt-3 p-3 rounded-md bg-gray-50">
          <p className="text-sm">{testResult}</p>
        </div>
      )}
      
      <div className="mt-3 text-xs text-gray-500">
        <p><strong>Current API Key:</strong> {import.meta.env.VITE_OPENWEATHERMAP_API_KEY ? 
          `${import.meta.env.VITE_OPENWEATHERMAP_API_KEY.substring(0, 8)}...` : 
          'Not configured'
        }</p>
      </div>
    </div>
  );
};

export default WeatherTestButton; 