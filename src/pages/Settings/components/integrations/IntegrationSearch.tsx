
import React from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface IntegrationSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onOpenCommandDialog: () => void;
}

export const IntegrationSearch: React.FC<IntegrationSearchProps> = ({
  searchTerm,
  onSearchChange,
  onOpenCommandDialog
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      <div className="relative flex-1 md:min-w-[300px] max-w-[600px]">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search integrations..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-8"
        />
      </div>
      <Button 
        variant="outline" 
        className="w-full sm:w-auto"
        onClick={onOpenCommandDialog}
      >
        <Search className="h-4 w-4 mr-2" />
        Advanced Search
      </Button>
    </div>
  );
};
