import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FilePlus, Printer } from 'lucide-react';
import { CustomerForm } from './CustomerForm';
import { QuoteItemsForm, QuoteItem } from './QuoteItemsForm';
import { TermsForm } from './TermsForm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface QuoteBuilderProps {
  template: {
    id: number;
    name: string;
    component: React.FC<any>;
  };
  onBack: () => void;
  onFinalize: (details: { customer: any; items: QuoteItem[]; terms: string[] }) => void;
}

const QuoteBuilderSidebar: React.FC<{
  customer: any;
  setCustomer: (data: any) => void;
  items: QuoteItem[];
  setItems: (items: QuoteItem[]) => void;
  terms: string[];
  setTerms: (terms: string[]) => void;
}> = ({ customer, setCustomer, items, setItems, terms, setTerms }) => {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Build Your Quote</h3>
        <p className="text-sm text-muted-foreground">Fill in the details below.</p>
      </div>
      <Accordion type="single" collapsible defaultValue="customer" className="flex-1 overflow-y-auto p-4">
        <AccordionItem value="customer">
          <AccordionTrigger>Customer Information</AccordionTrigger>
          <AccordionContent>
            <CustomerForm onUpdate={setCustomer} initialData={customer} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="items">
          <AccordionTrigger>Quote Items</AccordionTrigger>
          <AccordionContent>
            <QuoteItemsForm items={items} setItems={setItems} />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="terms">
          <AccordionTrigger>Terms & Conditions</AccordionTrigger>
          <AccordionContent>
            <TermsForm onUpdate={setTerms} initialTerms={terms} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({ template, onBack, onFinalize }) => {
  const [customer, setCustomer] = useState(null);
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [terms, setTerms] = useState<string[]>([]);

  const TemplateComponent = template.component;

  const templateProps = {
    ...customer,
    items,
    terms,
  };
  
  const handleFinalize = () => {
    onFinalize({ customer, items, terms });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="h-screen flex flex-col">
      <header className="p-4 border-b bg-white dark:bg-slate-900 sticky top-0 z-20 flex justify-between items-center no-print">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Gallery
        </Button>
        <h2 className="text-lg font-semibold">Live Quote Builder: {template.name}</h2>
        <div className="flex items-center gap-2">
          <Button onClick={handlePrint} variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleFinalize} className="bg-green-600 hover:bg-green-700 text-white">
            <FilePlus className="mr-2 h-4 w-4" />
            Finalize & Preview
          </Button>
        </div>
      </header>
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 overflow-hidden">
        <div className="md:col-span-1 h-full bg-slate-50 dark:bg-slate-800 border-r dark:border-slate-700 overflow-y-auto">
          <QuoteBuilderSidebar 
            customer={customer}
            setCustomer={setCustomer}
            items={items}
            setItems={setItems}
            terms={terms}
            setTerms={setTerms}
          />
        </div>
        <div className="md:col-span-2 h-full overflow-y-auto bg-gray-100 dark:bg-gray-900">
          <TemplateComponent {...templateProps} />
        </div>
      </div>
    </div>
  );
}; 