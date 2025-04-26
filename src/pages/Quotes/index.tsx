
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus } from "lucide-react";
import NewQuote from './NewQuote';

const Quotes = () => {
  const navigate = useNavigate();

  const handleNewQuote = () => {
    navigate('/quotes/new');
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Quotes</h1>
          <Button className="flex items-center gap-2" onClick={handleNewQuote}>
            <Plus className="h-4 w-4" />
            New Quote
          </Button>
        </div>
        
        <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No quotes yet</p>
            <Button onClick={handleNewQuote}>Create Your First Quote</Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export { Quotes as default, NewQuote };
