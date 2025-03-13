
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WOOD_TYPES, LOAD_TYPES } from "./constants";
import { useToast } from "@/hooks/use-toast";

interface CalculationResult {
  maxLoad: number;
  safeLoad: number;
  deflection: number;
}

interface BeamCalculatorProps {
  beamWidth: string;
  setBeamWidth: (value: string) => void;
  beamDepth: string;
  setBeamDepth: (value: string) => void;
  woodType: string;
  setWoodType: (value: string) => void;
  loadType: string;
  setLoadType: (value: string) => void;
  span: string;
  setSpan: (value: string) => void;
  calculatedResult: CalculationResult | null;
  setCalculatedResult: (result: CalculationResult | null) => void;
}

export const BeamCalculator: React.FC<BeamCalculatorProps> = ({
  beamWidth,
  setBeamWidth,
  beamDepth,
  setBeamDepth,
  woodType,
  setWoodType,
  loadType,
  setLoadType,
  span,
  setSpan,
  calculatedResult,
  setCalculatedResult,
}) => {
  const { toast } = useToast();

  const calculateStress = () => {
    if (!beamWidth || !beamDepth || !span) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic calculation variables
    const width = parseFloat(beamWidth);
    const depth = parseFloat(beamDepth);
    const spanLength = parseFloat(span);
    
    // Find wood and load factors
    const selectedWood = WOOD_TYPES.find(wood => wood.name === woodType) || WOOD_TYPES[0];
    const selectedLoad = LOAD_TYPES.find(load => load.name === loadType) || LOAD_TYPES[0];
    
    // Simple beam calculations (this is a simplified model)
    // Maximum distributed load (kg) = (width * depth² * strengthFactor) / (spanLength * 1000)
    const inertia = (width * Math.pow(depth, 3)) / 12;
    const maxLoad = (inertia * selectedWood.strengthFactor) / (spanLength * 1000);
    
    // Safe load is calculated with a safety factor of 2.5
    const safeLoad = maxLoad / 2.5;
    
    // Deflection in mm = (5 * loadFactor * span³) / (384 * E * I)
    // Using simplified approach
    const deflection = (5 * selectedLoad.factor * Math.pow(spanLength, 3)) / 
                       (384 * selectedWood.strengthFactor * inertia / 1000);
    
    setCalculatedResult({
      maxLoad: Number(maxLoad.toFixed(2)),
      safeLoad: Number(safeLoad.toFixed(2)),
      deflection: Number(deflection.toFixed(2)),
    });

    toast({
      title: "Calculation Complete",
      description: "Load and span results have been calculated",
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Beam Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beam-width">Beam Width (mm)</Label>
              <Input
                id="beam-width"
                type="number"
                value={beamWidth}
                onChange={(e) => setBeamWidth(e.target.value)}
                min="50"
                max="1000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beam-depth">Beam Depth (mm)</Label>
              <Input
                id="beam-depth"
                type="number"
                value={beamDepth}
                onChange={(e) => setBeamDepth(e.target.value)}
                min="50"
                max="1000"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Material & Load Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="wood-type">Wood Type</Label>
              <Select value={woodType} onValueChange={setWoodType}>
                <SelectTrigger id="wood-type">
                  <SelectValue placeholder="Select wood type" />
                </SelectTrigger>
                <SelectContent>
                  {WOOD_TYPES.map((wood) => (
                    <SelectItem key={wood.name} value={wood.name}>
                      {wood.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="load-type">Load Type</Label>
              <Select value={loadType} onValueChange={setLoadType}>
                <SelectTrigger id="load-type">
                  <SelectValue placeholder="Select load type" />
                </SelectTrigger>
                <SelectContent>
                  {LOAD_TYPES.map((load) => (
                    <SelectItem key={load.name} value={load.name}>
                      {load.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Span Length</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="span-length">Span Length (meters)</Label>
            <Input
              id="span-length"
              type="number"
              value={span}
              onChange={(e) => setSpan(e.target.value)}
              min="1"
              max="20"
              step="0.1"
            />
          </div>

          <Button 
            onClick={calculateStress} 
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
          >
            Calculate
          </Button>
        </CardContent>
      </Card>

      {calculatedResult && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Maximum Load</p>
                <p className="text-2xl font-bold text-amber-600">{calculatedResult.maxLoad} kN</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Safe Working Load</p>
                <p className="text-2xl font-bold text-green-600">{calculatedResult.safeLoad} kN</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Deflection</p>
                <p className="text-2xl font-bold text-blue-600">{calculatedResult.deflection} mm</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
