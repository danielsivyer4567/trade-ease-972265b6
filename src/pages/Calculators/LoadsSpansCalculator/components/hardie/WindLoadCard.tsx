
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { WIND_LOAD_CATEGORIES } from "../../constants";

interface WindLoadCardProps {
  windLoad: string;
  setWindLoad: (value: string) => void;
  calculateHardieRequirements: () => void;
}

export const WindLoadCard: React.FC<WindLoadCardProps> = ({
  windLoad,
  setWindLoad,
  calculateHardieRequirements
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Wind Load Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wind-load">Wind Load (kPa)</Label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Input
                id="wind-load"
                type="number"
                value={windLoad}
                onChange={(e) => setWindLoad(e.target.value)}
                min="0.5"
                max="7"
                step="0.5"
              />
            </div>
            <div className="md:col-span-3">
              <Select 
                onValueChange={(val) => setWindLoad(WIND_LOAD_CATEGORIES.find(w => w.name === val)?.kPa.toString() || windLoad)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Or select wind category" />
                </SelectTrigger>
                <SelectContent>
                  {WIND_LOAD_CATEGORIES.map((category) => (
                    <SelectItem key={category.name} value={category.name}>
                      {category.name} - {category.description} ({category.kPa} kPa)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Wind load affects fastening requirements and support spacing
          </p>
        </div>

        <Button 
          onClick={calculateHardieRequirements} 
          className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
        >
          Calculate Requirements
        </Button>
      </CardContent>
    </Card>
  );
};
