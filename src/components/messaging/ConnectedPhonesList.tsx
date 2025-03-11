import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Phone } from "lucide-react";
interface ConnectedPhonesListProps {
  connectedNumbers: string[];
  onRemoveNumber: (index: number) => void;
  onAddTwilioAccount: () => void;
}
export const ConnectedPhonesList: React.FC<ConnectedPhonesListProps> = ({
  connectedNumbers,
  onRemoveNumber,
  onAddTwilioAccount
}) => {
  return <div className="space-y-4">
      
      
      {connectedNumbers.length > 0 ? <div className="space-y-3">
          {connectedNumbers.map((number, index) => <div key={index} className="flex justify-between items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <span className="text-gray-900 font-medium">{number}</span>
              </div>
              
              <Button variant="ghost" size="sm" onClick={() => onRemoveNumber(index)} className="text-gray-500 hover:text-red-500 hover:bg-red-50">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>)}
        </div> : <div className="p-6 border rounded-lg bg-gray-50 text-center text-gray-500 border-dashed border-gray-300 py-0 px-0">
          <Phone className="h-10 w-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">No phone numbers connected yet</p>
          <p className="text-sm mt-1">Add a phone number to start sending and receiving messages</p>
        </div>}
    </div>;
};