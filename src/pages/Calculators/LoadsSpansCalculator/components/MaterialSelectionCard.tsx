import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPAN_TABLE } from "../constants";

interface MaterialSelectionCardProps {
  material: string;
  setMaterial: (value: string) => void;
  grade: string;
  setGrade: (value: string) => void;
  getAvailableGrades: () => string[];
}

export const MaterialSelectionCard: React.FC<MaterialSelectionCardProps> = ({
  material,
  setMaterial,
  grade,
  setGrade,
  getAvailableGrades,
}) => {
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle>Material Selection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2 text-black">
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
              <SelectTrigger id="material-type" className="text-black">
                <SelectValue placeholder="Select material" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(SPAN_TABLE).map((mat) => (
                  <SelectItem key={mat} value={mat} className="text-black">
                    {mat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 text-black">
            <Label htmlFor="grade">Grade/Thickness</Label>
            <Select 
              value={grade} 
              onValueChange={setGrade}
            >
              <SelectTrigger id="grade" className="text-black">
                <SelectValue placeholder="Select grade" className="text-black" />
              </SelectTrigger>
              <SelectContent>
                {getAvailableGrades().map((g) => (
                  <SelectItem key={g} value={g} className="text-black">
                    {g}
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
