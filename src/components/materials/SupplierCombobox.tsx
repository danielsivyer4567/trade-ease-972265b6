
import React, { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Mock supplier data
const suppliers = [
  {
    value: "smith-building",
    label: "Smith Building Materials",
  },
  {
    value: "johnson-equipment",
    label: "Johnson Equipment Rental",
  },
  {
    value: "aaa-electrical",
    label: "AAA Electrical Services",
  },
  {
    value: "northwest-lumber",
    label: "Northwest Lumber Co.",
  },
  {
    value: "quality-plumbing",
    label: "Quality Plumbing Supplies",
  },
];

export function ComboboxDemo() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // Ensure suppliers is not undefined
  const safeSuppliers = suppliers || [];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? safeSuppliers.find((supplier) => supplier.value === value)?.label
            : "Select supplier..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search supplier..." />
          <CommandEmpty>No supplier found.</CommandEmpty>
          <CommandGroup>
            {safeSuppliers.map((supplier) => (
              <CommandItem
                key={supplier.value}
                value={supplier.value}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === supplier.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {supplier.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
