
import { useState } from "react";

export type FenceType = 
  | "picket" 
  | "privacy" 
  | "chain-link" 
  | "post-rail" 
  | "1.8m butted up with a sleeper"
  | "1.8m butted up and capped with a sleeper"
  | "1.8m lapped"
  | "1.8m lapped and capped"
  | "1.8m lapped with a sleeper"
  | "1.8m lapped and capped with a sleeper"
  | "2.1m butted up"
  | "2.1m butted up and capped"
  | "2.1m butted up with a sleeper"
  | "2.1m butted up and capped with a sleeper"
  | "2.1m lapped"
  | "2.1m lapped and capped"
  | "2.1m lapped with a sleeper"
  | "2.1m lapped and capped with a sleeper";

export type Unit = "meters" | "feet";

export interface FencingResult {
  posts: number;
  panels: number;
  postDiameter: number;
  totalRails?: number;
  railsPerSection?: number;
  concreteAmount?: number;
  palings?: number;
  nails?: number;
  screws?: number;
  rapidSets?: number;
  caps?: number;
  sleepers?: number;
}

interface FencingComponents {
  palings: number;
  panels: number;
  posts: number;
  rails: number;
  nails: number;
  screws: number;
  rapidSets: number;
  caps?: number;
  sleepers?: number;
  postHeight: string;
}

// Fencing components per 10 meters based on fence type
const FENCING_COMPONENTS_PER_10M: Record<string, FencingComponents> = {
  "1.8m butted up with a sleeper": {
    palings: 100,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6,
    sleepers: 5
  },
  "1.8m butted up and capped with a sleeper": {
    palings: 100,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6,
    caps: 3,
    sleepers: 5
  },
  "1.8m lapped": {
    palings: 140,
    panels: 5,
    postHeight: "2.4m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6
  },
  "1.8m lapped and capped": {
    palings: 140,
    panels: 5,
    postHeight: "2.4m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    caps: 3
  },
  "1.8m lapped with a sleeper": {
    palings: 140,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    sleepers: 5
  },
  "1.8m lapped and capped with a sleeper": {
    palings: 140,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    caps: 3,
    sleepers: 5
  },
  "2.1m butted up": {
    palings: 100,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6
  },
  "2.1m butted up and capped": {
    palings: 100,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6,
    caps: 3
  },
  "2.1m butted up with a sleeper": {
    palings: 100,
    panels: 5,
    postHeight: "3m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6,
    sleepers: 5
  },
  "2.1m butted up and capped with a sleeper": {
    palings: 100,
    panels: 5,
    postHeight: "3m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6,
    caps: 3,
    sleepers: 5
  },
  "2.1m lapped": {
    palings: 140,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6
  },
  "2.1m lapped and capped": {
    palings: 140,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    caps: 3
  },
  "2.1m lapped with a sleeper": {
    palings: 140,
    panels: 5,
    postHeight: "3m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    sleepers: 5
  },
  "2.1m lapped and capped with a sleeper": {
    palings: 140,
    panels: 5,
    postHeight: "3m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6,
    caps: 3,
    sleepers: 5
  },
  // Keep the original fence types for backward compatibility
  "picket": {
    palings: 100,
    panels: 5,
    postHeight: "2.4m",
    posts: 6,
    rails: 7,
    nails: 500,
    screws: 30,
    rapidSets: 6
  },
  "privacy": {
    palings: 140,
    panels: 5,
    postHeight: "2.7m",
    posts: 6,
    rails: 7,
    nails: 700,
    screws: 30,
    rapidSets: 6
  },
  "chain-link": {
    palings: 0,
    panels: 5,
    postHeight: "2.4m",
    posts: 6,
    rails: 7,
    nails: 0,
    screws: 30,
    rapidSets: 6
  },
  "post-rail": {
    palings: 0,
    panels: 5,
    postHeight: "2.4m",
    posts: 6,
    rails: 14,
    nails: 0,
    screws: 60,
    rapidSets: 6
  }
};

export const useFencingCalculator = () => {
  const [length, setLength] = useState<number>(0);
  const [postSpacing, setPostSpacing] = useState<number>(2.4);
  const [fenceHeight, setFenceHeight] = useState<string>("1.8");
  const [fenceType, setFenceType] = useState<FenceType>("1.8m lapped");
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

    // Get the components for the selected fence type
    const componentsFor10m = FENCING_COMPONENTS_PER_10M[fenceType];
    
    if (!componentsFor10m) {
      return;
    }

    // Calculate the scaling factor based on actual fence length
    const scalingFactor = fencingLength / 10;
    
    // Calculate the number of posts based on fence length and post spacing
    const sections = Math.ceil(fencingLength / postSpacing);
    const posts = sections + 1 + (gateCount * 2); // Add 2 posts per gate
    
    // Calculate concrete needed (assuming standard post hole)
    const postHoleDiameterInFeet = 8 / 12; // 8 inches converted to feet
    const postHoleDepthInFeet = 2; // 2 feet deep holes

    // Volume of concrete per post in cubic feet
    const concretePerPostCubicFeet = Math.PI * Math.pow(postHoleDiameterInFeet / 2, 2) * postHoleDepthInFeet;
    
    // Convert to 20kg bags (assuming 1 bag ≈ 0.45 cubic feet)
    const concreteBagsPerPost = concretePerPostCubicFeet / 0.45;
    const totalConcreteBags = Math.ceil(concreteBagsPerPost * posts);
    
    // Calculate all materials based on the fence length
    setResult({
      posts,
      panels: Math.ceil(componentsFor10m.panels * scalingFactor),
      postDiameter: fenceType.includes("privacy") ? 6 : 4, // Diameter in inches
      totalRails: Math.ceil(componentsFor10m.rails * scalingFactor),
      concreteAmount: totalConcreteBags,
      palings: Math.ceil(componentsFor10m.palings * scalingFactor),
      nails: Math.ceil(componentsFor10m.nails * scalingFactor),
      screws: Math.ceil(componentsFor10m.screws * scalingFactor),
      rapidSets: Math.ceil(componentsFor10m.rapidSets * scalingFactor),
      ...(componentsFor10m.caps && { caps: Math.ceil(componentsFor10m.caps * scalingFactor) }),
      ...(componentsFor10m.sleepers && { sleepers: Math.ceil(componentsFor10m.sleepers * scalingFactor) })
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
    FENCING_COMPONENTS_PER_10M
  };
};
