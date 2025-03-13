
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  SPAN_TABLE, 
  MATERIAL_GRADES, 
  MATERIAL_DIMENSIONS, 
  JOIST_SPACINGS, 
  SPAN_TYPES 
} from "./constants";
import { useToast } from "@/hooks/use-toast";

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
}) => {
  const { toast } = useToast();

  // Helper function to get available grades for a material
  const getAvailableGrades = () => {
    return MATERIAL_GRADES[material as keyof typeof MATERIAL_GRADES] || [];
  };

  // Helper function to get available dimensions for a material and grade
  const getAvailableDimensions = () => {
    if (!material || !grade) return [];
    
    return (
      MATERIAL_DIMENSIONS[material as keyof typeof MATERIAL_DIMENSIONS]?.[
        grade as keyof (typeof MATERIAL_DIMENSIONS)[keyof typeof MATERIAL_DIMENSIONS]
      ] || []
    );
  };

  // Function to calculate span from the span table
  const calculateSpanFromTable = () => {
    try {
      // For James Hardie material, the grade is the thickness (e.g., "10mm")
      // and the dimension is directly the spacing (since there is no width)
      let lookupGrade = grade;
      let lookupDimension = dimension;
      let lookupSpacing = spacing;
      
      if (material === "James Hardie") {
        lookupGrade = grade; // Already in correct format (e.g., "10mm")
        lookupDimension = spacing; // For James Hardie, we use spacing directly
      }
      
      const spanValue = SPAN_TABLE[material]?.[lookupGrade]?.[lookupDimension]?.[lookupSpacing];
      
      if (spanValue !== undefined) {
        // Apply some basic adjustments based on span type
        let adjustedSpan = spanValue;
        if (spanType === "Continuous span") {
          adjustedSpan = spanValue * 1.25; // 25% increase for continuous spans
        } else if (spanType === "Cantilever") {
          adjustedSpan = spanValue * 0.4; // 60% decrease for cantilevers
        }
        
        // Apply load adjustment (simplified)
        const loadValue = parseFloat(load);
        const loadFactor = 2.0 / Math.max(loadValue, 0.5); // Base is 2.0 kPa
        adjustedSpan = adjustedSpan * Math.min(loadFactor, 1.5); // Cap the adjustment
        
        setSpanResult(`Maximum allowable span: ${adjustedSpan.toFixed(2)} meters`);
      } else {
        setSpanResult("Invalid combination of materials and dimensions");
      }
    } catch (error) {
      console.error("Error in span calculation:", error);
      setSpanResult("Error in calculation. Please check your inputs.");
    }
    
    toast({
      title: "Span Calculation Complete",
      description: "Maximum allowable span has been calculated",
    });
  };

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
                  const availableGrades = MATERIAL_GRADES[value as keyof typeof MATERIAL_GRADES] || [];
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
                  const availableDimensions = 
                    MATERIAL_DIMENSIONS[material as keyof typeof MATERIAL_DIMENSIONS]?.[
                      value as keyof (typeof MATERIAL_DIMENSIONS)[keyof typeof MATERIAL_DIMENSIONS]
                    ] || [];
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
