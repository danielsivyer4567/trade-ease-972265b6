
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Rate, Calculation } from "../types";

interface RateCalculatorProps {
  selectedRate: Rate | null;
  onCalculate: (calculation: Calculation) => void;
}

export function RateCalculator({ selectedRate, onCalculate }: RateCalculatorProps) {
  const [quantity, setQuantity] = useState<string>("");

  const handleCalculate = () => {
    if (selectedRate && quantity) {
      const numQuantity = parseFloat(quantity);
      const total = numQuantity * selectedRate.rate;
      onCalculate({
        quantity: numQuantity,
        rate: selectedRate.rate,
        total,
      });
    }
  };

  if (!selectedRate) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calculate Rate</CardTitle>
        <CardDescription>Calculate total for {selectedRate.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Quantity ({selectedRate.unit})</Label>
          <Input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder={`Enter quantity in ${selectedRate.unit}`}
          />
        </div>
        <Button onClick={handleCalculate} className="w-full">
          Calculate Total
        </Button>
      </CardContent>
    </Card>
  );
}
