import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  Plus, 
  RotateCcw, 
  FileText, 
  Mail, 
  Phone, 
  RotateCw, 
  Tag, 
  Star, 
  Upload, 
  Download, 
  ClipboardList,
  Clock,
  Folder,
  Search,
  Filter,
  Settings,
  MoreHorizontal
} from "lucide-react";
import { CustomerData } from './CustomerCard';
import { cn } from "@/lib/utils";

interface CustomerActionToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedFilter: string;
  setSelectedFilter: (filter: string) => void;
  filteredCustomers: CustomerData[];
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerActionToolbar = ({
  searchQuery,
  setSearchQuery,
  selectedFilter,
  setSelectedFilter,
  filteredCustomers,
  handleFileUpload
}: CustomerActionToolbarProps) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const actionButtons = [
    { icon: Plus, label: "Add", variant: "default" as const },
    { icon: RotateCcw, label: "Refresh", variant: "outline" as const },
    { icon: FileText, label: "Export", variant: "outline" as const },
    { icon: Mail, label: "Email", variant: "outline" as const },
    { icon: Phone, label: "Call", variant: "outline" as const },
    { icon: RotateCw, label: "Sync", variant: "outline" as const },
    { icon: Tag, label: "Tag", variant: "outline" as const },
    { icon: Star, label: "Favorite", variant: "outline" as const },
    { icon: Upload, label: "Import", variant: "outline" as const },
    { icon: Download, label: "Export", variant: "outline" as const },
    { icon: ClipboardList, label: "Tasks", variant: "outline" as const },
    { icon: Clock, label: "Schedule", variant: "outline" as const },
    { icon: Folder, label: "Organize", variant: "outline" as const },
  ];

  return (
    <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4 shadow-sm">
      {/* Filter Section */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFilter('all')}
            className="text-sm"
          >
            All
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={cn(
              "text-sm transition-colors",
              showAdvanced ? "bg-blue-50 text-blue-600 border-blue-200" : ""
            )}
          >
            Advanced
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {actionButtons.slice(0, showAdvanced ? actionButtons.length : 8).map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                variant={button.variant}
                size="sm"
                className="h-8 w-8 p-0 transition-all duration-200 hover:scale-110 hover:shadow-md"
                title={button.label}
              >
                <Icon className="h-4 w-4" />
              </Button>
            );
          })}
          
          {!showAdvanced && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {actionButtons.slice(8).map((button, index) => {
                  const Icon = button.icon;
                  return (
                    <DropdownMenuItem key={index}>
                      <Icon className="h-4 w-4 mr-2" />
                      {button.label}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="h-8 px-3">
              <Filter className="h-4 w-4 mr-1" />
              Columns
            </Button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Quick search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 w-64 pl-10 pr-4"
              />
            </div>
            
            <Button variant="outline" size="sm" className="h-8 px-3">
              More Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      {showAdvanced && (
        <div className="mt-4 p-4 bg-blue-50 rounded-md border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-blue-900">Advanced Options</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(false)}
              className="text-blue-600 hover:text-blue-700"
            >
              ×
            </Button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            <Button variant="outline" size="sm" className="justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Bulk Edit
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Upload className="h-4 w-4 mr-2" />
              Mass Import
            </Button>
            <Button variant="outline" size="sm" className="justify-start">
              <Tag className="h-4 w-4 mr-2" />
              Mass Tag
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}; 