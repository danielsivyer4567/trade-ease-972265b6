
import React from 'react';
import { Label } from "@/components/ui/label";

interface NodeColorSelectorProps {
  selectedColor: string;
  setSelectedColor: (color: string) => void;
  colors: string[];
}

export function NodeColorSelector({ selectedColor, setSelectedColor, colors }: NodeColorSelectorProps) {
  return (
    <div>
      <Label className="text-xs">Color</Label>
      <div className="flex flex-wrap gap-1 mt-1">
        {colors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => setSelectedColor(color)}
            className={`w-6 h-6 rounded-full border ${selectedColor === color ? 'border-gray-800 border-2' : 'border-gray-300'}`}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}
