
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSquaringCalculator, SquaringResult } from "./hooks/useSquaringCalculator";
import { Square, CornerUpLeft } from "lucide-react";

interface SquaringCalculatorProps {
  width: string;
  setWidth: (value: string) => void;
  length: string;
  setLength: (value: string) => void;
  diagonalA: string;
  setDiagonalA: (value: string) => void;
  diagonalB: string;
  setDiagonalB: (value: string) => void;
  unit: string;
  setUnit: (value: string) => void;
  squaringResult: SquaringResult | null;
  calculateSquaring: () => void;
  reset: () => void;
}

export const SquaringCalculator: React.FC<SquaringCalculatorProps> = ({
  width,
  setWidth,
  length,
  setLength,
  diagonalA,
  setDiagonalA,
  diagonalB,
  setDiagonalB,
  unit,
  setUnit,
  squaringResult,
  calculateSquaring,
  reset,
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Square className="h-5 w-5" />
            Rectangle Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width">Width</Label>
              <Input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="Enter width"
                min="0.1"
                step="0.1"
                className="bg-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="length">Length</Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="Enter length"
                min="0.1"
                step="0.1"
                className="bg-slate-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit of Measurement</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger id="unit">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="meters">Meters</SelectItem>
                <SelectItem value="feet">Feet</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Diagonal Measurements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="diagonal-a">Diagonal A</Label>
              <Input
                id="diagonal-a"
                type="number"
                value={diagonalA}
                onChange={(e) => setDiagonalA(e.target.value)}
                placeholder="Enter diagonal A"
                min="0.1"
                step="0.1"
                className="bg-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="diagonal-b">Diagonal B</Label>
              <Input
                id="diagonal-b"
                type="number"
                value={diagonalB}
                onChange={(e) => setDiagonalB(e.target.value)}
                placeholder="Enter diagonal B"
                min="0.1"
                step="0.1"
                className="bg-slate-400"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
            <Button onClick={calculateSquaring} className="flex-1 bg-amber-500 hover:bg-amber-600">
              Calculate
            </Button>
            <Button onClick={reset} variant="outline" className="flex-1">
              <CornerUpLeft className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {squaringResult && (
        <Card className="mt-4 bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Squaring Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Theoretical Diagonal</p>
                <p className="text-2xl font-bold text-amber-600">
                  {Math.sqrt(Math.pow(parseFloat(width), 2) + Math.pow(parseFloat(length), 2)).toFixed(2)} {unit}
                </p>
              </div>
              
              {diagonalA && diagonalB && (
                <>
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Diagonal Difference</p>
                    <p className="text-2xl font-bold text-amber-600">
                      {squaringResult.difference.toFixed(2)} {unit}
                    </p>
                  </div>
                  
                  <div className="p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-sm font-medium text-gray-500">Is Square/Rectangle?</p>
                    <p className={`text-2xl font-bold ${squaringResult.isSquare ? 'text-green-600' : 'text-red-600'}`}>
                      {squaringResult.isSquare ? 'Yes' : 'No'}
                    </p>
                  </div>
                  
                  {!squaringResult.isSquare && squaringResult.perpendicularDistance && (
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Adjustment Needed</p>
                      <p className="text-2xl font-bold text-blue-600">
                        ~{squaringResult.perpendicularDistance.toFixed(2)} {unit}
                      </p>
                    </div>
                  )}
                </>
              )}
              
              {!diagonalA && !diagonalB && (
                <div className="p-4 bg-white rounded-lg shadow-sm col-span-2">
                  <p className="text-sm font-medium text-gray-500">Recommended Diagonal Length</p>
                  <p className="text-2xl font-bold text-green-600">
                    {squaringResult.diagonalA.toFixed(2)} {unit}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    For a perfect square or rectangle, both diagonals should measure this length
                  </p>
                </div>
              )}
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-sm font-medium text-gray-500">How to Square a Layout</p>
              <ol className="mt-2 text-sm space-y-2 pl-5 list-decimal">
                <li>Measure the width and length of your rectangle</li>
                <li>Measure both diagonals (corner to corner)</li>
                <li>If both diagonals are equal, your layout is square</li>
                <li>If not, adjust the corners until the diagonals are equal</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
