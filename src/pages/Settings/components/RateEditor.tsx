
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rate } from "../types";

interface RateEditorProps {
  title: string;
  description: string;
  rates: Rate[];
  onUpdateRates: (rates: Rate[]) => void;
  onSelectRate: (rate: Rate) => void;
  selectedRate: Rate | null;
  onAddRate: () => void;
  addButtonText: string;
}

export function RateEditor({
  title,
  description,
  rates,
  onUpdateRates,
  onSelectRate,
  selectedRate,
  onAddRate,
  addButtonText,
}: RateEditorProps) {
  const handleRateChange = (id: string, value: number) => {
    const updatedRates = rates.map((rate) =>
      rate.id === id ? { ...rate, rate: value } : rate
    );
    onUpdateRates(updatedRates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((rate) => (
          <div key={rate.id} className="space-y-2">
            <Label>{rate.name}</Label>
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={rate.rate}
                onChange={(e) => handleRateChange(rate.id, parseFloat(e.target.value) || 0)}
                placeholder="Enter rate"
              />
              <Button
                variant="outline"
                onClick={() => onSelectRate(rate)}
              >
                Use Rate
              </Button>
            </div>
          </div>
        ))}
        <Button onClick={onAddRate} className="w-full">
          {addButtonText}
        </Button>
      </CardContent>
    </Card>
  );
}
