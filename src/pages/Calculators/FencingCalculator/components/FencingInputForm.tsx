import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FenceType, Unit } from "../hooks/useFencingCalculator";

interface FencingInputFormProps {
  length: number;
  setLength: (length: number) => void;
  postSpacing: number;
  setPostSpacing: (spacing: number) => void;
  fenceType: FenceType;
  setFenceType: (type: FenceType) => void;
  gateWidth: number;
  setGateWidth: (width: number) => void;
  gateCount: number;
  setGateCount: (count: number) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  calculateFencingMaterials: () => void;
}

export const FencingInputForm: React.FC<FencingInputFormProps> = ({
  length,
  setLength,
  postSpacing,
  setPostSpacing,
  fenceType,
  setFenceType,
  gateWidth,
  setGateWidth,
  gateCount,
  setGateCount,
  unit,
  setUnit,
  calculateFencingMaterials
}) => {
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle className="text-xl">Fence Specifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="unit">Unit of Measurement</Label>
          <Select 
            value={unit} 
            onValueChange={(value: Unit) => setUnit(value)}
          >
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
          <Label htmlFor="length">Fence Length ({unit})</Label>
          <Input
            id="length"
            type="number"
            min="0"
            step="0.1"
            value={length || ""}
            onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
            placeholder={`Enter fence length in ${unit}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fenceType">Fence Type</Label>
          <Select 
            value={fenceType} 
            onValueChange={(value: FenceType) => setFenceType(value)}
          >
            <SelectTrigger id="fenceType">
              <SelectValue placeholder="Select fence type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              <SelectItem value="1.8m butted up with a sleeper">1.8m Butted Up with Sleeper</SelectItem>
              <SelectItem value="1.8m butted up and capped with a sleeper">1.8m Butted Up and Capped with Sleeper</SelectItem>
              <SelectItem value="1.8m lapped">1.8m Lapped</SelectItem>
              <SelectItem value="1.8m lapped and capped">1.8m Lapped and Capped</SelectItem>
              <SelectItem value="1.8m lapped with a sleeper">1.8m Lapped with Sleeper</SelectItem>
              <SelectItem value="1.8m lapped and capped with a sleeper">1.8m Lapped and Capped with Sleeper</SelectItem>
              <SelectItem value="2.1m butted up">2.1m Butted Up</SelectItem>
              <SelectItem value="2.1m butted up and capped">2.1m Butted Up and Capped</SelectItem>
              <SelectItem value="2.1m butted up with a sleeper">2.1m Butted Up with Sleeper</SelectItem>
              <SelectItem value="2.1m butted up and capped with a sleeper">2.1m Butted Up and Capped with Sleeper</SelectItem>
              <SelectItem value="2.1m lapped">2.1m Lapped</SelectItem>
              <SelectItem value="2.1m lapped and capped">2.1m Lapped and Capped</SelectItem>
              <SelectItem value="2.1m lapped with a sleeper">2.1m Lapped with Sleeper</SelectItem>
              <SelectItem value="2.1m lapped and capped with a sleeper">2.1m Lapped and Capped with Sleeper</SelectItem>
              <SelectItem value="picket">Picket Fence</SelectItem>
              <SelectItem value="privacy">Privacy Fence</SelectItem>
              <SelectItem value="chain-link">Chain Link</SelectItem>
              <SelectItem value="post-rail">Post and Rail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="postSpacing">Post Spacing ({unit})</Label>
          <Input
            id="postSpacing"
            type="number"
            min="0.3"
            step="0.1"
            value={postSpacing || ""}
            onChange={(e) => setPostSpacing(parseFloat(e.target.value) || 0)}
            placeholder={`Enter post spacing in ${unit}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gateCount">Number of Gates</Label>
          <Input
            id="gateCount"
            type="number"
            min="0"
            step="1"
            value={gateCount || ""}
            onChange={(e) => setGateCount(parseInt(e.target.value) || 0)}
            placeholder="Enter number of gates"
          />
        </div>

        {gateCount > 0 && (
          <div className="space-y-2">
            <Label htmlFor="gateWidth">Gate Width ({unit})</Label>
            <Input
              id="gateWidth"
              type="number"
              min="0"
              step="0.1"
              value={gateWidth || ""}
              onChange={(e) => setGateWidth(parseFloat(e.target.value) || 0)}
              placeholder={`Enter gate width in ${unit}`}
            />
          </div>
        )}

        <Button 
          className="w-full mt-4 bg-blue-500 hover:bg-blue-600" 
          onClick={calculateFencingMaterials}
          disabled={!length || !postSpacing}
        >
          Calculate Materials
        </Button>
      </CardContent>
    </Card>
  );
};
