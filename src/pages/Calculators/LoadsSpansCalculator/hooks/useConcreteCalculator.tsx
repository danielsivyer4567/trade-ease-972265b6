
import { useState } from "react";

export const useConcreteCalculator = () => {
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [thickness, setThickness] = useState<number>(0);
  const [unit, setUnit] = useState<string>("meters");
  const [waste, setWaste] = useState<number>(10); // Default 10% waste
  const [calculatedVolume, setCalculatedVolume] = useState<number | null>(null);

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
      // Convert mm to meters
      thicknessInMeters = thickness / 1000;
    }

    // Calculate volume in cubic meters
    let volume = lengthInMeters * widthInMeters * thicknessInMeters;

    // Add waste factor
    if (waste > 0) {
      volume = volume * (1 + waste / 100);
    }

    setCalculatedVolume(volume);
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
    waste,
    setWaste,
    calculatedVolume,
    setCalculatedVolume,
    calculateConcreteVolume,
  };
};
