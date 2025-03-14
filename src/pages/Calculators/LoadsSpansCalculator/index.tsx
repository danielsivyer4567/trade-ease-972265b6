
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs } from "@/components/ui/tabs";
import { useBeamCalculator } from "./hooks/useBeamCalculator";
import { useSpanTableCalculator } from "./hooks/useSpanTableCalculator";
import { useJamesHardieCalculator } from "./hooks/useJamesHardieCalculator";
import { useConcreteCalculator } from "./hooks/useConcreteCalculator";
import { useSquaringCalculator } from "./hooks/useSquaringCalculator";
import { useDegreeCalculator } from "./hooks/useDegreeCalculator";
import { useStairsCalculator } from "./hooks/useStairsCalculator";
import { LoadsSpansHeader } from "./components/LoadsSpansHeader";
import { LoadsSpansTabs } from "./components/LoadsSpansTabs";
import {
  BeamCalculatorTab,
  SpanTableTab,
  JamesHardieTab,
  RafterRoofTab,
  ConcreteTab,
  SquaringTab,
  DegreeTab,
  StairsTab,
  AboutTab
} from "./components/TabContents";

const LoadsSpansCalculator = () => {
  // Beam calculator hook
  const beamCalcProps = useBeamCalculator();
  
  // Span table calculator hook
  const spanTableProps = useSpanTableCalculator();
  
  // James Hardie calculator hook
  const hardieProps = useJamesHardieCalculator();
  
  // Concrete calculator hook
  const concreteProps = useConcreteCalculator();

  // Squaring calculator hook
  const squaringProps = useSquaringCalculator();

  // Degree calculator hook
  const degreeProps = useDegreeCalculator();

  // Stairs calculator hook
  const stairsProps = useStairsCalculator();

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <LoadsSpansHeader />

        <Tabs defaultValue="beam-calculator" className="w-full">
          <LoadsSpansTabs />

          <BeamCalculatorTab {...beamCalcProps} />
          <SpanTableTab {...spanTableProps} />
          <JamesHardieTab {...hardieProps} />
          <RafterRoofTab />
          <ConcreteTab {...concreteProps} />
          <SquaringTab {...squaringProps} />
          <DegreeTab {...degreeProps} />
          <StairsTab {...stairsProps} />
          <AboutTab />
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LoadsSpansCalculator;
