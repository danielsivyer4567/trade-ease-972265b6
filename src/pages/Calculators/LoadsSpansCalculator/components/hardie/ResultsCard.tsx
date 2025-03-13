
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { HardieResult } from "../../hooks/useJamesHardieCalculator";

interface ResultsCardProps {
  hardieResult: HardieResult | null;
}

export const ResultsCard: React.FC<ResultsCardProps> = ({ hardieResult }) => {
  if (!hardieResult) return null;
  
  return (
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
                {hardieResult.applicationArea === "Wet Areas" && (
                  <li>✓ AS 3740: Waterproofing in wet areas</li>
                )}
                {parseFloat(hardieResult.windLoad) > 2.5 && (
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
  );
};
