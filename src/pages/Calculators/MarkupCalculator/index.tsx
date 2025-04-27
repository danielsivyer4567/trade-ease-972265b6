import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Percent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

const MarkupCalculator = () => {
  const [cost, setCost] = useState<number | ''>('');
  const [markup, setMarkup] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [marginPercent, setMarginPercent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("markup");
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Calculate selling price when cost and markup change
  useEffect(() => {
    calculateResults();
  }, [cost, markup]);

  const calculateResults = () => {
    if (cost === '' || markup === '') {
      setSellingPrice(null);
      setProfit(null);
      setMarginPercent(null);
      return;
    }

    const numericCost = Number(cost);
    const numericMarkup = Number(markup);
    
    if (isNaN(numericCost) || isNaN(numericMarkup)) return;

    if (activeTab === "markup") {
      // For markup calculation: selling price = cost * (1 + markup/100)
      const calculatedSellingPrice = numericCost * (1 + numericMarkup / 100);
      const calculatedProfit = calculatedSellingPrice - numericCost;
      const calculatedMarginPercent = (calculatedProfit / calculatedSellingPrice) * 100;
      
      setSellingPrice(calculatedSellingPrice);
      setProfit(calculatedProfit);
      setMarginPercent(calculatedMarginPercent);
    } else {
      // For margin calculation: selling price = cost / (1 - margin/100)
      const calculatedSellingPrice = numericCost / (1 - numericMarkup / 100);
      const calculatedProfit = calculatedSellingPrice - numericCost;
      const calculatedMarkup = (calculatedProfit / numericCost) * 100;
      
      setSellingPrice(calculatedSellingPrice);
      setProfit(calculatedProfit);
      // We don't update marginPercent here since it's the input value
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setCost('');
    setMarkup('');
    setSellingPrice(null);
    setProfit(null);
    setMarginPercent(null);
  };

  const handleShareResults = () => {
    navigator.clipboard.writeText(
      `Cost: $${cost}, ${activeTab === "markup" ? "Markup" : "Margin"}: ${markup}%, Selling Price: $${sellingPrice?.toFixed(2)}`
    ).then(() => {
      toast({
        title: "Results copied to clipboard",
        description: "You can now paste the calculation results."
      });
    });
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return `$${value.toFixed(2)}`;
  };

  const formatPercent = (value: number | null) => {
    if (value === null) return "-";
    return `${value.toFixed(2)}%`;
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Percent className="h-8 w-8 text-green-500" />
          <h1 className="text-3xl font-bold">Markup Calculator</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calculator Input Section */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Calculate Price</CardTitle>
              <CardDescription>
                {activeTab === "markup"
                  ? "Add a markup percentage to your cost price"
                  : "Set a profit margin percentage for your pricing"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={handleTabChange} className="mb-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="markup">Markup Calculation</TabsTrigger>
                  <TabsTrigger value="margin">Margin Calculation</TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cost">Cost Price ($)</Label>
                  <Input
                    id="cost"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter cost price"
                    value={cost}
                    onChange={(e) => setCost(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="markup">
                    {activeTab === "markup" ? "Markup Percentage (%)" : "Margin Percentage (%)"}
                  </Label>
                  <Input
                    id="markup"
                    type="number"
                    min="0"
                    max={activeTab === "margin" ? "99.99" : undefined}
                    step="0.1"
                    placeholder={`Enter ${activeTab === "markup" ? "markup" : "margin"} percentage`}
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  {activeTab === "margin" && markup && Number(markup) >= 100 && (
                    <p className="text-red-500 text-sm mt-1">
                      Margin percentage must be less than 100%
                    </p>
                  )}
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
                  <div className="font-medium">Cost Price:</div>
                  <div>{formatCurrency(cost === '' ? null : Number(cost))}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">
                    {activeTab === "markup" ? "Markup:" : "Margin:"}
                  </div>
                  <div>{markup === '' ? '-' : `${markup}%`}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Selling Price:</div>
                  <div className="font-bold text-green-600">{formatCurrency(sellingPrice)}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="font-medium">Profit:</div>
                  <div>{formatCurrency(profit)}</div>
                </div>
                
                {activeTab === "markup" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Profit Margin:</div>
                    <div>{formatPercent(marginPercent)}</div>
                  </div>
                )}
                {activeTab === "margin" && (
                  <div className="grid grid-cols-2 gap-2">
                    <div className="font-medium">Markup Rate:</div>
                    <div>{formatPercent(markup === '' ? null : Number(markup))}</div>
                  </div>
                )}
                
                <Button 
                  onClick={handleShareResults} 
                  disabled={!sellingPrice}
                  className="w-full mt-4"
                >
                  Copy Results
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Information Card */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Understanding Markup vs. Margin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Markup</h3>
                  <p className="text-gray-700 mb-2">
                    Markup is the percentage added to the cost price to determine the selling price.
                  </p>
                  <p className="text-gray-700">
                    <strong>Formula:</strong> Markup = (Profit / Cost) × 100
                  </p>
                  <p className="text-gray-700">
                    <strong>Example:</strong> If cost is $100 and markup is 25%, the selling price is $125.
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Margin</h3>
                  <p className="text-gray-700 mb-2">
                    Margin is the percentage of the selling price that represents profit.
                  </p>
                  <p className="text-gray-700">
                    <strong>Formula:</strong> Margin = (Profit / Selling Price) × 100
                  </p>
                  <p className="text-gray-700">
                    <strong>Example:</strong> If selling price is $125 and cost is $100, the margin is 20%.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default MarkupCalculator;
