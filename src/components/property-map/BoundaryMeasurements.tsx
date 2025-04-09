
import React from 'react';
import { Card } from "@/components/ui/card";
import { BoundaryEdge } from './types';
import { Ruler } from 'lucide-react';

export interface BoundaryMeasurementsProps {
  edges: BoundaryEdge[];
  showMeasurements: boolean;
}

export const BoundaryMeasurements: React.FC<BoundaryMeasurementsProps> = ({
  edges,
  showMeasurements
}) => {
  if (!showMeasurements || edges.length === 0) {
    return null;
  }
  
  // Group edges by boundary
  const edgesByBoundary: Record<number, BoundaryEdge[]> = {};
  edges.forEach(edge => {
    if (!edgesByBoundary[edge.boundaryIndex]) {
      edgesByBoundary[edge.boundaryIndex] = [];
    }
    edgesByBoundary[edge.boundaryIndex].push(edge);
  });
  
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <Ruler className="h-5 w-5 text-primary" /> 
        Boundary Measurements
      </h3>
      
      <div className="space-y-4">
        {Object.entries(edgesByBoundary).map(([boundaryIndex, boundaryEdges]) => (
          <Card key={boundaryIndex} className="p-4">
            <h4 className="text-md font-medium mb-3">Boundary {parseInt(boundaryIndex) + 1}</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {boundaryEdges.sort((a, b) => a.edgeIndex - b.edgeIndex).map(edge => (
                <div 
                  key={edge.id} 
                  className="bg-secondary/10 p-3 rounded-lg flex flex-col items-center justify-center border border-secondary/20 hover:bg-secondary/20 transition-colors"
                >
                  <div className="text-sm text-muted-foreground">Side {edge.edgeIndex + 1}</div>
                  <div className="text-xl font-bold">{edge.displayLength} m</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
