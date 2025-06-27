import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { SectionHeader } from "@/components/ui/SectionHeader";

const unitOptions = [
  { label: "Metric (m², mm, m³)", value: "metric" },
  { label: "Imperial (ft², in, yd³)", value: "imperial" },
];

const ConcreteCalculator = () => {
  const [unit, setUnit] = useState("metric");
  const [area, setArea] = useState("");
  const [thickness, setThickness] = useState("");
  const [volume, setVolume] = useState<string | null>(null);

  const handleCalculate = () => {
    const areaNum = parseFloat(area);
    const thicknessNum = parseFloat(thickness);
    if (isNaN(areaNum) || isNaN(thicknessNum) || areaNum <= 0 || thicknessNum <= 0) {
      setVolume(null);
      return;
    }
    if (unit === "metric") {
      // Area in m², thickness in mm
      const thicknessMeters = thicknessNum / 1000;
      const vol = areaNum * thicknessMeters; // m³
      setVolume(vol.toFixed(3) + " m³");
    } else {
      // Area in ft², thickness in inches
      const thicknessFeet = thicknessNum / 12;
      const volFeet = areaNum * thicknessFeet; // ft³
      const volYards = volFeet / 27; // yd³
      setVolume(volYards.toFixed(3) + " yd³");
    }
  };

  const handleReset = () => {
    setArea("");
    setThickness("");
    setVolume(null);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-xl">
        <SectionHeader title="Concrete Calculator" />
        <div className="bg-white rounded shadow p-6 mt-6">
          <div className="mb-4">
            <label className="block font-medium mb-1">Unit System</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={unit}
              onChange={e => setUnit(e.target.value)}
            >
              {unitOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Area ({unit === "metric" ? "m²" : "ft²"})
            </label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={area}
              onChange={e => setArea(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 25" : "e.g. 250"}
            />
          </div>
          <div className="mb-4">
            <label className="block font-medium mb-1">
              Thickness ({unit === "metric" ? "mm" : "in"})
            </label>
            <input
              type="number"
              min="0"
              className="w-full border rounded px-3 py-2"
              value={thickness}
              onChange={e => setThickness(e.target.value)}
              placeholder={unit === "metric" ? "e.g. 100" : "e.g. 4"}
            />
          </div>
          <div className="flex gap-2 mb-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              onClick={handleCalculate}
              type="button"
            >
              Calculate
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
              onClick={handleReset}
              type="button"
            >
              Reset
            </button>
          </div>
          {volume && (
            <div className="mt-4 p-4 bg-blue-50 rounded text-blue-800 font-semibold text-center">
              Concrete Volume: {volume}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ConcreteCalculator; 