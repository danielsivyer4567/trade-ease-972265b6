
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PostcodeSelectorProps {
  postcodes: string[];
  onAddPostcode: (postcode: string) => void;
  onRemovePostcode: (postcode: string) => void;
  label?: string;
  helpText?: string;
  placeholder?: string;
}

export const PostcodeSelector = ({
  postcodes,
  onAddPostcode,
  onRemovePostcode,
  label = "Preferred Postcodes",
  helpText,
  placeholder = "e.g. 2000"
}: PostcodeSelectorProps) => {
  const [postcode, setPostcode] = useState("");

  const handleAddPostcode = () => {
    if (postcode && !postcodes.includes(postcode)) {
      onAddPostcode(postcode);
      setPostcode("");
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      {helpText && (
        <div className="text-sm text-gray-500 mb-1">
          {helpText}
        </div>
      )}
      <div className="flex gap-2">
        <Input
          value={postcode}
          onChange={(e) => setPostcode(e.target.value)}
          placeholder={placeholder}
        />
        <Button 
          type="button" 
          variant="secondary" 
          onClick={handleAddPostcode}
        >
          Add
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 mt-2">
        {postcodes.map((p) => (
          <div 
            key={p}
            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
          >
            {p}
            <button 
              onClick={() => onRemovePostcode(p)}
              className="text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </div>
        ))}
        {postcodes.length === 0 && (
          <p className="text-sm text-gray-500">No preferred postcodes added</p>
        )}
      </div>
    </div>
  );
};
