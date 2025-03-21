
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs } from "@/components/ui/tabs";
import { useBeamCalculator } from "../hooks/useBeamCalculator";
import { useSpanTableCalculator } from "../hooks/useSpanTableCalculator";
import { useJamesHardieCalculator } from "../hooks/useJamesHardieCalculator";
import { useConcreteCalculator } from "../hooks/useConcreteCalculator";
import { useSquaringCalculator } from "../hooks/useSquaringCalculator";
import { useDegreeCalculator } from "../hooks/useDegreeCalculator";
import { useStairsCalculator } from "../hooks/useStairsCalculator";
import { LoadsSpansHeader } from "./LoadsSpansHeader";
import { LoadsSpansTabs } from "./LoadsSpansTabs";
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
} from "./TabContents";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

const LoadsSpansCalculator = () => {
  // Get URL params to set the active tab if specified
  const [searchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  
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

  // Set default tab based on URL parameter if present
  const defaultTab = tabParam && [
    'beam-calculator', 'span-table', 'james-hardie', 'rafter-roof', 
    'concrete', 'squaring', 'degree', 'stairs', 'about'
  ].includes(tabParam) ? tabParam : 'beam-calculator';

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <LoadsSpansHeader />

        <Tabs defaultValue={defaultTab} className="w-full">
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
