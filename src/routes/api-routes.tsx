import React from 'react';
import { RouteObject } from 'react-router-dom';
import { handleDocuSealWebhook } from '@/server/webhooks/docuSealWebhook';

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
    }
  ]
};

// Export the API routes for use in the main router
export default apiRoutes; 