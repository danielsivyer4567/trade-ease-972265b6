
import { useState } from "react";

type FenceType = "picket" | "privacy" | "chain-link" | "post-rail";
type Unit = "meters" | "feet";

interface FencingResult {
  posts: number;
  panels: number;
  postDiameter: number;
  totalRails?: number;
  railsPerSection?: number;
  concreteAmount?: number;
}

export const useFencingCalculator = () => {
  const [length, setLength] = useState<number>(0);
  const [postSpacing, setPostSpacing] = useState<number>(2.4);
  const [fenceHeight, setFenceHeight] = useState<string>("1.8");
  const [fenceType, setFenceType] = useState<FenceType>("privacy");
  const [gateWidth, setGateWidth] = useState<number>(1);
  const [gateCount, setGateCount] = useState<number>(0);
  const [unit, setUnit] = useState<Unit>("meters");
  const [result, setResult] = useState<FencingResult | null>(null);

  const calculateFencingMaterials = () => {
    if (!length || !postSpacing) return;

    // Adjust for gates
    const totalGateWidth = gateCount * gateWidth;
    const fencingLength = length - totalGateWidth;
    
    if (fencingLength <= 0) {
      // Handle error: gates are longer than fence
      return;
    }

    // Calculate number of posts (number of sections + 1)
    const sections = Math.ceil(fencingLength / postSpacing);
    const posts = sections + 1 + (gateCount * 2); // Add 2 posts per gate
    
    // Calculate post diameter based on fence type and height
    const heightNum = parseFloat(fenceHeight);
    let postDiameter = 4; // Default diameter in inches
    
    if (heightNum > 6 || fenceType === "privacy") {
      postDiameter = 6;
    }
    
    // Calculate concrete needed (assuming standard post hole)
    const postHoleDiameterInFeet = postDiameter / 12 * 2; // Convert inches to feet and double for hole width
    const postHoleDepthInFeet = (heightNum / 3) + 0.5; // 1/3 of fence height plus 6 inches
    
    // Volume of concrete per post in cubic feet
    const concretePerPostCubicFeet = Math.PI * Math.pow(postHoleDiameterInFeet / 2, 2) * postHoleDepthInFeet;
    
    // Convert to 60 lb bags (1 bag ≈ 0.45 cubic feet)
    const concreteBagsPerPost = concretePerPostCubicFeet / 0.45;
    const totalConcreteBags = Math.ceil(concreteBagsPerPost * posts);
    
    // Rails calculation for post and rail fence
    let railsPerSection;
    let totalRails;
    
    if (fenceType === "post-rail") {
      railsPerSection = heightNum <= 4 ? 2 : 3;
      totalRails = sections * railsPerSection;
    }
    
    setResult({
      posts,
      panels: sections,
      postDiameter,
      ...(railsPerSection && { railsPerSection, totalRails }),
      concreteAmount: totalConcreteBags
    });
  };

  return {
    length,
    setLength,
    postSpacing,
    setPostSpacing,
    fenceHeight,
    setFenceHeight,
    fenceType,
    setFenceType,
    gateWidth,
    setGateWidth,
    gateCount,
    setGateCount,
    unit,
    setUnit,
    calculateFencingMaterials,
    result,
  };
};
