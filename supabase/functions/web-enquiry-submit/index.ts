
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EnquiryData {
  formData: Record<string, string>;
  targetEmail: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData, targetEmail }: EnquiryData = await req.json();
    
    if (!formData || !targetEmail) {
      throw new Error("Missing required data");
    }

    console.log(`Received web enquiry form submission to be sent to: ${targetEmail}`);
    console.log("Form data:", formData);

    // In a production environment, you would send an email here
    // For now, we'll just simulate a successful email send
    
    // Email would be sent from noreply@tradeease.app or enquiries@tradeease.app
    const fromEmail = "enquiries@tradeease.app";
    
    // Log the simulated email
    console.log(`Email would be sent from: ${fromEmail} to: ${targetEmail}`);
    console.log("Email subject: New Web Enquiry from TradeEase Form");
    
    // Format email content
    let emailBody = "New web enquiry received:\n\n";
    Object.entries(formData).forEach(([key, value]) => {
      emailBody += `${key}: ${value}\n`;
    });
    
    console.log("Email content:", emailBody);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Enquiry submitted successfully",
        domain: "tradeease.app"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error processing web enquiry:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to process enquiry",
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
