
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  templateVariables?: Record<string, any>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const MAILGUN_API_KEY = Deno.env.get("MAILGUN_API_KEY");
    const MAILGUN_DOMAIN = Deno.env.get("MAILGUN_DOMAIN");
    
    if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
      console.error("Missing Mailgun API key or domain");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestData: EmailRequest = await req.json();
    const { to, subject, html, text, from, templateVariables } = requestData;

    // Validate required fields
    if (!to || !subject || (!html && !text)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Prepare form data for Mailgun API
    const formData = new FormData();
    formData.append('to', to);
    formData.append('subject', subject);
    
    if (html) {
      formData.append('html', html);
    }
    
    if (text) {
      formData.append('text', text);
    }
    
    // Set sender or use default
    formData.append('from', from || `Trade Ease <noreply@${MAILGUN_DOMAIN}>`);
    
    // Add template variables if provided
    if (templateVariables) {
      Object.entries(templateVariables).forEach(([key, value]) => {
        formData.append(`v:${key}`, JSON.stringify(value));
      });
    }

    console.log(`Sending email via Mailgun to: ${to}, subject: ${subject}`);

    // Send the email using Mailgun API
    const mailgunUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;
    const auth = btoa(`api:${MAILGUN_API_KEY}`);
    
    const response = await fetch(mailgunUrl, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`
      },
      body: formData
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Mailgun API error:", result);
      return new Response(
        JSON.stringify({ error: "Failed to send email", details: result }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("Email sent successfully:", result);
    return new Response(
      JSON.stringify({ success: true, messageId: result.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in mailgun-email-sender function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
