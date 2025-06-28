import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GateType } from "../../types/gateTypes";
import { GATE_MATERIALS } from "../../data/gateMaterials";

interface GateInputFormProps {
  gateType: GateType;
  setGateType: (type: GateType) => void;
  gateCount: number;
  setGateCount: (count: number) => void;
  onCalculate: () => void;
}

export const GateInputForm: React.FC<GateInputFormProps> = ({
  gateType,
  setGateType,
  gateCount,
  setGateCount,
  onCalculate
}) => {
  return (
    <div className="bg-slate-300 p-4 rounded-lg mb-4 border border-slate-400">
      <h3 className="text-lg font-semibold mb-4">Calculate Gate Materials</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <Label htmlFor="gate-type">Gate Type</Label>
          <Select 
            value={gateType} 
            onValueChange={(value: GateType) => setGateType(value)}
          >
            <SelectTrigger id="gate-type">
              <SelectValue placeholder="Select gate type" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {Object.keys(GATE_MATERIALS).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="gate-count">Number of Gates</Label>
          <Input
            id="gate-count"
            type="number"
            min="1"
            step="1"
            value={gateCount}
            onChange={(e) => setGateCount(parseInt(e.target.value) || 1)}
          />
        </div>
      </div>
      <Button 
        onClick={onCalculate}
        className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
      >
        Calculate Gate Materials
      </Button>
    </div>
  );
};
