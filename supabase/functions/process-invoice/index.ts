
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InvoiceData {
  supplierName: string;
  invoiceNumber: string;
  invoiceDate: string;
  jobId: string;
  jobNumber: string;
  totalAmount: number;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the invoice data from the request
    const invoiceData: InvoiceData = await req.json();
    
    // Log the received invoice data
    console.log("Processing invoice:", invoiceData);
    
    // In a real implementation, we would:
    // 1. Validate the invoice data
    // 2. Extract data from the invoice (OCR if it's an image)
    // 3. Cross-check the job reference
    // 4. Store the invoice in the database
    // 5. Update the job financials
    
    // Mock successful processing
    const processedResult = {
      success: true,
      invoiceId: `inv-${Date.now()}`,
      message: "Invoice processed successfully",
      financialImpact: {
        jobCosts: invoiceData.totalAmount,
        materialCosts: invoiceData.items.reduce((sum, item) => sum + item.total, 0)
      }
    };

    return new Response(
      JSON.stringify(processedResult),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error processing invoice:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Failed to process invoice" }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
