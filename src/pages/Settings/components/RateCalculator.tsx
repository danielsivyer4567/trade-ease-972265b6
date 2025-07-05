import React, { useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const RateCalculator = () => {
  const [hours, setHours] = useState<number | ''>('');
  const [rate, setRate] = useState<number | ''>('');
  const [total, setTotal] = useState<number | null>(null);
  const { toast } = useToast();

  const calculateTotal = useCallback(() => {
    if (hours === '' || rate === '') {
      setTotal(null);
      return;
    }

    const numericHours = Number(hours);
    const numericRate = Number(rate);
    
    if (isNaN(numericHours) || isNaN(numericRate)) return;

    const calculatedTotal = numericHours * numericRate;
    setTotal(calculatedTotal);
  }, [hours, rate]);

  const handleShareResults = useCallback(async () => {
    try {
      const text = `Hours: ${hours}, Rate: $${rate}/hr, Total: $${total?.toFixed(2)}`;
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
  }, [hours, rate, total, toast]);

  const formatCurrency = useCallback((value: number | null) => {
    if (value === null) return "-";
    return `$${value.toFixed(2)}`;
  }, []);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="hours">Hours</Label>
          <Input
            id="hours"
            type="number"
            min="0"
            step="0.5"
            placeholder="Enter hours"
            value={hours}
            onChange={(e) => {
              setHours(e.target.value === '' ? '' : Number(e.target.value));
              calculateTotal();
            }}
          />
        </div>
        
        <div>
          <Label htmlFor="rate">Rate per Hour ($)</Label>
          <Input
            id="rate"
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter rate per hour"
            value={rate}
            onChange={(e) => {
              setRate(e.target.value === '' ? '' : Number(e.target.value));
              calculateTotal();
            }}
          />
        </div>
      </div>

      <Card className="bg-slate-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Hours:</div>
              <div>{hours === '' ? '-' : hours}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Rate:</div>
              <div>{formatCurrency(rate === '' ? null : Number(rate))}/hr</div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">Total:</div>
              <div className="font-bold text-blue-600">{formatCurrency(total)}</div>
            </div>
            
            <Button 
              onClick={handleShareResults} 
              disabled={!total}
              className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
            >
              Copy Results
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
