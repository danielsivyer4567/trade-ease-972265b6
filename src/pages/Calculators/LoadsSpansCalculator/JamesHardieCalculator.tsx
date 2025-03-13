
import React from "react";
import { ProductSelectionCard } from "./components/hardie/ProductSelectionCard";
import { ApplicationDetailsCard } from "./components/hardie/ApplicationDetailsCard";
import { WindLoadCard } from "./components/hardie/WindLoadCard";
import { ResultsCard } from "./components/hardie/ResultsCard";
import { HardieResult } from "./hooks/useJamesHardieCalculator";

interface JamesHardieCalculatorProps {
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
  hardieResult: HardieResult | null;
  setHardieResult: (result: HardieResult | null) => void;
  calculateHardieRequirements: () => void;
}

export const JamesHardieCalculator: React.FC<JamesHardieCalculatorProps> = ({
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
  calculateHardieRequirements
}) => {
  return (
    <>
      <ProductSelectionCard
        productType={productType}
        setProductType={setProductType}
        thickness={thickness}
        setThickness={setThickness}
      />

      <ApplicationDetailsCard
        applicationArea={applicationArea}
        setApplicationArea={setApplicationArea}
        supportSpacing={supportSpacing}
        setSupportSpacing={setSupportSpacing}
      />

      <WindLoadCard
        windLoad={windLoad}
        setWindLoad={setWindLoad}
        calculateHardieRequirements={calculateHardieRequirements}
      />

      <ResultsCard hardieResult={hardieResult} />
    </>
  );
};
