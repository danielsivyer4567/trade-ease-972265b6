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
import { supabase } from '@/lib/supabase';


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

const PropertyImageWithTotalPerimeter = ({ 
  imageUrl, 
  measurements,
  address 
}: { 
  imageUrl: string; 
  measurements: number[];
  address?: {
    street_number: string;
    street_name: string;
    street_type: string;
    suburb: string;
    postcode: string;
  };
}) => {
  const totalPerimeter = measurements.reduce((sum, measurement) => sum + measurement, 0);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportText, setReportText] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReportIssue = async () => {
    if (!reportText.trim()) {
      alert('Please enter a description of the issue');
      return;
    }

    setIsSubmittingReport(true);
    
    try {
      const addressString = address ? 
        `${address.street_number} ${address.street_name} ${address.street_type}, ${address.suburb} ${address.postcode}` : 
        'Address not provided';

      const reportData = {
        address: addressString,
        issue_description: reportText,
        image_url: imageUrl,
        measurements: JSON.stringify(measurements),
        reported_at: new Date().toISOString(),
        status: 'new'
      };

      const { data, error } = await supabase
        .from('property_issue_reports')
        .insert([reportData])
        .select();

      if (error) {
        throw new Error(error.message);
      }

      setReportSubmitted(true);
      setReportText('');
      setTimeout(() => {
        setShowReportModal(false);
        setReportSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting report:', error);
      alert('Failed to submit report. Please try again.');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  return (
    <div className="space-y-3">
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
      
      {/* Total Perimeter Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
        <div className="text-lg font-semibold text-blue-800">
          Total Perimeter: {totalPerimeter.toFixed(1)}m
        </div>
        <div className="text-xs text-blue-600 mt-1">
          {measurements.length} boundaries measured
        </div>
      </div>

      {/* Disclaimer and Report Issue */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
        <div className="text-sm text-amber-800 mb-2">
          <strong>Please note:</strong> Some properties with technical data layouts may be hard for AI to interpret.
        </div>
        <div className="text-xs text-amber-700 mb-3">
          If there was an issue, please add the address and report an issue below.
        </div>
        <button
          onClick={() => setShowReportModal(true)}
          className="bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1 rounded transition-colors"
        >
          Report Issue
        </button>
      </div>

      {/* Report Issue Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Report an Issue</h3>
            
            {reportSubmitted ? (
              <div className="text-center">
                <div className="text-green-600 text-sm mb-2">✅ Report submitted successfully!</div>
                <div className="text-xs text-gray-600">Thank you for helping us improve our service.</div>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <div className="text-sm text-gray-700 mb-2">
                    <strong>Address:</strong> {address ? 
                      `${address.street_number} ${address.street_name} ${address.street_type}, ${address.suburb} ${address.postcode}` : 
                      'Not provided'}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Describe the issue:
                  </label>
                  <textarea
                    value={reportText}
                    onChange={(e) => setReportText(e.target.value)}
                    placeholder="Please describe what seems incorrect about the property measurement or visualization..."
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    rows={4}
                  />
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={handleReportIssue}
                    disabled={isSubmittingReport}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded disabled:opacity-50"
                  >
                    {isSubmittingReport ? 'Submitting...' : 'Submit Report'}
                  </button>
                  <button
                    onClick={() => {
                      setShowReportModal(false);
                      setReportText('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-700 text-sm px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
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

      
      setLoadingMessage('Connecting to Supabase function...');
      
      // Use Supabase method as the standard method
      const result = await PropertyMeasurementService.getPropertyMeasurementViaSupabase(formData);
      
      setLoadingMessage('Processing response...');


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
                      <p><strong>Connection Issue:</strong> Unable to connect to the property measurement service.</p>
                      <p>Please try again in a few moments.</p>
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
                                                              <PropertyImageWithTotalPerimeter 
                                imageUrl={data.image_url} 
                                measurements={data.side_lengths_m}
                                address={{
                                  street_number: formData.street_number,
                                  street_name: formData.street_name,
                                  street_type: formData.street_type,
                                  suburb: formData.suburb,
                                  postcode: formData.postcode
                                }}
                              />
                              </div>
                            </div>
                          )}

                          

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


      </div>
    </AppLayout>
  );
};

export default PropertyMeasurement; 