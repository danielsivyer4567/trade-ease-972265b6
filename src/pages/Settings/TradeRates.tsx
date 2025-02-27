
import { DollarSign } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TradeRates() {
  // Square meter calculation state
  const [squareMeterRate, setSquareMeterRate] = useState(45);
  const [squareMeters, setSquareMeters] = useState(20);
  
  // Linear meter calculation state
  const [linearMeterRate, setLinearMeterRate] = useState(35);
  const [linearMeters, setLinearMeters] = useState(10);
  
  // Hourly rate calculation state
  const [hourlyRate, setHourlyRate] = useState(85);
  const [hours, setHours] = useState(8);
  
  // Common state
  const [materials, setMaterials] = useState(350);
  const [markupPercentage, setMarkupPercentage] = useState(30);
  const [gstRate, setGstRate] = useState(10);

  // Calculation functions
  const calculateSquareMeterLabor = () => {
    return squareMeterRate * squareMeters;
  };

  const calculateLinearMeterLabor = () => {
    return linearMeterRate * linearMeters;
  };

  const calculateHourlyLabor = () => {
    return hourlyRate * hours;
  };

  const calculateMaterialsWithMarkup = () => {
    return materials * (1 + markupPercentage / 100);
  };

  const calculateSubtotal = (laborCost) => {
    return laborCost + calculateMaterialsWithMarkup();
  };

  const calculateGST = (subtotal) => {
    return subtotal * (gstRate / 100);
  };

  const calculateTotal = (laborCost) => {
    const subtotal = calculateSubtotal(laborCost);
    const gst = calculateGST(subtotal);
    return subtotal + gst;
  };

  return (
    <SettingsPageTemplate title="Trade Rates" icon={<DollarSign className="h-7 w-7 text-gray-700" />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Calculate and manage your trade rates for accurate quotes and billing</p>
          <Button>Save Default Rates</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Rate Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="square-meter">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="square-meter">Square Meter</TabsTrigger>
                  <TabsTrigger value="linear-meter">Linear Meter</TabsTrigger>
                  <TabsTrigger value="hourly">Hourly</TabsTrigger>
                </TabsList>
                
                <TabsContent value="square-meter" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="squareMeterRate">Rate per m² ($)</Label>
                    <Input 
                      id="squareMeterRate" 
                      type="number" 
                      value={squareMeterRate} 
                      onChange={(e) => setSquareMeterRate(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="squareMeters">Area (m²)</Label>
                    <Input 
                      id="squareMeters" 
                      type="number" 
                      value={squareMeters} 
                      onChange={(e) => setSquareMeters(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between py-2">
                      <span>Labor Cost:</span>
                      <span className="font-medium">${calculateSquareMeterLabor().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Materials (with markup):</span>
                      <span className="font-medium">${calculateMaterialsWithMarkup().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal(calculateSquareMeterLabor()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>GST ({gstRate}%):</span>
                      <span className="font-medium">${calculateGST(calculateSubtotal(calculateSquareMeterLabor())).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal(calculateSquareMeterLabor()).toFixed(2)}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="linear-meter" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="linearMeterRate">Rate per linear meter ($)</Label>
                    <Input 
                      id="linearMeterRate" 
                      type="number" 
                      value={linearMeterRate} 
                      onChange={(e) => setLinearMeterRate(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="linearMeters">Length (m)</Label>
                    <Input 
                      id="linearMeters" 
                      type="number" 
                      value={linearMeters} 
                      onChange={(e) => setLinearMeters(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between py-2">
                      <span>Labor Cost:</span>
                      <span className="font-medium">${calculateLinearMeterLabor().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Materials (with markup):</span>
                      <span className="font-medium">${calculateMaterialsWithMarkup().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal(calculateLinearMeterLabor()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>GST ({gstRate}%):</span>
                      <span className="font-medium">${calculateGST(calculateSubtotal(calculateLinearMeterLabor())).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal(calculateLinearMeterLabor()).toFixed(2)}</span>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="hourly" className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                    <Input 
                      id="hourlyRate" 
                      type="number" 
                      value={hourlyRate} 
                      onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div>
                    <Label htmlFor="hours">Hours</Label>
                    <Input 
                      id="hours" 
                      type="number" 
                      value={hours} 
                      onChange={(e) => setHours(parseFloat(e.target.value) || 0)} 
                    />
                  </div>
                  <div className="pt-4 border-t">
                    <div className="flex justify-between py-2">
                      <span>Labor Cost:</span>
                      <span className="font-medium">${calculateHourlyLabor().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Materials (with markup):</span>
                      <span className="font-medium">${calculateMaterialsWithMarkup().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>Subtotal:</span>
                      <span className="font-medium">${calculateSubtotal(calculateHourlyLabor()).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span>GST ({gstRate}%):</span>
                      <span className="font-medium">${calculateGST(calculateSubtotal(calculateHourlyLabor())).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between py-2 text-lg font-bold">
                      <span>Total:</span>
                      <span>${calculateTotal(calculateHourlyLabor()).toFixed(2)}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="mt-4 space-y-4 pt-4 border-t">
                <div>
                  <Label htmlFor="materials">Materials Cost ($)</Label>
                  <Input 
                    id="materials" 
                    type="number" 
                    value={materials} 
                    onChange={(e) => setMaterials(parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label htmlFor="markup">Materials Markup (%)</Label>
                  <Input 
                    id="markup" 
                    type="number" 
                    value={markupPercentage} 
                    onChange={(e) => setMarkupPercentage(parseFloat(e.target.value) || 0)} 
                  />
                </div>
                <div>
                  <Label htmlFor="gst">GST Rate (%)</Label>
                  <Input 
                    id="gst" 
                    type="number" 
                    value={gstRate} 
                    onChange={(e) => setGstRate(parseFloat(e.target.value) || 0)} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Default Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">These rates are used as defaults when creating new quotes and jobs.</p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Standard Square Meter Rate</span>
                  <span className="font-medium">$45.00 / m²</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Standard Linear Meter Rate</span>
                  <span className="font-medium">$35.00 / linear m</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Standard Hourly Rate</span>
                  <span className="font-medium">$85.00 / hour</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Emergency Service</span>
                  <span className="font-medium">$125.00 / hour</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Weekend Service</span>
                  <span className="font-medium">$110.00 / hour</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Materials Markup</span>
                  <span className="font-medium">30%</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>GST Rate</span>
                  <span className="font-medium">10%</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">Edit Default Rates</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsPageTemplate>
  );
}
