
import React from 'react';
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
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">Loading customers...</p>
      </div>
    );
  }

  if (filteredCustomers.length === 0) {
    return (
      <div className="flex justify-center py-8">
        <p className="text-gray-500">
          {searchQuery ? `No customers found matching '${searchQuery}'` : "No customers yet. Add your first customer!"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {filteredCustomers.map(customer => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onCustomerClick={onCustomerClick}
          onEditClick={onEditClick}
        />
      ))}
    </div>
  );
};
