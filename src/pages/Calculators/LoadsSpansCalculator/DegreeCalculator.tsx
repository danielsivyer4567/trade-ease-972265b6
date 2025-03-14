
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalculationType, DegreeCalculatorResult, useDegreeCalculator } from "./hooks/useDegreeCalculator";
import { Compass, ArrowRightLeft, Ruler, CornerUpLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface DegreeCalculatorProps {
  calculationType: CalculationType;
  setCalculationType: (type: CalculationType) => void;
  adjacent: string;
  setAdjacent: (value: string) => void;
  opposite: string;
  setOpposite: (value: string) => void;
  rise: string;
  setRise: (value: string) => void;
  run: string;
  setRun: (value: string) => void;
  percentage: string;
  setPercentage: (value: string) => void;
  gradient: string;
  setGradient: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  result: DegreeCalculatorResult | null;
  calculateAngle: () => void;
  reset: () => void;
}

export const DegreeCalculator: React.FC<DegreeCalculatorProps> = ({
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
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Angle Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calculation-type">Calculation Method</Label>
            <Select 
              value={calculationType} 
              onValueChange={(value) => setCalculationType(value as CalculationType)}
            >
              <SelectTrigger id="calculation-type">
                <SelectValue placeholder="Select calculation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="adjacent-opposite">Adjacent/Opposite Sides</SelectItem>
                <SelectItem value="rise-run">Rise/Run</SelectItem>
                <SelectItem value="percentage">Percentage Slope</SelectItem>
                <SelectItem value="gradient">Gradient (1:x)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue={calculationType} value={calculationType} onValueChange={(v) => setCalculationType(v as CalculationType)}>
            <TabsContent value="adjacent-opposite" className="space-y-4 mt-4 border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adjacent">Adjacent Side</Label>
                  <Input
                    id="adjacent"
                    type="number"
                    value={adjacent}
                    onChange={(e) => setAdjacent(e.target.value)}
                    placeholder="Enter adjacent side length"
                    className="bg-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="opposite">Opposite Side</Label>
                  <Input
                    id="opposite"
                    type="number"
                    value={opposite}
                    onChange={(e) => setOpposite(e.target.value)}
                    placeholder="Enter opposite side length"
                    className="bg-slate-400"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="rise-run" className="space-y-4 mt-4 border p-4 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rise">Rise</Label>
                  <Input
                    id="rise"
                    type="number"
                    value={rise}
                    onChange={(e) => setRise(e.target.value)}
                    placeholder="Enter rise"
                    className="bg-slate-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="run">Run</Label>
                  <Input
                    id="run"
                    type="number"
                    value={run}
                    onChange={(e) => setRun(e.target.value)}
                    placeholder="Enter run"
                    className="bg-slate-400"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="percentage" className="space-y-4 mt-4 border p-4 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="percentage">Percentage Slope (%)</Label>
                <Input
                  id="percentage"
                  type="number"
                  value={percentage}
                  onChange={(e) => setPercentage(e.target.value)}
                  placeholder="Enter percentage slope"
                  className="bg-slate-400"
                />
              </div>
            </TabsContent>

            <TabsContent value="gradient" className="space-y-4 mt-4 border p-4 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="gradient">Gradient (1 in X)</Label>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">1:</span>
                  <Input
                    id="gradient"
                    type="number"
                    value={gradient}
                    onChange={(e) => setGradient(e.target.value)}
                    placeholder="Enter gradient value"
                    className="bg-slate-400"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit of Measurement</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meters">Meters</SelectItem>
                <SelectItem value="feet">Feet</SelectItem>
                <SelectItem value="mm">Millimeters</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Button onClick={calculateAngle} className="flex-1 bg-amber-500 hover:bg-amber-600">
              Calculate Angle
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              <CornerUpLeft className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card className="mt-4 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Angle Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Angle in Degrees</p>
                <p className="text-2xl font-bold text-amber-600">
                  {result.degrees.toFixed(2)}°
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Angle in Radians</p>
                <p className="text-2xl font-bold text-amber-600">
                  {result.radians.toFixed(4)} rad
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Slope as Percentage</p>
                <p className="text-2xl font-bold text-amber-600">
                  {result.percentage.toFixed(2)}%
                </p>
              </div>
              
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Gradient (1:x)</p>
                <p className="text-2xl font-bold text-amber-600">
                  1:{result.gradient.toFixed(2)}
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">Understanding Angle Measurements</p>
              <ul className="mt-2 text-sm space-y-2 pl-5 list-disc">
                <li><strong>Degrees</strong>: Angular measurement from 0° to 360°, 90° is vertical</li>
                <li><strong>Radians</strong>: Alternative angle measurement used in math, 2π radians = 360°</li>
                <li><strong>Percentage Slope</strong>: Rise divided by run, multiplied by 100</li>
                <li><strong>Gradient (1:x)</strong>: Expressed as ratio of 1 unit rise to x units of run</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
