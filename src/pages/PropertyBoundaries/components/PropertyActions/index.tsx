
import React from 'react';
import { Button } from "@/components/ui/button";
import { Ruler, Save } from 'lucide-react';
import { usePropertyBoundaries } from '../../hooks/usePropertyBoundaries';

interface PropertyActionsProps {
  isMeasuring: boolean;
  onToggleMeasurement: () => void;
  selectedProperty?: any; // Using any for simplicity, should use Property type
}

export const PropertyActions: React.FC<PropertyActionsProps> = ({
  isMeasuring,
  onToggleMeasurement,
  selectedProperty
}) => {
  const { savePropertyToSupabase } = usePropertyBoundaries();

  const handleSaveProperty = async () => {
    if (selectedProperty) {
      await savePropertyToSupabase(selectedProperty);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <Button
        variant={isMeasuring ? "default" : "outline"}
        size="sm"
        onClick={onToggleMeasurement}
        className="flex items-center gap-2"
      >
        <Ruler className="h-4 w-4" />
        {isMeasuring ? "Exit Measure Mode" : "Measure Mode"}
      </Button>

      {selectedProperty && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleSaveProperty}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Property
        </Button>
      )}
    </div>
  );
};
