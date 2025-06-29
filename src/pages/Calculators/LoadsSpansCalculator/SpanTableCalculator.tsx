import React from "react";
import { MaterialSelectionCard } from "./components/MaterialSelectionCard";
import { DimensionsSpacingCard } from "./components/DimensionsSpacingCard";
import { LoadSpanConfigCard } from "./components/LoadSpanConfigCard";
import { ResultCard } from "./components/ResultCard";

interface SpanTableCalculatorProps {
  material: string;
  setMaterial: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
  spacing: string;
  setSpacing: (value: string) => void;
  load: string;
  setLoad: (value: string) => void;
  spanType: string;
  setSpanType: (value: string) => void;
  spanResult: string | null;
  setSpanResult: (result: string | null) => void;
  getAvailableGrades: () => string[];
  getAvailableDimensions: () => string[];
  calculateSpanFromTable: () => void;
}

export const SpanTableCalculator: React.FC<SpanTableCalculatorProps> = ({
  material,
  setMaterial,
  grade,
  setGrade,
  dimension,
  setDimension,
  spacing,
  setSpacing,
  load,
  setLoad,
  spanType,
  setSpanType,
  spanResult,
  setSpanResult,
  getAvailableGrades,
  getAvailableDimensions,
  calculateSpanFromTable
}) => {
  return (
    <>
      <MaterialSelectionCard
        material={material}
        setMaterial={setMaterial}
        grade={grade}
        setGrade={setGrade}
        getAvailableGrades={getAvailableGrades}
      />

      <DimensionsSpacingCard
        material={material}
        dimension={dimension}
        setDimension={setDimension}
        spacing={spacing}
        setSpacing={setSpacing}
        getAvailableDimensions={getAvailableDimensions}
      />

      <LoadSpanConfigCard
        load={load}
        setLoad={setLoad}
        spanType={spanType}
        setSpanType={setSpanType}
        calculateSpanFromTable={calculateSpanFromTable}
      />

      <ResultCard spanResult={spanResult} />
    </>
  );
};
