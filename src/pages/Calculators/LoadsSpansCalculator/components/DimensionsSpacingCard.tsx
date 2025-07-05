import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { JOIST_SPACINGS } from "../constants";

interface DimensionsSpacingCardProps {
  material: string;
  dimension: string;
  setDimension: (value: string) => void;
  spacing: string;
  setSpacing: (value: string) => void;
  getAvailableDimensions: () => string[];
}

export const DimensionsSpacingCard: React.FC<DimensionsSpacingCardProps> = ({
  material,
  dimension,
  setDimension,
  spacing,
  setSpacing,
  getAvailableDimensions
}) => {
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle>Dimensions & Spacing</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {material === "Timber" && (
            <div className="space-y-2 text-black">
              <Label htmlFor="dimension">Dimensions</Label>
              <Select value={dimension} onValueChange={setDimension}>
                <SelectTrigger id="dimension" className="text-black">
                  <SelectValue placeholder="Select dimension" className="text-black" />
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
          <div className="space-y-2 text-black">
            <Label htmlFor="spacing">Joist Spacing</Label>
            <Select value={spacing} onValueChange={setSpacing}>
              <SelectTrigger id="spacing" className="text-black">
                <SelectValue placeholder="Select spacing" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                {JOIST_SPACINGS.map((sp) => (
                  <SelectItem key={sp} value={sp} className="text-black">
                    {sp}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
