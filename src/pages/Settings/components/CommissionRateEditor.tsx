
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CommissionRate } from "../types";

interface CommissionRateEditorProps {
  rates: CommissionRate[];
  onUpdateRates: (rates: CommissionRate[]) => void;
  onAddRate: () => void;
}

export function CommissionRateEditor({
  rates,
  onUpdateRates,
  onAddRate,
}: CommissionRateEditorProps) {
  const handleChange = (id: string, field: keyof CommissionRate, value: string | number) => {
    const updatedRates = rates.map((rate) =>
      rate.id === id ? { ...rate, [field]: value } : rate
    );
    onUpdateRates(updatedRates);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Rates</CardTitle>
        <CardDescription>Set commission rates and minimum sales requirements</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {rates.map((rate) => (
          <div key={rate.id} className="space-y-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Staff Name</Label>
              <Input
                value={rate.staffName}
                onChange={(e) => handleChange(rate.id, 'staffName', e.target.value)}
                placeholder="Enter staff name"
              />
            </div>
            <div className="space-y-2">
              <Label>Commission Percentage</Label>
              <Input
                type="number"
                value={rate.percentage}
                onChange={(e) => handleChange(rate.id, 'percentage', parseFloat(e.target.value) || 0)}
                placeholder="Enter percentage"
              />
            </div>
            <div className="space-y-2">
              <Label>Minimum Sale Amount</Label>
              <Input
                type="number"
                value={rate.minimumSale}
                onChange={(e) => handleChange(rate.id, 'minimumSale', parseFloat(e.target.value) || 0)}
                placeholder="Enter minimum sale amount"
              />
            </div>
          </div>
        ))}
        <Button onClick={onAddRate} className="w-full">
          Add Commission Rate
        </Button>
      </CardContent>
    </Card>
  );
}
