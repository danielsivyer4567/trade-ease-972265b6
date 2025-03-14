
import React from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";
import { ArrowLeft, Square } from "lucide-react";
import { useFencingCalculator, FenceType, Unit } from "./hooks/useFencingCalculator";

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
    FENCING_COMPONENTS_PER_10M
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
                <Select 
                  value={unit} 
                  onValueChange={(value: Unit) => setUnit(value)}
                >
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
                <Select 
                  value={fenceType} 
                  onValueChange={(value: FenceType) => setFenceType(value)}
                >
                  <SelectTrigger id="fenceType">
                    <SelectValue placeholder="Select fence type" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="1.8m butted up with a sleeper">1.8m Butted Up with Sleeper</SelectItem>
                    <SelectItem value="1.8m butted up and capped with a sleeper">1.8m Butted Up and Capped with Sleeper</SelectItem>
                    <SelectItem value="1.8m lapped">1.8m Lapped</SelectItem>
                    <SelectItem value="1.8m lapped and capped">1.8m Lapped and Capped</SelectItem>
                    <SelectItem value="1.8m lapped with a sleeper">1.8m Lapped with Sleeper</SelectItem>
                    <SelectItem value="1.8m lapped and capped with a sleeper">1.8m Lapped and Capped with Sleeper</SelectItem>
                    <SelectItem value="2.1m butted up">2.1m Butted Up</SelectItem>
                    <SelectItem value="2.1m butted up and capped">2.1m Butted Up and Capped</SelectItem>
                    <SelectItem value="2.1m butted up with a sleeper">2.1m Butted Up with Sleeper</SelectItem>
                    <SelectItem value="2.1m butted up and capped with a sleeper">2.1m Butted Up and Capped with Sleeper</SelectItem>
                    <SelectItem value="2.1m lapped">2.1m Lapped</SelectItem>
                    <SelectItem value="2.1m lapped and capped">2.1m Lapped and Capped</SelectItem>
                    <SelectItem value="2.1m lapped with a sleeper">2.1m Lapped with Sleeper</SelectItem>
                    <SelectItem value="2.1m lapped and capped with a sleeper">2.1m Lapped and Capped with Sleeper</SelectItem>
                    <SelectItem value="picket">Picket Fence</SelectItem>
                    <SelectItem value="privacy">Privacy Fence</SelectItem>
                    <SelectItem value="chain-link">Chain Link</SelectItem>
                    <SelectItem value="post-rail">Post and Rail</SelectItem>
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
                      
                      {result.palings !== undefined && result.palings > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Palings (100x16mm):</span>
                          <span className="text-lg font-bold text-emerald-700">{result.palings} palings</span>
                        </div>
                      )}
                      
                      {result.totalRails !== undefined && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Rails (75x38mm):</span>
                          <span className="text-lg font-bold text-emerald-700">{result.totalRails} rails</span>
                        </div>
                      )}
                      
                      {result.nails !== undefined && result.nails > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Nails:</span>
                          <span className="text-lg font-bold text-emerald-700">{result.nails} nails</span>
                        </div>
                      )}
                      
                      {result.screws !== undefined && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Screws:</span>
                          <span className="text-lg font-bold text-emerald-700">{result.screws} screws</span>
                        </div>
                      )}
                      
                      {result.rapidSets !== undefined && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Rapid Set (30kg):</span>
                          <span className="text-lg font-bold text-emerald-700">{result.rapidSets} bags</span>
                        </div>
                      )}
                      
                      {result.caps !== undefined && result.caps > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">Caps:</span>
                          <span className="text-lg font-bold text-emerald-700">{result.caps} caps</span>
                        </div>
                      )}
                      
                      {result.sleepers !== undefined && result.sleepers > 0 && (
                        <div className="flex justify-between items-center pb-2 border-b border-emerald-100">
                          <span className="font-medium">2.4m Sleepers:</span>
                          <span className="text-lg font-bold text-emerald-700">{result.sleepers} sleepers</span>
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
                        <li>• Concrete estimate is based on standard 20kg bags</li>
                        <li>• Post height for {fenceType}: {FENCING_COMPONENTS_PER_10M[fenceType]?.postHeight}</li>
                        <li>• Recommended post diameter: {result.postDiameter}"</li>
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

        {/* Fence Types Reference Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Fence Types Reference</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-emerald-50">
                    <th className="p-2 text-left border">Fence Type</th>
                    <th className="p-2 text-center border">Palings (100x16mm)</th>
                    <th className="p-2 text-center border">Panels</th>
                    <th className="p-2 text-center border">Post Height</th>
                    <th className="p-2 text-center border">Posts</th>
                    <th className="p-2 text-center border">Rails (75x38mm)</th>
                    <th className="p-2 text-center border">Nails</th>
                    <th className="p-2 text-center border">Screws</th>
                    <th className="p-2 text-center border">Rapid Set</th>
                    <th className="p-2 text-center border">Caps</th>
                    <th className="p-2 text-center border">Sleepers</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(FENCING_COMPONENTS_PER_10M)
                    .filter(([key]) => !["picket", "privacy", "chain-link", "post-rail"].includes(key))
                    .map(([type, data], index) => (
                      <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-2 border">{type}</td>
                        <td className="p-2 text-center border">{data.palings}</td>
                        <td className="p-2 text-center border">{data.panels}</td>
                        <td className="p-2 text-center border">{data.postHeight}</td>
                        <td className="p-2 text-center border">{data.posts}</td>
                        <td className="p-2 text-center border">{data.rails}</td>
                        <td className="p-2 text-center border">{data.nails}</td>
                        <td className="p-2 text-center border">{data.screws}</td>
                        <td className="p-2 text-center border">{data.rapidSets}</td>
                        <td className="p-2 text-center border">{data.caps || "-"}</td>
                        <td className="p-2 text-center border">{data.sleepers || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <p className="text-xs text-gray-500 mt-2">
                Note: The values above are for 10 meters of fencing. The calculator will scale these values based on your fence length.
              </p>
            </div>
          </CardContent>
        </Card>

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
