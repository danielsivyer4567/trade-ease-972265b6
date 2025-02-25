
import { AppLayout } from "@/components/ui/AppLayout";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowLeft, Clock, Box, Ruler, Package, Percent } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Rate, CommissionRate, Staff, Calculation } from "./types";
import { StaffSelector } from "./components/StaffSelector";
import { RateEditor } from "./components/RateEditor";
import { CommissionRateEditor } from "./components/CommissionRateEditor";
import { RateCalculator } from "./components/RateCalculator";
import { CalculationResult } from "./components/CalculationResult";

export default function TradeRatesCalculator() {
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
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedRate, setSelectedRate] = useState<Rate | null>(null);
  const [calculation, setCalculation] = useState<Calculation | null>(null);

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

  const staffMembers: Staff[] = [
    { id: "1", name: "Charl" },
    { id: "2", name: "Sarah Johnson" },
    { id: "3", name: "Mike Wilson" },
  ];

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

        <StaffSelector
          staffMembers={staffMembers}
          selectedStaff={selectedStaff}
          onSelectStaff={setSelectedStaff}
        />

        {selectedStaff && (
          <>
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
                <RateEditor
                  title="Square Meter Rates (m²)"
                  description="Set rates based on square meter measurements"
                  rates={squareMeterRates}
                  onUpdateRates={setSquareMeterRates}
                  onSelectRate={setSelectedRate}
                  selectedRate={selectedRate}
                  onAddRate={() => addNewRate('square')}
                  addButtonText="Add Square Meter Rate"
                />
              </TabsContent>

              <TabsContent value="lineal">
                <RateEditor
                  title="Lineal Meter Rates"
                  description="Set rates based on lineal meter measurements"
                  rates={linealMeterRates}
                  onUpdateRates={setLinealMeterRates}
                  onSelectRate={setSelectedRate}
                  selectedRate={selectedRate}
                  onAddRate={() => addNewRate('lineal')}
                  addButtonText="Add Lineal Meter Rate"
                />
              </TabsContent>

              <TabsContent value="item">
                <RateEditor
                  title="Per Item Rates"
                  description="Set rates based on individual items"
                  rates={itemRates}
                  onUpdateRates={setItemRates}
                  onSelectRate={setSelectedRate}
                  selectedRate={selectedRate}
                  onAddRate={() => addNewRate('item')}
                  addButtonText="Add Item Rate"
                />
              </TabsContent>

              <TabsContent value="hourly">
                <RateEditor
                  title="Hourly Rates"
                  description="Set rates based on time"
                  rates={hourlyRates}
                  onUpdateRates={setHourlyRates}
                  onSelectRate={setSelectedRate}
                  selectedRate={selectedRate}
                  onAddRate={() => addNewRate('hourly')}
                  addButtonText="Add Hourly Rate"
                />
              </TabsContent>

              <TabsContent value="commission">
                <CommissionRateEditor
                  rates={commissionRates}
                  onUpdateRates={setCommissionRates}
                  onAddRate={addNewCommissionRate}
                />
              </TabsContent>
            </Tabs>

            <RateCalculator
              selectedRate={selectedRate}
              onCalculate={setCalculation}
            />

            {calculation && <CalculationResult calculation={calculation} />}
          </>
        )}
      </div>
    </AppLayout>
  );
}
