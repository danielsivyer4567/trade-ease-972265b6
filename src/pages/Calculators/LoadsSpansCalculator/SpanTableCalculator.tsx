
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  SPAN_TABLE, 
  JOIST_SPACINGS, 
  SPAN_TYPES 
} from "./constants";

interface SpanTableCalculatorProps {
  material: string;
  setMaterial: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  dimension: string;
  setDimension: (value: string) => void;
  spacing: string;
  setSpacing: (value: string) => void;
  load: string;
  setLoad: (value: string) => void;
  spanType: string;
  setSpanType: (value: string) => void;
  spanResult: string | null;
  setSpanResult: (result: string | null) => void;
  getAvailableGrades: () => string[];
  getAvailableDimensions: () => string[];
  calculateSpanFromTable: () => void;
}

export const SpanTableCalculator: React.FC<SpanTableCalculatorProps> = ({
  material,
  setMaterial,
  grade,
  setGrade,
  dimension,
  setDimension,
  spacing,
  setSpacing,
  load,
  setLoad,
  spanType,
  setSpanType,
  spanResult,
  setSpanResult,
  getAvailableGrades,
  getAvailableDimensions,
  calculateSpanFromTable
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Material Selection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="material-type">Material Type</Label>
              <Select 
                value={material} 
                onValueChange={(value) => {
                  setMaterial(value);
                  // Reset grade and dimension when material changes
                  const availableGrades = getAvailableGrades();
                  setGrade(availableGrades[0] || "");
                }}
              >
                <SelectTrigger id="material-type">
                  <SelectValue placeholder="Select material" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(SPAN_TABLE).map((mat) => (
                    <SelectItem key={mat} value={mat}>
                      {mat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade/Thickness</Label>
              <Select 
                value={grade} 
                onValueChange={(value) => {
                  setGrade(value);
                  // Reset dimension when grade changes
                  const availableDimensions = getAvailableDimensions();
                  setDimension(availableDimensions[0] || "");
                }}
              >
                <SelectTrigger id="grade">
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableGrades().map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
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
          <CardTitle>Dimensions & Spacing</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {material === "Timber" && (
              <div className="space-y-2">
                <Label htmlFor="dimension">Dimensions</Label>
                <Select value={dimension} onValueChange={setDimension}>
                  <SelectTrigger id="dimension">
                    <SelectValue placeholder="Select dimension" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableDimensions().map((dim) => (
                      <SelectItem key={dim} value={dim}>
                        {dim}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="spacing">Joist Spacing</Label>
              <Select value={spacing} onValueChange={setSpacing}>
                <SelectTrigger id="spacing">
                  <SelectValue placeholder="Select spacing" />
                </SelectTrigger>
                <SelectContent>
                  {JOIST_SPACINGS.map((sp) => (
                    <SelectItem key={sp} value={sp}>
                      {sp}
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
          <CardTitle>Load & Span Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="load-value">Load (kPa)</Label>
              <Input
                id="load-value"
                type="number"
                value={load}
                onChange={(e) => setLoad(e.target.value)}
                min="0.5"
                max="10"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="span-type">Span Type</Label>
              <Select value={spanType} onValueChange={setSpanType}>
                <SelectTrigger id="span-type">
                  <SelectValue placeholder="Select span type" />
                </SelectTrigger>
                <SelectContent>
                  {SPAN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={calculateSpanFromTable} 
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
          >
            Calculate Span
          </Button>
        </CardContent>
      </Card>

      {spanResult && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">Span Calculation Result</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <p className="text-2xl font-bold text-amber-600">{spanResult}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
