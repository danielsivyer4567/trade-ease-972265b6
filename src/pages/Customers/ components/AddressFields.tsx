import React, { useEffect, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AddressFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
  inputClassName?: string;
}

export function AddressFields({
  form,
  className,
  inputClassName = ""
}: AddressFieldsProps) {
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !addressRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(addressRef.current!, {
      types: ['geocode'],
      componentRestrictions: { country: 'au' } // 🇦🇺 Australia only
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      form.setValue("address", place.formatted_address);
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);

      let suburb = "";
      let state = "";
      let postalCode = "";

      for (const component of place.address_components || []) {
        const types = component.types;

        if (types.includes("locality")) {
          suburb = component.long_name; // e.g., Parramatta
        }
        if (types.includes("administrative_area_level_1")) {
          state = component.short_name; // e.g., NSW
        }
        if (types.includes("postal_code")) {
          postalCode = component.long_name;
        }
      }

      form.setValue("suburb", suburb);     // renamed from "city"
      form.setValue("state", state);
      form.setValue("zipCode", postalCode);
    });
  }, [form]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Address</h3>

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="md:col-span-2">
            <FormLabel>Street Address</FormLabel>
            <FormControl>
              <input
                ref={addressRef}
                defaultValue={field.value}
                onBlur={field.onBlur}
                name={field.name}
                className={`${inputClassName} max-w-xl w-full border border-gray-700 rounded p-2`}
                placeholder="Start typing an address..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          control={form.control}
          name="suburb"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Suburb</FormLabel>
              <FormControl>
                <div className={inputClassName}>
                  <Input placeholder="Enter suburb" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <div className={inputClassName}>
                    <Input placeholder="e.g. NSW" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <div className={inputClassName}>
                    <Input placeholder="Enter postal code" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
