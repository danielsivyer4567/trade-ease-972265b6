
import { DollarSign } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function TradeRates() {
  const [hourlyRate, setHourlyRate] = useState(85);
  const [hours, setHours] = useState(8);
  const [materials, setMaterials] = useState(350);
  const [markupPercentage, setMarkupPercentage] = useState(30);

  const calculateLabor = () => {
    return hourlyRate * hours;
  };

  const calculateMaterialsWithMarkup = () => {
    return materials * (1 + markupPercentage / 100);
  };

  const calculateTotal = () => {
    return calculateLabor() + calculateMaterialsWithMarkup();
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
              <div className="space-y-4">
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
                <div className="pt-4 border-t">
                  <div className="flex justify-between py-2">
                    <span>Labor Cost:</span>
                    <span className="font-medium">${calculateLabor().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span>Materials (with markup):</span>
                    <span className="font-medium">${calculateMaterialsWithMarkup().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 text-lg font-bold">
                    <span>Total:</span>
                    <span>${calculateTotal().toFixed(2)}</span>
                  </div>
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
                  <span>Standard Service</span>
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
                  <span>Trip Charge</span>
                  <span className="font-medium">$45.00</span>
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
