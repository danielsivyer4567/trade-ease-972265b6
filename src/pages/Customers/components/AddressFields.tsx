import React, { useEffect, useRef } from 'react';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";

interface AddressFieldsProps {
  form: UseFormReturn<any>;
  className?: string;
  inputClassName?: string;
}

export function AddressFields({ form, className, inputClassName = "" }: AddressFieldsProps) {
  const addressRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !addressRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(addressRef.current!, {
      types: ['geocode'],
      componentRestrictions: { country: 'au' }, // 🇦🇺 Only Australia
    });

    // Optional: Set map bounds to bias results toward Australia
    autocomplete.setBounds(
      new google.maps.LatLngBounds(
        new google.maps.LatLng(-44.0, 112.0), // SW corner of AU
        new google.maps.LatLng(-10.0, 154.0)  // NE corner of AU
      )
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();

      form.setValue("address", place.formatted_address);
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);

      for (const component of place.address_components || []) {
        const types = component.types;
        if (types.includes("locality")) {
          form.setValue("city", component.long_name); // Suburb
        }
        if (types.includes("administrative_area_level_1")) {
          form.setValue("state", component.short_name); // e.g. NSW
        }
        if (types.includes("postal_code")) {
          form.setValue("zipCode", component.long_name);
        }
      }
    });
  }, [form]);

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-medium">Address</h3>

      {/* Autocomplete address input */}
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

      {/* City / State / Zip display */}
      <div className="flex flex-col md:flex-row gap-2 mt-4">
        {["city", "state", "zipCode"].map((key) => (
          <FormField
            key={key}
            control={form.control}
            name={key}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{key === "zipCode" ? "Zip/Postal Code" : key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                <FormControl>
                  <div className={`${inputClassName} max-w-xs w-full border border-gray-700 rounded p-2`}>
                    <Input placeholder={`Enter ${key}`} {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}
