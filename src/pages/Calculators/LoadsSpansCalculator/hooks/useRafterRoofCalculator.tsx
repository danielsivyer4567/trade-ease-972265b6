
import { useState } from "react";
import { RoofSection } from "../types/rafterRoof";

export const useRafterRoofCalculator = () => {
  const [sections, setSections] = useState<RoofSection[]>([
    { height: "3", length: "2.4", area: 7.2 },
    { height: "2.5", length: "9.55", area: 23.875 }
  ]);
  const [totalArea, setTotalArea] = useState<number>(0);

  const addSection = () => {
    setSections([...sections, { height: "", length: "", area: 0 }]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index: number, field: 'height' | 'length', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    
    // Calculate area if both height and length have values
    if (newSections[index].height && newSections[index].length) {
      const height = parseFloat(newSections[index].height);
      const length = parseFloat(newSections[index].length);
      if (!isNaN(height) && !isNaN(length)) {
        newSections[index].area = height * length;
      }
    }
    
    setSections(newSections);
  };

  const calculateTotalArea = () => {
    const total = sections.reduce((sum, section) => sum + section.area, 0);
    setTotalArea(total);
    return total;
  };

  return {
    sections,
    totalArea,
    addSection,
    removeSection,
    updateSection,
    calculateTotalArea,
    setTotalArea
  };
};
