import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, Plus, Search } from "lucide-react";
import { mockDatabaseService } from '@/services/MockDatabaseService';
import { QuotesList } from './components/QuoteList';
import { useQuery } from '@tanstack/react-query';
import NewQuote from './NewQuote';

const Quotes = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const { data: quotes, isError, isSuccess } = useQuery({
    queryKey: ['quotes'],
    queryFn: async () => {
      const quotes = await mockDatabaseService.getQuotes();
      return quotes;
    },
  });

  // Show loader for a minimum time to avoid flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        
        {isLoading ? (
          <div className="flex justify-center items-center p-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : quotes && quotes.length > 0 ? (
          <QuotesList quotes={quotes} />
        ) : (
          <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No quotes yet</p>
              <Button onClick={handleNewQuote}>Create Your First Quote</Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export { Quotes as default, NewQuote };
