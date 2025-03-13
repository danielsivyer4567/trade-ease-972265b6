
import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";

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
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Update visualization when sections change
  useEffect(() => {
    drawRoofVisualization();
  }, [sections, totalArea]);

  // Initialize canvas on component mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size based on container
      const container = canvas.parentElement;
      if (container) {
        canvas.width = container.clientWidth;
        canvas.height = 300;
      }
      
      // Initial calculation
      calculateTotalArea();
    }
    
    // Handle window resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = canvas?.parentElement;
      if (canvas && container) {
        canvas.width = container.clientWidth;
        canvas.height = 300;
        drawRoofVisualization();
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
          <CardTitle>Roof Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <canvas 
              ref={canvasRef} 
              className="w-full border rounded-md bg-white"
              height="300"
            />
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
