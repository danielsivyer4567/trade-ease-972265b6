
import { useState } from "react";
import { HARDIE_PRODUCT_TYPES, WIND_LOAD_CATEGORIES } from "../constants";

export interface HardieResult {
  fastenerType: string;
  fastenerSpacing: number;
  maxSupportSpacing: number;
  notes: string;
  fireRating: string;
  bushfireRating: string;
  soundRating: number;
  thermalRValue: number;
  applicationArea: string;
  windLoad: string;
}

export const useJamesHardieCalculator = () => {
  const [productType, setProductType] = useState(HARDIE_PRODUCT_TYPES[0]?.name || "HardiePlank");
  const [thickness, setThickness] = useState("6mm");
  const [applicationArea, setApplicationArea] = useState("Interior Wall");
  const [supportSpacing, setSupportSpacing] = useState("450");
  const [windLoad, setWindLoad] = useState(WIND_LOAD_CATEGORIES[0]?.kPa.toString() || "0.5");
  const [hardieResult, setHardieResult] = useState<HardieResult | null>(null);

  const calculateHardieRequirements = () => {
    // Basic validation
    if (!productType || !thickness || !applicationArea || !supportSpacing || !windLoad) {
      return;
    }

    // Convert inputs to numbers for calculations
    const spacingNum = parseFloat(supportSpacing);
    const windLoadNum = parseFloat(windLoad);
    
    // Determine fastener type based on product and application
    let fastenerType = "Countersunk Screws";
    if (productType.includes("Plank") || productType.includes("Panel")) {
      fastenerType = "Galvanized Nails";
    }
    if (applicationArea === "Wet Areas") {
      fastenerType = "Stainless Steel Screws";
    }
    if (windLoadNum > 2.5) {
      fastenerType = "High-Wind Rated Screws";
    }
    
    // Calculate fastener spacing based on wind load
    let fastenerSpacing = 200;
    if (windLoadNum < 1.0) {
      fastenerSpacing = 300;
    } else if (windLoadNum > 3.0) {
      fastenerSpacing = 150;
    }
    
    // Determine max support spacing based on thickness and application
    let maxSupportSpacing = spacingNum;
    if (thickness === "6mm" && spacingNum > 450) {
      maxSupportSpacing = 450;
    }
    if (thickness === "9mm" && spacingNum > 600) {
      maxSupportSpacing = 600;
    }
    
    // Basic fire rating based on thickness
    const fireRating = thickness === "6mm" ? "30 minutes" :
                      thickness === "9mm" ? "60 minutes" :
                      thickness === "12mm" ? "90 minutes" :
                      "120 minutes";
    
    // Bushfire rating
    const bushfireRating = thickness === "6mm" ? "BAL-12.5" :
                           thickness === "9mm" ? "BAL-29" :
                           "BAL-40";
    
    // Sound rating increases with thickness
    const soundRating = 30 + (parseInt(thickness) * 0.5);
    
    // Thermal R-value based on thickness
    const thermalRValue = 0.04 + (parseInt(thickness) * 0.01);
    
    // Prepare usage notes
    let notes = `Install ${productType} with ${fastenerType} at ${fastenerSpacing}mm centers.`;
    if (applicationArea === "Wet Areas") {
      notes += " Use waterproofing membrane behind sheets in wet areas.";
    }
    if (windLoadNum > 2.5) {
      notes += " Additional bracing recommended for high wind areas.";
    }
    
    // Set the result
    setHardieResult({
      fastenerType,
      fastenerSpacing,
      maxSupportSpacing,
      notes,
      fireRating,
      bushfireRating,
      soundRating,
      thermalRValue,
      applicationArea,
      windLoad: windLoadNum.toString()
    });
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
