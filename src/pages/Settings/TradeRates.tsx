
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowLeft, Clock, Users, Percent } from "lucide-react";
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
  const [meterRates, setMeterRates] = useState<Rate[]>([
    { id: "1", name: "Standard Meter Rate", rate: 85, unit: "per meter" }
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

  const addNewRate = (type: 'meter' | 'hourly') => {
    const newRate = {
      id: Date.now().toString(),
      name: `New ${type === 'meter' ? 'Meter' : 'Hourly'} Rate`,
      rate: 0,
      unit: type === 'meter' ? 'per meter' : 'per hour'
    };
    
    if (type === 'meter') {
      setMeterRates([...meterRates, newRate]);
    } else {
      setHourlyRates([...hourlyRates, newRate]);
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

        <Tabs defaultValue="meter" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="meter" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Meter Rates
            </TabsTrigger>
            <TabsTrigger value="hourly" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hourly Rates
            </TabsTrigger>
            <TabsTrigger value="commission" className="flex items-center gap-2">
              <Percent className="h-4 w-4" />
              Commission Rates
            </TabsTrigger>
          </TabsList>

          <TabsContent value="meter">
            <Card>
              <CardHeader>
                <CardTitle>Meter Rates</CardTitle>
                <CardDescription>Set rates based on meter measurements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {meterRates.map((rate) => (
                  <div key={rate.id} className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Rate Name"
                      value={rate.name}
                      onChange={(e) => {
                        const updatedRates = meterRates.map(r =>
                          r.id === rate.id ? { ...r, name: e.target.value } : r
                        );
                        setMeterRates(updatedRates);
                      }}
                    />
                    <Input
                      type="number"
                      placeholder="Rate Amount"
                      value={rate.rate}
                      onChange={(e) => {
                        const updatedRates = meterRates.map(r =>
                          r.id === rate.id ? { ...r, rate: Number(e.target.value) } : r
                        );
                        setMeterRates(updatedRates);
                      }}
                    />
                  </div>
                ))}
                <Button variant="outline" onClick={() => addNewRate('meter')}>
                  Add Meter Rate
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
