
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowUpDown, ArrowDown, ScanLine } from "lucide-react";
import { StairsCalculatorResult, useStairsCalculator } from "./hooks/useStairsCalculator";

interface StairsCalculatorProps {
  totalRise: string;
  setTotalRise: (value: string) => void;
  floorToFloor: string;
  setFloorToFloor: (value: string) => void;
  availableRun: string;
  setAvailableRun: (value: string) => void;
  stairType: string;
  setStairType: (value: string) => void;
  targetRiser: string;
  setTargetRiser: (value: string) => void;
  targetTread: string;
  setTargetTread: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  headroomHeight: string;
  setHeadroomHeight: (value: string) => void;
  result: StairsCalculatorResult | null;
  calculateStairs: () => void;
  resetStairs: () => void;
}

export const StairsCalculator: React.FC<StairsCalculatorProps> = ({
  totalRise,
  setTotalRise,
  floorToFloor,
  setFloorToFloor,
  availableRun,
  setAvailableRun,
  stairType,
  setStairType,
  targetRiser,
  setTargetRiser,
  targetTread,
  setTargetTread,
  unit,
  setUnit,
  headroomHeight,
  setHeadroomHeight,
  result,
  calculateStairs,
  resetStairs
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader className="bg-orange-400 text-white">
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5" />
            Stairs Calculator
          </CardTitle>
          <CardDescription className="text-white opacity-90">
            Calculate stair dimensions, risers, and treads
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 bg-orange-50 pt-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Unit of Measurement</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm">Millimeters</SelectItem>
                <SelectItem value="inches">Inches</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stair-type">Stair Type</Label>
            <Select value={stairType} onValueChange={setStairType}>
              <SelectTrigger id="stair-type">
                <SelectValue placeholder="Select stair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="straight">Straight Stairs</SelectItem>
                <SelectItem value="l-shaped">L-Shaped Stairs</SelectItem>
                <SelectItem value="u-shaped">U-Shaped Stairs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total-rise">Total Rise (Floor to Floor)</Label>
              <Input 
                id="total-rise" 
                type="number" 
                value={floorToFloor}
                onChange={e => setFloorToFloor(e.target.value)}
                placeholder={`Enter height in ${unit}`}
                min="0"
                step={unit === "mm" ? "10" : "0.5"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-run">Available Run</Label>
              <Input 
                id="available-run" 
                type="number" 
                value={availableRun}
                onChange={e => setAvailableRun(e.target.value)}
                placeholder={`Enter run in ${unit}`}
                min="0"
                step={unit === "mm" ? "10" : "0.5"}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-riser">Target Riser Height (optional)</Label>
              <Input 
                id="target-riser" 
                type="number" 
                value={targetRiser}
                onChange={e => setTargetRiser(e.target.value)}
                placeholder={`Preferred riser (${unit})`}
                min="0"
                step={unit === "mm" ? "5" : "0.25"}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target-tread">Target Tread Depth (optional)</Label>
              <Input 
                id="target-tread" 
                type="number" 
                value={targetTread}
                onChange={e => setTargetTread(e.target.value)}
                placeholder={`Preferred tread (${unit})`}
                min="0"
                step={unit === "mm" ? "5" : "0.25"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="headroom-height">Minimum Headroom Height (optional)</Label>
            <Input 
              id="headroom-height" 
              type="number" 
              value={headroomHeight}
              onChange={e => setHeadroomHeight(e.target.value)}
              placeholder={`Min. headroom in ${unit}`}
              min="0"
              step={unit === "mm" ? "10" : "0.5"}
            />
          </div>

          <div className="flex space-x-2 pt-2">
            <Button 
              onClick={calculateStairs} 
              className="flex-1 bg-orange-500 hover:bg-orange-600"
            >
              Calculate Stairs
            </Button>
            <Button 
              onClick={resetStairs} 
              variant="outline" 
              className="flex-1"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader className="bg-orange-100">
            <CardTitle>Stair Calculation Results</CardTitle>
            <CardDescription>Based on your inputs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500">Number of Risers</p>
                <p className="text-2xl font-bold text-orange-600">{result.numberOfRisers}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500">Number of Treads</p>
                <p className="text-2xl font-bold text-orange-600">{result.numberOfTreads}</p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500">Riser Height</p>
                <p className="text-2xl font-bold text-orange-600">
                  {result.riserHeight.toFixed(2)} {unit}
                </p>
              </div>
              <div className="bg-white p-3 rounded-md shadow-sm">
                <p className="text-sm font-medium text-gray-500">Tread Depth</p>
                <p className="text-2xl font-bold text-orange-600">
                  {result.treadDepth.toFixed(2)} {unit}
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-500">Total Run Length</p>
              <p className="text-2xl font-bold text-orange-600">
                {result.totalRun.toFixed(2)} {unit}
              </p>
              <div className="mt-2 flex items-center text-sm text-gray-600">
                <ScanLine className="h-4 w-4 mr-1" />
                <span>Available: {availableRun} {unit}</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-500">Stringer Length</p>
              <p className="text-xl font-bold text-orange-600">
                {result.stringerLength.toFixed(2)} {unit}
              </p>
            </div>

            <div className="bg-white p-4 rounded-md shadow-sm">
              <p className="text-sm font-medium text-gray-500">Stair Angle</p>
              <p className="text-xl font-bold text-orange-600">
                {result.stairAngle.toFixed(2)}°
              </p>
            </div>

            {result.recommendations && (
              <div className="bg-blue-50 p-4 rounded-md">
                <p className="font-medium text-blue-800 mb-2">Recommendations</p>
                <ul className="list-disc pl-5 space-y-1 text-sm text-blue-700">
                  {result.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
