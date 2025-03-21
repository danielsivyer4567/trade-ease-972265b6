
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
        <CardTitle>Wind Load & Calculation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="wind-load">Wind Load (kPa)</Label>
          <Select value={windLoad} onValueChange={setWindLoad}>
            <SelectTrigger id="wind-load">
              <SelectValue placeholder="Select wind load category" />
            </SelectTrigger>
            <SelectContent>
              {WIND_LOAD_CATEGORIES.map((category) => (
                <SelectItem key={category.name} value={category.kPa.toString()}>
                  {category.name} - {category.kPa} kPa ({category.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-500 mt-1">
            Select the appropriate wind load category for your location
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
