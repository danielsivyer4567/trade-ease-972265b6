import React, { useEffect, useRef } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { openCustomer } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function CustomerConsole() {
  const navigate = useNavigate();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const externalUrl = 'http://localhost:8081/customers';
  const { toast } = useToast();

  // Function to inject the Open buttons into the iframe content
  const injectOpenButtons = () => {
    try {
      const iframe = iframeRef.current;
      if (!iframe || !iframe.contentWindow || !iframe.contentDocument) return;

      // Create style element for the iframe
      const style = iframe.contentDocument.createElement('style');
      style.innerHTML = `
        .customer-open-btn {
          display: inline-flex;
          align-items: center;
          font-size: 12px;
          padding: 2px 8px;
          margin-left: 8px;
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          cursor: pointer;
        }
        .customer-open-btn:hover {
          background-color: #f9fafb;
        }
        .customer-card-header {
          background-color: rgb(203 213 225) !important;
        }
      `;
      iframe.contentDocument.head.appendChild(style);

      // Get all customer name elements
      const customerNameElements = iframe.contentDocument.querySelectorAll('.cursor-pointer span');
      
      // Add open button next to each customer name
      customerNameElements.forEach(el => {
        // Skip if already processed
        if (el.nextElementSibling?.classList.contains('customer-open-btn')) return;
        
        // Find the customer ID (you'll need to adapt this logic)
        const customerCard = el.closest('[data-customer-id]');
        const customerId = customerCard?.getAttribute('data-customer-id') || '';
        
        if (customerId) {
          const btn = iframe.contentDocument!.createElement('button');
          btn.className = 'customer-open-btn';
          btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Open';
          btn.onclick = (e) => {
            e.stopPropagation();
            window.open(`${externalUrl}/${customerId}`, '_blank');
          };
          el.parentNode?.insertBefore(btn, el.nextSibling);
        }
      });
      
      // Change the background color of customer card headers
      const customerCardHeaders = iframe.contentDocument.querySelectorAll('.customer-card-header, .bg-slate-200');
      customerCardHeaders.forEach(el => {
        el.classList.add('customer-card-header');
      });
      
    } catch (error) {
      console.error('Error injecting open buttons:', error);
    }
  };

  // Function to handle iframe load event
  const handleIframeLoad = () => {
    // Wait a bit for the iframe content to fully render
    setTimeout(injectOpenButtons, 1000);
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-3 py-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Customer Console</h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={injectOpenButtons}
              className="flex items-center gap-2"
            >
              Refresh Open Buttons
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(externalUrl, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open in New Tab
            </Button>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4">
          <div className="mb-4">
            <p className="text-gray-600">
              The Customer Console provides a comprehensive interface for managing your customers, 
              tracking job progress, and sharing updates with clients.
            </p>
          </div>
          
          <div className="aspect-[16/9] w-full border border-gray-200 rounded-lg overflow-hidden mb-4">
            <iframe 
              ref={iframeRef}
              src={externalUrl}
              className="w-full h-full"
              title="Customer Console"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={handleIframeLoad}
            />
          </div>
          
          <div className="flex justify-center">
            <p className="text-sm text-gray-500">
              If the console doesn't load properly, please{" "}
              <a 
                href={externalUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-500 hover:underline"
              >
                open it directly
              </a>
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 