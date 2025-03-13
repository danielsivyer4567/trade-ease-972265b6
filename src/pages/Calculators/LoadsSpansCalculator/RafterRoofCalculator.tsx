
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, BarChart2, SquareStack } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface RoofSection {
  height: string;
  length: string;
  area: number;
}

interface RafterRoofCalculatorProps {}

export const RafterRoofCalculator: React.FC<RafterRoofCalculatorProps> = () => {
  const [sections, setSections] = useState<RoofSection[]>([
    { height: "3", length: "2.4", area: 7.2 },
    { height: "2.5", length: "9.55", area: 23.875 }
  ]);
  const [totalArea, setTotalArea] = useState<number>(0);
  const [viewMode, setViewMode] = useState<"stack" | "chart">("stack");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartCanvasRef = useRef<HTMLCanvasElement>(null);

  const addSection = () => {
    setSections([...sections, { height: "", length: "", area: 0 }]);
  };

  const removeSection = (index: number) => {
    const newSections = [...sections];
    newSections.splice(index, 1);
    setSections(newSections);
  };

  const updateSection = (index: number, field: 'height' | 'length', value: string) => {
    const newSections = [...sections];
    newSections[index][field] = value;
    
    // Calculate area if both height and length have values
    if (newSections[index].height && newSections[index].length) {
      const height = parseFloat(newSections[index].height);
      const length = parseFloat(newSections[index].length);
      if (!isNaN(height) && !isNaN(length)) {
        newSections[index].area = height * length;
      }
    }
    
    setSections(newSections);
  };

  const calculateTotalArea = () => {
    const total = sections.reduce((sum, section) => sum + section.area, 0);
    setTotalArea(total);
    drawRoofVisualization();
    drawBarChart();
  };

  const drawRoofVisualization = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Find max height and length for scaling
    const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
    const totalLength = sections.reduce((sum, s) => sum + (parseFloat(s.length) || 0), 0);
    
    // Scale factors
    const heightScale = (canvasHeight - 60) / (maxHeight || 1);
    const lengthScale = (canvasWidth - 60) / (totalLength || 1);
    
    // Start position
    let x = 30;
    const baseY = canvasHeight - 30;
    
    // Draw sections
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.fillStyle = 'rgba(255, 193, 7, 0.2)';
    
    // Draw baseline
    ctx.beginPath();
    ctx.moveTo(30, baseY);
    ctx.lineTo(canvasWidth - 30, baseY);
    ctx.stroke();
    
    // Draw roof sections
    for (const section of sections) {
      const height = parseFloat(section.height) || 0;
      const length = parseFloat(section.length) || 0;
      
      if (height && length) {
        const scaledHeight = height * heightScale;
        const scaledLength = length * lengthScale;
        
        // Draw the section
        ctx.beginPath();
        ctx.moveTo(x, baseY);
        ctx.lineTo(x, baseY - scaledHeight);
        ctx.lineTo(x + scaledLength, baseY - scaledHeight);
        ctx.lineTo(x + scaledLength, baseY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Draw area label
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(
          `${section.area.toFixed(1)} m²`, 
          x + scaledLength / 2 - 20, 
          baseY - scaledHeight / 2
        );
        
        x += scaledLength;
      }
    }
    
    // Reset fill style for next drawing
    ctx.fillStyle = 'rgba(255, 193, 7, 0.2)';
    
    // Draw total area
    ctx.font = '14px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText(`Total Area: ${totalArea.toFixed(2)} m²`, 30, 20);
  };

  const drawBarChart = () => {
    const canvas = chartCanvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set canvas size
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Chart margins
    const margin = { top: 40, right: 20, bottom: 50, left: 60 };
    const chartWidth = canvasWidth - margin.left - margin.right;
    const chartHeight = canvasHeight - margin.top - margin.bottom;
    
    // Calculate max values for scaling
    const maxHeight = Math.max(...sections.map(s => parseFloat(s.height) || 0));
    const maxLength = Math.max(...sections.map(s => parseFloat(s.length) || 0));
    const maxValue = Math.max(maxHeight, maxLength);
    
    // Calculate bar width and spacing
    const barCount = sections.length;
    const barWidth = chartWidth / (barCount * 3); // Each section has 2 bars + spacing
    const groupSpacing = barWidth / 2;
    
    // Draw chart title
    ctx.font = 'bold 16px Arial';
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText('Roof Section Dimensions', canvasWidth / 2, margin.top / 2);
    
    // Draw Y-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, margin.top);
    ctx.lineTo(margin.left, canvasHeight - margin.bottom);
    ctx.stroke();
    
    // Draw X-axis
    ctx.beginPath();
    ctx.moveTo(margin.left, canvasHeight - margin.bottom);
    ctx.lineTo(canvasWidth - margin.right, canvasHeight - margin.bottom);
    ctx.stroke();
    
    // Draw Y-axis labels
    const yTickCount = 5;
    ctx.textAlign = 'right';
    ctx.font = '12px Arial';
    for (let i = 0; i <= yTickCount; i++) {
      const value = maxValue * (i / yTickCount);
      const y = canvasHeight - margin.bottom - (i / yTickCount) * chartHeight;
      
      // Draw tick marks
      ctx.beginPath();
      ctx.moveTo(margin.left - 5, y);
      ctx.lineTo(margin.left, y);
      ctx.stroke();
      
      // Draw labels
      ctx.fillText(value.toFixed(1) + 'm', margin.left - 10, y + 4);
    }
    
    // Draw X-axis labels
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    
    // Draw legend
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    
    // Height legend
    ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
    ctx.fillRect(margin.left + 10, margin.top - 25, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Height (m)', margin.left + 30, margin.top - 15);
    
    // Length legend
    ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
    ctx.fillRect(margin.left + 110, margin.top - 25, 15, 15);
    ctx.fillStyle = '#333';
    ctx.fillText('Length (m)', margin.left + 130, margin.top - 15);
    
    // Draw bars
    sections.forEach((section, index) => {
      const height = parseFloat(section.height) || 0;
      const length = parseFloat(section.length) || 0;
      
      if (height && length) {
        const x = margin.left + (index * 3 + 1) * barWidth + groupSpacing * index;
        
        // Calculate heights (scaled)
        const heightBarHeight = (height / maxValue) * chartHeight;
        const lengthBarHeight = (length / maxValue) * chartHeight;
        
        // Draw height bar
        ctx.fillStyle = 'rgba(59, 130, 246, 0.7)'; // Blue
        ctx.fillRect(
          x, 
          canvasHeight - margin.bottom - heightBarHeight,
          barWidth,
          heightBarHeight
        );
        
        // Draw length bar
        ctx.fillStyle = 'rgba(245, 158, 11, 0.7)'; // Amber
        ctx.fillRect(
          x + barWidth + 5,
          canvasHeight - margin.bottom - lengthBarHeight,
          barWidth,
          lengthBarHeight
        );
        
        // Draw section label
        ctx.fillStyle = '#333';
        ctx.textAlign = 'center';
        ctx.fillText(
          `Section ${index + 1}`,
          x + barWidth + 2.5, 
          canvasHeight - margin.bottom + 15
        );
        
        // Draw values above bars
        ctx.fillText(
          height.toFixed(1),
          x + barWidth / 2,
          canvasHeight - margin.bottom - heightBarHeight - 5
        );
        
        ctx.fillText(
          length.toFixed(1),
          x + barWidth + 5 + barWidth / 2,
          canvasHeight - margin.bottom - lengthBarHeight - 5
        );
      }
    });
    
    // Draw Y-axis title
    ctx.save();
    ctx.translate(15, canvasHeight / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillText('Measurements (m)', 0, 0);
    ctx.restore();
    
    // Draw X-axis title
    ctx.textAlign = 'center';
    ctx.font = '14px Arial';
    ctx.fillText('Roof Sections', canvasWidth / 2, canvasHeight - 10);
  };

  // Update visualization when sections change
  useEffect(() => {
    drawRoofVisualization();
    drawBarChart();
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
        canvas.height = 300;
        
        chartCanvas.width = container.clientWidth;
        chartCanvas.height = 350;
      }
      
      // Initial calculation
      calculateTotalArea();
    }
    
    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      const chartCanvas = chartCanvasRef.current;
      const container = canvas?.parentElement;
      
      if (canvas && chartCanvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = 300;
        
        chartCanvas.width = container.clientWidth;
        chartCanvas.height = 350;
        
        drawRoofVisualization();
        drawBarChart();
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Rafter Roof Area Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500 mb-4">
            Add sections of your rafter roof to calculate the total area. Enter the height and length of each section.
          </p>
          
          <div className="space-y-4">
            {sections.map((section, index) => (
              <div key={index} className="grid grid-cols-7 gap-4 items-center">
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`height-${index}`}>Height (m)</Label>
                  <Input
                    id={`height-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={section.height}
                    onChange={(e) => updateSection(index, 'height', e.target.value)}
                  />
                </div>
                <div className="col-span-3 space-y-2">
                  <Label htmlFor={`length-${index}`}>Length (m)</Label>
                  <Input
                    id={`length-${index}`}
                    type="number"
                    step="0.1"
                    min="0"
                    value={section.length}
                    onChange={(e) => updateSection(index, 'length', e.target.value)}
                  />
                </div>
                <div className="col-span-1 flex items-end">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => removeSection(index)}
                    disabled={sections.length <= 1}
                  >
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={addSection}
              >
                <PlusCircle className="h-4 w-4" />
                Add Section
              </Button>
              
              <Button 
                className="bg-amber-500 hover:bg-amber-600 flex-1"
                onClick={calculateTotalArea}
              >
                Calculate Area
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Roof Visualization</span>
            <div className="flex gap-2">
              <Button
                variant={viewMode === "stack" ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setViewMode("stack")}
              >
                <SquareStack className="h-4 w-4" />
                <span className="hidden sm:inline">Stack View</span>
              </Button>
              <Button
                variant={viewMode === "chart" ? "default" : "outline"}
                size="sm"
                className="flex items-center gap-1"
                onClick={() => setViewMode("chart")}
              >
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Chart View</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            {viewMode === "stack" ? (
              <canvas 
                ref={canvasRef} 
                className="w-full border rounded-md bg-white"
                height="300"
              />
            ) : (
              <canvas 
                ref={chartCanvasRef} 
                className="w-full border rounded-md bg-white"
                height="350"
              />
            )}
          </div>
          
          {totalArea > 0 && (
            <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200">
              <h3 className="font-medium text-amber-800">Results:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">Section Areas:</p>
                  <ul className="list-disc list-inside">
                    {sections.map((section, index) => (
                      <li key={index} className="text-sm">
                        Section {index + 1}: {section.area.toFixed(2)} m²
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex items-center justify-center bg-white rounded-md p-4 shadow-sm">
                  <p className="text-2xl font-bold text-amber-600">
                    Total Area: {totalArea.toFixed(2)} m²
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
