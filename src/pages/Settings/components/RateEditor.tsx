
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  addButtonText 
}: RateEditorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {rates.map((rate) => (
          <div key={rate.id} className="grid grid-cols-3 gap-4">
            <Input
              placeholder="Rate Name"
              value={rate.name}
              onChange={(e) => {
                const updatedRates = rates.map(r =>
                  r.id === rate.id ? { ...r, name: e.target.value } : r
                );
                onUpdateRates(updatedRates);
              }}
            />
            <Input
              type="number"
              placeholder="Rate Amount"
              value={rate.rate}
              onChange={(e) => {
                const updatedRates = rates.map(r =>
                  r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                );
                onUpdateRates(updatedRates);
              }}
            />
            <Button 
              variant={selectedRate?.id === rate.id ? "default" : "outline"}
              onClick={() => onSelectRate(rate)}
            >
              Select Rate
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={onAddRate}>
          {addButtonText}
        </Button>
      </CardContent>
    </Card>
  );
}
