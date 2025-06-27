import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PlumbingCalculator = () => {
  // Pipe Size Calculator state
  const [pipeValues, setPipeValues] = useState({
    flowRate: '',
    material: 'copper',
    maxVelocity: '8',
    pipeSize: ''
  });

  // Pressure Loss Calculator state
  const [pressureValues, setPressureValues] = useState({
    pipeSize: '0.5',
    material: 'copper',
    flowRate: '',
    pipeLength: '',
    fittingsCount: '0',
    pressureLoss: ''
  });

  // Tank Volume Calculator state
  const [tankValues, setTankValues] = useState({
    shape: 'rectangular',
    length: '',
    width: '',
    height: '',
    diameter: '',
    cylinderHeight: '',
    hDiameter: '',
    hLength: '',
    fillLevel: '',
    volume: ''
  });

  // Drain Size Calculator state
  const [drainValues, setDrainValues] = useState({
    toilets: '0',
    sinks: '0',
    showers: '0',
    bathtubs: '0',
    washingMachines: '0',
    dishwashers: '0',
    slope: '0.25',
    totalDFU: '',
    drainSize: ''
  });

  // Pipe Grade Calculator state
  const [gradeValues, setGradeValues] = useState({
    length: '',
    slope: '0.25',
    totalDrop: ''
  });

  // Water Heater Sizing Calculator state
  const [heaterValues, setHeaterValues] = useState({
    householdSize: '',
    climate: 'moderate',
    usageLevel: 'average',
    waterHeaterSize: '',
    btuRating: ''
  });

  // Pipe Size Calculator functions
  const calculatePipeSize = () => {
    const flowRate = parseFloat(pipeValues.flowRate);
    const maxVelocity = parseFloat(pipeValues.maxVelocity) || 8;
    
    if (!flowRate) {
      alert("Please enter flow rate");
      return;
    }
    
    // Using formula: Area = Flow Rate / Velocity
    // Flow rate in GPM needs to be converted to ft³/s
    // 1 GPM = 0.002228 ft³/s
    const flowRateCubicFtPerSec = flowRate * 0.002228;
    const areaSqFt = flowRateCubicFtPerSec / maxVelocity;
    const areaSqIn = areaSqFt * 144; // convert to square inches
    const diameterInches = Math.sqrt(areaSqIn * 4 / Math.PI);
    
    // Round up to next standard size
    let recommendedSize = "";
    const standardSizes = [0.5, 0.75, 1, 1.25, 1.5, 2, 2.5, 3, 4, 6];
    for (let i = 0; i < standardSizes.length; i++) {
      if (diameterInches <= standardSizes[i]) {
        recommendedSize = standardSizes[i].toString();
        break;
      }
    }
    if (recommendedSize === "") recommendedSize = "Greater than 6";
    
    // Convert decimal to fraction for display
    let sizeDisplay = "";
    if (recommendedSize === "0.5") sizeDisplay = "1/2";
    else if (recommendedSize === "0.75") sizeDisplay = "3/4";
    else if (recommendedSize === "1.25") sizeDisplay = "1-1/4";
    else if (recommendedSize === "1.5") sizeDisplay = "1-1/2";
    else if (recommendedSize === "2.5") sizeDisplay = "2-1/2";
    else sizeDisplay = recommendedSize;
    
    setPipeValues({ ...pipeValues, pipeSize: sizeDisplay + " inch" });
  };

  const resetPipeSize = () => {
    setPipeValues({
      flowRate: '',
      material: 'copper',
      maxVelocity: '8',
      pipeSize: ''
    });
  };

  // Pressure Loss Calculator functions
  const calculatePressureLoss = () => {
    const pipeSize = parseFloat(pressureValues.pipeSize);
    const material = pressureValues.material;
    const flowRate = parseFloat(pressureValues.flowRate);
    const pipeLength = parseFloat(pressureValues.pipeLength);
    const fittingsCount = parseInt(pressureValues.fittingsCount) || 0;
    
    if (!flowRate || !pipeLength) {
      alert("Please enter flow rate and pipe length");
      return;
    }
    
    // C values for different materials
    const cValues: { [key: string]: number } = {
      'copper': 130,
      'pvc': 150,
      'pex': 150,
      'galvanized': 120
    };
    
    const c = cValues[material];
    
    // Inside diameter is slightly less than nominal for some pipe types
    let insideDiameter = pipeSize;
    if (material === 'copper') {
      // Type L copper has smaller inside diameter
      const copperSizes: { [key: number]: number } = {
        0.5: 0.545,
        0.75: 0.785,
        1: 1.025,
        1.25: 1.265,
        1.5: 1.505,
        2: 1.985
      };
      insideDiameter = copperSizes[pipeSize] || pipeSize;
    }
    
    // Calculate head loss in feet of water
    const headLoss = 0.002083 * pipeLength * Math.pow(100/c, 1.85) * Math.pow(flowRate, 1.85) / Math.pow(insideDiameter, 4.8655);
    
    // Calculate equivalent length of fittings
    // Using a simplified approach where each fitting is equivalent to ~5 feet of pipe
    const fittingsEquivLength = fittingsCount * 5;
    const fittingsHeadLoss = 0.002083 * fittingsEquivLength * Math.pow(100/c, 1.85) * Math.pow(flowRate, 1.85) / Math.pow(insideDiameter, 4.8655);
    
    // Total head loss
    const totalHeadLoss = headLoss + fittingsHeadLoss;
    
    // Convert head loss to PSI (1 foot of water = 0.433 PSI)
    const pressureLossPSI = totalHeadLoss * 0.433;
    
    setPressureValues({ ...pressureValues, pressureLoss: pressureLossPSI.toFixed(2) + " PSI" });
  };

  const resetPressureLoss = () => {
    setPressureValues({
      pipeSize: '0.5',
      material: 'copper',
      flowRate: '',
      pipeLength: '',
      fittingsCount: '0',
      pressureLoss: ''
    });
  };

  // Tank Volume Calculator functions
  const calculateTankVolume = () => {
    const shape = tankValues.shape;
    let volume = 0;
    
    if (shape === 'rectangular') {
      const length = parseFloat(tankValues.length);
      const width = parseFloat(tankValues.width);
      const height = parseFloat(tankValues.height);
      
      if (!length || !width || !height) {
        alert("Please enter all dimensions for rectangular tank");
        return;
      }
      
      // Volume in cubic feet
      volume = length * width * height;
    } else if (shape === 'cylindrical') {
      const diameter = parseFloat(tankValues.diameter);
      const height = parseFloat(tankValues.cylinderHeight);
      
      if (!diameter || !height) {
        alert("Please enter all dimensions for cylindrical tank");
        return;
      }
      
      // Volume in cubic feet
      const radius = diameter / 2;
      volume = Math.PI * radius * radius * height;
    } else if (shape === 'cylindricalHorizontal') {
      const diameter = parseFloat(tankValues.hDiameter);
      const length = parseFloat(tankValues.hLength);
      const fillLevel = parseFloat(tankValues.fillLevel);
      
      if (!diameter || !length) {
        alert("Please enter diameter and length for horizontal cylindrical tank");
        return;
      }
      
      const radius = diameter / 2;
      
      if (fillLevel) {
        // Partially filled horizontal cylinder
        if (fillLevel >= diameter) {
          // If fill level exceeds diameter, tank is full
          volume = Math.PI * radius * radius * length;
        } else {
          const h = fillLevel; // height of the filled portion
          const theta = 2 * Math.acos((radius - h) / radius);
          const area = (radius * radius * (theta - Math.sin(theta))) / 2;
          volume = area * length;
        }
      } else {
        // Full tank
        volume = Math.PI * radius * radius * length;
      }
    }
    
    // Convert cubic feet to gallons (1 cubic foot = 7.48052 gallons)
    const volumeGallons = volume * 7.48052;
    
    setTankValues({ ...tankValues, volume: volumeGallons.toFixed(2) + " gallons (" + volume.toFixed(2) + " cubic feet)" });
  };

  const resetTankVolume = () => {
    setTankValues({
      shape: 'rectangular',
      length: '',
      width: '',
      height: '',
      diameter: '',
      cylinderHeight: '',
      hDiameter: '',
      hLength: '',
      fillLevel: '',
      volume: ''
    });
  };

  // Drain Size Calculator functions
  const calculateDrainSize = () => {
    const toilets = parseInt(drainValues.toilets) || 0;
    const sinks = parseInt(drainValues.sinks) || 0;
    const showers = parseInt(drainValues.showers) || 0;
    const bathtubs = parseInt(drainValues.bathtubs) || 0;
    const washingMachines = parseInt(drainValues.washingMachines) || 0;
    const dishwashers = parseInt(drainValues.dishwashers) || 0;
    const slope = parseFloat(drainValues.slope);
    
    if (toilets + sinks + showers + bathtubs + washingMachines + dishwashers === 0) {
      alert("Please enter at least one fixture");
      return;
    }
    
    // DFU (Drainage Fixture Units) values
    const dfuValues = {
      'toilet': 3,
      'sink': 1,
      'shower': 2,
      'bathtub': 2,
      'washingMachine': 2,
      'dishwasher': 2
    };
    
    // Calculate total DFU
    const totalDFU = 
      toilets * dfuValues.toilet +
      sinks * dfuValues.sink +
      showers * dfuValues.shower +
      bathtubs * dfuValues.bathtub +
      washingMachines * dfuValues.washingMachine +
      dishwashers * dfuValues.dishwasher;
    
    // Determine drain size based on DFU and slope
    let drainSize = "";
    
    if (slope === 0.125) { // 1/8" per foot
      if (totalDFU <= 10) drainSize = "2 inch";
      else if (totalDFU <= 20) drainSize = "3 inch";
      else if (totalDFU <= 180) drainSize = "4 inch";
      else if (totalDFU <= 700) drainSize = "6 inch";
      else drainSize = "8 inch or larger";
    } else if (slope === 0.25) { // 1/4" per foot
      if (totalDFU <= 21) drainSize = "2 inch";
      else if (totalDFU <= 24) drainSize = "3 inch";
      else if (totalDFU <= 216) drainSize = "4 inch";
      else if (totalDFU <= 840) drainSize = "6 inch";
      else drainSize = "8 inch or larger";
    } else { // 1/2" per foot
      if (totalDFU <= 26) drainSize = "2 inch";
      else if (totalDFU <= 31) drainSize = "3 inch";
      else if (totalDFU <= 250) drainSize = "4 inch";
      else if (totalDFU <= 1000) drainSize = "6 inch";
      else drainSize = "8 inch or larger";
    }
    
    setDrainValues({ ...drainValues, totalDFU: totalDFU.toString(), drainSize });
  };

  const resetDrainSize = () => {
    setDrainValues({
      toilets: '0',
      sinks: '0',
      showers: '0',
      bathtubs: '0',
      washingMachines: '0',
      dishwashers: '0',
      slope: '0.25',
      totalDFU: '',
      drainSize: ''
    });
  };

  // Pipe Grade Calculator functions
  const calculatePipeGrade = () => {
    const length = parseFloat(gradeValues.length);
    const slope = parseFloat(gradeValues.slope);
    
    if (!length) {
      alert("Please enter pipe length");
      return;
    }
    
    // Calculate total drop
    const dropInches = length * slope;
    const dropFeet = Math.floor(dropInches / 12);
    const remainingInches = dropInches % 12;
    
    let result = "";
    if (dropFeet > 0) {
      result += dropFeet + " ft ";
    }
    result += remainingInches.toFixed(2) + " inches";
    
    setGradeValues({ ...gradeValues, totalDrop: result });
  };

  const resetPipeGrade = () => {
    setGradeValues({
      length: '',
      slope: '0.25',
      totalDrop: ''
    });
  };

  // Water Heater Sizing Calculator functions
  const calculateWaterHeater = () => {
    const people = parseInt(heaterValues.householdSize);
    const climate = heaterValues.climate;
    const usage = heaterValues.usageLevel;
    
    if (!people) {
      alert("Please enter household size");
      return;
    }
    
    // Base gallons per person
    let gallonsPerPerson = 0;
    if (usage === 'light') gallonsPerPerson = 10;
    else if (usage === 'average') gallonsPerPerson = 15;
    else if (usage === 'heavy') gallonsPerPerson = 20;
    
    // Climate adjustment
    let climateMultiplier = 1;
    if (climate === 'cold') climateMultiplier = 1.2;
    else if (climate === 'warm') climateMultiplier = 0.9;
    
    // Calculate tank size
    const tankSize = people * gallonsPerPerson * climateMultiplier;
    
    // Round to nearest standard size
    let recommendedSize: number | string = 0;
    const standardSizes = [30, 40, 50, 75, 80, 100, 120];
    for (let i = 0; i < standardSizes.length; i++) {
      if (tankSize <= standardSizes[i]) {
        recommendedSize = standardSizes[i];
        break;
      }
    }
    if (recommendedSize === 0) recommendedSize = "Greater than 120";
    
    // Calculate BTU rating
    // Rule of thumb: ~35,000 BTU for 40 gallons, scaling linearly
    const btuRating = typeof recommendedSize === 'number' ? Math.round((recommendedSize / 40) * 35000 / 1000) * 1000 : 42000;
    
    setHeaterValues({ 
      ...heaterValues, 
      waterHeaterSize: recommendedSize + " gallons",
      btuRating: btuRating.toLocaleString() + " BTU"
    });
  };

  const resetWaterHeater = () => {
    setHeaterValues({
      householdSize: '',
      climate: 'moderate',
      usageLevel: 'average',
      waterHeaterSize: '',
      btuRating: ''
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Plumbing Calculator</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Pipe Size Calculator */}
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Pipe Size Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="flowRate">Flow Rate (GPM)</Label>
                <Input
                  id="flowRate"
                  type="number"
                  placeholder="Enter flow rate"
                  value={pipeValues.flowRate}
                  onChange={(e) => setPipeValues({ ...pipeValues, flowRate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pipeMaterial">Pipe Material</Label>
                <Select value={pipeValues.material} onValueChange={(value) => setPipeValues({ ...pipeValues, material: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="pvc">PVC</SelectItem>
                    <SelectItem value="pex">PEX</SelectItem>
                    <SelectItem value="galvanized">Galvanized Steel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="maxVelocity">Maximum Velocity (ft/s)</Label>
                <Input
                  id="maxVelocity"
                  type="number"
                  placeholder="Max velocity"
                  value={pipeValues.maxVelocity}
                  onChange={(e) => setPipeValues({ ...pipeValues, maxVelocity: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pipeSize">Recommended Pipe Size</Label>
                <Input
                  id="pipeSize"
                  type="text"
                  value={pipeValues.pipeSize}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculatePipeSize} className="bg-blue-600 hover:bg-blue-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetPipeSize} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pressure Loss Calculator */}
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-green-800">Pressure Loss Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="pressurePipeSize">Pipe Size (inches)</Label>
                <Select value={pressureValues.pipeSize} onValueChange={(value) => setPressureValues({ ...pressureValues, pipeSize: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">1/2"</SelectItem>
                    <SelectItem value="0.75">3/4"</SelectItem>
                    <SelectItem value="1">1"</SelectItem>
                    <SelectItem value="1.25">1-1/4"</SelectItem>
                    <SelectItem value="1.5">1-1/2"</SelectItem>
                    <SelectItem value="2">2"</SelectItem>
                    <SelectItem value="2.5">2-1/2"</SelectItem>
                    <SelectItem value="3">3"</SelectItem>
                    <SelectItem value="4">4"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pressurePipeMaterial">Pipe Material</Label>
                <Select value={pressureValues.material} onValueChange={(value) => setPressureValues({ ...pressureValues, material: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="pvc">PVC</SelectItem>
                    <SelectItem value="pex">PEX</SelectItem>
                    <SelectItem value="galvanized">Galvanized Steel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pressureFlowRate">Flow Rate (GPM)</Label>
                <Input
                  id="pressureFlowRate"
                  type="number"
                  placeholder="Enter flow rate"
                  value={pressureValues.flowRate}
                  onChange={(e) => setPressureValues({ ...pressureValues, flowRate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pipeLength">Pipe Length (ft)</Label>
                <Input
                  id="pipeLength"
                  type="number"
                  placeholder="Enter pipe length"
                  value={pressureValues.pipeLength}
                  onChange={(e) => setPressureValues({ ...pressureValues, pipeLength: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fittingsCount">Number of Fittings</Label>
                <Input
                  id="fittingsCount"
                  type="number"
                  placeholder="Number of fittings"
                  value={pressureValues.fittingsCount}
                  onChange={(e) => setPressureValues({ ...pressureValues, fittingsCount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="pressureLoss">Pressure Loss</Label>
                <Input
                  id="pressureLoss"
                  type="text"
                  value={pressureValues.pressureLoss}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculatePressureLoss} className="bg-green-600 hover:bg-green-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetPressureLoss} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tank Volume Calculator */}
          <Card className="bg-purple-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-purple-800">Tank Volume Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="tankShape">Tank Shape</Label>
                <Select value={tankValues.shape} onValueChange={(value) => setTankValues({ ...tankValues, shape: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rectangular">Rectangular</SelectItem>
                    <SelectItem value="cylindrical">Cylindrical</SelectItem>
                    <SelectItem value="cylindricalHorizontal">Cylindrical (Horizontal)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Rectangular Tank */}
              {tankValues.shape === 'rectangular' && (
                <>
                  <div>
                    <Label htmlFor="tankLength">Length (ft)</Label>
                    <Input
                      id="tankLength"
                      type="number"
                      placeholder="Enter length"
                      value={tankValues.length}
                      onChange={(e) => setTankValues({ ...tankValues, length: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tankWidth">Width (ft)</Label>
                    <Input
                      id="tankWidth"
                      type="number"
                      placeholder="Enter width"
                      value={tankValues.width}
                      onChange={(e) => setTankValues({ ...tankValues, width: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tankHeight">Height (ft)</Label>
                    <Input
                      id="tankHeight"
                      type="number"
                      placeholder="Enter height"
                      value={tankValues.height}
                      onChange={(e) => setTankValues({ ...tankValues, height: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              {/* Cylindrical Tank */}
              {tankValues.shape === 'cylindrical' && (
                <>
                  <div>
                    <Label htmlFor="tankDiameter">Diameter (ft)</Label>
                    <Input
                      id="tankDiameter"
                      type="number"
                      placeholder="Enter diameter"
                      value={tankValues.diameter}
                      onChange={(e) => setTankValues({ ...tankValues, diameter: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cylinderHeight">Height (ft)</Label>
                    <Input
                      id="cylinderHeight"
                      type="number"
                      placeholder="Enter height"
                      value={tankValues.cylinderHeight}
                      onChange={(e) => setTankValues({ ...tankValues, cylinderHeight: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              {/* Horizontal Cylindrical Tank */}
              {tankValues.shape === 'cylindricalHorizontal' && (
                <>
                  <div>
                    <Label htmlFor="hTankDiameter">Diameter (ft)</Label>
                    <Input
                      id="hTankDiameter"
                      type="number"
                      placeholder="Enter diameter"
                      value={tankValues.hDiameter}
                      onChange={(e) => setTankValues({ ...tankValues, hDiameter: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hTankLength">Length (ft)</Label>
                    <Input
                      id="hTankLength"
                      type="number"
                      placeholder="Enter length"
                      value={tankValues.hLength}
                      onChange={(e) => setTankValues({ ...tankValues, hLength: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="fillLevel">Fill Level (ft)</Label>
                    <Input
                      id="fillLevel"
                      type="number"
                      placeholder="Fill level"
                      value={tankValues.fillLevel}
                      onChange={(e) => setTankValues({ ...tankValues, fillLevel: e.target.value })}
                    />
                  </div>
                </>
              )}
              
              <div>
                <Label htmlFor="tankVolume">Volume</Label>
                <Input
                  id="tankVolume"
                  type="text"
                  value={tankValues.volume}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateTankVolume} className="bg-purple-600 hover:bg-purple-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetTankVolume} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Drain Size Calculator */}
          <Card className="bg-amber-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-amber-800">Drain Size Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Fixture Units</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="toilets">Toilets</Label>
                    <Input
                      id="toilets"
                      type="number"
                      min="0"
                      value={drainValues.toilets}
                      onChange={(e) => setDrainValues({ ...drainValues, toilets: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sinks">Sinks</Label>
                    <Input
                      id="sinks"
                      type="number"
                      min="0"
                      value={drainValues.sinks}
                      onChange={(e) => setDrainValues({ ...drainValues, sinks: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="showers">Showers</Label>
                    <Input
                      id="showers"
                      type="number"
                      min="0"
                      value={drainValues.showers}
                      onChange={(e) => setDrainValues({ ...drainValues, showers: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathtubs">Bathtubs</Label>
                    <Input
                      id="bathtubs"
                      type="number"
                      min="0"
                      value={drainValues.bathtubs}
                      onChange={(e) => setDrainValues({ ...drainValues, bathtubs: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="washingMachines">Washing Machine</Label>
                    <Input
                      id="washingMachines"
                      type="number"
                      min="0"
                      value={drainValues.washingMachines}
                      onChange={(e) => setDrainValues({ ...drainValues, washingMachines: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dishwashers">Dishwasher</Label>
                    <Input
                      id="dishwashers"
                      type="number"
                      min="0"
                      value={drainValues.dishwashers}
                      onChange={(e) => setDrainValues({ ...drainValues, dishwashers: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="drainSlope">Drain Slope (inches per foot)</Label>
                <Select value={drainValues.slope} onValueChange={(value) => setDrainValues({ ...drainValues, slope: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.125">1/8"</SelectItem>
                    <SelectItem value="0.25">1/4"</SelectItem>
                    <SelectItem value="0.5">1/2"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="totalDFU">Total Drainage Fixture Units (DFU)</Label>
                <Input
                  id="totalDFU"
                  type="text"
                  value={drainValues.totalDFU}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="drainSize">Recommended Drain Size</Label>
                <Input
                  id="drainSize"
                  type="text"
                  value={drainValues.drainSize}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateDrainSize} className="bg-amber-600 hover:bg-amber-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetDrainSize} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pipe Grade Calculator */}
          <Card className="bg-red-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-red-800">Pipe Grade Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="gradeLength">Pipe Length (ft)</Label>
                <Input
                  id="gradeLength"
                  type="number"
                  placeholder="Enter pipe length"
                  value={gradeValues.length}
                  onChange={(e) => setGradeValues({ ...gradeValues, length: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="requiredSlope">Required Slope (inches per foot)</Label>
                <Select value={gradeValues.slope} onValueChange={(value) => setGradeValues({ ...gradeValues, slope: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.125">1/8"</SelectItem>
                    <SelectItem value="0.25">1/4"</SelectItem>
                    <SelectItem value="0.5">1/2"</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="totalDrop">Total Drop</Label>
                <Input
                  id="totalDrop"
                  type="text"
                  value={gradeValues.totalDrop}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculatePipeGrade} className="bg-red-600 hover:bg-red-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetPipeGrade} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Water Heater Sizing Calculator */}
          <Card className="bg-teal-50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-teal-800">Water Heater Sizing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="householdSize">Household Size (people)</Label>
                <Input
                  id="householdSize"
                  type="number"
                  placeholder="Number of people"
                  value={heaterValues.householdSize}
                  onChange={(e) => setHeaterValues({ ...heaterValues, householdSize: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="climate">Climate</Label>
                <Select value={heaterValues.climate} onValueChange={(value) => setHeaterValues({ ...heaterValues, climate: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">Warm (Southern regions)</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="cold">Cold (Northern regions)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="usageLevel">Usage Level</Label>
                <Select value={heaterValues.usageLevel} onValueChange={(value) => setHeaterValues({ ...heaterValues, usageLevel: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light (fewer fixtures)</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="heavy">Heavy (multiple bathrooms)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="waterHeaterSize">Recommended Tank Size</Label>
                <Input
                  id="waterHeaterSize"
                  type="text"
                  value={heaterValues.waterHeaterSize}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="btuRating">Recommended BTU Rating</Label>
                <Input
                  id="btuRating"
                  type="text"
                  value={heaterValues.btuRating}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateWaterHeater} className="bg-teal-600 hover:bg-teal-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetWaterHeater} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>This calculator is for reference only. Always consult with a licensed plumber and follow local plumbing codes.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default PlumbingCalculator; 