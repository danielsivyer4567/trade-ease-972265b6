import React from "react";
import { SpanTableCalculator } from "../SpanTableCalculator";
import { BeamCalculator } from "../BeamCalculator";
import { RafterRoofCalculator } from "../RafterRoofCalculator";
import { ConcreteCalculator } from "../ConcreteCalculator";
import { SquaringCalculator } from "../SquaringCalculator";
import { DegreeCalculator } from "../DegreeCalculator";
import { StairsCalculator } from "../StairsCalculator";
import { DeckingCalculator } from "../DeckingCalculator";
import { JamesHardieCalculator } from "../JamesHardieCalculator";
import { useSpanTableCalculator } from "../hooks/useSpanTableCalculator";
import { useBeamCalculator } from "../hooks/useBeamCalculator";
import { useConcreteCalculator } from "../hooks/useConcreteCalculator";
import { useSquaringCalculator } from "../hooks/useSquaringCalculator";
import { useDegreeCalculator } from "../hooks/useDegreeCalculator";
import { useStairsCalculator } from "../hooks/useStairsCalculator";
import { useJamesHardieCalculator } from "../hooks/useJamesHardieCalculator";

interface TabContentsProps {
  tabId: string;
}

export const TabContents: React.FC<TabContentsProps> = ({ tabId }) => {
  // Use all the necessary hooks for each calculator
  const spanTableCalculatorProps = useSpanTableCalculator();
  const beamCalculatorProps = useBeamCalculator();
  const concreteCalculatorProps = useConcreteCalculator();
  const squaringCalculatorProps = useSquaringCalculator();
  const degreeCalculatorProps = useDegreeCalculator();
  const stairsCalculatorProps = useStairsCalculator();
  const hardieCalculatorProps = useJamesHardieCalculator();

  // Render the appropriate calculator based on tabId
  switch (tabId) {
    case "beam":
      return <BeamCalculator {...beamCalculatorProps} />;
    case "joist":
      return <SpanTableCalculator {...spanTableCalculatorProps} />;
    case "rafter":
      return <RafterRoofCalculator />;
    case "concrete":
      return <ConcreteCalculator {...concreteCalculatorProps} />;
    case "squaring":
      return <SquaringCalculator {...squaringCalculatorProps} />;
    case "degrees":
      return <DegreeCalculator {...degreeCalculatorProps} />;
    case "stairs":
      return <StairsCalculator {...stairsCalculatorProps} />;
    case "decking":
      return <DeckingCalculator />;
    case "hardie":
      return <JamesHardieCalculator {...hardieCalculatorProps} />;
    default:
      return (
        <div className="p-6 text-center text-gray-500">
          Select a calculator from the tabs above.
        </div>
      );
  }
};
