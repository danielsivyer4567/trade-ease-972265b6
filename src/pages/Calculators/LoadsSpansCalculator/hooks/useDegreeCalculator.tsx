import { useState } from "react";
import { useCalculationHistory } from "@/hooks/use-calculation-history";

export interface DegreeCalculatorResult {
  degrees: number;
  radians: number;
  gradient: number;
  percentage: number;
}

export type CalculationType = "adjacent-opposite" | "rise-run" | "percentage" | "gradient";

export const useDegreeCalculator = () => {
  const [calculationType, setCalculationType] = useState<CalculationType>("adjacent-opposite");
  const [adjacent, setAdjacent] = useState<string>("");
  const [opposite, setOpposite] = useState<string>("");
  const [rise, setRise] = useState<string>("");
  const [run, setRun] = useState<string>("");
  const [percentage, setPercentage] = useState<string>("");
  const [gradient, setGradient] = useState<string>("");
  const [unit, setUnit] = useState<string>("meters");
  const [result, setResult] = useState<DegreeCalculatorResult | null>(null);

  const { addCalculation } = useCalculationHistory();

  const calculateAngle = () => {
    let degrees = 0;

    switch (calculationType) {
      case "adjacent-opposite":
        // Calculate angle using arctangent (opposite/adjacent)
        if (adjacent && opposite) {
          const adjacentValue = parseFloat(adjacent);
          const oppositeValue = parseFloat(opposite);
          if (adjacentValue === 0) return;
          
          degrees = Math.atan(oppositeValue / adjacentValue) * (180 / Math.PI);
        }
        break;
      
      case "rise-run":
        // Rise over run calculation (similar to opposite/adjacent)
        if (rise && run) {
          const riseValue = parseFloat(rise);
          const runValue = parseFloat(run);
          if (runValue === 0) return;
          
          degrees = Math.atan(riseValue / runValue) * (180 / Math.PI);
        }
        break;
      
      case "percentage":
        // Percentage slope to angle
        if (percentage) {
          const percentageValue = parseFloat(percentage);
          degrees = Math.atan(percentageValue / 100) * (180 / Math.PI);
        }
        break;
      
      case "gradient":
        // Gradient to angle (1:x)
        if (gradient) {
          const gradientValue = parseFloat(gradient);
          if (gradientValue === 0) return;
          
          degrees = Math.atan(1 / gradientValue) * (180 / Math.PI);
        }
        break;
      
      default:
        return;
    }

    // Ensure we have a positive angle
    if (degrees < 0) {
      degrees += 180;
    }

    // Calculate related values
    const radians = degrees * (Math.PI / 180);
    const gradientValue = Math.tan(radians) !== 0 ? 1 / Math.tan(radians) : 0;
    const percentageValue = Math.tan(radians) * 100;

    const calculationResult = {
      degrees,
      radians,
      gradient: gradientValue,
      percentage: percentageValue
    };

    setResult(calculationResult);

    // Save calculation to history
    addCalculation(
      "Degrees Calculator",
      {
        calculationType,
        adjacent: adjacent || null,
        opposite: opposite || null,
        rise: rise || null,
        run: run || null,
        percentage: percentage || null,
        gradient: gradient || null,
        unit: unit
      },
      calculationResult
    );
  };

  const reset = () => {
    setAdjacent("");
    setOpposite("");
    setRise("");
    setRun("");
    setPercentage("");
    setGradient("");
    setResult(null);
  };

  return {
    calculationType,
    setCalculationType,
    adjacent,
    setAdjacent,
    opposite,
    setOpposite,
    rise,
    setRise,
    run,
    setRun,
    percentage,
    setPercentage,
    gradient,
    setGradient,
    unit,
    setUnit,
    result,
    calculateAngle,
    reset
  };
};
