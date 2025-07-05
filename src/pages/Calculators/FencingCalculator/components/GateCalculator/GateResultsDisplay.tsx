import React from "react";

interface GateResultsDisplayProps {
  calculationResult: Record<string, number | string> | null;
  gateType: string;
  gateCount: number;
}

export const GateResultsDisplay: React.FC<GateResultsDisplayProps> = ({
  calculationResult,
  gateType,
  gateCount
}) => {
  if (!calculationResult) {
    return null;
  }

  // Material key to display name mapping
  const materialLabels: Record<string, string> = {
    palings: "Palings",
    adjustableGateStile: "Gate Stile",
    nailHardend32mm: "32mm Nails",
    hardwoodPostHeight: "Post Height",
    hardwoodPostQty: "Posts",
    rapidSet30kg: "Rapid Set (30kg)",
    rapidSet20kg: "Rapid Set (20kg)",
    hinges: "Hinges",
    dLatch: "D-Latch",
    dropBolts: "Drop Bolts",
    screws: "Screws"
  };

  return (
    <div className="bg-slate-300 p-4 rounded-lg border border-slate-400">
      <h4 className="font-medium mb-2">Materials Required for {gateCount} {gateType}{gateCount > 1 ? 's' : ''}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {Object.entries(calculationResult).map(([key, value]) => {
          // Only display items with values greater than 0 (except for post height which is a string)
          if (key === 'hardwoodPostHeight' || Number(value) > 0) {
            return (
              <div key={key} className="bg-blue-50 p-2 rounded">
                <div className="text-sm text-gray-600">{materialLabels[key] || key}</div>
                <div className="font-bold">{value}</div>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};
