
import React, { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Square } from "lucide-react";
import { useFencingCalculator } from "./hooks/useFencingCalculator";

const FencingCalculator = () => {
  const {
    length,
    setLength,
    postSpacing,
    setPostSpacing,
    fenceHeight,
    setFenceHeight,
    fenceType,
    setFenceType,
    gateWidth,
    setGateWidth,
    gateCount,
    setGateCount,
    unit,
    setUnit,
    calculateFencingMaterials,
    result,
  } = useFencingCalculator();

  return (
    <AppLayout>
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Link to="/calculators" className="hover:text-blue-500">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <Square className="h-8 w-8 text-emerald-500" />
          <h1 className="text-3xl font-bold">Fencing Calculator</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Input Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Fence Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Unit of Measurement</Label>
                <Select value={unit} onValueChange={setUnit}>
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meters">Meters</SelectItem>
                    <SelectItem value="feet">Feet</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Fence Length ({unit})</Label>
                <Input
                  id="length"
                  type="number"
                  min="0"
                  step="0.1"
                  value={length || ""}
                  onChange={(e) => setLength(parseFloat(e.target.value) || 0)}
                  placeholder={`Enter fence length in ${unit}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fenceType">Fence Type</Label>
                <Select value={fenceType} onValueChange={setFenceType}>
                  <SelectTrigger id="fenceType">
                    <SelectValue placeholder="Select fence type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="picket">Picket Fence</SelectItem>
                    <SelectItem value="privacy">Privacy Fence</SelectItem>
                    <SelectItem value="chain-link">Chain Link</SelectItem>
                    <SelectItem value="post-rail">Post and Rail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fenceHeight">Fence Height ({unit === "meters" ? "m" : "ft"})</Label>
                <Select value={fenceHeight} onValueChange={setFenceHeight}>
                  <SelectTrigger id="fenceHeight">
                    <SelectValue placeholder="Select fence height" />
                  </SelectTrigger>
                  <SelectContent>
                    {unit === "meters" ? (
                      <>
                        <SelectItem value="1.2">1.2m (4ft)</SelectItem>
                        <SelectItem value="1.5">1.5m (5ft)</SelectItem>
                        <SelectItem value="1.8">1.8m (6ft)</SelectItem>
                        <SelectItem value="2.1">2.1m (7ft)</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="4">4ft (1.2m)</SelectItem>
                        <SelectItem value="5">5ft (1.5m)</SelectItem>
                        <SelectItem value="6">6ft (1.8m)</SelectItem>
                        <SelectItem value="7">7ft (2.1m)</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postSpacing">Post Spacing ({unit})</Label>
                <Input
                  id="postSpacing"
                  type="number"
                  min="0.3"
                  step="0.1"
                  value={postSpacing || ""}
                  onChange={(e) => setPostSpacing(parseFloat(e.target.value) || 0)}
                  placeholder={`Enter post spacing in ${unit}`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gateCount">Number of Gates</Label>
                <Input
                  id="gateCount"
                  type="number"
                  min="0"
                  step="1"
                  value={gateCount || ""}
                  onChange={(e) => setGateCount(parseInt(e.target.value) || 0)}
                  placeholder="Enter number of gates"
                />
              </div>

              {gateCount > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="gateWidth">Gate Width ({unit})</Label>
                  <Input
                    id="gateWidth"
                    type="number"
                    min="0"
                    step="0.1"
                    value={gateWidth || ""}
                    onChange={(e) => setGateWidth(parseFloat(e.target.value) || 0)}
                    placeholder={`Enter gate width in ${unit}`}
                  />
                </div>
              )}

              <Button 
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600" 
                onClick={calculateFencingMaterials}
                disabled={!length || !postSpacing}
              >
                Calculate Materials
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Materials Required</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                    <h3 className="text-lg font-medium text-emerald-800 mb-4">Material Summary</h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                        <span className="font-medium">Fence Posts:</span>
                        <span className="text-lg font-bold text-emerald-700">{result.posts} posts</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                        <span className="font-medium">Fence Panels/Sections:</span>
                        <span className="text-lg font-bold text-emerald-700">{result.panels} panels</span>
                      </div>
                      
                      {result.railsPerSection && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Rails:</span>
                          <span className="text-lg font-bold text-emerald-700">{result.totalRails} rails</span>
                        </div>
                      )}
                      
                      {gateCount > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Gates:</span>
                          <span className="text-lg font-bold text-emerald-700">{gateCount} gates</span>
                        </div>
                      )}
                      
                      {result.concreteAmount && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Concrete (for post holes):</span>
                          <span className="text-lg font-bold text-emerald-700">{result.concreteAmount} bags</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-medium">Additional Information:</h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <ul className="space-y-2 text-sm">
                        <li>• Post hole depth should be about 1/3 of the post height</li>
                        <li>• Add 10% extra materials for waste</li>
                        <li>• Concrete estimate is based on standard 60lb bags</li>
                        <li>• For {fenceType} fence, recommended post diameter is {result.postDiameter}"</li>
                      </ul>
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-2">
                      Note: This calculator provides estimates only. Actual materials needed may vary depending on terrain, obstacles, and specific installation methods.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6">
                  <div className="text-emerald-500 bg-emerald-50 p-3 rounded-full mb-3">
                    <Square className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-medium">Enter Fence Specifications</h3>
                  <p className="text-gray-500 mt-1">
                    Fill in the fence details to calculate the required materials
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Tips and Considerations Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Fencing Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Installation Considerations:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Check local building codes and regulations before starting</li>
                  <li>Call utilities to mark underground lines before digging</li>
                  <li>Start and end your fence with a post, not a panel</li>
                  <li>For sloped terrain, consider step-down or racked fencing</li>
                  <li>Set posts in concrete for stability</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Material Selection:</h3>
                <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
                  <li>Choose pressure-treated wood for longer life</li>
                  <li>Consider vinyl for low-maintenance options</li>
                  <li>Metal posts can provide better stability than wood</li>
                  <li>For decorative elements, add post caps and finials</li>
                  <li>Choose gate hardware based on gate weight and usage</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default FencingCalculator;
