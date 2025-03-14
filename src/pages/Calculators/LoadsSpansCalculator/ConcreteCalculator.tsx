
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConcreteCalculator } from "./hooks/useConcreteCalculator";

export const ConcreteCalculator = ({
  length,
  setLength,
  width,
  setWidth,
  thickness,
  setThickness,
  unit,
  setUnit,
  thicknessUnit,
  setThicknessUnit,
  waste,
  setWaste,
  calculatedVolume,
  calculateConcreteVolume,
}: {
  length: number;
  setLength: (value: number) => void;
  width: number;
  setWidth: (value: number) => void;
  thickness: number;
  setThickness: (value: number) => void;
  unit: string;
  setUnit: (value: string) => void;
  thicknessUnit: string;
  setThicknessUnit: (value: string) => void;
  waste: number;
  setWaste: (value: number) => void;
  calculatedVolume: number | null;
  calculateConcreteVolume: () => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Input Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Concrete Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="unit">Length & Width Units</Label>
            <Select value={unit} onValueChange={(value) => setUnit(value)}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meters">Meters</SelectItem>
                <SelectItem value="feet">Feet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="length">Length ({unit === "meters" ? "m" : "ft"})</Label>
            <Input
              id="length"
              type="number"
              min="0"
              step="0.01"
              value={length || ""}
              onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
              placeholder="Enter length"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="width">Width ({unit === "meters" ? "m" : "ft"})</Label>
            <Input
              id="width"
              type="number"
              min="0"
              step="0.01"
              value={width || ""}
              onChange={(e) => setWidth(parseFloat(e.target.value) || 0)}
              placeholder="Enter width"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thicknessUnit">Thickness Unit</Label>
            <Select 
              value={thicknessUnit} 
              onValueChange={(value) => setThicknessUnit(value)}
              disabled={unit === "feet"}
            >
              <SelectTrigger id="thicknessUnit">
                <SelectValue placeholder="Select thickness unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mm">Millimeters (mm)</SelectItem>
                <SelectItem value="m">Meters (m)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="thickness">
              Thickness ({unit === "feet" ? "inches" : thicknessUnit})
            </Label>
            <Input
              id="thickness"
              type="number"
              min="0"
              step={thicknessUnit === "mm" ? "1" : "0.01"}
              value={thickness || ""}
              onChange={(e) => setThickness(parseFloat(e.target.value) || 0)}
              placeholder={`Enter thickness in ${unit === "feet" ? "inches" : thicknessUnit}`}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="waste">Waste Factor (%)</Label>
            <Input
              id="waste"
              type="number"
              min="0"
              max="100"
              value={waste || ""}
              onChange={(e) => setWaste(parseFloat(e.target.value) || 0)}
              placeholder="Extra for waste (e.g., 10%)"
            />
          </div>

          <Button 
            className="w-full mt-4" 
            onClick={calculateConcreteVolume}
            disabled={!length || !width || !thickness}
          >
            Calculate Concrete Volume
          </Button>
        </CardContent>
      </Card>

      {/* Results Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Required Concrete</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {calculatedVolume !== null ? (
              <>
                <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                  <h3 className="text-lg font-medium text-amber-800 mb-2">Total Volume Needed</h3>
                  <p className="text-3xl font-bold text-amber-900">
                    {calculatedVolume.toFixed(2)} m³
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    This includes a {waste}% waste factor
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-medium">Order Guide:</h3>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="font-medium">20kg Bags</p>
                      <p className="text-lg font-bold">
                        {Math.ceil(calculatedVolume * 100)} bags
                      </p>
                      <p className="text-xs text-gray-500">Approx. 0.01m³ per bag</p>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded border">
                      <p className="font-medium">Ready-Mix</p>
                      <p className="text-lg font-bold">
                        {calculatedVolume.toFixed(2)} m³
                      </p>
                      <p className="text-xs text-gray-500">Order by cubic meter</p>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-2">
                    Note: Always check with your supplier for exact quantities. 
                    Actual coverage may vary depending on site conditions and concrete mix.
                  </p>
                </div>
              </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="text-amber-500 bg-amber-50 p-3 rounded-full mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="18" height="10" x="3" y="8" rx="1" />
                    <path d="M7 8v4" />
                    <path d="M17 8v4" />
                    <path d="M7 12h10" />
                    <path d="M7 16v2" />
                    <path d="M17 16v2" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium">Enter Measurements</h3>
                <p className="text-gray-500 mt-1">
                  Fill in the dimensions to calculate the required concrete volume
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
