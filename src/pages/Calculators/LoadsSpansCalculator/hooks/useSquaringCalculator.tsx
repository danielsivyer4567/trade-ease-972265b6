
import { useState } from "react";

export interface SquaringResult {
  isSquare: boolean;
  diagonalA: number;
  diagonalB: number;
  difference: number;
  perpendicularDistance?: number;
}

export const useSquaringCalculator = () => {
  const [width, setWidth] = useState<string>("");
  const [length, setLength] = useState<string>("");
  const [diagonalA, setDiagonalA] = useState<string>("");
  const [diagonalB, setDiagonalB] = useState<string>("");
  const [unit, setUnit] = useState<string>("meters");
  const [squaringResult, setSquaringResult] = useState<SquaringResult | null>(null);

  const calculateSquaring = () => {
    const widthNum = parseFloat(width);
    const lengthNum = parseFloat(length);
    const diagonalANum = diagonalA ? parseFloat(diagonalA) : 0;
    const diagonalBNum = diagonalB ? parseFloat(diagonalB) : 0;

    if (!widthNum || !lengthNum) {
      return;
    }

    // Calculate the theoretical diagonal using Pythagorean theorem
    const theoreticalDiagonal = Math.sqrt(Math.pow(widthNum, 2) + Math.pow(lengthNum, 2));
    
    let result: SquaringResult;

    if (diagonalANum && diagonalBNum) {
      // If both diagonals are provided, check if they're equal (indicating a square/rectangle)
      const difference = Math.abs(diagonalANum - diagonalBNum);
      const isSquare = difference <= 0.01; // Allow a small tolerance
      
      result = {
        isSquare,
        diagonalA: diagonalANum,
        diagonalB: diagonalBNum,
        difference,
      };
    } else {
      // If diagonals are not provided, calculate the theoretical diagonal
      result = {
        isSquare: true, // Assuming it's square based on width and length
        diagonalA: theoreticalDiagonal,
        diagonalB: theoreticalDiagonal,
        difference: 0,
      };
    }

    // Calculate perpendicular distance if needed (useful for adjusting)
    if (!result.isSquare) {
      // This is a simplified way to estimate how much to adjust to make it square
      // In reality, this depends on which corner needs adjustment
      result.perpendicularDistance = result.difference / 2;
    }

    setSquaringResult(result);
  };

  const reset = () => {
    setWidth("");
    setLength("");
    setDiagonalA("");
    setDiagonalB("");
    setSquaringResult(null);
  };

  return {
    width,
    setWidth,
    length,
    setLength,
    diagonalA,
    setDiagonalA,
    diagonalB,
    setDiagonalB,
    unit,
    setUnit,
    squaringResult,
    calculateSquaring,
    reset,
  };
};
