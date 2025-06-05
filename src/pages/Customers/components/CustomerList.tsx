import React, { useState } from 'react';
import { CustomerCard, CustomerData } from './CustomerCard';

interface CustomerListProps {
  isLoading: boolean;
  filteredCustomers: CustomerData[];
  searchQuery: string;
  onCustomerClick: (id: string) => void;
  onEditClick: (e: React.MouseEvent, customer: CustomerData) => void;
}

export const CustomerList = ({
  isLoading,
  filteredCustomers,
  searchQuery,
  onCustomerClick,
  onEditClick
}: CustomerListProps) => {
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  // Show error state if there's an error
  if (error) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (!filteredCustomers || filteredCustomers.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">
          {searchQuery ? `No customers found matching '${searchQuery}'` : "No customers yet. Add your first customer!"}
        </p>
      </div>
    );
  }

  try {
    return (
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map(customer => (
          <CustomerCard
            key={customer?.id || Math.random().toString()}
            customer={customer}
            onCustomerClick={onCustomerClick}
            onEditClick={onEditClick}
          />
        ))}
      </div>
    );
  } catch (err) {
    console.error("Error rendering customer list:", err);
    setError("Failed to display customers. Please try refreshing the page.");
    return (
      <div className="flex justify-center py-8">
        <p className="text-red-500">Error loading customers. Please try refreshing the page.</p>
      </div>
    );
  }
};
