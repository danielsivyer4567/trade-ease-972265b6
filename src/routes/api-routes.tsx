import React from 'react';
import { RouteObject } from 'react-router-dom';
import { handleDocuSealWebhook } from '@/server/webhooks/docuSealWebhook';

// Handler for property measurement API
const handlePropertyMeasurement = async (request: Request) => {
  try {
    const body = await request.json();
    const { street_number, street_name, street_type, suburb, postcode } = body;

    // Validate required fields
    if (!street_number || !street_name || !street_type || !suburb || !postcode) {
      return {
        status: 400,
        body: { 
          success: false, 
          error: 'All property fields are required' 
        }
      };
    }

    const requestBody = {
      street_number: street_number.toString(),
      street_name: street_name.toString(),
      street_type: street_type.toString(),
      suburb: suburb.toString(),
      postcode: postcode.toString()
    };

    console.log('Making request to property measurement API:', requestBody);

    const response = await fetch('https://property-measurement-47233712259.australia-southeast1.run.app/visualize', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 5a218f5e-58cf-4dd9-ad40-ed1d90ce4fc7',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    console.log('External API response status:', response.status);

    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch {
        errorText = 'Unable to read error response';
      }
      console.error('External API error:', errorText);
      return {
        status: response.status,
        body: { 
          success: false,
          error: `External API error: ${response.status} - ${errorText}` 
        }
      };
    }

    // Check if response has content
    const contentLength = response.headers.get('content-length');
    console.log('Content-Length:', contentLength);
    
    let data = '';
    try {
      data = await response.text();
      console.log('Raw response:', data);
      console.log('Response length:', data.length);
    } catch (error) {
      console.error('Failed to read response text:', error);
      return {
        status: 500,
        body: { 
          success: false,
          error: 'Failed to read API response' 
        }
      };
    }

    // Handle empty response
    if (!data || data.trim() === '') {
      console.log('Empty response received');
      return {
        status: 200,
        body: { 
          success: true, 
          data: 'Empty response received from external API' 
        }
      };
    }

    // Try to parse as JSON, if it fails return as text
    try {
      const jsonData = JSON.parse(data);
      console.log('Successfully parsed JSON response');
      return {
        status: 200,
        body: { success: true, data: jsonData }
      };
    } catch (parseError) {
      console.log('Response is not JSON, returning as text:', parseError);
      return {
        status: 200,
        body: { success: true, data: data }
      };
    }

  } catch (error) {
    console.error('Property measurement API error:', error);
    return {
      status: 500,
      body: { 
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error' 
      }
    };
  }
};

/**
 * This file defines API routes that handle server-side functionality
 * such as webhooks and other non-UI endpoints.
 * 
 * Note: These routes would typically be handled by a server-side framework
 * In a fully client-side app, you'll need a lightweight backend service
 * to handle these routes or use serverless functions.
 */

// Helper function to handle API requests
const apiHandler = (handler: Function) => async (req: Request) => {
  try {
    const result = await handler(req);
    return new Response(JSON.stringify(result.body), {
      status: result.status || 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

// Define API routes configuration
export const apiRoutes = {
  path: '/api',
  children: [
    {
      path: 'webhooks/docuseal',
      // Use the loader function for handling webhook requests
      loader: async ({ request }) => {
        try {
          const result = await handleDocuSealWebhook(request, {});
          return new Response(JSON.stringify(result.body), {
            status: result.status || 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error) {
          console.error('DocuSeal webhook error:', error);
          return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
    },
    {
      path: 'property-measurement/visualize',
      // Handle property measurement API requests
      action: async ({ request }) => {
        console.log('API route hit - property measurement');
        console.log('Request method:', request.method);
        console.log('Request URL:', request.url);
        
        try {
          const result = await handlePropertyMeasurement(request);
          console.log('Handler result:', result);
          
          const response = new Response(JSON.stringify(result.body), {
            status: result.status || 200,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type'
            }
          });
          
          console.log('Sending response:', response);
          return response;
        } catch (error) {
          console.error('Property measurement API error:', error);
          return new Response(JSON.stringify({ success: false, error: 'Internal server error', details: error.message }), {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          });
        }
      }
    },
    {
      path: 'test',
      // Simple test endpoint
      action: async ({ request }) => {
        console.log('Test API route hit');
        return new Response(JSON.stringify({ success: true, message: 'Test API working!' }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    }
  ]
};

// Export the API routes for use in the main router
export default apiRoutes; 