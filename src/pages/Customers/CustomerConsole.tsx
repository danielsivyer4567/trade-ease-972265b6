import React, { useEffect, useRef, useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ExternalLink, PlusCircle, Briefcase } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { openCustomer } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export default function CustomerConsole() {
  const navigate = useNavigate();
  const location = useLocation();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Determine if we're viewing a specific customer by checking the path
  useEffect(() => {
    const path = location.pathname;
    const match = path.match(/\/customers\/(\d+)/);
    if (match && match[1]) {
      setCustomerId(match[1]);
      setSelectedCustomerId(match[1]);
    } else {
      setCustomerId(null);
    }
  }, [location.pathname]);
  
  // Base URL for the iframe
  const baseUrl = 'http://localhost:8081/customers';
  
  // Get the iframe source URL based on whether we're viewing a specific customer
  const getIframeUrl = () => {
    return customerId ? `${baseUrl}/${customerId}` : baseUrl;
  };

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
        .customer-name {
          cursor: pointer;
        }
        .customer-name:hover {
          text-decoration: underline;
          color: #2563eb;
        }
        .selected-customer {
          border: 2px solid #2563eb !important;
        }
      `;
      iframe.contentDocument.head.appendChild(style);

      // If we're on a specific customer page, we're already viewing the customer details
      if (customerId) {
        // Set the selected customer ID to the current customer
        setSelectedCustomerId(customerId);
        return;
      }

      // Get all customer cards
      const customerCards = iframe.contentDocument.querySelectorAll('.cursor-pointer');
      
      customerCards.forEach(card => {
        // Find customer name element
        const nameElement = card.querySelector('span, h3, .customer-name');
        if (!nameElement) return;
        
        // Add customer-name class to make it visibly clickable
        nameElement.classList.add('customer-name');
        
        // Find customer ID
        // First try data attribute
        let cardCustomerId = card.getAttribute('data-customer-id');
        
        // If no data attribute, try to find ID in another way (URL, ID property, etc.)
        if (!cardCustomerId) {
          // Look for ID in a data attribute, element ID, or URL pattern
          const idElement = card.querySelector('[data-customer-id], [id^="customer-"]');
          if (idElement) {
            cardCustomerId = idElement.getAttribute('data-customer-id') || 
                         idElement.id.replace('customer-', '');
          }
          
          // If still no ID, try to find it in the text (like "CUST-1001")
          if (!cardCustomerId) {
            const text = card.textContent || '';
            const match = text.match(/CUST-\d+/);
            if (match) cardCustomerId = match[0];
          }
          
          // Last resort, use any unique identifier on the card
          if (!cardCustomerId) {
            cardCustomerId = card.id || 'unknown';
          }
        }
        
        // Make the name clickable to open customer
        (nameElement as HTMLElement).addEventListener('click', (e) => {
          e.stopPropagation();
          navigate(`/customers/${cardCustomerId}`);
        });
        
        // Allow selecting a customer for creating a new job
        card.addEventListener('click', () => {
          // Remove selection from all cards
          customerCards.forEach(c => c.classList.remove('selected-customer'));
          // Select this card
          card.classList.add('selected-customer');
          // Store the selected customer ID
          setSelectedCustomerId(cardCustomerId);
        });
        
        // Skip if already has an Open button
        if (nameElement.nextElementSibling?.classList.contains('customer-open-btn')) return;
        
        // Add an Open button
        const btn = iframe.contentDocument!.createElement('button');
        btn.className = 'customer-open-btn';
        btn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-1"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg> Open';
        btn.onclick = (e) => {
          e.stopPropagation();
          navigate(`/customers/${cardCustomerId}`);
        };
        
        // Insert the button after the name
        nameElement.parentNode?.insertBefore(btn, nameElement.nextSibling);
      });
      
      // Change the background color of customer card headers
      const customerCardHeaders = iframe.contentDocument.querySelectorAll('.bg-slate-200, .customer-card-header');
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

  // Function to handle adding a new customer
  const handleAddCustomer = () => {
    // Navigate to the external URL for creating a new customer
    window.open(`${baseUrl}/new`, '_blank');
  };

  // Function to handle creating a new job for selected customer
  const handleNewJob = () => {
    if (!selectedCustomerId) {
      toast({
        title: "No customer selected",
        description: "Please select a customer first to create a new job.",
        variant: "destructive"
      });
      return;
    }
    
    // Navigate to the external URL for creating a new job with the selected customer
    window.open(`${baseUrl}/${selectedCustomerId}/jobs/new`, '_blank');
  };

  // Function to handle going back to customer list
  const handleBackToList = () => {
    navigate('/customers');
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={customerId ? handleBackToList : () => navigate(-1)}
              className="rounded-md border border-gray-300 px-3 py-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">
              {customerId ? `Customer Details #${customerId}` : 'Customer Console'}
            </h1>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="default"
              onClick={handleAddCustomer}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Add Customer
            </Button>
            <Button 
              variant="secondary"
              onClick={handleNewJob}
              className="flex items-center gap-2"
            >
              <Briefcase className="h-4 w-4" />
              New Job
            </Button>
            <Button 
              variant="outline"
              onClick={injectOpenButtons}
              className="flex items-center gap-2"
            >
              Refresh Open Buttons
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.open(getIframeUrl(), '_blank')}
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
              {customerId 
                ? `Viewing details for Customer #${customerId}. Create a new job or edit customer information using the buttons above.`
                : 'The Customer Console provides a comprehensive interface for managing your customers, tracking job progress, and sharing updates with clients. Click on any customer name or "Open" button to view complete details.'}
            </p>
          </div>
          
          <div className="aspect-[16/9] w-full border border-gray-200 rounded-lg overflow-hidden mb-4">
            <iframe 
              ref={iframeRef}
              src={getIframeUrl()}
              className="w-full h-full"
              title={customerId ? `Customer ${customerId} Details` : "Customer Console"}
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              onLoad={handleIframeLoad}
            />
          </div>
          
          <div className="flex justify-center">
            <p className="text-sm text-gray-500">
              If the console doesn't load properly, please{" "}
              <a 
                href={getIframeUrl()} 
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