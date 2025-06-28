import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculation } from "../types";

interface CalculationResultProps {
  calculation: Calculation;
}

export function CalculationResult({ calculation }: CalculationResultProps) {
  return (
    <Card className="bg-slate-300">
      <CardHeader>
        <CardTitle>Calculation Result</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-2xl font-bold">
            ${calculation.total.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            {calculation.quantity} × ${calculation.rate.toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
