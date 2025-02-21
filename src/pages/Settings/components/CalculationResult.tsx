
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Equal } from "lucide-react";
import { Calculation } from "../types";

interface CalculationResultProps {
  calculation: Calculation;
}

export function CalculationResult({ calculation }: CalculationResultProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Equal className="h-5 w-5" />
          Calculation Result
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Rate Type:</span>
            <span>{calculation.rateType}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Rate:</span>
            <span>${calculation.rate.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Quantity:</span>
            <span>{calculation.quantity}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">Subtotal:</span>
            <span>${calculation.subtotal.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <span className="text-gray-600">GST (10%):</span>
            <span>${calculation.gst.toFixed(2)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-lg font-bold">
            <span>Total:</span>
            <span>${calculation.total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
