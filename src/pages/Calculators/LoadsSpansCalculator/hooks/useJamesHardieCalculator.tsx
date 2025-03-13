
import { useState } from "react";
import { HARDIE_PRODUCT_TYPES } from "../constants";
import { useToast } from "@/hooks/use-toast";

export interface HardieResult {
  fastenerType: string;
  fastenerSpacing: number;
  maxSupportSpacing: number;
  notes: string;
}

export const useJamesHardieCalculator = () => {
  const [productType, setProductType] = useState("HardiePlank®");
  const [thickness, setThickness] = useState("6mm");
  const [applicationArea, setApplicationArea] = useState("Exterior Wall");
  const [supportSpacing, setSupportSpacing] = useState("600");
  const [windLoad, setWindLoad] = useState("2.5");
  const [hardieResult, setHardieResult] = useState<HardieResult | null>(null);
  
  const { toast } = useToast();

  const calculateHardieRequirements = () => {
    try {
      // Get product details
      const selectedProduct = HARDIE_PRODUCT_TYPES.find(p => p.name === productType) || HARDIE_PRODUCT_TYPES[0];
      const thicknessValue = parseInt(thickness);
      const spacingValue = parseInt(supportSpacing);
      const windLoadValue = parseFloat(windLoad);
      
      // Basic calculation for fastener spacing based on wind load
      // Higher wind loads require closer fastener spacing
      let fastenerSpacing = 200; // Default
      if (windLoadValue <= 1.5) {
        fastenerSpacing = 300;
      } else if (windLoadValue <= 2.5) {
        fastenerSpacing = 250;
      } else if (windLoadValue <= 4.0) {
        fastenerSpacing = 200;
      } else {
        fastenerSpacing = 150;
      }
      
      // Adjust based on thickness and product type
      if (thicknessValue >= 9) {
        fastenerSpacing += 50; // Thicker products can have wider fastener spacing
      }
      
      // Determine fastener type based on product and application
      let fastenerType = "Galvanized Nails";
      if (selectedProduct.premium) {
        fastenerType = "Stainless Steel Screws";
      } else if (applicationArea === "Wet Areas") {
        fastenerType = "Stainless Steel Nails";
      }
      
      // Calculate maximum support spacing
      // For thin products, limit max support spacing
      let maxSupportSpacing = spacingValue;
      const calculatedMaxSpacing = 900 - (windLoadValue * 100);
      
      if (thicknessValue <= 6 && calculatedMaxSpacing < spacingValue) {
        maxSupportSpacing = Math.max(150, calculatedMaxSpacing);
      }
      
      // Installation notes based on the product and application
      let notes = `Install ${selectedProduct.name} with ${fastenerType} at ${fastenerSpacing}mm fastener spacing.`;
      
      if (applicationArea === "Wet Areas") {
        notes += " Ensure all joints are sealed with waterproof sealant.";
      }
      
      if (windLoadValue > 4.0) {
        notes += " For high wind areas, additional reinforcement may be required at corners.";
      }
      
      setHardieResult({
        fastenerType,
        fastenerSpacing,
        maxSupportSpacing,
        notes
      });
      
      toast({
        title: "Calculation Complete",
        description: "James Hardie requirements have been calculated",
      });
    } catch (error) {
      console.error("Error in James Hardie calculation:", error);
      toast({
        title: "Calculation Error",
        description: "There was an error calculating requirements. Please check your inputs.",
        variant: "destructive"
      });
    }
  };

  return {
    productType,
    setProductType,
    thickness,
    setThickness,
    applicationArea,
    setApplicationArea,
    supportSpacing,
    setSupportSpacing,
    windLoad,
    setWindLoad,
    hardieResult,
    setHardieResult,
    calculateHardieRequirements
  };
};
