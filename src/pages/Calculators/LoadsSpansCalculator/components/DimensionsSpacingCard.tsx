
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
  );
};
