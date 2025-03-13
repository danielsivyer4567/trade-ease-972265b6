
import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Wood types with their properties
const WOOD_TYPES = [
  { name: "Pine", strengthFactor: 1.0, densityFactor: 0.9 },
  { name: "Oak", strengthFactor: 1.5, densityFactor: 1.3 },
  { name: "Hardwood", strengthFactor: 1.3, densityFactor: 1.2 },
  { name: "Softwood", strengthFactor: 0.8, densityFactor: 0.8 },
  { name: "Cedar", strengthFactor: 0.7, densityFactor: 0.7 },
];

// Load types with their multipliers
const LOAD_TYPES = [
  { name: "Residential - Light", factor: 1.0 },
  { name: "Residential - Heavy", factor: 1.5 },
  { name: "Commercial", factor: 2.0 },
  { name: "Industrial", factor: 2.5 },
];

const LoadsSpansCalculator = () => {
  const { toast } = useToast();
  const [beamWidth, setBeamWidth] = useState("200");
  const [beamDepth, setBeamDepth] = useState("300");
  const [loadType, setLoadType] = useState("Residential - Light");
  const [woodType, setWoodType] = useState("Pine");
  const [span, setSpan] = useState("4");
  const [calculatedResult, setCalculatedResult] = useState<{
    maxLoad: number;
    safeLoad: number;
    deflection: number;
  } | null>(null);

  const calculateStress = () => {
    if (!beamWidth || !beamDepth || !span) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Basic calculation variables
    const width = parseFloat(beamWidth);
    const depth = parseFloat(beamDepth);
    const spanLength = parseFloat(span);
    
    // Find wood and load factors
    const selectedWood = WOOD_TYPES.find(wood => wood.name === woodType) || WOOD_TYPES[0];
    const selectedLoad = LOAD_TYPES.find(load => load.name === loadType) || LOAD_TYPES[0];
    
    // Simple beam calculations (this is a simplified model)
    // Maximum distributed load (kg) = (width * depth² * strengthFactor) / (spanLength * 1000)
    const inertia = (width * Math.pow(depth, 3)) / 12;
    const maxLoad = (inertia * selectedWood.strengthFactor) / (spanLength * 1000);
    
    // Safe load is calculated with a safety factor of 2.5
    const safeLoad = maxLoad / 2.5;
    
    // Deflection in mm = (5 * loadFactor * span³) / (384 * E * I)
    // Using simplified approach
    const deflection = (5 * selectedLoad.factor * Math.pow(spanLength, 3)) / 
                      (384 * selectedWood.strengthFactor * inertia / 1000);
    
    setCalculatedResult({
      maxLoad: Number(maxLoad.toFixed(2)),
      safeLoad: Number(safeLoad.toFixed(2)),
      deflection: Number(deflection.toFixed(2)),
    });

    toast({
      title: "Calculation Complete",
      description: "Load and span results have been calculated",
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Ruler className="h-8 w-8 text-amber-500" />
          <h1 className="text-3xl font-bold">Loads and Spans Calculator</h1>
        </div>

        <Tabs defaultValue="beam-calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="beam-calculator">Beam Calculator</TabsTrigger>
            <TabsTrigger value="about">About This Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="beam-calculator" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Beam Dimensions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="beam-width">Beam Width (mm)</Label>
                    <Input
                      id="beam-width"
                      type="number"
                      value={beamWidth}
                      onChange={(e) => setBeamWidth(e.target.value)}
                      min="50"
                      max="1000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beam-depth">Beam Depth (mm)</Label>
                    <Input
                      id="beam-depth"
                      type="number"
                      value={beamDepth}
                      onChange={(e) => setBeamDepth(e.target.value)}
                      min="50"
                      max="1000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Material & Load Properties</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wood-type">Wood Type</Label>
                    <Select value={woodType} onValueChange={setWoodType}>
                      <SelectTrigger id="wood-type">
                        <SelectValue placeholder="Select wood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {WOOD_TYPES.map((wood) => (
                          <SelectItem key={wood.name} value={wood.name}>
                            {wood.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="load-type">Load Type</Label>
                    <Select value={loadType} onValueChange={setLoadType}>
                      <SelectTrigger id="load-type">
                        <SelectValue placeholder="Select load type" />
                      </SelectTrigger>
                      <SelectContent>
                        {LOAD_TYPES.map((load) => (
                          <SelectItem key={load.name} value={load.name}>
                            {load.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Span Length</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="span-length">Span Length (meters)</Label>
                  <Input
                    id="span-length"
                    type="number"
                    value={span}
                    onChange={(e) => setSpan(e.target.value)}
                    min="1"
                    max="20"
                    step="0.1"
                  />
                </div>

                <Button 
                  onClick={calculateStress} 
                  className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
                >
                  Calculate
                </Button>
              </CardContent>
            </Card>

            {calculatedResult && (
              <Card className="bg-amber-50 border-amber-200">
                <CardHeader>
                  <CardTitle className="text-amber-800">Calculation Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Maximum Load</p>
                      <p className="text-2xl font-bold text-amber-600">{calculatedResult.maxLoad} kN</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Safe Working Load</p>
                      <p className="text-2xl font-bold text-green-600">{calculatedResult.safeLoad} kN</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm">
                      <p className="text-sm font-medium text-gray-500">Deflection</p>
                      <p className="text-2xl font-bold text-blue-600">{calculatedResult.deflection} mm</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>About the Loads and Spans Calculator</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  This calculator helps you determine the maximum load capacity and deflection of timber beams based on their dimensions, material properties, and span length.
                </p>
                <p>
                  <strong>How it works:</strong> The calculator uses engineering principles to estimate the load-bearing capacity and deflection of beams under different load conditions.
                </p>
                <p>
                  <strong>Important notes:</strong>
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>This calculator provides estimates only and should not replace professional engineering advice for critical structures.</li>
                  <li>Always consult local building codes and regulations when designing structural elements.</li>
                  <li>The calculations use simplified beam theory and don't account for all real-world variables.</li>
                  <li>A safety factor of 2.5 is applied to determine the safe working load.</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default LoadsSpansCalculator;
