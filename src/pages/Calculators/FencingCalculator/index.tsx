
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { useFencingCalculator } from "./hooks/useFencingCalculator";
import { FencingHeader } from "./components/FencingHeader";
import { FencingInputForm } from "./components/FencingInputForm";
import { FencingResultsCard } from "./components/FencingResultsCard";
import { FencingReferenceTable } from "./components/FencingReferenceTable";
import { FencingTips } from "./components/FencingTips";
import { GateCalculator } from "./components/GateCalculator";

const FencingCalculator = () => {
  const {
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
  } = useFencingCalculator();

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <FencingHeader />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Card */}
          <FencingInputForm 
            length={length}
            setLength={setLength}
            postSpacing={postSpacing}
            setPostSpacing={setPostSpacing}
            fenceType={fenceType}
            setFenceType={setFenceType}
            gateWidth={gateWidth}
            setGateWidth={setGateWidth}
            gateCount={gateCount}
            setGateCount={setGateCount}
            unit={unit}
            setUnit={setUnit}
            calculateFencingMaterials={calculateFencingMaterials}
          />

          {/* Results Card */}
          <FencingResultsCard 
            result={result}
            fenceType={fenceType}
            FENCING_COMPONENTS_PER_10M={FENCING_COMPONENTS_PER_10M}
            gateCount={gateCount}
          />
        </div>

        {/* Gate Calculator */}
        <GateCalculator unit={unit} />

        {/* Fence Types Reference Table */}
        <FencingReferenceTable FENCING_COMPONENTS_PER_10M={FENCING_COMPONENTS_PER_10M} />

        {/* Tips and Considerations Card */}
        <FencingTips />
      </div>
    </AppLayout>
  );
};

export default FencingCalculator;
