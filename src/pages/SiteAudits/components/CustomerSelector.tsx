
import React from 'react';
import { Check, ChevronsUpDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Customer } from '../types/auditTypes';

interface CustomerSelectorProps {
  customers: Customer[];
  selectedCustomerId: string | null;
  onSelectCustomer: (customerId: string) => void;
}

export function CustomerSelector({
  customers = [],
  selectedCustomerId,
  onSelectCustomer
}: CustomerSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedCustomer = React.useMemo(() => 
    (customers || []).find(c => c.id === selectedCustomerId),
  [customers, selectedCustomerId]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between min-w-[220px]"
        >
          <div className="flex items-center gap-2 truncate">
            <User className="h-4 w-4" />
            <span className="truncate">
              {selectedCustomer ? selectedCustomer.name : "Select a customer..."}
            </span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search customers..." />
          <CommandEmpty>No customers found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-auto">
            {(customers || []).map((customer) => (
              <CommandItem
                key={customer.id}
                value={customer.name}
                onSelect={() => {
                  onSelectCustomer(customer.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedCustomerId === customer.id ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="truncate">{customer.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
