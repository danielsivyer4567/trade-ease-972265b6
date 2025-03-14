
import React, { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BarChart2, SquareStack } from "lucide-react";
import { RoofSection, ViewMode } from "../../types/rafterRoof";
import { drawRoofVisualization, drawBarChart } from "../../utils/rafterRoofVisualizer";

interface RoofVisualizationProps {
  sections: RoofSection[];
  totalArea: number;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const RoofVisualization: React.FC<RoofVisualizationProps> = ({
  sections,
  totalArea,
  viewMode,
  setViewMode
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  // Update visualization when sections or viewMode change
  useEffect(() => {
    if (viewMode === "stack") {
      drawRoofVisualization(canvasRef, sections, totalArea);
    } else {
      drawBarChart(chartCanvasRef, sections, totalArea);
    }
  }, [sections, totalArea, viewMode]);

  // Initialize canvas on component mount and handle resize
  useEffect(() => {
    const canvas = canvasRef.current;
    const chartCanvas = chartCanvasRef.current;
    
    const setupCanvas = () => {
      if (canvas && chartCanvas) {
        // Get the container dimensions
        const container = canvas.parentElement;
        if (!container) return;
        
        const containerWidth = container.clientWidth;
        const dpr = window.devicePixelRatio || 1;

        // Set the canvas dimensions with the device pixel ratio factored in
        canvas.width = containerWidth * dpr;
        canvas.height = 220 * dpr;
        canvas.style.width = `${containerWidth}px`;
        canvas.style.height = `220px`;
        
        chartCanvas.width = containerWidth * dpr;
        chartCanvas.height = 220 * dpr; // Increase chart canvas height
        chartCanvas.style.width = `${containerWidth}px`;
        chartCanvas.style.height = `220px`; // Match with actual height
        
        // Scale the canvas context to account for the device pixel ratio
        const ctx = canvas.getContext('2d');
        const chartCtx = chartCanvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        if (chartCtx) chartCtx.scale(dpr, dpr);

        // Initial drawing
        if (viewMode === "stack") {
          drawRoofVisualization(canvasRef, sections, totalArea);
        } else {
          drawBarChart(chartCanvasRef, sections, totalArea);
        }
      }
    };

    // Initial setup
    setupCanvas();
    
    // Handle window resize
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [sections, totalArea, viewMode]);

  return (
    <>
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-md font-medium">Roof Visualization</h3>
        <div className="flex gap-2">
          <Button 
            variant={viewMode === "stack" ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1 h-7 text-xs" 
            onClick={() => setViewMode("stack")}
          >
            <SquareStack className="h-3 w-3" />
            <span className="hidden sm:inline">Triangular View</span>
          </Button>
          <Button 
            variant={viewMode === "chart" ? "default" : "outline"} 
            size="sm" 
            className="flex items-center gap-1 h-7 text-xs" 
            onClick={() => setViewMode("chart")}
          >
            <BarChart2 className="h-3 w-3" />
            <span className="hidden sm:inline">Chart View</span>
          </Button>
        </div>
      </div>
      
      <div className="w-full">
        {viewMode === "stack" ? (
          <div className="w-full border rounded-md bg-white p-2 flex justify-center">
            <img 
              src="/lovable-uploads/ae3d67e8-3620-4069-b805-8133fef2a567.png" 
              alt="Roof visualization diagram" 
              className="max-w-full max-h-[220px] object-contain" 
            />
          </div>
        ) : (
          <div className="w-full border rounded-md bg-white p-0 my-0 h-[220px]">
            <canvas ref={chartCanvasRef} className="w-full h-full" />
          </div>
        )}
      </div>
    </>
  );
};
