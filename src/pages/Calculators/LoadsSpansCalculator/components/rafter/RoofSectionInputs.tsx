
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { RoofSection } from "../../types/rafterRoof";

interface RoofSectionInputsProps {
  sections: RoofSection[];
  updateSection: (index: number, field: 'height' | 'length', value: string) => void;
  removeSection: (index: number) => void;
  addSection: () => void;
  calculateTotalArea: () => void;
}

export const RoofSectionInputs: React.FC<RoofSectionInputsProps> = ({
  sections,
  updateSection,
  removeSection,
  addSection,
  calculateTotalArea
}) => {
  return (
    <div className="space-y-4">
      {sections.map((section, index) => (
        <div key={index} className="grid grid-cols-7 gap-4 items-center">
          <div className="col-span-3 space-y-2">
            <Label htmlFor={`height-${index}`}>Height (m)</Label>
            <Input
              id={`height-${index}`}
              type="number"
              step="0.1"
              min="0"
              value={section.height}
              onChange={(e) => updateSection(index, 'height', e.target.value)}
            />
          </div>
          <div className="col-span-3 space-y-2">
            <Label htmlFor={`length-${index}`}>Length (m)</Label>
            <Input
              id={`length-${index}`}
              type="number"
              step="0.1"
              min="0"
              value={section.length}
              onChange={(e) => updateSection(index, 'length', e.target.value)}
            />
          </div>
          <div className="col-span-1 flex items-end">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => removeSection(index)}
              disabled={sections.length <= 1}
            >
              <Trash2 className="h-5 w-5 text-red-500" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={addSection}
        >
          <PlusCircle className="h-4 w-4" />
          Add Section
        </Button>
        
        <Button 
                      className="bg-blue-500 hover:bg-blue-600 flex-1"
          onClick={calculateTotalArea}
        >
          Calculate Area
        </Button>
      </div>
    </div>
  );
};
