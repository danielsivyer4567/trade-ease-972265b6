
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowLeft, Clock, Users, Percent, Box, Ruler, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Rate {
  id: string;
  name: string;
  rate: number;
  unit: string;
}

interface CommissionRate {
  id: string;
  staffName: string;
  percentage: number;
  minimumSale: number;
}

export default function TradeRates() {
  const [squareMeterRates, setSquareMeterRates] = useState<Rate[]>([
    { id: "1", name: "Standard Square Meter Rate", rate: 85, unit: "per m²" }
  ]);
  const [linealMeterRates, setLinealMeterRates] = useState<Rate[]>([
    { id: "1", name: "Standard Lineal Meter Rate", rate: 45, unit: "per lineal meter" }
  ]);
  const [itemRates, setItemRates] = useState<Rate[]>([
    { id: "1", name: "Standard Item Rate", rate: 120, unit: "per item" }
  ]);
  const [hourlyRates, setHourlyRates] = useState<Rate[]>([
    { id: "1", name: "Standard Labor", rate: 95, unit: "per hour" }
  ]);
  const [commissionRates, setCommissionRates] = useState<CommissionRate[]>([
    { id: "1", staffName: "Sales Team A", percentage: 10, minimumSale: 1000 }
  ]);
  
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Changes Saved",
      description: "Your rate changes have been saved successfully",
    });
  };

  const addNewRate = (type: 'square' | 'lineal' | 'item' | 'hourly') => {
    const newRate = {
      id: Date.now().toString(),
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Rate`,
      rate: 0,
      unit: type === 'square' ? 'per m²' : 
            type === 'lineal' ? 'per lineal meter' :
            type === 'item' ? 'per item' : 'per hour'
    };
    
    switch(type) {
      case 'square':
        setSquareMeterRates([...squareMeterRates, newRate]);
        break;
      case 'lineal':
        setLinealMeterRates([...linealMeterRates, newRate]);
        break;
      case 'item':
        setItemRates([...itemRates, newRate]);
        break;
      case 'hourly':
        setHourlyRates([...hourlyRates, newRate]);
        break;
    }
  };

  const addNewCommissionRate = () => {
    const newRate = {
      id: Date.now().toString(),
      staffName: "New Staff Member",
      percentage: 0,
      minimumSale: 0
    };
    setCommissionRates([...commissionRates, newRate]);
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/settings" className="hover:text-blue-500">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <DollarSign className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Trade Rates</h1>
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>

        <Tabs defaultValue="square" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="square" className="flex items-center gap-2">
              <Box className="h-4 w-4" />
              Square Meter
            </TabsTrigger>
            <TabsTrigger value="lineal" className="flex items-center gap-2">
              <Ruler className="h-4 w-4" />
              Lineal Meter
            </TabsTrigger>
            <TabsTrigger value="item" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Per Item
            </TabsTrigger>
            <TabsTrigger value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hourly
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Commission
            </TabsTrigger>
          </TabsList>

          <TabsContent value="square">
            <Card>
              <CardHeader>
                <CardTitle>Square Meter Rates (m²)</CardTitle>
                <CardDescription>Set rates based on square meter measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {squareMeterRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rate Name"
                      value={rate.name}
                      onChange={(e) => {
                        const updatedRates = squareMeterRates.map(r =>
                          r.id === rate.id ? { ...r, name: e.target.value } : r
                        );
                        setSquareMeterRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Rate Amount"
                      value={rate.rate}
                      onChange={(e) => {
                        const updatedRates = squareMeterRates.map(r =>
                          r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                        );
                        setSquareMeterRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addNewRate('square')}>
                  Add Square Meter Rate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lineal">
            <Card>
              <CardHeader>
                <CardTitle>Lineal Meter Rates</CardTitle>
                <CardDescription>Set rates based on lineal meter measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {linealMeterRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rate Name"
                      value={rate.name}
                      onChange={(e) => {
                        const updatedRates = linealMeterRates.map(r =>
                          r.id === rate.id ? { ...r, name: e.target.value } : r
                        );
                        setLinealMeterRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Rate Amount"
                      value={rate.rate}
                      onChange={(e) => {
                        const updatedRates = linealMeterRates.map(r =>
                          r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                        );
                        setLinealMeterRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addNewRate('lineal')}>
                  Add Lineal Meter Rate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="item">
            <Card>
              <CardHeader>
                <CardTitle>Per Item Rates</CardTitle>
                <CardDescription>Set rates based on individual items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {itemRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rate Name"
                      value={rate.name}
                      onChange={(e) => {
                        const updatedRates = itemRates.map(r =>
                          r.id === rate.id ? { ...r, name: e.target.value } : r
                        );
                        setItemRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Rate Amount"
                      value={rate.rate}
                      onChange={(e) => {
                        const updatedRates = itemRates.map(r =>
                          r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                        );
                        setItemRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addNewRate('item')}>
                  Add Item Rate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hourly">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Rates</CardTitle>
                <CardDescription>Set rates based on time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {hourlyRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rate Name"
                      value={rate.name}
                      onChange={(e) => {
                        const updatedRates = hourlyRates.map(r =>
                          r.id === rate.id ? { ...r, name: e.target.value } : r
                        );
                        setHourlyRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Rate Amount"
                      value={rate.rate}
                      onChange={(e) => {
                        const updatedRates = hourlyRates.map(r =>
                          r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                        );
                        setHourlyRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addNewRate('hourly')}>
                  Add Hourly Rate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="commission">
            <Card>
              <CardHeader>
                <CardTitle>Commission Rates</CardTitle>
                <CardDescription>Set commission-based rates for sales staff</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {commissionRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-3 gap-4">
                    <Input
                      placeholder="Staff Name"
                      value={rate.staffName}
                      onChange={(e) => {
                        const updatedRates = commissionRates.map(r =>
                          r.id === rate.id ? { ...r, staffName: e.target.value } : r
                        );
                        setCommissionRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Commission %"
                      value={rate.percentage}
                      onChange={(e) => {
                        const updatedRates = commissionRates.map(r =>
                          r.id === rate.id ? { ...r, percentage: Number(e.target.value) } : r
                        );
                        setCommissionRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Minimum Sale"
                      value={rate.minimumSale}
                      onChange={(e) => {
                        const updatedRates = commissionRates.map(r =>
                          r.id === rate.id ? { ...r, minimumSale: Number(e.target.value) } : r
                        );
                        setCommissionRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={addNewCommissionRate}>
                  Add Commission Rate
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
