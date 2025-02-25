
import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Calculator } from "lucide-react";
import { Link } from "react-router-dom";

type MeasurementType = 'm2' | 'm3' | 'linear' | 'item';

interface Rate {
  type: MeasurementType;
  baseRate: number;
}

export default function TradeRatesCalculator() {
  const [measurementType, setMeasurementType] = useState<MeasurementType>('m2');
  const [quantity, setQuantity] = useState<string>('');
  const [rate, setRate] = useState<string>('');
  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const numQuantity = parseFloat(quantity);
    const numRate = parseFloat(rate);
    
    if (!isNaN(numQuantity) && !isNaN(numRate)) {
      const total = numQuantity * numRate;
      setResult(total);
    }
  };

  const measurementLabels = {
    'm2': 'Square Meters (m²)',
    'm3': 'Cubic Meters (m³)',
    'linear': 'Linear Meters',
    'item': 'Per Item'
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/settings">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Calculator className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Trade Rates Calculator</h1>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Calculate Trade Rates</CardTitle>
            <CardDescription>
              Select measurement type and enter values to calculate total cost
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label>Measurement Type</Label>
                <Select 
                  value={measurementType}
                  onValueChange={(value) => setMeasurementType(value as MeasurementType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select measurement type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(measurementLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantity ({measurementLabels[measurementType]})</Label>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder={`Enter ${measurementType} quantity`}
                />
              </div>

              <div className="space-y-2">
                <Label>Rate per {measurementLabels[measurementType]}</Label>
                <Input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder={`Enter rate per ${measurementType}`}
                />
              </div>

              <Button onClick={handleCalculate} className="mt-4">
                Calculate Total
              </Button>

              {result !== null && (
                <div className="p-4 bg-secondary rounded-lg mt-4">
                  <h3 className="font-semibold mb-2">Calculation Result</h3>
                  <div className="text-2xl font-bold">
                    ${result.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quantity} {measurementLabels[measurementType]} × ${rate} per {measurementType}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
