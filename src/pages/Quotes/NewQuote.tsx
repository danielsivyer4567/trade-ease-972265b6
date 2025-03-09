import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QuoteTemplateSelector } from "./components/QuoteTemplateSelector";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { CustomerForm } from "./components/CustomerForm";
import { QuoteItemsForm, QuoteItem } from "./components/QuoteItemsForm";
import { PriceListForm, PriceListItem } from "./components/PriceListForm";
import { TermsForm } from "./components/TermsForm";
import { QuotePreview } from "./components/QuotePreview";
export default function NewQuote() {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([{
    description: "",
    quantity: 1,
    rate: 0,
    total: 0
  }]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const handleBack = () => {
    navigate("/quotes");
  };
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected",
      description: `Template ${templateId} has been applied to your quote`
    });
    setQuoteItems([{
      description: "Labor - Standard Rate",
      quantity: 8,
      rate: 85,
      total: 680
    }, {
      description: "Materials - Premium Grade",
      quantity: 1,
      rate: 450,
      total: 450
    }, {
      description: "Equipment Rental",
      quantity: 1,
      rate: 200,
      total: 200
    }]);
  };
  const handleAddPriceListItem = (item: PriceListItem) => {
    const newItem = {
      description: item.name,
      quantity: 1,
      rate: item.price,
      total: item.price
    };
    setQuoteItems([...quoteItems, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your quote`
    });
    setActiveTab("items");
  };
  return <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4 rounded-md border border-gray-300" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="details" className="bg-slate-400 hover:bg-slate-300">Customer Details</TabsTrigger>
                <TabsTrigger value="items" className="bg-slate-400 hover:bg-slate-300 px-0 mx-[12px]">Quote Items</TabsTrigger>
                <TabsTrigger value="price-list" className="bg-slate-400 hover:bg-slate-300 mx-0">Price List</TabsTrigger>
                <TabsTrigger value="terms" className="bg-slate-400 hover:bg-slate-300 mx-[13px]">Terms & Notes</TabsTrigger>
                <TabsTrigger value="preview" className="bg-slate-400 hover:bg-slate-300 mx-[2px]">Preview</TabsTrigger>
              </TabsList>
              
              <Card>
                <CardContent className="p-6">
                  <TabsContent value="details" className="mt-0">
                    <CustomerForm onNextTab={() => setActiveTab("items")} />
                  </TabsContent>
                  
                  <TabsContent value="items" className="mt-0">
                    <QuoteItemsForm quoteItems={quoteItems} setQuoteItems={setQuoteItems} onPrevTab={() => setActiveTab("details")} onNextTab={() => setActiveTab("terms")} />
                  </TabsContent>
                  
                  <TabsContent value="price-list" className="mt-0">
                    <PriceListForm onAddItemToQuote={handleAddPriceListItem} onChangeTab={tab => setActiveTab(tab)} />
                  </TabsContent>
                  
                  <TabsContent value="terms" className="mt-0">
                    <TermsForm onPrevTab={() => setActiveTab("items")} onNextTab={() => setActiveTab("preview")} />
                  </TabsContent>
                  
                  <TabsContent value="preview" className="mt-0">
                    <QuotePreview quoteItems={quoteItems} onPrevTab={() => setActiveTab("terms")} />
                  </TabsContent>
                </CardContent>
              </Card>
            </Tabs>
          </div>
          
          <div>
            <QuoteTemplateSelector onSelectTemplate={handleSelectTemplate} selectedTemplate={selectedTemplate} />
          </div>
        </div>
      </div>
    </AppLayout>;
}