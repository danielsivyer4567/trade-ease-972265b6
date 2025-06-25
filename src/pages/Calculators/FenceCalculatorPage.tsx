import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Fence } from 'lucide-react';

const FenceCalculatorPage = () => {
  const [length, setLength] = useState('');
  const [material, setMaterial] = useState('wood');
  const [cost, setCost] = useState<number | null>(null);

  const calculateCost = () => {
    const lengthNum = parseFloat(length);
    if (isNaN(lengthNum) || lengthNum <= 0) {
      alert('Please enter a valid length.');
      return;
    }

    let costPerFoot = 0;
    switch (material) {
      case 'wood':
        costPerFoot = 25;
        break;
      case 'vinyl':
        costPerFoot = 35;
        break;
      case 'chain-link':
        costPerFoot = 15;
        break;
      default:
        costPerFoot = 25;
    }

    setCost(lengthNum * costPerFoot);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fence className="mr-2 h-6 w-6" />
            Fence Cost Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="length">Fence Length (feet)</Label>
              <Input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="e.g., 100"
              />
            </div>
            <div>
              <Label htmlFor="material">Fence Material</Label>
              <Select value={material} onValueChange={setMaterial}>
                <SelectTrigger id="material">
                  <SelectValue placeholder="Select a material" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wood">Wood</SelectItem>
                  <SelectItem value="vinyl">Vinyl</SelectItem>
                  <SelectItem value="chain-link">Chain-link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button onClick={calculateCost} className="w-full">
              Calculate
            </Button>
            {cost !== null && (
              <div className="text-center text-xl font-bold pt-4">
                <h2>Estimated Cost:</h2>
                <p>${cost.toLocaleString()}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FenceCalculatorPage; 