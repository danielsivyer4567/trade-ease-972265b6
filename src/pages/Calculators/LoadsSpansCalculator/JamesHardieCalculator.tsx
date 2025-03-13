
import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { HARDIE_PRODUCT_TYPES, HARDIE_THICKNESSES, HARDIE_APPLICATION_AREAS, WIND_LOAD_CATEGORIES } from "./constants";
import { HardieResult } from "./hooks/useJamesHardieCalculator";

interface JamesHardieCalculatorProps {
  productType: string;
  setProductType: (value: string) => void;
  thickness: string;
  setThickness: (value: string) => void;
  applicationArea: string;
  setApplicationArea: (value: string) => void;
  supportSpacing: string;
  setSupportSpacing: (value: string) => void;
  windLoad: string;
  setWindLoad: (value: string) => void;
  hardieResult: HardieResult | null;
  setHardieResult: (result: HardieResult | null) => void;
  calculateHardieRequirements: () => void;
}

export const JamesHardieCalculator: React.FC<JamesHardieCalculatorProps> = ({
  productType,
  setProductType,
  thickness,
  setThickness,
  applicationArea,
  setApplicationArea,
  supportSpacing,
  setSupportSpacing,
  windLoad,
  setWindLoad,
  hardieResult,
  calculateHardieRequirements
}) => {
  // Get selected product details for additional information
  const selectedProduct = HARDIE_PRODUCT_TYPES.find(p => p.name === productType) || HARDIE_PRODUCT_TYPES[0];
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>James Hardie Product Selection</CardTitle>
          <CardDescription>
            James Hardie is a leading manufacturer of fiber cement products, widely used in construction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product-type">Product Type</Label>
              <Select value={productType} onValueChange={setProductType}>
                <SelectTrigger id="product-type">
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {HARDIE_PRODUCT_TYPES.map((product) => (
                    <SelectItem key={product.name} value={product.name}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedProduct && (
                <p className="text-sm text-gray-500 mt-1">{selectedProduct.description}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="thickness">Thickness</Label>
              <Select value={thickness} onValueChange={setThickness}>
                <SelectTrigger id="thickness">
                  <SelectValue placeholder="Select thickness" />
                </SelectTrigger>
                <SelectContent>
                  {HARDIE_THICKNESSES.map((thick) => (
                    <SelectItem key={thick} value={thick}>
                      {thick}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                Thickness affects load capacity, fire rating, and acoustic properties
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Application Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="application-area">Application Area</Label>
              <Select value={applicationArea} onValueChange={setApplicationArea}>
                <SelectTrigger id="application-area">
                  <SelectValue placeholder="Select application area" />
                </SelectTrigger>
                <SelectContent>
                  {HARDIE_APPLICATION_AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-500 mt-1">
                {applicationArea === "Wet Areas" && "Requires special waterproofing to meet AS 3740"}
                {applicationArea === "Flooring" && "Suitable for tile, vinyl, and carpet applications"}
                {applicationArea === "Exterior Wall" && "Requires weather-resistant products"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="support-spacing">Support Spacing (mm)</Label>
              <Input
                id="support-spacing"
                type="number"
                value={supportSpacing}
                onChange={(e) => setSupportSpacing(e.target.value)}
                min="150"
                max="900"
                step="50"
              />
              <p className="text-sm text-gray-500 mt-1">
                Standard spacings are 450mm or 600mm for studs/joists
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Wind Load Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wind-load">Wind Load (kPa)</Label>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-1">
                <Input
                  id="wind-load"
                  type="number"
                  value={windLoad}
                  onChange={(e) => setWindLoad(e.target.value)}
                  min="0.5"
                  max="7"
                  step="0.5"
                />
              </div>
              <div className="md:col-span-3">
                <Select 
                  onValueChange={(val) => setWindLoad(WIND_LOAD_CATEGORIES.find(w => w.name === val)?.kPa.toString() || windLoad)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Or select wind category" />
                  </SelectTrigger>
                  <SelectContent>
                    {WIND_LOAD_CATEGORIES.map((category) => (
                      <SelectItem key={category.name} value={category.name}>
                        {category.name} - {category.description} ({category.kPa} kPa)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Wind load affects fastening requirements and support spacing
            </p>
          </div>

          <Button 
            onClick={calculateHardieRequirements} 
            className="w-full mt-4 bg-amber-500 hover:bg-amber-600"
          >
            Calculate Requirements
          </Button>
        </CardContent>
      </Card>

      {hardieResult && (
        <Card className="bg-amber-50 border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-800">James Hardie Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Recommended Fastener Type</p>
                <p className="text-xl font-bold text-amber-600">{hardieResult.fastenerType}</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Fastener Spacing</p>
                <p className="text-xl font-bold text-green-600">{hardieResult.fastenerSpacing} mm</p>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-sm">
                <p className="text-sm font-medium text-gray-500">Max. Support Spacing</p>
                <p className="text-xl font-bold text-blue-600">{hardieResult.maxSupportSpacing} mm</p>
              </div>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm mt-2">
              <p className="text-sm font-medium text-gray-500">Installation Notes</p>
              <p className="text-md text-gray-800 mt-1">{hardieResult.notes}</p>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-800">Technical Properties</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Fire Rating</p>
                    <p className="text-sm font-semibold">{hardieResult.fireRating}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Bushfire Rating</p>
                    <p className="text-sm font-semibold">{hardieResult.bushfireRating}</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Sound Rating (STC)</p>
                    <p className="text-sm font-semibold">{hardieResult.soundRating} dB</p>
                  </div>
                  <div className="p-3 bg-white rounded-lg shadow-sm">
                    <p className="text-xs font-medium text-gray-500">Thermal R-Value</p>
                    <p className="text-sm font-semibold">{hardieResult.thermalRValue} m²·K/W</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-amber-800">Standards Compliance</h3>
                <div className="p-3 bg-white rounded-lg shadow-sm">
                  <ul className="text-sm space-y-1">
                    <li>✓ AS 1530.1: Non-combustibility</li>
                    <li>✓ AS 1684: Timber framing compatibility</li>
                    <li>✓ AS 1170: Structural design loads</li>
                    {applicationArea === "Wet Areas" && (
                      <li>✓ AS 3740: Waterproofing in wet areas</li>
                    )}
                    {parseFloat(windLoad) > 2.5 && (
                      <li>✓ AS 4055: Wind loads for housing</li>
                    )}
                    {hardieResult.bushfireRating !== "BAL-12.5" && (
                      <li>✓ AS 3959: Construction in bushfire-prone areas</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};
