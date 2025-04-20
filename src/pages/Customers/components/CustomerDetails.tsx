import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MessageCircle, 
  Image, 
  DollarSign, 
  FileCheck, 
  Star, 
  Link as LinkIcon,
  Package2,
  History
} from "lucide-react";
import { CustomerNote, CustomerJobHistory } from "@/pages/Banking/types";

// Import the tab components
import { CustomerOverview } from './tabs/CustomerOverview';
import { CustomerJobsQuotes } from './tabs/CustomerJobsQuotes';
import { CustomerNotes } from './tabs/CustomerNotes';
import { CustomerConversations } from './CustomerConversations';
import { CustomerPhotos } from './CustomerPhotos';
import { CustomerFinancials } from './CustomerFinancials';
import { CustomerForms } from './CustomerForms';
import { CustomerReviews } from './CustomerReviews';
import { CustomerProgressLink } from './tabs/CustomerProgressLink';
import { CustomerDetailsHeader } from './CustomerDetailsHeader';
import { CustomerMaterials } from './tabs/CustomerMaterials';
import { CustomerJourney } from './tabs/CustomerJourney';

interface CustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: 'active' | 'inactive';
    created_at: string;
  };
  notes?: CustomerNote[];
  jobHistory?: CustomerJobHistory[];
  onAddNote?: (note: string, important: boolean) => Promise<void>;
  onCreateJob?: (customerId: string) => void;
  onCreateQuote?: (customerId: string) => void;
}

export function CustomerDetails({ 
  customer,
  notes = [],
  jobHistory = [],
  onAddNote,
  onCreateJob,
  onCreateQuote 
}: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <CustomerDetailsHeader 
            customer={customer} 
            onCreateJob={onCreateJob} 
            onCreateQuote={onCreateQuote} 
          />
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b rounded-none bg-white overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="journey">
                <History className="h-4 w-4 mr-1 inline" /> Journey
              </TabsTrigger>
              <TabsTrigger value="jobs">Jobs & Quotes</TabsTrigger>
              <TabsTrigger value="materials">
                <Package2 className="h-4 w-4 mr-1 inline" /> Materials
              </TabsTrigger>
              <TabsTrigger value="conversations">
                <MessageCircle className="h-4 w-4 mr-1 inline" /> Conversations
              </TabsTrigger>
              <TabsTrigger value="photos">
                <Image className="h-4 w-4 mr-1 inline" /> Photos
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="financials">
                <DollarSign className="h-4 w-4 mr-1 inline" /> Financials
              </TabsTrigger>
              <TabsTrigger value="forms">
                <FileCheck className="h-4 w-4 mr-1 inline" /> Forms
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-1 inline" /> Reviews
              </TabsTrigger>
              <TabsTrigger value="progress-link">
                <LinkIcon className="h-4 w-4 mr-1 inline" /> Progress Link
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview">
              <CustomerOverview 
                customer={customer} 
                jobHistory={jobHistory} 
                formatDate={formatDate} 
              />
            </TabsContent>

            {/* Journey Tab */}
            <TabsContent value="journey">
              <CustomerJourney customerId={customer.id} />
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs">
              <CustomerJobsQuotes 
                jobHistory={jobHistory} 
                formatDate={formatDate} 
                onCreateJob={onCreateJob}
                onCreateQuote={onCreateQuote}
                customerId={customer.id}
              />
            </TabsContent>
            
            {/* Materials Tab */}
            <TabsContent value="materials">
              <CustomerMaterials 
                customerId={customer.id}
                customerName={customer.name}
                jobHistory={jobHistory}
              />
            </TabsContent>
            
            {/* Conversations Tab */}
            <TabsContent value="conversations">
              <CustomerConversations customerId={customer.id} />
            </TabsContent>
            
            {/* Photos Tab */}
            <TabsContent value="photos">
              <CustomerPhotos customerId={customer.id} />
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes">
              <CustomerNotes 
                notes={notes} 
                onAddNote={onAddNote} 
                formatDate={formatDate} 
              />
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials">
              <CustomerFinancials customerId={customer.id} />
            </TabsContent>

            {/* Forms Tab */}
            <TabsContent value="forms">
              <CustomerForms customerId={customer.id} />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews">
              <CustomerReviews customerId={customer.id} />
            </TabsContent>

            {/* Progress Link Tab */}
            <TabsContent value="progress-link">
              <CustomerProgressLink customerId={customer.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
