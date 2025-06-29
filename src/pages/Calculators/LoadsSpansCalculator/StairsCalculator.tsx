import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StairsResult } from "./hooks/useStairsCalculator";
import { CheckCircle, AlertTriangle } from "lucide-react";

interface StairsCalculatorProps {
  floorToFloorHeight: string;
  setFloorToFloorHeight: (value: string) => void;
  availableRun: string;
  setAvailableRun: (value: string) => void;
  treadThickness: string;
  setTreadThickness: (value: string) => void;
  desiredRiserHeight: string;
  setDesiredRiserHeight: (value: string) => void;
  buildingType: string;
  setBuildingType: (value: string) => void;
  stairsResult: StairsResult | null;
  calculateStairs: () => void;
}

export const StairsCalculator: React.FC<StairsCalculatorProps> = ({
  floorToFloorHeight,
  setFloorToFloorHeight,
  availableRun,
  setAvailableRun,
  treadThickness,
  setTreadThickness,
  desiredRiserHeight,
  setDesiredRiserHeight,
  buildingType,
  setBuildingType,
  stairsResult,
  calculateStairs
}) => {
  return (
    <>
      <Card className="bg-slate-300">
        <CardHeader>
          <CardTitle>Stairs Calculator</CardTitle>
          <CardDescription>
            Calculate stair dimensions based on floor height and available run
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="floor-height">Floor to Floor Height (mm)</Label>
              <Input
                id="floor-height"
                type="number"
                value={floorToFloorHeight}
                onChange={(e) => setFloorToFloorHeight(e.target.value)}
                min="1000"
                max="5000"
                step="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="available-run">Available Run (mm)</Label>
              <Input
                id="available-run"
                type="number"
                value={availableRun}
                onChange={(e) => setAvailableRun(e.target.value)}
                min="1000"
                max="10000"
                step="10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tread-thickness">Tread Thickness (mm)</Label>
              <Input
                id="tread-thickness"
                type="number"
                value={treadThickness}
                onChange={(e) => setTreadThickness(e.target.value)}
                min="20"
                max="100"
                step="1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="desired-riser">Desired Riser Height (mm)</Label>
              <Input
                id="desired-riser"
                type="number"
                value={desiredRiserHeight}
                onChange={(e) => setDesiredRiserHeight(e.target.value)}
                min="150"
                max="200"
                step="5"
                placeholder="Target riser height"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="building-type">Building Type</Label>
            <Select value={buildingType} onValueChange={setBuildingType}>
              <SelectTrigger id="building-type">
                <SelectValue placeholder="Select building type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial/Public</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            onClick={calculateStairs} 
            className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
          >
            Calculate Stairs
          </Button>
        </CardContent>
      </Card>

      {stairsResult && (
        <Card className="bg-slate-300 mt-6 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>Stairs Calculation Results</span>
              {stairsResult.isCompliant ? (
                <CheckCircle className="text-green-500 h-5 w-5" />
              ) : (
                <AlertTriangle className="text-blue-500 h-5 w-5" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500">Number of Risers</p>
                <p className="text-lg font-bold text-blue-600">{stairsResult.numberOfRisers}</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500">Riser Height</p>
                <p className="text-lg font-bold text-blue-600">{stairsResult.riserHeight.toFixed(1)} mm</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500">Tread Depth</p>
                <p className="text-lg font-bold text-blue-600">{stairsResult.treadDepth.toFixed(1)} mm</p>
              </div>
              <div className="p-3 bg-white rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500">Stair Angle</p>
                <p className="text-lg font-bold text-blue-600">{stairsResult.stairAngle.toFixed(1)}°</p>
              </div>
            </div>

            {stairsResult.complianceNotes.length > 0 && (
              <Alert className="bg-blue-100 border-blue-300">
                <AlertTitle>Building Code Compliance Issues</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    {stairsResult.complianceNotes.map((note, index) => (
                      <li key={index}>{note}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="p-4 bg-white rounded-lg shadow-sm mt-4">
              <h3 className="font-semibold mb-2">Stair Specifications</h3>
              <ul className="text-sm space-y-2">
                <li><span className="font-medium">Total Run:</span> {stairsResult.totalRun.toFixed(0)} mm</li>
                <li><span className="font-medium">Total Rise:</span> {floorToFloorHeight} mm</li>
                <li><span className="font-medium">Number of Treads:</span> {stairsResult.numberOfRisers - 1}</li>
                <li><span className="font-medium">Building Type:</span> {buildingType === "residential" ? "Residential" : "Commercial/Public"}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default StairsCalculator;
