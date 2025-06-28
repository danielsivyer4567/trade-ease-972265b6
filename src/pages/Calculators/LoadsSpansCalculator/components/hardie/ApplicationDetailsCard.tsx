import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HARDIE_APPLICATION_AREAS } from "../../constants";

interface ApplicationDetailsCardProps {
  applicationArea: string;
  setApplicationArea: (value: string) => void;
  supportSpacing: string;
  setSupportSpacing: (value: string) => void;
}

export const ApplicationDetailsCard: React.FC<ApplicationDetailsCardProps> = ({
  applicationArea,
  setApplicationArea,
  supportSpacing,
  setSupportSpacing
}) => {
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle>Application Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="application-area">Application Area</Label>
            <Select value={applicationArea} onValueChange={setApplicationArea}>
              <SelectTrigger id="application-area" className="text-black">
                <SelectValue placeholder="Select application area" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                {HARDIE_APPLICATION_AREAS.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              {applicationArea === "Wet Areas" && "Requires special waterproofing to meet AS 3740"}
              {applicationArea === "Flooring" && "Suitable for tile, vinyl, and carpet applications"}
              {applicationArea === "Exterior Wall" && "Requires weather-resistant products"}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="support-spacing">Support Spacing (mm)</Label>
            <Input
              id="support-spacing"
              type="number"
              value={supportSpacing}
              onChange={(e) => setSupportSpacing(e.target.value)}
              min="150"
              max="900"
              step="50"
            />
            <p className="text-sm text-gray-500 mt-1">
              Standard spacings are 450mm or 600mm for studs/joists
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
