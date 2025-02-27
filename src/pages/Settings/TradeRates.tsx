
import { DollarSign } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TradeRates() {
  return (
    <SettingsPageTemplate title="Trade Rates" icon={<DollarSign className="h-7 w-7 text-gray-700" />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Manage your trade rates and pricing structures</p>
          <Button>Update Rates</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Hourly Rates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Configure standard hourly rates for different service types.</p>
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
                  <span>Consultation</span>
                  <span className="font-medium">$95.00 / hour</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">Edit Hourly Rates</Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Fixed Price Services</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">Manage pricing for standard fixed-price services.</p>
              <div className="space-y-2">
                <div className="flex justify-between py-2 border-b">
                  <span>Basic Installation</span>
                  <span className="font-medium">$350.00</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>System Replacement</span>
                  <span className="font-medium">$1,200.00</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Annual Maintenance</span>
                  <span className="font-medium">$180.00</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Safety Inspection</span>
                  <span className="font-medium">$120.00</span>
                </div>
              </div>
              <Button variant="outline" className="mt-4 w-full">Edit Fixed Prices</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsPageTemplate>
  );
}
