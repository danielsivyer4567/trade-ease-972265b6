
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calculator, Equal } from "lucide-react";
import { Rate, Calculation } from "../types";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface RateCalculatorProps {
  selectedRate: Rate | null;
  onCalculate: (calculation: Calculation) => void;
}

export function RateCalculator({ selectedRate, onCalculate }: RateCalculatorProps) {
  const [quantity, setQuantity] = useState<number>(0);
  const { toast } = useToast();

  const calculateTotal = () => {
    if (!selectedRate || !quantity) {
      toast({
        title: "Error",
        description: "Please select a rate and enter a quantity",
        variant: "destructive",
      });
      return;
    }

    const subtotal = selectedRate.rate * quantity;
    const gst = subtotal * 0.1; // 10% GST
    const total = subtotal + gst;

    const calculation: Calculation = {
      rateType: selectedRate.unit,
      rateName: selectedRate.name,
      rate: selectedRate.rate,
      quantity,
      subtotal,
      gst,
      total,
    };

    onCalculate(calculation);
    toast({
      title: "Calculation Complete",
      description: "The total has been calculated with GST",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Calculate Rate
        </CardTitle>
        <CardDescription>Enter quantity and calculate total with GST</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Selected Rate</label>
            <Input
              value={selectedRate?.name || ""}
              placeholder="Click a rate above"
              readOnly
              className="bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Quantity</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Enter quantity"
            />
          </div>
        </div>
        <Button onClick={calculateTotal} className="w-full">
          Calculate Total
        </Button>
      </CardContent>
    </Card>
  );
}
