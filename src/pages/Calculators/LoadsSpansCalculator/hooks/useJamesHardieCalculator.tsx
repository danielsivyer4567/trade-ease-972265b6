
import { useState } from "react";
import { 
  HARDIE_PRODUCT_TYPES, 
  HARDIE_THICKNESSES, 
  HARDIE_APPLICATION_AREAS,
  HARDIE_TECHNICAL_PROPERTIES,
  HARDIE_FASTENER_TYPES,
  WIND_LOAD_CATEGORIES
} from "../constants";
import { useToast } from "@/hooks/use-toast";

export interface HardieResult {
  fastenerType: string;
  fastenerSpacing: number;
  maxSupportSpacing: number;
  notes: string;
  soundRating: number;
  fireRating: string;
  bushfireRating: string;
  thermalRValue: number;
  densityRating: string;
  applicationArea: string;
  windLoad: string;
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
      
      // Adjust based on thickness
      if (thicknessValue >= 9) {
        fastenerSpacing += 50; // Thicker products can have wider fastener spacing
      }
      
      // Determine fastener type based on product and application
      let fastenerType = "Galvanized Nails";
      const suitableFasteners = HARDIE_FASTENER_TYPES.filter(f => 
        f.applications.includes(applicationArea)
      );
      
      if (applicationArea === "Wet Areas" || windLoadValue > 2.1) {
        fastenerType = "Stainless Steel Screws";
      } else if (selectedProduct.premium) {
        fastenerType = "Countersunk Screws";
      } else if (suitableFasteners.length > 0) {
        fastenerType = suitableFasteners[0].name;
      }
      
      // Calculate maximum support spacing
      // For thin products, limit max support spacing
      let maxSupportSpacing = spacingValue;
      const calculatedMaxSpacing = 900 - (windLoadValue * 100);
      
      if (thicknessValue <= 6 && calculatedMaxSpacing < spacingValue) {
        maxSupportSpacing = Math.max(150, calculatedMaxSpacing);
      }
      
      // Get technical specifications
      const soundRating = HARDIE_TECHNICAL_PROPERTIES.soundReduction[thickness as keyof typeof HARDIE_TECHNICAL_PROPERTIES.soundReduction] || 25;
      const bushfireRating = HARDIE_TECHNICAL_PROPERTIES.bushfireRating[thickness as keyof typeof HARDIE_TECHNICAL_PROPERTIES.bushfireRating] || "BAL-12.5";
      const thermalRValue = HARDIE_TECHNICAL_PROPERTIES.thermalConductivity;
      
      // Density rating
      let densityRating = "Standard";
      if (thicknessValue >= 12) {
        densityRating = "High";
      } else if (thicknessValue <= 6) {
        densityRating = "Light";
      }
      
      // Fire rating
      let fireRating = "Non-combustible (AS 1530.1)";
      if (thicknessValue >= 12) {
        fireRating = "Up to 60/60/60 fire rating";
      } else if (thicknessValue >= 9) {
        fireRating = "Up to 30/30/30 fire rating";
      }
      
      // Installation notes based on the product and application
      let notes = `Install ${selectedProduct.name} with ${fastenerType} at ${fastenerSpacing}mm fastener spacing.`;
      
      // Application-specific notes
      if (applicationArea === "Wet Areas") {
        notes += " Ensure all joints are sealed with waterproof sealant to meet AS 3740 requirements.";
      } else if (applicationArea === "Flooring") {
        const loadCapacity = HARDIE_TECHNICAL_PROPERTIES.loadCapacity.Flooring[thickness as keyof typeof HARDIE_TECHNICAL_PROPERTIES.loadCapacity.Flooring];
        notes += loadCapacity 
          ? ` Suitable for loads up to ${loadCapacity} kPa.` 
          : " Not recommended for heavy load-bearing applications.";
      }
      
      // Wind load notes
      if (windLoadValue > 3.0) {
        notes += " For high wind areas, additional reinforcement may be required at corners and edges.";
        
        // Find matching wind load category
        const windCategory = WIND_LOAD_CATEGORIES.find(w => Math.abs(w.kPa - windLoadValue) < 0.3);
        if (windCategory) {
          notes += ` Meets ${windCategory.name} wind load category (${windCategory.description}).`;
        }
      }
      
      // Add thermal and acoustic notes for relevant applications
      if (applicationArea === "Interior Wall" || applicationArea === "Exterior Wall") {
        notes += ` Provides sound reduction of approximately ${soundRating}dB (STC).`;
      }
      
      setHardieResult({
        fastenerType,
        fastenerSpacing,
        maxSupportSpacing,
        notes,
        soundRating,
        fireRating,
        bushfireRating,
        thermalRValue,
        densityRating,
        applicationArea,
        windLoad
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
