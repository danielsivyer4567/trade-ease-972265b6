import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, MapPin, Compass } from 'lucide-react';
import { PropertyMeasurementService } from '@/services/PropertyMeasurementService';
import { AutocompleteInput } from '@/components/ui/AutocompleteInput';
import { AddressAutocompleteService, AddressSuggestion } from '@/services/AddressAutocompleteService';
import { BoundaryMeasurements } from '@/components/ui/BoundaryMeasurements';
import { identifyFrontBoundary } from '@/utils/propertyBoundaryUtils';

const PropertyBoundaryIconSmall = () => (
  <svg
    width="64"
    height="64"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="text-blue-600"
  >
    {/* Property boundary outline - animated drawing */}
    <path
      d="M6 8 L24 8 L24 22 L6 22 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="60;0;60"
        dur="3s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Corner markers */}
    <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="0.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="1.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="6" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="3s" begin="2.4s" repeatCount="indefinite"/>
    </circle>
    
    {/* Measurement lines */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="2.2s" repeatCount="indefinite"/>
      
      {/* Top measurement */}
      <line x1="6" y1="5" x2="24" y2="5" stroke="currentColor" strokeWidth="1"/>
      <line x1="6" y1="4" x2="6" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="24" y1="4" x2="24" y2="6" stroke="currentColor" strokeWidth="1"/>
      <text x="15" y="3.5" fontSize="2.5" fill="currentColor" textAnchor="middle">25m</text>
      
      {/* Right measurement */}
      <line x1="26" y1="8" x2="26" y2="22" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="8" x2="27" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="22" x2="27" y2="22" stroke="currentColor" strokeWidth="1"/>
      <text x="28.5" y="16" fontSize="2.5" fill="currentColor" textAnchor="middle">15m</text>
    </g>
    
    {/* Survey compass indicator */}
    <g transform="translate(26,6)" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="3s" begin="1s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <path d="M0,-1.5 L0.5,1 L0,0.5 L-0.5,1 Z" fill="currentColor"/>
      <text x="0" y="3.5" fontSize="2" fill="currentColor" textAnchor="middle">N</text>
    </g>
  </svg>
);

const PropertyBoundaryIcon = () => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="mx-auto mb-4 text-blue-500"
  >
    {/* Property boundary outline - animated drawing */}
    <path
      d="M6 8 L24 8 L24 22 L6 22 Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeDasharray="60"
      strokeDashoffset="60"
    >
      <animate
        attributeName="stroke-dashoffset"
        values="60;0;60"
        dur="4s"
        repeatCount="indefinite"
      />
    </path>
    
    {/* Corner markers */}
    <circle cx="6" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="4s" begin="0.8s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="8" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="4s" begin="1.6s" repeatCount="indefinite"/>
    </circle>
    <circle cx="24" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="4s" begin="2.4s" repeatCount="indefinite"/>
    </circle>
    <circle cx="6" cy="22" r="1.5" fill="currentColor" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="4s" begin="3.2s" repeatCount="indefinite"/>
    </circle>
    
    {/* Measurement lines */}
    <g opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin="3.5s" repeatCount="indefinite"/>
      
      {/* Top measurement */}
      <line x1="6" y1="5" x2="24" y2="5" stroke="currentColor" strokeWidth="1"/>
      <line x1="6" y1="4" x2="6" y2="6" stroke="currentColor" strokeWidth="1"/>
      <line x1="24" y1="4" x2="24" y2="6" stroke="currentColor" strokeWidth="1"/>
      <text x="15" y="3.5" fontSize="2.5" fill="currentColor" textAnchor="middle">25m</text>
      
      {/* Right measurement */}
      <line x1="26" y1="8" x2="26" y2="22" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="8" x2="27" y2="8" stroke="currentColor" strokeWidth="1"/>
      <line x1="25" y1="22" x2="27" y2="22" stroke="currentColor" strokeWidth="1"/>
      <text x="28.5" y="16" fontSize="2.5" fill="currentColor" textAnchor="middle">15m</text>
    </g>
    
    {/* Survey compass indicator */}
    <g transform="translate(26,6)" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" dur="4s" begin="1.5s" repeatCount="indefinite"/>
      <circle cx="0" cy="0" r="2" fill="none" stroke="currentColor" strokeWidth="0.5"/>
      <path d="M0,-1.5 L0.5,1 L0,0.5 L-0.5,1 Z" fill="currentColor"/>
      <text x="0" y="3.5" fontSize="2" fill="currentColor" textAnchor="middle">N</text>
    </g>
  </svg>
);

const PropertyImageWithFrontHighlight = ({ 
  imageUrl, 
  measurements, 
  coordinates 
}: { 
  imageUrl: string; 
  measurements: number[]; 
  coordinates?: any[] 
}) => {
  // Use unified front boundary identification algorithm
  const frontBoundaryResult = identifyFrontBoundary(measurements, coordinates);
  const frontIndex = frontBoundaryResult.frontIndex;
  const confidence = Math.round(frontBoundaryResult.confidence * 100);

  return (
    <div className="relative">
      <img 
        src={imageUrl} 
        alt="Property boundary visualization"
        className="w-full h-auto"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      
      {/* Front Boundary Indicator - Animated Pulse */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top boundary highlight (if front is boundary 0) */}
        {frontIndex === 0 && (
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
              🏠 FRONT (Street) {confidence}%
            </div>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1">
              <div className="w-0 h-0 border-l-6 border-r-6 border-b-8 border-transparent border-b-blue-500 animate-bounce drop-shadow-lg"></div>
            </div>
          </div>
        )}
        
        {/* Right boundary highlight (if front is boundary 1) */}
        {frontIndex === 1 && (
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
              🏠 FRONT {confidence}%
            </div>
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1">
              <div className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-blue-500 animate-bounce drop-shadow-lg"></div>
            </div>
          </div>
        )}
        
        {/* Bottom boundary highlight (if front is boundary 2) */}
        {frontIndex === 2 && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
              🏠 FRONT (Street) {confidence}%
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
              <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-blue-500 animate-bounce drop-shadow-lg"></div>
            </div>
          </div>
        )}
        
        {/* Left boundary highlight (if front is boundary 3) */}
        {frontIndex === 3 && (
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
            <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
              🏠 FRONT {confidence}%
            </div>
            <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-1">
              <div className="w-0 h-0 border-t-6 border-b-6 border-r-8 border-transparent border-r-blue-500 animate-bounce drop-shadow-lg"></div>
            </div>
          </div>
        )}
        
        {/* Irregular properties - position badge based on front boundary location */}
        {measurements.length > 4 && (
          <>
            {/* Front boundary is bottom-ish (likely boundary 4 for 5-sided property) */}
            {frontIndex === 4 && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
                  🏠 FRONT (Street) {confidence}%
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1">
                  <div className="w-0 h-0 border-l-6 border-r-6 border-t-8 border-transparent border-t-blue-500 animate-bounce drop-shadow-lg"></div>
                </div>
              </div>
            )}
            
            {/* Front boundary is top-ish (boundary 0) */}
            {frontIndex === 0 && (
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
                  🏠 FRONT (Street) {confidence}%
                </div>
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1">
                  <div className="w-0 h-0 border-l-6 border-r-6 border-b-8 border-transparent border-b-blue-500 animate-bounce drop-shadow-lg"></div>
                </div>
              </div>
            )}
            
            {/* Front boundary is right-ish */}
            {(frontIndex === 1 || frontIndex === 2) && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
                  🏠 FRONT {confidence}%
                </div>
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-1">
                  <div className="w-0 h-0 border-t-6 border-b-6 border-l-8 border-transparent border-l-blue-500 animate-bounce drop-shadow-lg"></div>
                </div>
              </div>
            )}
            
            {/* Front boundary is left-ish */}
            {frontIndex === 3 && (
              <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
                  🏠 FRONT {confidence}%
                </div>
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 mr-1">
                  <div className="w-0 h-0 border-t-6 border-b-6 border-r-8 border-transparent border-r-blue-500 animate-bounce drop-shadow-lg"></div>
                </div>
              </div>
            )}
            
            {/* Fallback for other irregular boundaries */}
            {frontIndex > 4 && (
              <div className="absolute top-8 right-8">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse shadow-lg border-2 border-blue-300">
                  🏠 FRONT (#{frontIndex + 1}) {confidence}%
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Compass indicator */}
        <div className="absolute top-2 right-2">
          <div className="bg-white/90 rounded-full p-2 shadow-lg">
            <div className="w-6 h-6 relative">
              <div className="absolute inset-0 text-red-500 text-center font-bold text-xs leading-6">N</div>
              <div className="absolute inset-0 border border-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PropertyMeasurement = () => {
  const [formData, setFormData] = useState({
    unit_number: '',
    street_number: '',
    street_name: '',
    street_type: '',
    suburb: '',
    postcode: ''
  });
  
  const [fullAddress, setFullAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingAddress, setIsParsingAddress] = useState(false);
  const [response, setResponse] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [debugMode, setDebugMode] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [validationMessage, setValidationMessage] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    setIsParsingAddress(true);
    setError('');
    setValidationMessage('');
    
    try {
      console.log('Selected address suggestion:', suggestion);
      
      // First, try to get detailed address components from Google Places API
      const addressDetails = await AddressAutocompleteService.getAddressDetails(suggestion.placeId);
      
      let finalFormData: typeof formData;
      
      if (addressDetails && addressDetails.street_number && addressDetails.street_name) {
        console.log('Using Google Places API details:', addressDetails);
        finalFormData = {
          unit_number: addressDetails.unit_number,
          street_number: addressDetails.street_number,
          street_name: addressDetails.street_name,
          street_type: addressDetails.street_type,
          suburb: addressDetails.suburb,
          postcode: addressDetails.postcode
        };
      } else {
        // Fallback: use robust address description parsing
        console.log('Google Places API details failed, using fallback parsing');
        const parsedAddress = AddressAutocompleteService.parseAddressDescription(suggestion.description);
        
        console.log('Parsed address from description:', parsedAddress);
        
        finalFormData = {
          unit_number: parsedAddress.unit_number,
          street_number: parsedAddress.street_number,
          street_name: parsedAddress.street_name,
          street_type: parsedAddress.street_type,
          suburb: parsedAddress.suburb,
          postcode: parsedAddress.postcode
        };
      }
      
      // Update form data
      setFormData(finalFormData);
      
      // Validate the parsed data
      const missingFields = [];
      if (!finalFormData.street_number) missingFields.push('street number');
      if (!finalFormData.street_name) missingFields.push('street name');
      if (!finalFormData.suburb) missingFields.push('suburb');
      // Note: unit_number is optional, so we don't validate it
      
      if (missingFields.length > 0) {
        setValidationMessage(`⚠️ Please manually complete: ${missingFields.join(', ')}`);
      } else {
        setValidationMessage('✅ Address parsed successfully');
        // Clear success message after 3 seconds
        setTimeout(() => setValidationMessage(''), 3000);
      }
      
      console.log('Final form data after address selection:', finalFormData);
      
    } catch (error) {
      console.error('Error parsing address:', error);
      setError('Failed to parse address. Please fill in the fields manually.');
    } finally {
      setIsParsingAddress(false);
    }
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

  const validateFormData = (): string[] => {
    const errors: string[] = [];
    
    if (!formData.street_number.trim()) errors.push('Street Number is required');
    if (!formData.street_name.trim()) errors.push('Street Name is required');
    if (!formData.suburb.trim()) errors.push('Suburb is required');
    if (!formData.postcode.trim()) errors.push('Postcode is required');
    
    // Validate postcode format (Australian postcodes are 4 digits)
    if (formData.postcode && !/^\d{4}$/.test(formData.postcode.trim())) {
      errors.push('Postcode must be 4 digits');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form data before submission
    const validationErrors = validateFormData();
    if (validationErrors.length > 0) {
      setError(`Please fix the following issues:\n${validationErrors.join('\n')}`);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setResponse('');
    setValidationMessage('');
    setLoadingMessage('Initializing...');

    try {
      debugMode && console.log('Using PropertyMeasurementService with data:', formData);
      
      setLoadingMessage('Connecting to Supabase function...');
      
      // Use Supabase method as the standard method
      const result = await PropertyMeasurementService.getPropertyMeasurementViaSupabase(formData);
      
      setLoadingMessage('Processing response...');
      debugMode && console.log('Service result:', result);

      if (!result.success) {
        throw new Error(result.error || 'Supabase service call failed');
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
      console.error('Supabase service error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  };

  const clearForm = () => {
    setFormData({
      unit_number: '',
      street_number: '',
      street_name: '',
      street_type: '',
      suburb: '',
      postcode: ''
    });
    setFullAddress('');
    setResponse('');
    setError('');
    setValidationMessage('');
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
          
          {/* Speed Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-2">
              <div className="bg-green-100 rounded-full p-1">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800">Optimized Performance</h4>
                <p className="text-sm text-green-700 mt-1">
                  Now using Supabase Edge Function for optimal speed (1-5 seconds). Alternative methods available in debug mode if needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Form Section */}
          <Card className="bg-slate-300">
            <CardHeader className="bg-slate-300">
              <div className="flex items-center justify-between">
                <CardTitle>Property Details</CardTitle>
                <PropertyBoundaryIconSmall />
              </div>
            </CardHeader>
            <CardContent className="bg-slate-300">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Address Autocomplete */}
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">🔍 Quick Address Search</h4>
                  <AutocompleteInput
                    label="Search for address"
                    value={fullAddress}
                    onChange={setFullAddress}
                    onSuggestionSelect={handleAddressSelect}
                    placeholder="Start typing an address... (e.g., 'Unit 1/2 Adelong Close, Upper Coomera' or '2 Adelong Close, Upper Coomera')"
                    className="mb-2"
                  />
                  <p className="text-xs text-blue-600">
                    Start typing to see address suggestions. Selecting an address will auto-fill the fields below.
                  </p>
                  
                  {/* Address Parsing Status */}
                  {isParsingAddress && (
                    <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Parsing address...
                    </div>
                  )}
                  
                  {/* Validation Message */}
                  {validationMessage && (
                    <div className={`mt-2 text-sm ${validationMessage.includes('✅') ? 'text-green-600' : 'text-amber-600'}`}>
                      {validationMessage}
                    </div>
                  )}
                </div>

                {/* Manual Entry Fields */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Or enter address details manually:</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="unit_number">Unit/Apartment Number (Optional)</Label>
                      <Input
                        id="unit_number"
                        name="unit_number"
                        value={formData.unit_number}
                        onChange={handleInputChange}
                        placeholder="e.g., 1, Unit 5, Apt 12"
                      />
                    </div>
                    
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
                  </div>
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
          <Card className="bg-slate-300">
            <CardHeader className="bg-slate-300">
              <CardTitle>Response</CardTitle>
            </CardHeader>
            <CardContent className="bg-slate-300">
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
                                <PropertyImageWithFrontHighlight 
                                  imageUrl={data.image_url} 
                                  measurements={data.side_lengths_m}
                                  coordinates={data.coordinates || data.boundary_points || data.vertices}
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-1">
                                Image URL: <a href={data.image_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                  {data.image_url}
                                </a>
                              </p>
                            </div>
                          )}
                          
                          {/* Property Measurements with Directional Labels */}
                          {data.side_lengths_m && Array.isArray(data.side_lengths_m) && (
                            <BoundaryMeasurements 
                              measurements={data.side_lengths_m}
                              coordinates={data.coordinates || data.boundary_points || data.vertices}
                              propertyData={data}
                              address={{
                                street_number: formData.street_number,
                                street_name: formData.street_name,
                                street_type: formData.street_type,
                                suburb: formData.suburb,
                                postcode: formData.postcode
                              }}
                              streetFacing="north" // Default - can be enhanced later with actual orientation data
                            />
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
                  <div className="space-y-2">
                    <p className="font-medium text-gray-700">Automatic Boundary Detection</p>
                    <p className="text-sm">Enter property details and click "Get Property Measurement" to see boundary measurements, area calculations, and property visualization</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Boundary Direction Information */}
        <Card className="mt-6 bg-slate-300">
          <CardHeader className="bg-slate-300">
            <CardTitle className="flex items-center gap-2">
              <Compass className="h-5 w-5" />
              Understanding Boundary Directions
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-300">
            <div className="space-y-4 text-sm">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🏠 Automatic Direction Detection</h4>
                <div className="space-y-2 text-blue-700">
                  <p><strong>Smart Front Detection:</strong></p>
                  <div className="ml-4 space-y-1 text-sm">
                    <p>• For properties with coordinates: Uses geometric analysis to identify street-facing boundary</p>
                    <p>• For properties without coordinates: Uses shortest boundary (typical for residential lots)</p>
                    <p>• Considers southern positioning (many streets run east-west)</p>
                  </div>
                  
                  <p><strong>Left/Right Assignment:</strong></p>
                  <div className="ml-4 space-y-1 text-sm">
                    <p>• Calculated relative to standing at the front boundary facing inward</p>
                    <p>• Uses clockwise/counterclockwise analysis from property centroid</p>
                    <p>• Angular positioning: Right (45°-135°), Back (135°-225°), Left (225°-315°)</p>
                  </div>
                  
                  <p><strong>Rear Identification:</strong></p>
                  <div className="ml-4 space-y-1 text-sm">
                    <p>• Boundary positioned opposite or furthest from the identified front</p>
                    <p>• Uses geometric analysis for irregular properties</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✏️ Customizing Boundary Labels</h4>
                <div className="space-y-2 text-green-700">
                  <p>• Click <strong>"Edit Directions"</strong> to customize boundary labels</p>
                  <p>• Smart defaults are applied based on typical property layouts</p>
                  <p>• Rectangular properties automatically get Front, Back, Left, Right assignments</p>
                  <p>• Irregular properties can be manually labeled as needed</p>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="font-semibold text-amber-800 mb-2">🗺️ Important Property Information</h4>
                <div className="space-y-2 text-amber-700">
                  <p><strong>Street Frontage:</strong> The measurement of your property that faces the street</p>
                  <p><strong>Perimeter:</strong> Total boundary length around your property</p>
                  <p><strong>Boundary Order:</strong> Measurements typically start from the street and go clockwise</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Optimization Section */}
        <Card className="mt-6 bg-slate-300">
          <CardHeader className="bg-slate-300">
            <CardTitle>Performance Optimization</CardTitle>
          </CardHeader>
          <CardContent className="bg-slate-300">
            <div className="space-y-4 text-sm">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-2">✅ Using Supabase Function (Optimized)</h4>
                <p className="text-green-700 mb-2">The main "Get Property Measurement" button now uses the Supabase function for optimal performance.</p>
                <div className="text-xs text-green-600">
                  <div><strong>Method:</strong> Direct Supabase Edge Function</div>
                  <div><strong>Expected Speed:</strong> 1-5 seconds (no proxy overhead)</div>
                  <div><strong>Reliability:</strong> High (server-side execution)</div>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🔧 If Function Not Deployed</h4>
                <p className="text-blue-700 mb-2">If you haven't deployed the Supabase function yet, deploy it for full functionality:</p>
                <div className="bg-white rounded border p-3 font-mono text-xs">
                  <div>1. Open terminal</div>
                  <div>2. Run: <code className="bg-gray-100 px-1 rounded">supabase login</code></div>
                  <div>3. Run: <code className="bg-gray-100 px-1 rounded">supabase functions deploy property-measurement</code></div>
                </div>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">Alternative Methods</h4>
                <p className="text-gray-600 mb-2">Backup methods available in debug mode:</p>
                <div className="text-xs text-gray-500">
                  <div><strong>Fast Mode:</strong> Alternative proxy methods</div>
                  <div><strong>CORS Proxy:</strong> cors-anywhere.herokuapp.com or api.allorigins.win</div>
                  <div><strong>Direct API:</strong> Direct call (may have CORS issues)</div>
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