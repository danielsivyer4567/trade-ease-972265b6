
import React from 'react';
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Upload, UserPlus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface CustomerHeaderProps {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CustomerHeader = ({ handleFileUpload }: CustomerHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-gray-950"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <User className="h-8 w-8" />
          Customers
        </h1>
      </div>
      <div className="flex gap-2 bg-slate-200">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Import Customers</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.csv';
              input.onchange = e => handleFileUpload(e as any);
              input.click();
            }}>
              Import from CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.xlsx,.xls';
              input.onchange = e => handleFileUpload(e as any);
              input.click();
            }}>
              Import from Spreadsheet
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast({
              title: "Google Docs Import",
              description: "Google Docs integration coming soon!"
            })}>
              Import from Google Docs
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button onClick={() => navigate('/customers/new')} className="text-zinc-950 bg-slate-400 hover:bg-slate-300">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>
    </div>
  );
};
