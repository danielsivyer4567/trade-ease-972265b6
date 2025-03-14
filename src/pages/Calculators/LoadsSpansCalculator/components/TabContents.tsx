
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { BeamCalculator } from "../BeamCalculator";
import { SpanTableCalculator } from "../SpanTableCalculator";
import { AboutCalculator } from "../AboutCalculator";
import { JamesHardieCalculator } from "../JamesHardieCalculator";
import { RafterRoofCalculator } from "../RafterRoofCalculator";
import { ConcreteCalculator } from "../ConcreteCalculator";
import { SquaringCalculator } from "../SquaringCalculator";
import { DegreeCalculator } from "../DegreeCalculator";
import { StairsCalculator } from "../StairsCalculator";
import { CalculationResult } from "../hooks/useBeamCalculator";

// Props for the BeamCalculatorTab component
interface BeamCalculatorTabProps {
  beamWidth: string;
  setBeamWidth: (value: string) => void;
  beamDepth: string;
  setBeamDepth: (value: string) => void;
  woodType: string;
  setWoodType: (value: string) => void;
  loadType: string;
  setLoadType: (value: string) => void;
  span: string;
  setSpan: (value: string) => void;
  calculatedResult: CalculationResult | null;
  setCalculatedResult: (result: CalculationResult | null) => void;
  calculateStress: () => void;
}

export const BeamCalculatorTab: React.FC<BeamCalculatorTabProps> = (props) => {
  return (
    <TabsContent value="beam-calculator" className="space-y-6">
      <BeamCalculator {...props} />
    </TabsContent>
  );
};

// Props for the SpanTableTab component
interface SpanTableTabProps {
  material: string;
  setMaterial: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
  spacing: string;
  setSpacing: (value: string) => void;
  load: string;
  setLoad: (value: string) => void;
  spanType: string;
  setSpanType: (value: string) => void;
  spanResult: string | null;
  setSpanResult: (result: string | null) => void;
  getAvailableGrades: () => string[];
  getAvailableDimensions: () => string[];
  calculateSpanFromTable: () => void;
}

export const SpanTableTab: React.FC<SpanTableTabProps> = (props) => {
  return (
    <TabsContent value="span-table" className="space-y-6">
      <SpanTableCalculator {...props} />
    </TabsContent>
  );
};

// Props for the JamesHardieTab component
interface JamesHardieTabProps {
  productType: string;
  setProductType: (value: string) => void;
  thickness: string;
  setThickness: (value: string) => void;
  applicationArea: string;
  setApplicationArea: (value: string) => void;
  supportSpacing: string;
  setSupportSpacing: (value: string) => void;
  windLoad: string;
  setWindLoad: (value: string) => void;
  hardieResult: any;
  setHardieResult: (result: any) => void;
  calculateHardieRequirements: () => void;
}

export const JamesHardieTab: React.FC<JamesHardieTabProps> = (props) => {
  return (
    <TabsContent value="james-hardie" className="space-y-6">
      <JamesHardieCalculator {...props} />
    </TabsContent>
  );
};

// Rafter Roof Tab
export const RafterRoofTab: React.FC = () => {
  return (
    <TabsContent value="rafter-roof" className="space-y-6">
      <RafterRoofCalculator />
    </TabsContent>
  );
};

// Props for the ConcreteTab component
interface ConcreteTabProps {
  length: number;
  setLength: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  thickness: number;
  setThickness: (value: number) => void;
  unit: string;
  setUnit: (value: string) => void;
  thicknessUnit: string;
  setThicknessUnit: (value: string) => void;
  waste: number;
  setWaste: (value: number) => void;
  calculatedVolume: number | null;
  calculateConcreteVolume: () => void;
}

export const ConcreteTab: React.FC<ConcreteTabProps> = (props) => {
  return (
    <TabsContent value="concrete" className="space-y-6">
      <ConcreteCalculator {...props} />
    </TabsContent>
  );
};

// Props for the SquaringTab component
interface SquaringTabProps {
  width: string;
  setWidth: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  diagonalA: string;
  setDiagonalA: (value: string) => void;
  diagonalB: string;
  setDiagonalB: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  squaringResult: any;
  calculateSquaring: () => void;
  reset: () => void;
}

export const SquaringTab: React.FC<SquaringTabProps> = (props) => {
  return (
    <TabsContent value="squaring" className="space-y-6">
      <SquaringCalculator {...props} />
    </TabsContent>
  );
};

// Props for the DegreeTab component
interface DegreeTabProps {
  calculationType: string;
  setCalculationType: (type: any) => void;
  adjacent: string;
  setAdjacent: (value: string) => void;
  opposite: string;
  setOpposite: (value: string) => void;
  rise: string;
  setRise: (value: string) => void;
  run: string;
  setRun: (value: string) => void;
  percentage: string;
  setPercentage: (value: string) => void;
  gradient: string;
  setGradient: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  result: any;
  calculateAngle: () => void;
  reset: () => void;
}

export const DegreeTab: React.FC<DegreeTabProps> = (props) => {
  return (
    <TabsContent value="degree" className="space-y-6">
      <DegreeCalculator {...props} />
    </TabsContent>
  );
};

// Props for the StairsTab component
interface StairsTabProps {
  totalRise: string;
  setTotalRise: (value: string) => void;
  floorToFloor: string;
  setFloorToFloor: (value: string) => void;
  availableRun: string;
  setAvailableRun: (value: string) => void;
  stairType: string;
  setStairType: (value: string) => void;
  targetRiser: string;
  setTargetRiser: (value: string) => void;
  targetTread: string;
  setTargetTread: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  headroomHeight: string;
  setHeadroomHeight: (value: string) => void;
  result: any;
  calculateStairs: () => void;
  resetStairs: () => void;
}

export const StairsTab: React.FC<StairsTabProps> = (props) => {
  return (
    <TabsContent value="stairs" className="space-y-6">
      <StairsCalculator {...props} />
    </TabsContent>
  );
};

// About Tab
export const AboutTab: React.FC = () => {
  return (
    <TabsContent value="about">
      <AboutCalculator />
    </TabsContent>
  );
};
