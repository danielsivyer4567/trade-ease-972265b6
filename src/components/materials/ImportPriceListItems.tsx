
import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDown, Package2, Files, Search, X } from "lucide-react";
import { CSVUploadForm } from './import/CSVUploadForm';
import { PriceListSearch } from './import/PriceListSearch';

interface ImportPriceListItemsProps {
  onImportItems: (items: Array<{name: string, quantity: string, unit: string}>) => void;
}

export function ImportPriceListItems({ onImportItems }: ImportPriceListItemsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [uploadMode, setUploadMode] = useState(false);

  const handleImport = useCallback((items: Array<{name: string, quantity: string, unit: string}>) => {
    onImportItems(items);
    setIsOpen(false);
  }, [onImportItems]);

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  if (!isOpen) {
    return (
      <Button 
        variant="outline" 
        className="flex items-center gap-2"
        onClick={() => setIsOpen(true)}
      >
        <ArrowDown className="h-4 w-4" />
        Import from Price List
      </Button>
    );
  }

  return (
    <Card className="mt-4 relative">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package2 className="h-5 w-5 text-blue-500" />
          Import from Price List
        </CardTitle>
        <Button 
          variant="ghost" 
          size="icon"
          className="absolute top-2 right-2 rounded-full h-8 w-8" 
          onClick={handleCloseModal}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Tab-like selection */}
          <div className="flex gap-2 mb-4">
            <Button 
              variant={!uploadMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setUploadMode(false)}
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              Search Price List
            </Button>
            <Button 
              variant={uploadMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setUploadMode(true)}
              className="flex items-center gap-1"
            >
              <Files className="h-4 w-4" />
              Import from CSV
            </Button>
          </div>

          {uploadMode ? (
            <CSVUploadForm 
              onItemsImported={handleImport} 
              onCancel={() => setUploadMode(false)} 
            />
          ) : (
            <PriceListSearch 
              onImport={handleImport} 
              onCancel={handleCloseModal} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
