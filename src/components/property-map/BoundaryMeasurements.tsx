import React, { useMemo } from 'react';
import { Card } from "@/components/ui/card";
import { BoundaryEdge } from './types';
import { Ruler, Square } from 'lucide-react';

export interface BoundaryMeasurementsProps {
  edges: BoundaryEdge[];
  showMeasurements: boolean;
}

export const BoundaryMeasurements: React.FC<BoundaryMeasurementsProps> = ({
  edges,
  showMeasurements
}) => {
  if (!showMeasurements || !edges || edges.length === 0) {
    return (
      <div className="mt-6 bg-white p-4 rounded-lg shadow-sm text-center">
        <p className="text-muted-foreground">No boundary measurements available</p>
      </div>
    );
  }
  
  // Group edges by boundary and add index information
  const edgesByBoundary = useMemo(() => {
    const result: Record<number, Array<BoundaryEdge & { index: number }>> = {};
    
    edges.forEach((edge, index) => {
      if (!result[edge.boundaryIndex]) {
        result[edge.boundaryIndex] = [];
      }
      result[edge.boundaryIndex].push({
        ...edge,
        index
      });
    });
    
    return result;
  }, [edges]);
  
  const formatDistance = (meters: number): string => {
    return `${Math.round(meters)} m`;
  };
  
  return (
    <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Ruler className="h-5 w-5 text-primary" /> 
        Boundary Measurements
      </h3>
      
      <div className="space-y-4">
        {Object.entries(edgesByBoundary).length > 0 ? (
          Object.entries(edgesByBoundary).map(([boundaryIndex, boundaryEdges]) => (
            <Card key={boundaryIndex} className="p-4">
              <h4 className="text-md font-medium mb-3 flex items-center gap-2">
                <Square className="h-4 w-4 text-primary" />
                Boundary {parseInt(boundaryIndex) + 1}
              </h4>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {boundaryEdges.sort((a, b) => a.index - b.index).map((edge, i) => (
                  <div 
                    key={`edge-${edge.boundaryIndex}-${i}`} 
                    className="bg-secondary/10 p-3 rounded-lg flex flex-col items-center justify-center border border-secondary/20 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="text-sm text-muted-foreground">Side {i + 1}</div>
                    <div className="text-xl font-bold">{formatDistance(edge.length)}</div>
                  </div>
                ))}
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No boundary edges found</p>
          </div>
        )}
      </div>
    </div>
  );
};
