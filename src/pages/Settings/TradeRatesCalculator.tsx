import React, { useState, useCallback } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Calculator, Lock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAccess } from "@/hooks/use-feature-access";
import { RateCalculator } from "./components/RateCalculator";
import { CalculationResult } from "./components/CalculationResult";

const TradeRatesCalculator = () => {
  const [quantity, setQuantity] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [total, setTotal] = useState<number | null>(null);
  const { toast } = useToast();
  const { tradeCalculators, isLoading } = useFeatureAccess();

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

  if (isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!tradeCalculators) {
    return (
      <AppLayout>
        <div className="container mx-auto p-4 md:p-6">
          <div className="flex items-center gap-2 mb-6">
            <Link to="/settings" className="hover:text-blue-500">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <Calculator className="h-8 w-8 text-gray-400" />
            <h1 className="text-3xl font-bold text-gray-400">Trade Rates Calculator</h1>
          </div>
          
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-600">
                <Lock className="h-6 w-6" />
                Feature Not Available
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
                <div>
                  <p className="text-muted-foreground mb-4">
                    Trade-specific calculators and features are only available for Growing Pain Relief, Premium Edge, and Skeleton Key subscription tiers.
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Upgrade your subscription to access advanced calculation tools, trade-specific formulas, and specialized features for your industry.
                  </p>
                  <Button asChild>
                    <Link to="/settings/my-plan">
                      View Subscription Plans
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/settings" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Calculator className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Trade Rates Calculator</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Input Section */}
          <Card className="lg:col-span-2 bg-slate-300">
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
          <Card className="bg-slate-300">
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
                  <div className="font-bold text-blue-600">{formatCurrency(total)}</div>
                </div>
                

                {total !== null && (
                  <Button 
                    onClick={handleShareResults}
                    className="w-full"
                  >
                    Share Results
                  </Button>
                )}

              </div>
            </CardContent>
          </Card>
          
          {/* Rate Calculator Section */}
          <Card className="lg:col-span-3 bg-slate-300">
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
