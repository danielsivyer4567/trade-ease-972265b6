import React, { useState } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Home, Square, Triangle, RectangleHorizontal } from "lucide-react";

export const DeckingCalculator: React.FC = () => {
  // State for deck shape and dimensions
  const [deckShape, setDeckShape] = useState<"square" | "rectangle" | "triangle" | "">("");
  const [dimensionA, setDimensionA] = useState("");
  const [dimensionB, setDimensionB] = useState("");
  const [dimensionC, setDimensionC] = useState(""); // For triangle
  
  // State for deck configuration
  const [deckingDirection, setDeckingDirection] = useState<"A" | "B" | "">("");
  const [subFrameType, setSubFrameType] = useState<"timber" | "steel" | "">("");
  const [bearerSize, setBearerSize] = useState<"90x45" | "140x45" | "190x45" | "240x45" | "">("");
  const [joistSize, setJoistSize] = useState<"90x45" | "140x90" | "240x45" | "">("");
  const [edgeDesign, setEdgeDesign] = useState<"picture-frame" | "fascia-board" | "flush" | "overhang" | "">("");
  
  // State for decking material
  const [deckingMaterial, setDeckingMaterial] = useState<"merbau" | "spotted-gum" | "blackbutt" | "composite" | "">("");
  const [boardWidth, setBoardWidth] = useState<"90" | "140" | "88" | "137" | "">("");
  const [fixingMethod, setFixingMethod] = useState<"nails" | "screws" | "concealed" | "">("");
  
  // State for selected board type from choices section
  const [selectedBoardType, setSelectedBoardType] = useState<string>("");
  
  // State for results
  const [results, setResults] = useState<any>(null);

  const calculateDeck = () => {
    if (!deckShape || !dimensionA || !dimensionB) return;

    const dimA = parseFloat(dimensionA);
    const dimB = parseFloat(dimensionB);
    const dimC = parseFloat(dimensionC) || 0;

    let deckArea = 0;
    
    // Calculate area based on shape
    switch (deckShape) {
      case "square":
        deckArea = dimA * dimA;
        break;
      case "rectangle":
        deckArea = dimA * dimB;
        break;
      case "triangle":
        if (dimC > 0) {
          // Using Heron's formula for triangle area
          const s = (dimA + dimB + dimC) / 2;
          deckArea = Math.sqrt(s * (s - dimA) * (s - dimB) * (s - dimC));
        } else {
          // Right triangle
          deckArea = (dimA * dimB) / 2;
        }
        break;
    }

    // Convert to square meters
    const deckAreaM2 = deckArea / 1000000;

    // Calculate board requirements
    const boardWidthMm = parseInt(boardWidth || "140");
    let boardLength = 5700; // Default timber length in mm
    let boardThickness = 19; // Default thickness in mm
    
    // Set board specifications based on selected board type
    if (selectedBoardType.includes("composite")) {
      boardLength = 5400; // Composite boards are 5.4m
      boardThickness = 23; // Composite thickness
    } else if (selectedBoardType.includes("timber")) {
      boardLength = 5700; // Timber boards are 5.7m
      boardThickness = 19; // Timber thickness
    } else if (deckingMaterial === "composite") {
      boardLength = 5400;
      boardThickness = 23;
    } else if (deckingMaterial === "merbau" || deckingMaterial === "spotted-gum" || deckingMaterial === "blackbutt") {
      boardLength = 5700; // All hardwoods are 5.7m
      boardThickness = 19; // Hardwood thickness
    }
    
    // Calculate boards needed based on direction
    let boardsNeeded = 0;
    let linearMeters = 0;
    
    if (deckingDirection === "A") {
      linearMeters = dimA / 1000; // Convert to meters
      boardsNeeded = Math.ceil((dimB / boardWidthMm)) * Math.ceil(linearMeters / (boardLength / 1000));
    } else {
      linearMeters = dimB / 1000;
      boardsNeeded = Math.ceil((dimA / boardWidthMm)) * Math.ceil(linearMeters / (boardLength / 1000));
    }

    // Add 10% wastage
    const totalBoardsWithWastage = Math.ceil(boardsNeeded * 1.1);
    const totalLinearMeters = Math.ceil(linearMeters * 1.1);

    // Calculate fixings
    let fixingsPerBoard = 0;
    switch (fixingMethod) {
      case "nails":
        fixingsPerBoard = Math.ceil(linearMeters / 0.3); // Every 300mm
        break;
      case "screws":
        fixingsPerBoard = Math.ceil(linearMeters / 0.4); // Every 400mm
        break;
      case "concealed":
        fixingsPerBoard = Math.ceil(linearMeters / 0.6); // Every 600mm
        break;
    }
    
    const totalFixings = Math.ceil(totalBoardsWithWastage * fixingsPerBoard * 1.1);

    // Calculate additional materials based on bearer size
    let joistsNeeded = 0;
    let bearersNeeded = 0;
    let joistBoots = 0;
    let cloutNails = 0;
    
        if (bearerSize === "90x45") {
      // Small bearers (90x45mm) - no joists needed, more bearers
      const bearerSpacing = 300; // Closer spacing for smaller bearers
      bearersNeeded = Math.ceil((deckingDirection === "A" ? dimB : dimA) / bearerSpacing) + 1;
      // No joists needed for small bearers
    } else if (bearerSize === "140x45" || bearerSize === "190x45" || bearerSize === "240x45") {
      // Larger bearers - need joists
      let bearerSpacing = 1800; // Standard spacing for large bearers
      
      // Adjust spacing based on bearer size
      if (bearerSize === "190x45") bearerSpacing = 2100;
      if (bearerSize === "240x45") bearerSpacing = 2400;
      
      bearersNeeded = Math.ceil((deckingDirection === "A" ? dimA : dimB) / bearerSpacing) + 1;
      
      // Calculate joists based on selected size
      const joistSpacing = joistSize === "240x45" ? 600 : joistSize === "140x90" ? 500 : 450; // Different spacing based on joist size
      joistsNeeded = Math.ceil((deckingDirection === "A" ? dimB : dimA) / joistSpacing) + 1;
      
      // Calculate joist boots/brackets for large bearer system
      joistBoots = joistsNeeded * bearersNeeded;
      cloutNails = joistBoots * 4; // 4 clouts per boot
    }

    setResults({
      deckArea: deckAreaM2.toFixed(2),
      totalBoards: totalBoardsWithWastage,
      linearMeters: totalLinearMeters,
      totalFixings,
      joistsNeeded,
      bearersNeeded,
      joistBoots,
      cloutNails,
      boardLength: boardLength / 1000,
      boardWidth: boardWidthMm,
      wastageIncluded: "10%",
      bearerSize,
      joistSize: (bearerSize === "140x45" || bearerSize === "190x45" || bearerSize === "240x45") ? joistSize : null
    });
  };

  const resetCalculator = () => {
    setDeckShape("");
    setDimensionA("");
    setDimensionB("");
    setDimensionC("");
    setDeckingDirection("");
    setSubFrameType("");
    setBearerSize("");
    setJoistSize("");
    setEdgeDesign("");
    setDeckingMaterial("");
    setBoardWidth("");
    setFixingMethod("");
    setSelectedBoardType("");
    setResults(null);
  };

  return (
    <>
      <div className="w-full flex justify-center mb-6">
        <img 
          src="/lovable-uploads/197ba1646d3c2.png" 
          alt="Decking construction diagram" 
          className="max-w-full h-auto rounded shadow-md border border-gray-200"
          style={{ maxHeight: 300 }}
        />
      </div>
      
      <Card className="bg-slate-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Decking Calculator
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant={deckShape === "square" ? "default" : "outline"}
              className={`h-20 flex flex-col items-center gap-2 ${deckShape === "square" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setDeckShape("square")}
            >
              <Square className="h-6 w-6" />
              Square
            </Button>
            <Button
              variant={deckShape === "rectangle" ? "default" : "outline"}
              className={`h-20 flex flex-col items-center gap-2 ${deckShape === "rectangle" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setDeckShape("rectangle")}
            >
              <RectangleHorizontal className="h-6 w-6" />
              Rectangle
            </Button>
            <Button
              variant={deckShape === "triangle" ? "default" : "outline"}
              className={`h-20 flex flex-col items-center gap-2 ${deckShape === "triangle" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
              onClick={() => setDeckShape("triangle")}
            >
              <Triangle className="h-6 w-6" />
              Triangle
            </Button>
          </div>
        </CardContent>
      </Card>

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Deck Dimensions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full flex justify-center mb-6">
              <img 
                src="/lovable-uploads/197b9a21089f9.png" 
                alt="Deck dimensions diagram" 
                className="max-w-full h-auto rounded shadow-md border border-gray-200"
                style={{ maxHeight: 300 }}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dimension-a">Dimension A (mm)</Label>
                <Input
                  id="dimension-a"
                  type="number"
                  value={dimensionA}
                  onChange={(e) => setDimensionA(e.target.value)}
                  placeholder="Enter dimension A"
                  className="bg-white text-black"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dimension-b">Dimension B (mm)</Label>
                <Input
                  id="dimension-b"
                  type="number"
                  value={dimensionB}
                  onChange={(e) => setDimensionB(e.target.value)}
                  placeholder="Enter dimension B"
                  className="bg-white text-black"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Select the preferred direction of your decking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/197b9ba33ab10.png" 
                  alt="Decking direction diagram" 
                  className="max-w-full h-auto rounded shadow-md border border-gray-200"
                  style={{ maxHeight: 300 }}
                />
              </div>
              
              <div className="space-y-4">
                <div
                  className={`w-full bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-gray-400 ${deckingDirection === "A" ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setDeckingDirection("A")}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Direction A (Across dimension A)</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={dimensionA}
                        onChange={(e) => {
                          setDimensionA(e.target.value);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Length (mm)"
                        className="w-32 bg-white text-black"
                      />
                      <span className="text-sm text-gray-500">mm</span>
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full bg-white border-2 rounded-lg p-4 cursor-pointer transition-all hover:border-gray-400 ${deckingDirection === "B" ? "border-blue-500" : "border-gray-300"}`}
                  onClick={() => setDeckingDirection("B")}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Direction B (Across dimension B)</span>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={dimensionB}
                        onChange={(e) => {
                          setDimensionB(e.target.value);
                          e.stopPropagation();
                        }}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Length (mm)"
                        className="w-32 bg-white text-black"
                      />
                      <span className="text-sm text-gray-500">mm</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Sub-frame Type</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/197b9bd2db824.png" 
                  alt="Sub-frame type diagram" 
                  className="max-w-full h-auto rounded shadow-md border border-gray-200"
                  style={{ maxHeight: 300 }}
                />
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Sub-frame Material</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant={subFrameType === "timber" ? "default" : "outline"}
                    className={`h-20 flex flex-col items-center gap-2 ${subFrameType === "timber" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    onClick={() => setSubFrameType("timber")}
                  >
                    <span className="font-semibold">Timber</span>
                    <span className="text-xs">Treated Pine/Hardwood</span>
                  </Button>
                  <Button
                    variant={subFrameType === "steel" ? "default" : "outline"}
                    className={`h-20 flex flex-col items-center gap-2 ${subFrameType === "steel" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    onClick={() => setSubFrameType("steel")}
                  >
                    <span className="font-semibold">Steel</span>
                    <span className="text-xs">C-Sections & RHS</span>
                  </Button>
                </div>
              </div>

              {subFrameType && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Bearer Size ({subFrameType === "timber" ? "Timber" : "Steel"})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${bearerSize === "90x45" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                      onClick={() => setBearerSize("90x45")}
                    >
                      <h4 className={`font-semibold mb-2 ${bearerSize === "90x45" ? "text-white" : ""}`}>
                        {subFrameType === "timber" ? "90x45mm Timber" : "90x45mm C-Section"}
                      </h4>
                      <ul className={`text-sm space-y-1 ${bearerSize === "90x45" ? "text-blue-100" : "text-gray-600"}`}>
                        <li>• More bearers needed</li>
                        <li>• Closer spacing (300mm)</li>
                        <li>• No joists required</li>
                        <li>• {subFrameType === "timber" ? "Economical timber option" : "Lightweight steel option"}</li>
                      </ul>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${bearerSize === "140x45" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                      onClick={() => setBearerSize("140x45")}
                    >
                      <h4 className={`font-semibold mb-2 ${bearerSize === "140x45" ? "text-white" : ""}`}>
                        {subFrameType === "timber" ? "140x45mm Timber" : "140x45mm C-Section"}
                      </h4>
                      <ul className={`text-sm space-y-1 ${bearerSize === "140x45" ? "text-blue-100" : "text-gray-600"}`}>
                        <li>• Standard size</li>
                        <li>• Requires joists</li>
                        <li>• 1.8m spacing</li>
                        <li>• {subFrameType === "timber" ? "Good timber strength" : "Corrosion resistant steel"}</li>
                      </ul>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${bearerSize === "190x45" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                      onClick={() => setBearerSize("190x45")}
                    >
                      <h4 className={`font-semibold mb-2 ${bearerSize === "190x45" ? "text-white" : ""}`}>
                        {subFrameType === "timber" ? "190x45mm Timber" : "190x45mm C-Section"}
                      </h4>
                      <ul className={`text-sm space-y-1 ${bearerSize === "190x45" ? "text-blue-100" : "text-gray-600"}`}>
                        <li>• Heavy duty</li>
                        <li>• Requires joists</li>
                        <li>• 2.1m spacing</li>
                        <li>• {subFrameType === "timber" ? "High timber strength" : "High strength steel"}</li>
                      </ul>
                    </div>
                    <div 
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${bearerSize === "240x45" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                      onClick={() => setBearerSize("240x45")}
                    >
                      <h4 className={`font-semibold mb-2 ${bearerSize === "240x45" ? "text-white" : ""}`}>
                        {subFrameType === "timber" ? "240x45mm Timber" : "240x45mm C-Section"}
                      </h4>
                      <ul className={`text-sm space-y-1 ${bearerSize === "240x45" ? "text-blue-100" : "text-gray-600"}`}>
                        <li>• Extra heavy duty</li>
                        <li>• Requires joists</li>
                        <li>• 2.4m spacing</li>
                        <li>• {subFrameType === "timber" ? "Maximum timber strength" : "Maximum steel strength"}</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {(bearerSize === "140x45" || bearerSize === "190x45" || bearerSize === "240x45") && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Joist Size ({subFrameType === "timber" ? "Timber" : "Steel"})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button
                      variant={joistSize === "90x45" ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center gap-1 ${joistSize === "90x45" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                      onClick={() => setJoistSize("90x45")}
                    >
                      <span className="font-semibold">
                        {subFrameType === "timber" ? "90x45mm Timber" : "90x45mm C-Section"}
                      </span>
                      <span className="text-xs">Standard</span>
                    </Button>
                    <Button
                      variant={joistSize === "140x90" ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center gap-1 ${joistSize === "140x90" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                      onClick={() => setJoistSize("140x90")}
                    >
                      <span className="font-semibold">
                        {subFrameType === "timber" ? "140x90mm Timber" : "140x90mm RHS"}
                      </span>
                      <span className="text-xs">Heavy duty</span>
                    </Button>
                    <Button
                      variant={joistSize === "240x45" ? "default" : "outline"}
                      className={`h-16 flex flex-col items-center gap-1 ${joistSize === "240x45" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                      onClick={() => setJoistSize("240x45")}
                    >
                      <span className="font-semibold">
                        {subFrameType === "timber" ? "240x45mm Timber" : "240x45mm C-Section"}
                      </span>
                      <span className="text-xs">Extra heavy duty</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      
      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Edge Design</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/197b9d4a1abd9.png" 
                    alt="Picture Frame design" 
                    className="w-full max-w-64 h-auto rounded shadow-md border border-gray-200"
                    style={{ maxHeight: 192 }}
                  />
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/197b9d90bdb24.png" 
                    alt="Fascia Board design" 
                    className="w-full max-w-64 h-auto rounded shadow-md border border-gray-200"
                    style={{ maxHeight: 192 }}
                  />
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/197b9dbf36e0a (1).png" 
                    alt="Flush design" 
                    className="w-full max-w-64 h-auto rounded shadow-md border border-gray-200"
                    style={{ maxHeight: 192 }}
                  />
                </div>
                <div className="flex justify-center">
                  <img 
                    src="/lovable-uploads/197b9dee25e6c.png" 
                    alt="Overhang design" 
                    className="w-full max-w-64 h-auto rounded shadow-md border border-gray-200"
                    style={{ maxHeight: 192 }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { value: "picture-frame", label: "Picture Frame" },
                  { value: "fascia-board", label: "Fascia Board" },
                  { value: "flush", label: "Flush" },
                  { value: "overhang", label: "Overhang" }
                ].map((option) => (
                  <Button
                    key={option.value}
                    variant={edgeDesign === option.value ? "default" : "outline"}
                    className={`h-16 ${edgeDesign === option.value ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                    onClick={() => setEdgeDesign(option.value as any)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Decking Material</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deckingMaterial === "merbau" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                   onClick={() => setDeckingMaterial("merbau")}>
                <h3 className={`font-semibold text-lg mb-2 ${deckingMaterial === "merbau" ? "text-white" : ""}`}>Merbau Hardwood</h3>
                <ul className={`text-sm space-y-1 ${deckingMaterial === "merbau" ? "text-blue-100" : "text-gray-600"}`}>
                  <li>• Warm reddish-brown tones</li>
                  <li>• Pre-oiled protection</li>
                  <li>• 40+ year life expectancy</li>
                  <li>• Bushfire compliant BAL 29</li>
                  <li>• Termite resistant</li>
                  <li>• 5.7m lengths available</li>
                </ul>
              </div>
              
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deckingMaterial === "spotted-gum" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                   onClick={() => setDeckingMaterial("spotted-gum")}>
                <h3 className={`font-semibold text-lg mb-2 ${deckingMaterial === "spotted-gum" ? "text-white" : ""}`}>Spotted Gum</h3>
                <ul className={`text-sm space-y-1 ${deckingMaterial === "spotted-gum" ? "text-blue-100" : "text-gray-600"}`}>
                  <li>• Light brown to chocolate</li>
                  <li>• High strength & durability</li>
                  <li>• Class 2 durability rating</li>
                  <li>• Popular Australian native</li>
                  <li>• Excellent weathering</li>
                  <li>• 5.7m lengths available</li>
                </ul>
              </div>
              
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deckingMaterial === "blackbutt" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                   onClick={() => setDeckingMaterial("blackbutt")}>
                <h3 className={`font-semibold text-lg mb-2 ${deckingMaterial === "blackbutt" ? "text-white" : ""}`}>Blackbutt</h3>
                <ul className={`text-sm space-y-1 ${deckingMaterial === "blackbutt" ? "text-blue-100" : "text-gray-600"}`}>
                  <li>• Pale yellow to light brown</li>
                  <li>• Even grain pattern</li>
                  <li>• Class 2 durability rating</li>
                  <li>• Cost-effective hardwood</li>
                  <li>• Takes stain well</li>
                  <li>• 5.7m lengths available</li>
                </ul>
              </div>
              
              <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${deckingMaterial === "composite" ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 bg-white hover:border-gray-400"}`}
                   onClick={() => setDeckingMaterial("composite")}>
                <h3 className={`font-semibold text-lg mb-2 ${deckingMaterial === "composite" ? "text-white" : ""}`}>Composite Decking</h3>
                <ul className={`text-sm space-y-1 ${deckingMaterial === "composite" ? "text-blue-100" : "text-gray-600"}`}>
                  <li>• Low maintenance material</li>
                  <li>• Weather & insect resistant</li>
                  <li>• Consistent color/texture</li>
                  <li>• No staining required</li>
                  <li>• Various colors available</li>
                  <li>• 5.4m lengths available</li>
                </ul>
              </div>
            </div>
            <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 mt-4">
              <p className="text-sm text-blue-800 text-center">
                <strong>Please note:</strong> Timber options based on SpecRite full length boards
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {deckingMaterial && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Which width of decking board would you like?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(deckingMaterial === "merbau" || deckingMaterial === "spotted-gum" || deckingMaterial === "blackbutt") ? (
                <>
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${boardWidth === "90" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    onClick={() => setBoardWidth("90")}
                  >
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 h-20 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/20 via-transparent to-amber-700/20"></div>
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            rgba(139, 69, 19, 0.1) 0px,
                            rgba(139, 69, 19, 0.1) 2px,
                            transparent 2px,
                            transparent 8px
                          )`
                        }}></div>
                        <span className="relative text-white font-bold text-lg">90mm Wide Boards</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-600">90mm</h3>
                      <p className="text-sm text-gray-600">Hardwood 90 x 19mm</p>
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Traditional narrower board width</li>
                      <li>• Classic linear appearance</li>
                      <li>• More visible board joints</li>
                      <li>• 5.7m lengths available</li>
                    </ul>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${boardWidth === "140" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    onClick={() => setBoardWidth("140")}
                  >
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 h-20 rounded-md mb-4 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-800/20 via-transparent to-amber-700/20"></div>
                        <div className="absolute inset-0" style={{
                          backgroundImage: `repeating-linear-gradient(
                            45deg,
                            rgba(139, 69, 19, 0.1) 0px,
                            rgba(139, 69, 19, 0.1) 3px,
                            transparent 3px,
                            transparent 12px
                          )`
                        }}></div>
                        <span className="relative text-white font-bold text-lg">140mm Wide Boards</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-600">140mm</h3>
                      <p className="text-sm text-gray-600">Hardwood 140 x 19mm</p>
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Modern wider board width</li>
                      <li>• Fewer visible board joints</li>
                      <li>• Contemporary clean appearance</li>
                      <li>• 5.7m lengths available</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${boardWidth === "88" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    onClick={() => setBoardWidth("88")}
                  >
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 h-20 rounded-md mb-4 flex items-center justify-center relative">
                        <span className="text-white font-bold text-lg">88mm Composite</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-600">88mm</h3>
                      <p className="text-sm text-gray-600">Composite 88mm x 23mm</p>
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Standard composite width</li>
                      <li>• 5.4m lengths</li>
                      <li>• Low maintenance</li>
                      <li>• Weather resistant</li>
                    </ul>
                  </div>
                  
                  <div 
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${boardWidth === "137" ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"}`}
                    onClick={() => setBoardWidth("137")}
                  >
                    <div className="text-center mb-4">
                      <div className="bg-gradient-to-r from-gray-600 via-gray-500 to-gray-400 h-20 rounded-md mb-4 flex items-center justify-center relative">
                        <span className="text-white font-bold text-lg">137mm Composite</span>
                      </div>
                      <h3 className="text-2xl font-bold text-blue-600">137mm</h3>
                      <p className="text-sm text-gray-600">Composite 137mm x 23mm</p>
                    </div>
                    <ul className="text-xs space-y-1">
                      <li>• Wide composite board</li>
                      <li>• 5.4m lengths</li>
                      <li>• Fewer joints, cleaner look</li>
                      <li>• Premium appearance</li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Fixing Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/197b9e796adba.png" 
                  alt="Fixing methods diagram" 
                  className="max-w-full h-auto rounded shadow-md border border-gray-200"
                  style={{ maxHeight: 240 }}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant={fixingMethod === "nails" ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center gap-2 ${fixingMethod === "nails" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  onClick={() => setFixingMethod("nails")}
                >
                  <span className="font-semibold">Nails</span>
                  <span className="text-xs text-red-500">*Not recommended</span>
                </Button>
                <Button
                  variant={fixingMethod === "screws" ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center gap-2 ${fixingMethod === "screws" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  onClick={() => setFixingMethod("screws")}
                >
                  <span className="font-semibold">Screws</span>
                  <span className="text-xs text-green-600">*Recommended</span>
                </Button>
                <Button
                  variant={fixingMethod === "concealed" ? "default" : "outline"}
                  className={`h-20 flex flex-col items-center gap-2 ${fixingMethod === "concealed" ? "bg-blue-500 hover:bg-blue-600" : ""}`}
                  onClick={() => setFixingMethod("concealed")}
                >
                  <span className="font-semibold">Concealed</span>
                </Button>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              * For best results, merbau decking should be fixed using hot dipped galvanised or stainless steel screws. 
              Stainless steel fixings are recommended for coastal or poolside applications.
            </p>
          </CardContent>
        </Card>
      )}

      {deckShape && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle>Calculate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={calculateDeck} className="flex-1 bg-blue-500 hover:bg-blue-600">
                Calculate Materials
              </Button>
              <Button onClick={resetCalculator} variant="outline" className="flex-1">
                Reset Calculator
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {results && (
        <Card className="bg-slate-300">
          <CardHeader>
            <CardTitle className="text-blue-800">Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600">Deck Area</h3>
                <p className="text-2xl font-bold text-blue-800">{results.deckArea} m²</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600">Boards Needed</h3>
                <p className="text-2xl font-bold text-blue-800">{results.totalBoards}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600">Bearers Required</h3>
                <p className="text-2xl font-bold text-blue-800">{results.bearersNeeded}</p>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold text-blue-600">Fixings Required</h3>
                <p className="text-2xl font-bold text-blue-800">{results.totalFixings}</p>
              </div>
            </div>
            
            {results.joistsNeeded > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-600">Joists Required</h3>
                  <p className="text-2xl font-bold text-blue-800">{results.joistsNeeded}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-600">Joist Boots</h3>
                  <p className="text-2xl font-bold text-blue-800">{results.joistBoots}</p>
                </div>
                <div className="bg-white p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-600">Clout Nails</h3>
                  <p className="text-2xl font-bold text-blue-800">{results.cloutNails}</p>
                </div>
              </div>
            )}
            
            <Separator className="my-6" />
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg text-blue-800 mb-2">You Have Selected:</h3>
              <ul className="space-y-1 text-sm">
                <li><strong>Deck Shape:</strong> {deckShape?.charAt(0).toUpperCase() + deckShape?.slice(1)}</li>
                <li><strong>Decking Material:</strong> {
                  deckingMaterial === "merbau" ? "Merbau Hardwood" :
                  deckingMaterial === "spotted-gum" ? "Spotted Gum" :
                  deckingMaterial === "blackbutt" ? "Blackbutt" :
                  "Composite"
                } - {boardWidth}mm x {deckingMaterial === "composite" ? "23mm" : "19mm"}</li>
                <li><strong>Sub-frame:</strong> {subFrameType?.charAt(0).toUpperCase() + subFrameType?.slice(1)}</li>
                <li><strong>Bearer Size:</strong> {
                  bearerSize === "90x45" ? `90x45mm ${subFrameType === "timber" ? "Timber" : "C-Section"} (More bearers, no joists needed)` :
                  bearerSize === "140x45" ? `140x45mm ${subFrameType === "timber" ? "Timber" : "C-Section"} (Standard, requires joists)` :
                  bearerSize === "190x45" ? `190x45mm ${subFrameType === "timber" ? "Timber" : "C-Section"} (Heavy duty, requires joists)` :
                  bearerSize === "240x45" ? `240x45mm ${subFrameType === "timber" ? "Timber" : "C-Section"} (Extra heavy duty, requires joists)` :
                  "Not selected"
                }</li>
                {results.joistSize && (
                  <li><strong>Joist Size:</strong> {results.joistSize} {
                    subFrameType === "timber" ? "Timber" : 
                    results.joistSize === "140x90" ? "RHS" : "C-Section"
                  }</li>
                )}
                <li><strong>Edge Design:</strong> {edgeDesign?.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</li>
                <li><strong>Fixing Method:</strong> {fixingMethod?.charAt(0).toUpperCase() + fixingMethod?.slice(1)}</li>
                <li><strong>Deck Area:</strong> {results.deckArea} m²</li>
              </ul>
              <p className="text-xs text-gray-600 mt-4">* Includes an additional {results.wastageIncluded} for wastage</p>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}; 