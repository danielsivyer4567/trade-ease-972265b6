import React from "react";
import { BeamCalculator } from "../BeamCalculator";
import { RafterRoofCalculator } from "../RafterRoofCalculator";
import { ConcreteCalculator } from "../ConcreteCalculator";
import { SquaringCalculator } from "../SquaringCalculator";
import { DegreeCalculator } from "../DegreeCalculator";
import { StairsCalculator } from "../StairsCalculator";
import { DeckingCalculator } from "../DeckingCalculator";
import { JamesHardieCalculator } from "../JamesHardieCalculator";
import { useBeamCalculator } from "../hooks/useBeamCalculator";
import { useConcreteCalculator } from "../hooks/useConcreteCalculator";
import { useSquaringCalculator } from "../hooks/useSquaringCalculator";
import { useDegreeCalculator } from "../hooks/useDegreeCalculator";
import { useStairsCalculator } from "../hooks/useStairsCalculator";
import { useJamesHardieCalculator } from "../hooks/useJamesHardieCalculator";
import { useCalculationHistory } from "@/hooks/use-calculation-history";
import { CalculationHistory } from "@/components/ui/CalculationHistory";



interface TabContentsProps {
  tabId: string;
}

export const TabContents: React.FC<TabContentsProps> = ({ tabId }) => {
  // Use calculation history hook
  const { calculations, addCalculation, deleteCalculation, clearHistory } = useCalculationHistory();
  
  // Use all the necessary hooks for each calculator
  const beamCalculatorProps = useBeamCalculator();
  const concreteCalculatorProps = useConcreteCalculator();
  const squaringCalculatorProps = useSquaringCalculator();
  const degreeCalculatorProps = useDegreeCalculator();
  const stairsCalculatorProps = useStairsCalculator();
  const hardieCalculatorProps = useJamesHardieCalculator();

  // Filter calculations for current calculator type
  const getCalculatorTypeName = (tabId: string) => {
    const typeMap: Record<string, string> = {
      "beam": "Beam Calculator",
      "rafter": "Rafter & Roof Calculator",
      "concrete": "Concrete Calculator",
      "squaring": "Squaring Calculator",
      "degrees": "Degrees Calculator",
      "stairs": "Stairs Calculator",
      "decking": "Decking Calculator",
      "hardie": "James Hardie Calculator"
    };
    return typeMap[tabId] || "Calculator";
  };

  const currentCalculatorType = getCalculatorTypeName(tabId);
  const relevantCalculations = calculations
    .filter(calc => calc.calculatorType === currentCalculatorType)
    .slice(0, 5); // Show only last 5 calculations

  const handleRestoreCalculation = (calculation: any) => {
    // This will be implemented per calculator to restore specific values
    console.log("Restoring calculation:", calculation);
  };



  // Render the appropriate calculator based on tabId
  const renderCalculator = () => {
    switch (tabId) {
      case "beam":
        return <BeamCalculator {...beamCalculatorProps} />;
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

  return (
    <div className="space-y-6">
      {/* Calculator Content */}
      <div>
        {renderCalculator()}
      </div>
      
      {/* Calculation History */}
      {relevantCalculations.length > 0 && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Recent Calculations</h3>
          <CalculationHistory 
            calculations={relevantCalculations}
            onDelete={deleteCalculation}
            onRestore={handleRestoreCalculation}
          />
        </div>
      )}
    </div>
  );
};
