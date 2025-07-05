import React, { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Percent, History } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCalculationHistory } from "@/hooks/use-calculation-history";
import { CalculationHistory } from "@/components/ui/CalculationHistory";

const MarkupCalculator = () => {
  const [cost, setCost] = useState<number | ''>('');
  const [markup, setMarkup] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | null>(null);
  const [profit, setProfit] = useState<number | null>(null);
  const [marginPercent, setMarginPercent] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("markup");
  const [activeView, setActiveView] = useState("calculator");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { calculations, addCalculation, deleteCalculation } = useCalculationHistory();

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

      // Save to calculation history
      addCalculation('Markup Calculator', {
        cost: numericCost,
        markup: numericMarkup,
        type: 'markup'
      }, {
        sellingPrice: calculatedSellingPrice,
        profit: calculatedProfit,
        marginPercent: calculatedMarginPercent
      });
    } else {
      // For margin calculation: selling price = cost / (1 - margin/100)
      const calculatedSellingPrice = numericCost / (1 - numericMarkup / 100);
      const calculatedProfit = calculatedSellingPrice - numericCost;
      const calculatedMarkup = (calculatedProfit / numericCost) * 100;
      
      setSellingPrice(calculatedSellingPrice);
      setProfit(calculatedProfit);
      // We don't update marginPercent here since it's the input value

      // Save to calculation history
      addCalculation('Markup Calculator', {
        cost: numericCost,
        margin: numericMarkup,
        type: 'margin'
      }, {
        sellingPrice: calculatedSellingPrice,
        profit: calculatedProfit,
        markup: calculatedMarkup
      });
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

  const handleRestoreCalculation = (calculation: any) => {
    if (calculation.inputs.type === 'markup') {
      setActiveTab('markup');
      setCost(calculation.inputs.cost);
      setMarkup(calculation.inputs.markup);
    } else {
      setActiveTab('margin');
      setCost(calculation.inputs.cost);
      setMarkup(calculation.inputs.margin);
    }
    setActiveView('calculator');
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Percent className="h-8 w-8 text-blue-500" />
          <h1 className="text-3xl font-bold">Markup Calculator</h1>
        </div>
        
        <Tabs value={activeView} onValueChange={setActiveView} className="mb-6">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="calculator">Calculator</TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="calculator">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Calculator Input Section */}
              <Card className="lg:col-span-2 bg-slate-300">
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
              <Card className="bg-slate-300">
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
                      <div className="font-bold text-blue-600">{formatCurrency(sellingPrice)}</div>
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
                    
                    <Button onClick={handleShareResults} className="w-full bg-blue-500 hover:bg-blue-600">
                      Copy Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="history">
            <CalculationHistory
              calculations={calculations.filter(calc => calc.calculatorType === 'Markup Calculator')}
              onDelete={deleteCalculation}
              onRestore={handleRestoreCalculation}
            />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default MarkupCalculator;
