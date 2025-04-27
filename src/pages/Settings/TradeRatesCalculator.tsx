import React, { useState, useCallback } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { RateCalculator } from "./components/RateCalculator";
import { CalculationResult } from "./components/CalculationResult";

const TradeRatesCalculator = () => {
  const [quantity, setQuantity] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [total, setTotal] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateTotal = useCallback(() => {
    if (quantity === '' || rate === '') {
      setTotal(null);
      return;
    }

    const numericQuantity = Number(quantity);
    const numericRate = Number(rate);
    
    if (isNaN(numericQuantity) || isNaN(numericRate)) return;

    const calculatedTotal = numericQuantity * numericRate;
    setTotal(calculatedTotal);
  }, [quantity, rate]);

  const handleShareResults = useCallback(async () => {
    try {
      const text = `Quantity: ${quantity}, Rate: $${rate}, Total: $${total?.toFixed(2)}`;
      await navigator.clipboard.writeText(text);
      toast({
        title: "Results copied to clipboard",
        description: "You can now paste the calculation results."
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "Failed to copy results",
        description: "Please try again or copy manually.",
        variant: "destructive"
      });
    }
  }, [quantity, rate, total, toast]);

  const formatCurrency = useCallback((value: number | null) => {
    if (value === null) return "-";
    return `$${value.toFixed(2)}`;
  }, []);

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/settings" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Calculator className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Trade Rates Calculator</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Input Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calculate Total</CardTitle>
              <CardDescription>
                Calculate the total based on quantity and rate
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter quantity"
                    value={quantity}
                    onChange={(e) => {
                      setQuantity(e.target.value === '' ? '' : Number(e.target.value));
                      calculateTotal();
                    }}
                  />
                </div>
                
                <div>
                  <Label htmlFor="rate">Rate ($)</Label>
                  <Input
                    id="rate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter rate"
                    value={rate}
                    onChange={(e) => {
                      setRate(e.target.value === '' ? '' : Number(e.target.value));
                      calculateTotal();
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card>
            <CardHeader>
              <CardTitle>Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Quantity:</div>
                  <div>{quantity === '' ? '-' : quantity}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Rate:</div>
                  <div>{formatCurrency(rate === '' ? null : Number(rate))}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Total:</div>
                  <div className="font-bold text-green-600">{formatCurrency(total)}</div>
                </div>
                
                <Button 
                  onClick={handleShareResults} 
                  disabled={!total}
                  className="w-full mt-4"
                >
                  Copy Results
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Rate Calculator Section */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Rate Calculator</CardTitle>
              <CardDescription>
                Calculate rates for different types of work
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RateCalculator />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default TradeRatesCalculator;
