
import React from 'react';
import { Button } from "@/components/ui/button";
import { Loader2, Phone } from "lucide-react";
import { TwilioPhoneNumber } from '../types';

interface NumberListProps {
  isLoadingNumbers: boolean;
  availableNumbers: TwilioPhoneNumber[];
  phoneNumber: string;
  handleSelectNumber: (number: TwilioPhoneNumber) => void;
}

export const NumberList = ({
  isLoadingNumbers,
  availableNumbers,
  phoneNumber,
  handleSelectNumber
}: NumberListProps) => {
  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    return phone.replace(/^\+1/, '').replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
  };
  
  return (
    <div className="border rounded-md overflow-hidden">
      {isLoadingNumbers ? (
        <div className="p-8 flex justify-center items-center">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          <span>Loading available numbers...</span>
        </div>
      ) : availableNumbers.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <p>No available numbers found. Try a different area code or refresh.</p>
        </div>
      ) : (
        <div className="max-h-[300px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-slate-300 sticky top-0">
              <tr>
                <th className="px-4 py-2 text-left">Phone Number</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-center">Select</th>
              </tr>
            </thead>
            <tbody>
              {availableNumbers.map((number, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-slate-100' : 'bg-white'}>
                  <td className="px-4 py-2">{formatPhoneNumber(number.friendlyName)}</td>
                  <td className="px-4 py-2">
                    {number.locality && number.region 
                      ? `${number.locality}, ${number.region}` 
                      : number.region || 'Unknown location'}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Button 
                      size="sm" 
                      onClick={() => handleSelectNumber(number)}
                      className={`${phoneNumber === number.phoneNumber 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-slate-400 hover:bg-slate-300'}`}
                    >
                      <Phone className="h-3 w-3 mr-1" />
                      {phoneNumber === number.phoneNumber ? 'Selected' : 'Select'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
