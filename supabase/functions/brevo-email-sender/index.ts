
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
  templateId?: number;
  params?: Record<string, any>;
  sender?: {
    name?: string;
    email?: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
    
    if (!BREVO_API_KEY) {
      console.error("Missing Brevo API key");
      return new Response(
        JSON.stringify({ error: "Server configuration error" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const requestData: EmailRequest = await req.json();
    const { to, subject, htmlContent, textContent, templateId, params, sender } = requestData;

    // Validate required fields
    if ((!htmlContent && !templateId) || !to || !subject) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Construct the email payload for Brevo API
    const payload: any = {
      to: [{ email: to }],
      subject: subject,
      sender: sender || { 
        name: "Trade Ease", 
        email: "notifications@yourdomain.com" // Change to your verified sender
      }
    };

    // Handle template-based or content-based email
    if (templateId) {
      payload.templateId = templateId;
      if (params) {
        payload.params = params;
      }
    } else {
      payload.htmlContent = htmlContent;
      if (textContent) {
        payload.textContent = textContent;
      }
    }

    console.log("Sending email via Brevo:", { to, subject, templateId: templateId || "N/A" });

    // Send the email using Brevo API
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Brevo API error:", result);
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
      JSON.stringify({ success: true, messageId: result.messageId }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in brevo-email-sender function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
