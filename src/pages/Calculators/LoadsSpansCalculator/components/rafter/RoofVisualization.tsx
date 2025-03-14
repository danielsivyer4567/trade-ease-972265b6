
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

  // Initialize canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    const chartCanvas = chartCanvasRef.current;
    
    if (canvas && chartCanvas) {
      // Set canvas size based on container
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 280; // Increased from 220 to 280 for the new visualization
        
        chartCanvas.width = container.clientWidth;
        chartCanvas.height = 250;
      }
      
      // Initial drawing
      if (viewMode === "stack") {
        drawRoofVisualization(canvasRef, sections, totalArea);
      } else {
        drawBarChart(chartCanvasRef, sections, totalArea);
      }
    }
    
    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      const chartCanvas = chartCanvasRef.current;
      const container = canvas?.parentElement;
      
      if (canvas && chartCanvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = 280; // Increased from 220 to 280 for the new visualization
        
        chartCanvas.width = container.clientWidth;
        chartCanvas.height = 250;
        
        if (viewMode === "stack") {
          drawRoofVisualization(canvasRef, sections, totalArea);
        } else {
          drawBarChart(chartCanvasRef, sections, totalArea);
        }
      }
    };
    
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
          <canvas 
            ref={canvasRef} 
            className="w-full border rounded-md bg-white"
            height="280"
          />
        ) : (
          <canvas 
            ref={chartCanvasRef} 
            className="w-full border rounded-md bg-white"
            height="250"
          />
        )}
      </div>
    </>
  );
};
