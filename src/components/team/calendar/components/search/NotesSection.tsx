
import React from 'react';
import { Textarea } from '@/components/ui/textarea';

export const NotesSection: React.FC = () => {
  return (
    <div className="mb-1">
      <label className="block text-xs font-medium mb-1 text-gray-500">Notes</label>
      <Textarea 
        placeholder="Add notes here..." 
        className="w-full h-10 px-3 py-1 border border-gray-300 rounded-md text-xs bg-slate-300" 
      />
    </div>
  );
};
