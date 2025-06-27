import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MapPin } from 'lucide-react';
import { PropertyMeasurementService } from '@/services/PropertyMeasurementService';

const PropertyMeasurement = () => {
  const [formData, setFormData] = useState({
    street_number: '',
    street_name: '',
    street_type: '',
    suburb: '',
    postcode: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [debugMode, setDebugMode] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const testConnectivity = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      debugMode && console.log('Testing API connectivity...');
      
      // Simple connectivity test - just check if we can reach the API
      const response = await fetch('https://property-measurement-47233712259.australia-southeast1.run.app/visualize', {
        method: 'OPTIONS', // Use OPTIONS instead of POST for connectivity test
        headers: {
          'Content-Type': 'application/json'
        }
      });

      debugMode && console.log('Connectivity test response status:', response.status);
      debugMode && console.log('Connectivity test response headers:', Object.fromEntries(response.headers.entries()));

      setResponse(`Connectivity Test Result:\nStatus: ${response.status}\nAPI is reachable: ${response.status < 500 ? 'Yes' : 'No'}`);
    } catch (err) {
      console.error('Connectivity test error:', err);
      setError(`Connectivity test failed: ${err instanceof Error ? err.message : 'Unknown error'}\nThis indicates a network issue or CORS problem.`);
    } finally {
      setIsLoading(false);
    }
  };

  const testFastMode = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');
    setLoadingMessage('Using fast mode...');

    try {
      debugMode && console.log('Testing fast mode...');
      
      const result = await PropertyMeasurementService.getPropertyMeasurementFast(formData);
      debugMode && console.log('Fast mode test result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Fast mode test failed');
      }

      if (typeof result.data === 'string') {
        setResponse(`Fast Mode Response:\n${result.data}`);
      } else {
        setResponse(`Fast Mode Response:\n${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (err) {
      console.error('Fast mode test error:', err);
      setError(`Fast mode test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const testSupabaseFunction = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      debugMode && console.log('Testing Supabase function...');
      
      const result = await PropertyMeasurementService.getPropertyMeasurementViaSupabase(formData);
      debugMode && console.log('Supabase function test result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Supabase function test failed');
      }

      if (typeof result.data === 'string') {
        setResponse(`Supabase Function Response:\n${result.data}`);
      } else {
        setResponse(`Supabase Function Response:\n${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (err) {
      console.error('Supabase function test error:', err);
      setError(`Supabase function test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testWithProxy = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      debugMode && console.log('Testing with CORS proxy...');
      
      const result = await PropertyMeasurementService.getPropertyMeasurementWithProxy(formData, true);
      debugMode && console.log('Proxy test result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Proxy test failed');
      }

      if (typeof result.data === 'string') {
        setResponse(`CORS Proxy Response:\n${result.data}`);
      } else {
        setResponse(`CORS Proxy Response:\n${JSON.stringify(result.data, null, 2)}`);
      }
    } catch (err) {
      console.error('Proxy test error:', err);
      setError(`CORS proxy test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testDirectAPI = async () => {
    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      debugMode && console.log('Testing direct API call with data:', formData);
      
      const response = await fetch('https://property-measurement-47233712259.australia-southeast1.run.app/visualize', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer 5a218f5e-58cf-4dd9-ad40-ed1d90ce4fc7',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      debugMode && console.log('Direct API Response status:', response.status);
      debugMode && console.log('Direct API Response headers:', Object.fromEntries(response.headers.entries()));

      const responseText = await response.text();
      debugMode && console.log('Direct API Raw response:', responseText);

      if (!response.ok) {
        throw new Error(`Direct API error: ${response.status} - ${responseText}`);
      }

      setResponse(`Direct API Response:\n${responseText}`);
    } catch (err) {
      console.error('Direct API error:', err);
      setError(`Direct API test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResponse('');
    setLoadingMessage('Initializing...');

    try {
      debugMode && console.log('Using PropertyMeasurementService with data:', formData);
      
      setLoadingMessage('Connecting to property measurement service...');
      
      const result = await PropertyMeasurementService.getPropertyMeasurement(formData);
      
      setLoadingMessage('Processing response...');
      debugMode && console.log('Service result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Service call failed');
      }

      setLoadingMessage('Formatting data...');

      // Handle the response data
      if (typeof result.data === 'string') {
        setResponse(result.data);
      } else {
        setResponse(JSON.stringify(result.data, null, 2));
      }
      
      setLoadingMessage('Complete!');
    } catch (err) {
      console.error('Service error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const clearForm = () => {
    setFormData({
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    });
    setResponse('');
    setError('');
    setDebugMode(false);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <MapPin className="h-8 w-8 text-blue-600" />
            Property Measurement Tool
          </h1>
          <p className="text-gray-600">
            Enter property details to get measurement and visualization data
          </p>
          
          {/* Speed Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <div className="bg-amber-100 rounded-full p-1">
                <svg className="w-4 h-4 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-amber-800">Performance Note</h4>
                <p className="text-sm text-amber-700 mt-1">
                  The service may take 10-30 seconds due to CORS proxy overhead. For faster results, deploy the Supabase function.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle>Property Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="street_number">Street Number</Label>
                  <Input
                    id="street_number"
                    name="street_number"
                    value={formData.street_number}
                    onChange={handleInputChange}
                    placeholder="e.g., 2"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="street_name">Street Name</Label>
                  <Input
                    id="street_name"
                    name="street_name"
                    value={formData.street_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Adelong"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="street_type">Street Type</Label>
                  <Input
                    id="street_type"
                    name="street_type"
                    value={formData.street_type}
                    onChange={handleInputChange}
                    placeholder="e.g., Cl, St, Ave, Rd"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="suburb">Suburb</Label>
                  <Input
                    id="suburb"
                    name="suburb"
                    value={formData.suburb}
                    onChange={handleInputChange}
                    placeholder="e.g., Upper Coomera"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="postcode">Postcode</Label>
                  <Input
                    id="postcode"
                    name="postcode"
                    value={formData.postcode}
                    onChange={handleInputChange}
                    placeholder="e.g., 4209"
                    required
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <div className="flex gap-2">
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="flex-1"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {loadingMessage || 'Processing...'}
                        </>
                      ) : (
                        'Get Property Measurement'
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={clearForm}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  </div>
                  
                  <Button 
                    type="button" 
                    variant="secondary" 
                    onClick={testFastMode}
                    disabled={isLoading}
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {loadingMessage || 'Processing...'}
                      </>
                    ) : (
                      '⚡ Try Fast Mode (Alternative Proxy)'
                    )}
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={debugMode}
                      onChange={(e) => setDebugMode(e.target.checked)}
                    />
                    Enable debug mode (show detailed logs)
                  </label>
                  
                  {debugMode && (
                    <div className="space-y-2">
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={testSupabaseFunction}
                        disabled={isLoading}
                        className="w-full text-xs bg-green-100 hover:bg-green-200 text-green-800"
                      >
                        Test Supabase Function (Recommended)
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={testFastMode}
                        disabled={isLoading}
                        className="w-full text-xs bg-blue-100 hover:bg-blue-200 text-blue-800"
                      >
                        ⚡ Test Fast Mode (Usually Faster)
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={testConnectivity}
                        disabled={isLoading}
                        className="w-full text-xs"
                      >
                        Test API Connectivity (check if API is reachable)
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={testDirectAPI}
                        disabled={isLoading}
                        className="w-full text-xs"
                      >
                        Test Direct API Call (no proxy)
                      </Button>
                      <Button 
                        type="button" 
                        variant="secondary" 
                        onClick={testWithProxy}
                        disabled={isLoading}
                        className="w-full text-xs"
                      >
                        Test with CORS Proxy
                      </Button>
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Response Section */}
          <Card>
            <CardHeader>
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md mb-4">
                  <p className="text-red-700 text-sm">
                    <strong>Error:</strong> {error}
                  </p>
                  {(error.includes('Failed to fetch') || error.includes('Not authenticated')) && (
                    <div className="mt-2 text-xs text-red-600">
                      {error.includes('Not authenticated') ? (
                        <>
                          <p><strong>Authentication Issue:</strong> The proxy couldn't authenticate with the API.</p>
                          <p>Try the regular "Get Property Measurement" button instead.</p>
                        </>
                      ) : (
                        <>
                          <p><strong>CORS Issue:</strong> The browser is blocking the request due to security policy.</p>
                          <p>Try enabling debug mode and using "Test with CORS Proxy" button.</p>
                        </>
                      )}
                      <p>For cors-anywhere proxy, you may need to visit: <a href="https://cors-anywhere.herokuapp.com/corsdemo" target="_blank" rel="noopener noreferrer" className="underline">https://cors-anywhere.herokuapp.com/corsdemo</a> and click "Request temporary access"</p>
                    </div>
                  )}
                </div>
              )}
              
              {response && (
                <div className="space-y-4">
                  <Label htmlFor="response">API Response:</Label>
                  
                  {(() => {
                    try {
                      const data = JSON.parse(response.replace('CORS Proxy Response:\n', '').replace('Supabase Function Response:\n', ''));
                      return (
                        <div className="space-y-4">
                          {/* Property Image */}
                          {data.image_url && (
                            <div>
                              <Label className="text-sm font-semibold">Property Visualization:</Label>
                              <div className="mt-2 border rounded-lg overflow-hidden">
                                <img 
                                  src={data.image_url} 
                                  alt="Property boundary visualization"
                                  className="w-full h-auto"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Image URL: <a href={data.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {data.image_url}
                                </a>
                              </p>
                            </div>
                          )}
                          
                          {/* Property Measurements */}
                          {data.side_lengths_m && Array.isArray(data.side_lengths_m) && (
                            <div>
                              <Label className="text-sm font-semibold">Property Measurements:</Label>
                              <div className="mt-2 grid grid-cols-2 gap-2">
                                {data.side_lengths_m.map((length: number, index: number) => (
                                  <div key={index} className="bg-blue-50 p-2 rounded text-sm">
                                    <span className="font-medium">Side {index + 1}:</span> {length}m
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 p-2 bg-green-50 rounded text-sm">
                                <span className="font-medium">Total Perimeter:</span> {data.side_lengths_m.reduce((sum: number, length: number) => sum + length, 0).toFixed(2)}m
                              </div>
                            </div>
                          )}
                          
                          {/* Raw JSON Response */}
                          <details className="mt-4">
                            <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                              View Raw JSON Response
                            </summary>
                            <Textarea
                              value={JSON.stringify(data, null, 2)}
                              readOnly
                              rows={8}
                              className="font-mono text-xs mt-2"
                            />
                          </details>
                        </div>
                      );
                    } catch {
                      // Fallback to plain text display
                      return (
                        <Textarea
                          id="response"
                          value={response}
                          readOnly
                          rows={12}
                          className="font-mono text-sm"
                        />
                      );
                    }
                  })()}
                </div>
              )}
              
              {!response && !error && (
                <div className="text-center py-8 text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-30" />
                  <p>Enter property details and click "Get Property Measurement" to see the response</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Optimization Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Performance Optimization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🚀 For Best Performance - Deploy Supabase Function</h4>
                <p className="text-blue-700 mb-2">To get instant results (1-2 seconds instead of 10-30 seconds), deploy the server-side function:</p>
                <div className="bg-white rounded border p-3 font-mono text-xs">
                  <div>1. Open terminal</div>
                  <div>2. Run: <code className="bg-gray-100 px-1 rounded">supabase login</code></div>
                  <div>3. Run: <code className="bg-gray-100 px-1 rounded">supabase functions deploy property-measurement</code></div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Current Method - CORS Proxy</h4>
                <p className="text-gray-600 mb-2">Currently using CORS proxy which adds delay:</p>
                <div className="text-xs text-gray-500">
                  <div><strong>URL:</strong> https://property-measurement-47233712259.australia-southeast1.run.app/visualize</div>
                  <div><strong>Proxy:</strong> cors-anywhere.herokuapp.com or api.allorigins.win</div>
                  <div><strong>Speed:</strong> 10-30 seconds (due to proxy overhead)</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default PropertyMeasurement; 