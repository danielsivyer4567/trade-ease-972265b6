
import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Unit } from "../hooks/useFencingCalculator";

type GateType = 
  | "1.2m x 1m Single Gate"
  | "1.5m x 1m Single Gate"
  | "1.8m x 1m Single Gate"
  | "2.1m x 1m Single Gate"
  | "1.2m x 1.5m Double Gate"
  | "1.5m x 1.5m Double Gate"
  | "1.8m x 1.5m Double Gate"
  | "2.1m x 1.5m Double Gate";

interface GateRequirements {
  palings: number;
  adjustableGateStile: number;
  nailHardend32mm: number;
  hardwoodPostHeight: string;
  hardwoodPostQty: number;
  rapidSet30kg: number;
  rapidSet20kg: number;
  hinges: number;
  dLatch: number;
  dropBolts: number;
  screws: number;
}

// Gate materials requirements based on gate type - updated according to the provided image
const GATE_MATERIALS: Record<GateType, GateRequirements> = {
  "1.2m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "1800mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.5m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2100mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.8m x 1m Single Gate": {
    palings: 0,
    adjustableGateStile: 1,
    nailHardend32mm: 0,
    hardwoodPostHeight: "2400mm",
    hardwoodPostQty: 0,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 0,
    dropBolts: 0,
    screws: 0
  },
  "2.1m x 1m Single Gate": {
    palings: 10,
    adjustableGateStile: 1,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2700mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 0,
    screws: 0
  },
  "1.2m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "1800mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  },
  "1.5m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2100mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  },
  "1.8m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2400mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 2,
    dLatch: 1,
    dropBolts: 1,
    screws: 10
  },
  "2.1m x 1.5m Double Gate": {
    palings: 30,
    adjustableGateStile: 2,
    nailHardend32mm: 50,
    hardwoodPostHeight: "2700mm",
    hardwoodPostQty: 2,
    rapidSet30kg: 6,
    rapidSet20kg: 9,
    hinges: 0,
    dLatch: 1,
    dropBolts: 1,
    screws: 0
  }
};

interface GateCalculatorProps {
  unit: Unit;
}

export const GateCalculator: React.FC<GateCalculatorProps> = ({ unit }) => {
  const [gateType, setGateType] = useState<GateType>("1.8m x 1.5m Double Gate");
  const [gateCount, setGateCount] = useState<number>(1);
  const [calculationResult, setCalculationResult] = useState<Record<string, number | string> | null>(null);

  const calculateGateMaterials = () => {
    const gateMaterials = GATE_MATERIALS[gateType];
    
    if (!gateMaterials) {
      return;
    }

    // Calculate materials based on gate count
    setCalculationResult({
      palings: gateMaterials.palings * gateCount,
      adjustableGateStile: gateMaterials.adjustableGateStile * gateCount,
      nailHardend32mm: gateMaterials.nailHardend32mm * gateCount,
      hardwoodPostHeight: gateMaterials.hardwoodPostHeight,
      hardwoodPostQty: gateMaterials.hardwoodPostQty * gateCount,
      rapidSet30kg: gateMaterials.rapidSet30kg * gateCount,
      rapidSet20kg: gateMaterials.rapidSet20kg * gateCount,
      hinges: gateMaterials.hinges * gateCount,
      dLatch: gateMaterials.dLatch * gateCount,
      dropBolts: gateMaterials.dropBolts * gateCount,
      screws: gateMaterials.screws * gateCount
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Gate Materials Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-emerald-50 p-4 rounded-lg mb-4 border border-emerald-200">
          <h3 className="text-lg font-semibold mb-4">Calculate Gate Materials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="gate-type">Gate Type</Label>
              <Select 
                value={gateType} 
                onValueChange={(value: GateType) => setGateType(value)}
              >
                <SelectTrigger id="gate-type">
                  <SelectValue placeholder="Select gate type" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.keys(GATE_MATERIALS).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gate-count">Number of Gates</Label>
              <Input
                id="gate-count"
                type="number"
                min="1"
                step="1"
                value={gateCount}
                onChange={(e) => setGateCount(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>
          <Button 
            onClick={calculateGateMaterials}
            className="w-full bg-emerald-500 hover:bg-emerald-600 mb-4"
          >
            Calculate Gate Materials
          </Button>

          {calculationResult && (
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2">Materials Required for {gateCount} {gateType}{gateCount > 1 ? 's' : ''}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Number(calculationResult.palings) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Palings</div>
                    <div className="font-bold">{calculationResult.palings}</div>
                  </div>
                )}
                
                {Number(calculationResult.adjustableGateStile) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Gate Stile</div>
                    <div className="font-bold">{calculationResult.adjustableGateStile}</div>
                  </div>
                )}
                
                {Number(calculationResult.nailHardend32mm) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">32mm Nails</div>
                    <div className="font-bold">{calculationResult.nailHardend32mm}</div>
                  </div>
                )}
                
                <div className="bg-emerald-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Post Height</div>
                  <div className="font-bold">{calculationResult.hardwoodPostHeight}</div>
                </div>
                
                {Number(calculationResult.hardwoodPostQty) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Posts</div>
                    <div className="font-bold">{calculationResult.hardwoodPostQty}</div>
                  </div>
                )}
                
                {Number(calculationResult.rapidSet30kg) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Rapid Set (30kg)</div>
                    <div className="font-bold">{calculationResult.rapidSet30kg}</div>
                  </div>
                )}
                
                {Number(calculationResult.rapidSet20kg) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Rapid Set (20kg)</div>
                    <div className="font-bold">{calculationResult.rapidSet20kg}</div>
                  </div>
                )}
                
                {Number(calculationResult.hinges) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Hinges</div>
                    <div className="font-bold">{calculationResult.hinges}</div>
                  </div>
                )}
                
                {Number(calculationResult.dLatch) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">D-Latch</div>
                    <div className="font-bold">{calculationResult.dLatch}</div>
                  </div>
                )}
                
                {Number(calculationResult.dropBolts) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Drop Bolts</div>
                    <div className="font-bold">{calculationResult.dropBolts}</div>
                  </div>
                )}
                
                {Number(calculationResult.screws) > 0 && (
                  <div className="bg-emerald-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Screws</div>
                    <div className="font-bold">{calculationResult.screws}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: Gate calculations are based on standard gate dimensions. Additional materials may be required for custom gate sizes.
        </p>
      </CardContent>
    </Card>
  );
};
