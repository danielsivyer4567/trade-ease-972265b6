
import React from 'react';

interface CustomerProgressLinkProps {
  customerId: string;
}

export function CustomerProgressLink({ customerId }: CustomerProgressLinkProps) {
  return (
    <div className="p-4">
      <h3 className="font-medium mb-4">Customer Progress Link</h3>
      <div className="bg-gray-50 p-4 rounded-md border">
        <p className="text-sm">
          This section will allow you to create and manage a customer progress link 
          that lets customers view the status of their project.
        </p>
      </div>
    </div>
  );
}
