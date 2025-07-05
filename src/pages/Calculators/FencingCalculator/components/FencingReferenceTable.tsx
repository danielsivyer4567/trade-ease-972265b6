import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FenceType } from "../hooks/useFencingCalculator";

interface FencingReferenceTableProps {
  FENCING_COMPONENTS_PER_10M: Record<string, any>;
}

export const FencingReferenceTable: React.FC<FencingReferenceTableProps> = ({ 
  FENCING_COMPONENTS_PER_10M
}) => {
  const [fenceType, setFenceType] = useState<FenceType>("1.8m lapped");
  const [length, setLength] = useState<number>(10);
  const [calculationResult, setCalculationResult] = useState<Record<string, number | string> | null>(null);

  const calculateMaterials = () => {
    const componentsFor10m = FENCING_COMPONENTS_PER_10M[fenceType];
    
    if (!componentsFor10m) {
      return;
    }

    // Calculate the scaling factor based on fence length
    const scalingFactor = length / 10;
    
    // Calculate all materials based on the fence length
    setCalculationResult({
      palings: Math.ceil(componentsFor10m.palings * scalingFactor),
      panels: Math.ceil(componentsFor10m.panels * scalingFactor),
      postHeight: componentsFor10m.postHeight,
      posts: Math.ceil(componentsFor10m.posts * scalingFactor),
      rails: Math.ceil(componentsFor10m.rails * scalingFactor),
      nails: Math.ceil(componentsFor10m.nails * scalingFactor),
      screws: Math.ceil(componentsFor10m.screws * scalingFactor),
      rapidSets: Math.ceil(componentsFor10m.rapidSets * scalingFactor),
      caps: componentsFor10m.caps ? Math.ceil(componentsFor10m.caps * scalingFactor) : "-",
      sleepers: componentsFor10m.sleepers ? Math.ceil(componentsFor10m.sleepers * scalingFactor) : "-"
    });
  };

  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle className="text-xl">Fence Types & Materials Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Simple Calculator Section */}
        <div className="bg-slate-300 p-4 rounded-lg mb-4 border border-slate-400">
          <h3 className="text-lg font-semibold mb-4">Quick Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label htmlFor="quick-fence-type">Fence Type</Label>
              <Select 
                value={fenceType} 
                onValueChange={(value: FenceType) => setFenceType(value)}
              >
                <SelectTrigger id="quick-fence-type">
                  <SelectValue placeholder="Select fence type" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {Object.keys(FENCING_COMPONENTS_PER_10M)
                    .filter(key => !["picket", "privacy", "chain-link", "post-rail"].includes(key))
                    .map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="quick-length">Fence Length (meters)</Label>
              <Input
                id="quick-length"
                type="number"
                min="1"
                step="0.1"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value) || 10)}
              />
            </div>
          </div>
          <Button 
            onClick={calculateMaterials}
            className="w-full bg-blue-500 hover:bg-blue-600 mb-4"
          >
            Calculate Materials
          </Button>

          {calculationResult && (
            <div className="bg-slate-300 p-4 rounded-lg border border-slate-400">
              <h4 className="font-medium mb-2">Materials Required for {length}m of {fenceType}</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Posts</div>
                  <div className="font-bold">{calculationResult.posts}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Panels</div>
                  <div className="font-bold">{calculationResult.panels}</div>
                </div>
                {calculationResult.palings !== "-" && (
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Palings</div>
                    <div className="font-bold">{calculationResult.palings}</div>
                  </div>
                )}
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Rails</div>
                  <div className="font-bold">{calculationResult.rails}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Post Height</div>
                  <div className="font-bold">{calculationResult.postHeight}</div>
                </div>
                {calculationResult.nails !== "-" && Number(calculationResult.nails) > 0 && (
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Nails</div>
                    <div className="font-bold">{calculationResult.nails}</div>
                  </div>
                )}
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Screws</div>
                  <div className="font-bold">{calculationResult.screws}</div>
                </div>
                <div className="bg-blue-50 p-2 rounded">
                  <div className="text-sm text-gray-600">Rapid Sets</div>
                  <div className="font-bold">{calculationResult.rapidSets}</div>
                </div>
                {calculationResult.caps !== "-" && (
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Caps</div>
                    <div className="font-bold">{calculationResult.caps}</div>
                  </div>
                )}
                {calculationResult.sleepers !== "-" && (
                  <div className="bg-blue-50 p-2 rounded">
                    <div className="text-sm text-gray-600">Sleepers</div>
                    <div className="font-bold">{calculationResult.sleepers}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Note: All calculations are based on standard fencing requirements per 10 meters, scaled to your specified length.
        </p>
      </CardContent>
    </Card>
  );
};
