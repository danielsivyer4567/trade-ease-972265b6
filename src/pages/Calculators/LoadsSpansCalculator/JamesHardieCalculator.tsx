
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { HARDIE_PRODUCT_TYPES, HARDIE_THICKNESSES, HARDIE_APPLICATION_AREAS } from "./constants";
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
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>James Hardie Product Selection</CardTitle>
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
          </CardContent>
        </Card>
      )}
    </>
  );
};
