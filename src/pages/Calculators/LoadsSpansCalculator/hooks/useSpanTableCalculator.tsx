import { useState } from "react";
import { 
  SPAN_TABLE, 
  MATERIAL_GRADES, 
  MATERIAL_DIMENSIONS,
} from "../constants";
import { useToast } from "@/hooks/use-toast";

export const useSpanTableCalculator = () => {
  const [material, setMaterial] = useState("Timber");
  const [grade, setGrade] = useState("MGP10");
  const [dimension, setDimension] = useState("140x45");
  const [spacing, setSpacing] = useState("450mm");
  const [load, setLoad] = useState("2.0");
  const [spanType, setSpanType] = useState("Single span");
  const [spanResult, setSpanResult] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Helper function to get available grades for a material
  const getAvailableGrades = () => {
    return MATERIAL_GRADES[material as keyof typeof MATERIAL_GRADES] || [];
  };

  // Helper function to get available dimensions for a material and grade
  const getAvailableDimensions = () => {
    if (!material || !grade) return [];
    
    return (
      MATERIAL_DIMENSIONS[material as keyof typeof MATERIAL_DIMENSIONS]?.[
        grade as keyof (typeof MATERIAL_DIMENSIONS)[keyof typeof MATERIAL_DIMENSIONS]
      ] || []
    );
  };

  // Function to calculate span from the span table
  const calculateSpanFromTable = () => {
    try {
      // For James Hardie material, the grade is the thickness (e.g., "10mm")
      // and the dimension is directly the spacing (since there is no width)
      let lookupGrade = grade;
      let lookupDimension = dimension;
      const lookupSpacing = spacing;
      
      if (material === "James Hardie") {
        lookupGrade = grade; // Already in correct format (e.g., "10mm")
        lookupDimension = spacing; // For James Hardie, we use spacing directly
      }
      
      const spanValue = SPAN_TABLE[material]?.[lookupGrade]?.[lookupDimension]?.[lookupSpacing];
      
      if (spanValue !== undefined) {
        // Apply some basic adjustments based on span type
        let adjustedSpan = spanValue;
        if (spanType === "Continuous span") {
          adjustedSpan = spanValue * 1.25; // 25% increase for continuous spans
        } else if (spanType === "Cantilever") {
          adjustedSpan = spanValue * 0.4; // 60% decrease for cantilevers
        }
        
        // Apply load adjustment (simplified)
        const loadValue = parseFloat(load);
        const loadFactor = 2.0 / Math.max(loadValue, 0.5); // Base is 2.0 kPa
        adjustedSpan = adjustedSpan * Math.min(loadFactor, 1.5); // Cap the adjustment
        
        setSpanResult(`Maximum allowable span: ${adjustedSpan.toFixed(2)} meters`);
      } else {
        setSpanResult("Invalid combination of materials and dimensions");
      }
    } catch (error) {
      console.error("Error in span calculation:", error);
      setSpanResult("Error in calculation. Please check your inputs.");
    }
    
    toast({
      title: "Span Calculation Complete",
      description: "Maximum allowable span has been calculated",
    });
  };

  return {
    material,
    setMaterial,
    grade,
    setGrade,
    dimension,
    setDimension,
    spacing,
    setSpacing,
    load,
    setLoad,
    spanType,
    setSpanType,
    spanResult,
    setSpanResult,
    getAvailableGrades,
    getAvailableDimensions,
    calculateSpanFromTable
  };
};
