
import React from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Square } from "lucide-react";
import { FencingResult, FenceType } from "../hooks/useFencingCalculator";

interface FencingResultsCardProps {
  result: FencingResult | null;
  fenceType: FenceType;
  FENCING_COMPONENTS_PER_10M: Record<string, any>;
  gateCount: number;
}

export const FencingResultsCard: React.FC<FencingResultsCardProps> = ({ 
  result, 
  fenceType, 
  FENCING_COMPONENTS_PER_10M,
  gateCount
}) => {
  return (
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
  );
};
