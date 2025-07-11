import { useState } from "react";
import { useCalculationHistory } from "@/hooks/use-calculation-history";

export const useConcreteCalculator = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(0);
  const [unit, setUnit] = useState<string>("meters");
  const [thicknessUnit, setThicknessUnit] = useState<string>("mm"); // Add thickness unit state
  const [waste, setWaste] = useState<number>(10); // Default 10% waste
  const [calculatedVolume, setCalculatedVolume] = useState<number | null>(null);

  const { addCalculation } = useCalculationHistory();

  const calculateConcreteVolume = () => {
    if (!length || !width || !thickness) {
      return;
    }

    // Convert all measurements to meters
    let lengthInMeters = length;
    let widthInMeters = width;
    let thicknessInMeters = thickness;

    if (unit === "feet") {
      // Convert feet to meters
      lengthInMeters = length * 0.3048;
      widthInMeters = width * 0.3048;
      // Convert inches to meters
      thicknessInMeters = thickness * 0.0254;
    } else {
      // For metric units, convert thickness based on the thickness unit
      if (thicknessUnit === "mm") {
        thicknessInMeters = thickness / 1000; // mm to meters
      } else {
        thicknessInMeters = thickness; // Already in meters
      }
    }

    // Calculate volume in cubic meters
    let volume = lengthInMeters * widthInMeters * thicknessInMeters;

    // Add waste factor
    if (waste > 0) {
      volume = volume * (1 + waste / 100);
    }

    setCalculatedVolume(volume);

    // Save calculation to history
    addCalculation(
      "Concrete Calculator",
      {
        length,
        width,
        thickness,
        unit,
        thicknessUnit,
        waste
      },
      {
        volume: Number(volume.toFixed(3)),
        lengthInMeters: Number(lengthInMeters.toFixed(2)),
        widthInMeters: Number(widthInMeters.toFixed(2)),
        thicknessInMeters: Number(thicknessInMeters.toFixed(3))
      }
    );
  };

  return {
    length,
    setLength,
    width,
    setWidth,
    thickness,
    setThickness,
    unit,
    setUnit,
    thicknessUnit,
    setThicknessUnit,
    waste,
    setWaste,
    calculatedVolume,
    setCalculatedVolume,
    calculateConcreteVolume,
  };
};
