
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export const StaffConnections: React.FC = () => {
  return (
    <div className="my-[8px] py-0">
      <label className="block text-xs font-medium mb-1 text-gray-500">Staff & Connections</label>
      <div className="flex py-px px-0 my-0 mx-[4px]">
        <Input 
          placeholder="Add staff members or connections..." 
          className="w-full border-gray-300 h-7 text-xs bg-slate-300 py-[25px] my-0 px-[14px] mx-[3px]" 
        />
        <Button 
          variant="outline" 
          size="sm" 
          className="ml-1 border-gray-300 h-7 w-7 p-0 bg-slate-400 hover:bg-slate-300 my-0 py-[25px] mx-[11px] px-0"
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
};
