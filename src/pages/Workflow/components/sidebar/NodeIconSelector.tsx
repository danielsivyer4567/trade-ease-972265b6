
import React from 'react';
import { Label } from "@/components/ui/label";

interface NodeIconSelectorProps {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
  icons: string[];
}

export function NodeIconSelector({ selectedIcon, setSelectedIcon, icons }: NodeIconSelectorProps) {
  return (
    <div>
      <Label className="text-xs">Icon</Label>
      <div className="flex flex-wrap gap-1 mt-1">
        {icons.map((icon) => (
          <button
            key={icon}
            type="button"
            onClick={() => setSelectedIcon(icon)}
            className={`w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 ${selectedIcon === icon ? 'bg-gray-200' : ''}`}
          >
            {icon}
          </button>
        ))}
      </div>
    </div>
  );
}
