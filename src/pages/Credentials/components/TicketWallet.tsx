import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

// Placeholder data - replace with actual data fetching
const mockTickets = [
  {
    id: '1',
    type: 'White Card',
    issuer: 'Construction Industry',
    number: '1234567',
    expiry: null,
    colorScheme: 'dark' // 'dark', 'green', 'blue', etc.
  },
  {
    id: '2',
    type: 'Working with Children Check',
    issuer: 'State Gov',
    number: 'WWCC-987',
    expiry: '12/2026',
    colorScheme: 'green'
  },
  // Add more mock tickets as needed
];

export const TicketWallet = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {mockTickets.map((ticket) => (
        <Card key={ticket.id} className={`relative overflow-hidden shadow-md aspect-[1.58/1] flex flex-col justify-between p-4
          ${ticket.colorScheme === 'dark' ? 'bg-gray-800 text-white' : 
             ticket.colorScheme === 'green' ? 'bg-green-100 text-green-800' : 
             ticket.colorScheme === 'blue' ? 'bg-blue-100 text-blue-800' : 
             'bg-gray-100 text-gray-800'}
        `}>
          <div className="flex-grow">
            <p className="text-xs opacity-80 mb-1">{ticket.issuer}</p>
            <h3 className="font-semibold text-sm sm:text-base mb-1 truncate">{ticket.type}</h3>
            <p className="text-xs opacity-80">{ticket.number}</p>
          </div>
          <div className="text-right text-xs opacity-80 mt-2">
            {ticket.expiry ? `Exp: ${ticket.expiry}` : 'No Expiry'}
          </div>
          {/* Vertical colored bar - adjust colors as needed */}
          <div className={`absolute top-0 right-0 bottom-0 w-4 
            ${ticket.colorScheme === 'dark' ? 'bg-yellow-400' : 
               ticket.colorScheme === 'green' ? 'bg-blue-500' : 
               ticket.colorScheme === 'blue' ? 'bg-yellow-500' : 
               'bg-gray-300'}
          `}>
            <span className="absolute bottom-2 right-1/2 translate-x-1/2 rotate-90 text-[8px] sm:text-[10px] font-bold tracking-wider whitespace-nowrap text-black/60 opacity-70">
              {/* Placeholder for state/region - could come from data */}
              VICTORIA 
            </span>
          </div>
        </Card>
      ))}
      {/* Placeholder for 'Add New' button */}
      <Card className="relative overflow-hidden shadow-md aspect-[1.58/1] border-2 border-dashed border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer">
        <span className="text-gray-500">+ Add New</span>
      </Card>
    </div>
  );
}; 