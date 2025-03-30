
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";
import Quotes from "../Quotes/NewQuote";
import { InvoicesPage } from "./components/InvoicesPage";

export default function QuotesInvoices() {
  const [activeTab, setActiveTab] = useState<string>("quotes");
  
  return (
    <AppLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Quotes & Invoicing</h1>
        
        <Tabs defaultValue="quotes" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-6 w-[400px]">
            <TabsTrigger value="quotes">Quotes</TabsTrigger>
            <TabsTrigger value="invoices">Invoices</TabsTrigger>
          </TabsList>

          <TabsContent value="quotes" className="mt-0">
            <Quotes />
          </TabsContent>
          
          <TabsContent value="invoices" className="mt-0">
            <InvoicesPage />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
