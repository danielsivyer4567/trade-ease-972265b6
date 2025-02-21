
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CommissionRate } from "../types";

interface CommissionRateEditorProps {
  rates: CommissionRate[];
  onUpdateRates: (rates: CommissionRate[]) => void;
  onAddRate: () => void;
}

export function CommissionRateEditor({ rates, onUpdateRates, onAddRate }: CommissionRateEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Commission Rates</CardTitle>
        <CardDescription>Set commission-based rates for sales staff</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((rate) => (
          <div key={rate.id} className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Staff Name"
              value={rate.staffName}
              onChange={(e) => {
                const updatedRates = rates.map(r =>
                  r.id === rate.id ? { ...r, staffName: e.target.value } : r
                );
                onUpdateRates(updatedRates);
              }}
            />
            <Input
              type="number"
              placeholder="Commission %"
              value={rate.percentage}
              onChange={(e) => {
                const updatedRates = rates.map(r =>
                  r.id === rate.id ? { ...r, percentage: Number(e.target.value) } : r
                );
                onUpdateRates(updatedRates);
              }}
            />
            <Input
              type="number"
              placeholder="Minimum Sale"
              value={rate.minimumSale}
              onChange={(e) => {
                const updatedRates = rates.map(r =>
                  r.id === rate.id ? { ...r, minimumSale: Number(e.target.value) } : r
                );
                onUpdateRates(updatedRates);
              }}
            />
          </div>
        ))}
        <Button variant="outline" onClick={onAddRate}>
          Add Commission Rate
        </Button>
      </CardContent>
    </Card>
  );
}
