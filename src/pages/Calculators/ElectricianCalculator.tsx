import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ElectricianCalculator = () => {
  // Ohm's Law Calculator state
  const [ohmValues, setOhmValues] = useState({
    voltage: '',
    current: '',
    resistance: '',
    power: ''
  });

  // Wire Size Calculator state
  const [wireValues, setWireValues] = useState({
    current: '',
    length: '',
    voltage: '',
    material: 'copper',
    wireSize: ''
  });

  // Voltage Drop Calculator state
  const [vdValues, setVdValues] = useState({
    wireSize: '14',
    current: '',
    length: '',
    voltage: '',
    material: 'copper',
    result: '',
    percentage: ''
  });

  // Conduit Fill Calculator state
  const [conduitValues, setConduitValues] = useState({
    size: '0.5',
    type: 'emt',
    wire14: '0',
    wire12: '0',
    wire10: '0',
    wire8: '0',
    wire6: '0',
    wire4: '0',
    fillPercentage: ''
  });

  // Ohm's Law Calculator functions
  const calculateOhm = () => {
    const voltage = parseFloat(ohmValues.voltage) || 0;
    const current = parseFloat(ohmValues.current) || 0;
    const resistance = parseFloat(ohmValues.resistance) || 0;
    const power = parseFloat(ohmValues.power) || 0;
    
    // Count how many values are provided
    let providedValues = 0;
    if (voltage > 0) providedValues++;
    if (current > 0) providedValues++;
    if (resistance > 0) providedValues++;
    if (power > 0) providedValues++;
    
    // Need at least 2 values to calculate the others
    if (providedValues < 2) {
      alert("Please provide at least 2 values to calculate");
      return;
    }
    
    const newValues = { ...ohmValues };
    
    // Calculate based on provided values
    if (voltage === 0 && current > 0 && resistance > 0) {
      newValues.voltage = (current * resistance).toFixed(2);
    } else if (voltage === 0 && current > 0 && power > 0) {
      newValues.voltage = (power / current).toFixed(2);
    } else if (voltage === 0 && resistance > 0 && power > 0) {
      newValues.voltage = Math.sqrt(power * resistance).toFixed(2);
    } else if (current === 0 && voltage > 0 && resistance > 0) {
      newValues.current = (voltage / resistance).toFixed(2);
    } else if (current === 0 && voltage > 0 && power > 0) {
      newValues.current = (power / voltage).toFixed(2);
    } else if (current === 0 && resistance > 0 && power > 0) {
      newValues.current = Math.sqrt(power / resistance).toFixed(2);
    } else if (resistance === 0 && voltage > 0 && current > 0) {
      newValues.resistance = (voltage / current).toFixed(2);
    } else if (resistance === 0 && voltage > 0 && power > 0) {
      newValues.resistance = ((voltage * voltage) / power).toFixed(2);
    } else if (resistance === 0 && current > 0 && power > 0) {
      newValues.resistance = (power / (current * current)).toFixed(2);
    } else if (power === 0 && voltage > 0 && current > 0) {
      newValues.power = (voltage * current).toFixed(2);
    } else if (power === 0 && voltage > 0 && resistance > 0) {
      newValues.power = ((voltage * voltage) / resistance).toFixed(2);
    } else if (power === 0 && current > 0 && resistance > 0) {
      newValues.power = (current * current * resistance).toFixed(2);
    }
    
    setOhmValues(newValues);
  };

  const resetOhm = () => {
    setOhmValues({
      voltage: '',
      current: '',
      resistance: '',
      power: ''
    });
  };

  // Wire Size Calculator functions
  const calculateWireSize = () => {
    const current = parseFloat(wireValues.current);
    const length = parseFloat(wireValues.length);
    const voltage = parseFloat(wireValues.voltage);
    const material = wireValues.material;
    
    if (!current || !length || !voltage) {
      alert("Please enter all required values");
      return;
    }
    
    let wireSize = "";
    
    if (material === 'copper') {
      if (current <= 15) wireSize = "14 AWG";
      else if (current <= 20) wireSize = "12 AWG";
      else if (current <= 30) wireSize = "10 AWG";
      else if (current <= 40) wireSize = "8 AWG";
      else if (current <= 55) wireSize = "6 AWG";
      else if (current <= 70) wireSize = "4 AWG";
      else if (current <= 85) wireSize = "3 AWG";
      else if (current <= 95) wireSize = "2 AWG";
      else if (current <= 110) wireSize = "1 AWG";
      else if (current <= 125) wireSize = "1/0 AWG";
      else if (current <= 145) wireSize = "2/0 AWG";
      else if (current <= 165) wireSize = "3/0 AWG";
      else if (current <= 195) wireSize = "4/0 AWG";
      else wireSize = "Need larger than 4/0 AWG";
    } else { // aluminum
      if (current <= 15) wireSize = "12 AWG";
      else if (current <= 20) wireSize = "10 AWG";
      else if (current <= 30) wireSize = "8 AWG";
      else if (current <= 40) wireSize = "6 AWG";
      else if (current <= 55) wireSize = "4 AWG";
      else if (current <= 70) wireSize = "3 AWG";
      else if (current <= 85) wireSize = "2 AWG";
      else if (current <= 100) wireSize = "1 AWG";
      else if (current <= 115) wireSize = "1/0 AWG";
      else if (current <= 130) wireSize = "2/0 AWG";
      else if (current <= 150) wireSize = "3/0 AWG";
      else if (current <= 175) wireSize = "4/0 AWG";
      else wireSize = "Need larger than 4/0 AWG";
    }
    
    // Adjust for long runs
    if (length > 100) {
      wireSize += " (Consider upsizing for voltage drop)";
    }
    
    setWireValues({ ...wireValues, wireSize });
  };

  const resetWireSize = () => {
    setWireValues({
      current: '',
      length: '',
      voltage: '',
      material: 'copper',
      wireSize: ''
    });
  };

  // Voltage Drop Calculator functions
  const calculateVoltageDrop = () => {
    const wireSize = vdValues.wireSize;
    const current = parseFloat(vdValues.current);
    const length = parseFloat(vdValues.length);
    const voltage = parseFloat(vdValues.voltage);
    const material = vdValues.material;
    
    if (!current || !length || !voltage) {
      alert("Please enter all required values");
      return;
    }
    
    // Wire resistance per 1000 ft (simplified values)
    const resistancePerKFt: { [key: string]: { [key: string]: number } } = {
      'copper': {
        '14': 3.14,
        '12': 1.98,
        '10': 1.24,
        '8': 0.778,
        '6': 0.491,
        '4': 0.308,
        '2': 0.194,
        '1': 0.154,
        '1/0': 0.122,
        '2/0': 0.0967,
        '3/0': 0.0766,
        '4/0': 0.0608
      },
      'aluminum': {
        '14': 5.17,
        '12': 3.25,
        '10': 2.04,
        '8': 1.28,
        '6': 0.808,
        '4': 0.508,
        '2': 0.319,
        '1': 0.253,
        '1/0': 0.201,
        '2/0': 0.159,
        '3/0': 0.126,
        '4/0': 0.100
      }
    };
    
    // Calculate voltage drop
    const resistance = resistancePerKFt[material][wireSize];
    const voltageDrop = (2 * length * current * resistance) / 1000; // Two-way length
    const percentageDrop = (voltageDrop / voltage) * 100;
    
    let result = voltageDrop.toFixed(2) + " V";
    let percentage = percentageDrop.toFixed(2) + "%";
    
    // Add warning if voltage drop is excessive
    if (percentageDrop > 3) {
      percentage += " (Exceeds 3% recommendation)";
    }
    
    setVdValues({ ...vdValues, result, percentage });
  };

  const resetVoltageDrop = () => {
    setVdValues({
      wireSize: '14',
      current: '',
      length: '',
      voltage: '',
      material: 'copper',
      result: '',
      percentage: ''
    });
  };

  // Conduit Fill Calculator functions
  const calculateConduitFill = () => {
    const conduitSize = parseFloat(conduitValues.size);
    const conduitType = conduitValues.type;
    
    // Wire counts
    const wire14Count = parseInt(conduitValues.wire14) || 0;
    const wire12Count = parseInt(conduitValues.wire12) || 0;
    const wire10Count = parseInt(conduitValues.wire10) || 0;
    const wire8Count = parseInt(conduitValues.wire8) || 0;
    const wire6Count = parseInt(conduitValues.wire6) || 0;
    const wire4Count = parseInt(conduitValues.wire4) || 0;
    
    if (wire14Count + wire12Count + wire10Count + wire8Count + wire6Count + wire4Count === 0) {
      alert("Please enter at least one wire");
      return;
    }
    
    // Wire areas in square inches
    const wireAreas: { [key: string]: number } = {
      '14': 0.0097,
      '12': 0.0133,
      '10': 0.0211,
      '8': 0.0366,
      '6': 0.0507,
      '4': 0.0824
    };
    
    // Conduit areas (internal) in square inches
    const conduitAreas: { [key: string]: { [key: string]: number } } = {
      'emt': {
        '0.5': 0.304,
        '0.75': 0.533,
        '1': 0.864,
        '1.25': 1.496,
        '1.5': 2.036,
        '2': 3.356,
        '2.5': 5.858,
        '3': 8.846,
        '3.5': 11.545,
        '4': 14.753
      },
      'pvc': {
        '0.5': 0.285,
        '0.75': 0.508,
        '1': 0.848,
        '1.25': 1.453,
        '1.5': 1.986,
        '2': 3.291,
        '2.5': 4.695,
        '3': 7.38,
        '3.5': 9.513,
        '4': 12.24
      },
      'rigid': {
        '0.5': 0.233,
        '0.75': 0.421,
        '1': 0.722,
        '1.25': 1.049,
        '1.5': 1.528,
        '2': 2.559,
        '2.5': 3.819,
        '3': 6.16,
        '3.5': 8.153,
        '4': 10.57
      }
    };
    
    // Calculate total wire area
    const totalWireArea = 
      wire14Count * wireAreas['14'] +
      wire12Count * wireAreas['12'] +
      wire10Count * wireAreas['10'] +
      wire8Count * wireAreas['8'] +
      wire6Count * wireAreas['6'] +
      wire4Count * wireAreas['4'];
    
    // Calculate fill percentage
    const conduitArea = conduitAreas[conduitType][conduitSize.toString()];
    const fillPercentage = (totalWireArea / conduitArea) * 100;
    
    let result = fillPercentage.toFixed(2) + "%";
    
    // Add warning if fill exceeds code maximum (40% for 3+ wires)
    if (fillPercentage > 40) {
      result += " (Exceeds 40% maximum)";
    }
    
    setConduitValues({ ...conduitValues, fillPercentage: result });
  };

  const resetConduitFill = () => {
    setConduitValues({
      size: '0.5',
      type: 'emt',
      wire14: '0',
      wire12: '0',
      wire10: '0',
      wire8: '0',
      wire6: '0',
      wire4: '0',
      fillPercentage: ''
    });
  };

  return (
    <AppLayout>
      <div className="container mx-auto max-w-6xl p-6">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Electrician Calculator</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ohm's Law Calculator */}
          <Card className="bg-slate-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Ohm's Law Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="voltage">Voltage (V)</Label>
                <Input
                  id="voltage"
                  type="number"
                  placeholder="Enter voltage"
                  value={ohmValues.voltage}
                  onChange={(e) => setOhmValues({ ...ohmValues, voltage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="current">Current (A)</Label>
                <Input
                  id="current"
                  type="number"
                  placeholder="Enter current"
                  value={ohmValues.current}
                  onChange={(e) => setOhmValues({ ...ohmValues, current: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="resistance">Resistance (Ω)</Label>
                <Input
                  id="resistance"
                  type="number"
                  placeholder="Enter resistance"
                  value={ohmValues.resistance}
                  onChange={(e) => setOhmValues({ ...ohmValues, resistance: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="power">Power (W)</Label>
                <Input
                  id="power"
                  type="number"
                  placeholder="Enter power"
                  value={ohmValues.power}
                  onChange={(e) => setOhmValues({ ...ohmValues, power: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateOhm} className="bg-blue-600 hover:bg-blue-700 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetOhm} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Wire Size Calculator */}
          <Card className="bg-slate-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Wire Size Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="wireCurrent">Current (A)</Label>
                <Input
                  id="wireCurrent"
                  type="number"
                  placeholder="Enter current"
                  value={wireValues.current}
                  onChange={(e) => setWireValues({ ...wireValues, current: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wireLength">Length (ft)</Label>
                <Input
                  id="wireLength"
                  type="number"
                  placeholder="Enter one-way length"
                  value={wireValues.length}
                  onChange={(e) => setWireValues({ ...wireValues, length: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wireVoltage">Voltage (V)</Label>
                <Input
                  id="wireVoltage"
                  type="number"
                  placeholder="Enter voltage"
                  value={wireValues.voltage}
                  onChange={(e) => setWireValues({ ...wireValues, voltage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="wireMaterial">Material</Label>
                <Select value={wireValues.material} onValueChange={(value) => setWireValues({ ...wireValues, material: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="wireSize">Recommended AWG Size</Label>
                <Input
                  id="wireSize"
                  type="text"
                  value={wireValues.wireSize}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateWireSize} className="bg-blue-500 hover:bg-blue-600 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetWireSize} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Voltage Drop Calculator */}
          <Card className="bg-slate-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Voltage Drop Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="vdWireSize">Wire Size (AWG)</Label>
                <Select value={vdValues.wireSize} onValueChange={(value) => setVdValues({ ...vdValues, wireSize: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="14">14 AWG</SelectItem>
                    <SelectItem value="12">12 AWG</SelectItem>
                    <SelectItem value="10">10 AWG</SelectItem>
                    <SelectItem value="8">8 AWG</SelectItem>
                    <SelectItem value="6">6 AWG</SelectItem>
                    <SelectItem value="4">4 AWG</SelectItem>
                    <SelectItem value="2">2 AWG</SelectItem>
                    <SelectItem value="1">1 AWG</SelectItem>
                    <SelectItem value="1/0">1/0 AWG</SelectItem>
                    <SelectItem value="2/0">2/0 AWG</SelectItem>
                    <SelectItem value="3/0">3/0 AWG</SelectItem>
                    <SelectItem value="4/0">4/0 AWG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vdCurrent">Current (A)</Label>
                <Input
                  id="vdCurrent"
                  type="number"
                  placeholder="Enter current"
                  value={vdValues.current}
                  onChange={(e) => setVdValues({ ...vdValues, current: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vdLength">Length (ft)</Label>
                <Input
                  id="vdLength"
                  type="number"
                  placeholder="Enter one-way length"
                  value={vdValues.length}
                  onChange={(e) => setVdValues({ ...vdValues, length: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vdVoltage">Voltage (V)</Label>
                <Input
                  id="vdVoltage"
                  type="number"
                  placeholder="Enter voltage"
                  value={vdValues.voltage}
                  onChange={(e) => setVdValues({ ...vdValues, voltage: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="vdMaterial">Material</Label>
                <Select value={vdValues.material} onValueChange={(value) => setVdValues({ ...vdValues, material: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="copper">Copper</SelectItem>
                    <SelectItem value="aluminum">Aluminum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="vdResult">Voltage Drop</Label>
                <Input
                  id="vdResult"
                  type="text"
                  value={vdValues.result}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="vdPercentage">Percentage Drop</Label>
                <Input
                  id="vdPercentage"
                  type="text"
                  value={vdValues.percentage}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateVoltageDrop} className="bg-blue-500 hover:bg-blue-600 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetVoltageDrop} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Conduit Fill Calculator */}
          <Card className="bg-slate-300">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-blue-800">Conduit Fill Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="conduitSize">Conduit Size</Label>
                <Select value={conduitValues.size} onValueChange={(value) => setConduitValues({ ...conduitValues, size: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0.5">1/2 inch</SelectItem>
                    <SelectItem value="0.75">3/4 inch</SelectItem>
                    <SelectItem value="1">1 inch</SelectItem>
                    <SelectItem value="1.25">1-1/4 inch</SelectItem>
                    <SelectItem value="1.5">1-1/2 inch</SelectItem>
                    <SelectItem value="2">2 inch</SelectItem>
                    <SelectItem value="2.5">2-1/2 inch</SelectItem>
                    <SelectItem value="3">3 inch</SelectItem>
                    <SelectItem value="3.5">3-1/2 inch</SelectItem>
                    <SelectItem value="4">4 inch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="conduitType">Conduit Type</Label>
                <Select value={conduitValues.type} onValueChange={(value) => setConduitValues({ ...conduitValues, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emt">EMT</SelectItem>
                    <SelectItem value="pvc">PVC Schedule 40</SelectItem>
                    <SelectItem value="rigid">Rigid Metal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <h3 className="text-md font-medium text-gray-700 mb-2">Wire Count</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="wire14">14 AWG</Label>
                    <Input
                      id="wire14"
                      type="number"
                      min="0"
                      value={conduitValues.wire14}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire14: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wire12">12 AWG</Label>
                    <Input
                      id="wire12"
                      type="number"
                      min="0"
                      value={conduitValues.wire12}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire12: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wire10">10 AWG</Label>
                    <Input
                      id="wire10"
                      type="number"
                      min="0"
                      value={conduitValues.wire10}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire10: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wire8">8 AWG</Label>
                    <Input
                      id="wire8"
                      type="number"
                      min="0"
                      value={conduitValues.wire8}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire8: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wire6">6 AWG</Label>
                    <Input
                      id="wire6"
                      type="number"
                      min="0"
                      value={conduitValues.wire6}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire6: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="wire4">4 AWG</Label>
                    <Input
                      id="wire4"
                      type="number"
                      min="0"
                      value={conduitValues.wire4}
                      onChange={(e) => setConduitValues({ ...conduitValues, wire4: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="fillPercentage">Fill Percentage</Label>
                <Input
                  id="fillPercentage"
                  type="text"
                  value={conduitValues.fillPercentage}
                  readOnly
                  className="bg-gray-50"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={calculateConduitFill} className="bg-blue-500 hover:bg-blue-600 flex-1">
                  Calculate
                </Button>
                <Button onClick={resetConduitFill} variant="secondary">
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Footer */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>This calculator is for reference only. Always consult with a licensed electrician and follow local electrical codes.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default ElectricianCalculator; 