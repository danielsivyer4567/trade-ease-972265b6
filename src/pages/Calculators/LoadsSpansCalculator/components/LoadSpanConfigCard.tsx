
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SPAN_TYPES } from "../constants";

interface LoadSpanConfigCardProps {
  load: string;
  setLoad: (value: string) => void;
  spanType: string;
  setSpanType: (value: string) => void;
  calculateSpanFromTable: () => void;
}

export const LoadSpanConfigCard: React.FC<LoadSpanConfigCardProps> = ({
  load,
  setLoad,
  spanType,
  setSpanType,
  calculateSpanFromTable
}) => {
  return (
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
  );
};
