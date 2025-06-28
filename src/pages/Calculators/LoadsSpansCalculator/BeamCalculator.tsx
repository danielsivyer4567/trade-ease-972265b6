import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WOOD_TYPES, LOAD_TYPES } from "./constants";
import { CalculationResult } from "./hooks/useBeamCalculator";
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
  calculateStress: () => void;
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
  calculateStress
}) => {
  return <>
      {/* Beam illustration image above measurements */}
      <div className="w-full flex justify-center mb-6">
        <img 
          src="/lovable-uploads/197b48b6454ca%20(1).png" 
          alt="Beam illustration" 
          className="max-w-full h-auto rounded shadow-md border border-gray-200"
          style={{ maxHeight: 240 }}
        />
      </div>
      <Card className="bg-slate-300">
        <CardHeader>
          <CardTitle>Beam Dimensions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="beam-height">Beam Height - A (mm)</Label>
              <Input id="beam-height" type="number" value={beamWidth} onChange={e => setBeamWidth(e.target.value)} min="50" max="1000" className="bg-slate-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="span-length">Span Length - B (meters)</Label>
              <Input id="span-length" type="number" value={span} onChange={e => setSpan(e.target.value)} min="1" max="20" step="0.1" className="bg-slate-400" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="beam-depth">Beam Depth - C (mm)</Label>
              <Input id="beam-depth" type="number" value={beamDepth} onChange={e => setBeamDepth(e.target.value)} min="50" max="1000" className="bg-slate-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-300">
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
                  {WOOD_TYPES.map(wood => <SelectItem key={wood.name} value={wood.name}>
                      {wood.name}
                    </SelectItem>)}
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
                  {LOAD_TYPES.map(load => <SelectItem key={load.name} value={load.name}>
                      {load.name}
                    </SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-slate-300">
        <CardHeader>
          <CardTitle>Span Length</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="span-length">Span Length (meters)</Label>
            <Input id="span-length" type="number" value={span} onChange={e => setSpan(e.target.value)} min="1" max="20" step="0.1" className="bg-slate-400" />
          </div>

          <Button onClick={calculateStress} className="w-full mt-4 bg-amber-500 hover:bg-amber-600">
            Calculate
          </Button>
        </CardContent>
      </Card>

      {calculatedResult && <Card className="bg-slate-300 border-amber-200">
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
        </Card>}
    </>;
};