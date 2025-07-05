import { DollarSign, Search, Plus, X } from "lucide-react";
import SettingsPageTemplate from "./SettingsPageTemplate";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@/types/job";

// Dummy job data
const dummyJobs: Job[] = [
  {
    id: "1",
    customer: "John Smith",
    type: "Plumbing",
    status: "ready",
    date: "2024-03-15",
    location: [151.2093, -33.8688],
    jobNumber: "PLM-001",
    title: "Water Heater Installation",
    description: "Install new water heater system",
  },
  {
    id: "2",
    customer: "Sarah Johnson",
    type: "HVAC",
    status: "in-progress",
    date: "2024-03-14",
    location: [151.2543, -33.8688],
    jobNumber: "HVAC-001",
    title: "HVAC Maintenance",
    description: "Regular maintenance check",
    assignedTeam: "Blue Team"
  },
  {
    id: "3",
    customer: "Mike Brown",
    type: "Electrical",
    status: "to-invoice",
    date: "2024-03-13",
    location: [151.1943, -33.8788],
    jobNumber: "ELE-001",
    title: "Electrical Panel Upgrade",
    description: "Upgrade main electrical panel",
    assignedTeam: "Green Team"
  }
];

type Extra = {
  id: string;
  name: string;
  price: number;
};

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

  // Job search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showJobResults, setShowJobResults] = useState(false);

  // Extras state
  const [extras, setExtras] = useState<Extra[]>([]);
  const [newExtraName, setNewExtraName] = useState("");
  const [newExtraPrice, setNewExtraPrice] = useState(0);

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

  const calculateExtrasCost = () => {
    return extras.reduce((total, extra) => total + extra.price, 0);
  };

  const calculateSubtotal = (laborCost) => {
    return laborCost + calculateMaterialsWithMarkup() + calculateExtrasCost();
  };

  const calculateGST = (subtotal) => {
    return subtotal * (gstRate / 100);
  };

  const calculateTotal = (laborCost) => {
    const subtotal = calculateSubtotal(laborCost);
    const gst = calculateGST(subtotal);
    return subtotal + gst;
  };

  // Filter jobs based on search query
  const filteredJobs = dummyJobs.filter(job => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.jobNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle job selection
  const handleJobSelect = (job: Job) => {
    setSelectedJob(job);
    setShowJobResults(false);
  };

  // Handle adding a new extra
  const handleAddExtra = () => {
    if (newExtraName.trim() === "" || newExtraPrice <= 0) return;
    
    setExtras([
      ...extras,
      {
        id: Date.now().toString(),
        name: newExtraName,
        price: newExtraPrice
      }
    ]);
    
    setNewExtraName("");
    setNewExtraPrice(0);
  };

  // Handle removing an extra
  const handleRemoveExtra = (id: string) => {
    setExtras(extras.filter(extra => extra.id !== id));
  };

  return (
    <SettingsPageTemplate title="Trade Rates" icon={<DollarSign className="h-7 w-7 text-gray-700" />}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-gray-600">Calculate and manage your trade rates for accurate quotes and billing</p>
          <Button className="bg-blue-500 hover:bg-blue-600">Save Default Rates</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-slate-300">
            <CardHeader>
              <CardTitle>Rate Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4 relative">
                <Label htmlFor="jobSearch">Search Job</Label>
                <div className="relative">
                  <Input 
                    id="jobSearch" 
                    placeholder="Search by job number, title, or customer name" 
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowJobResults(e.target.value.length > 0);
                    }}
                    className="pr-10"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                
                {showJobResults && searchQuery.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 shadow-lg rounded-md max-h-60 overflow-y-auto">
                    {filteredJobs.length > 0 ? (
                      filteredJobs.map(job => (
                        <div 
                          key={job.id}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleJobSelect(job)}
                        >
                          <div className="font-medium">{job.jobNumber} - {job.title}</div>
                          <div className="text-sm text-gray-600">{job.customer}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-2 text-gray-500">No jobs found</div>
                    )}
                  </div>
                )}
              </div>
              
              {selectedJob && (
                <div className="mb-4 p-3 bg-slate-200 rounded-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{selectedJob.jobNumber} - {selectedJob.title}</h3>
                      <p className="text-sm text-gray-600">Customer: {selectedJob.customer}</p>
                      <p className="text-sm text-gray-600">Type: {selectedJob.type}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedJob(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
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
                    {extras.length > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Extras:</span>
                        <span className="font-medium">${calculateExtrasCost().toFixed(2)}</span>
                      </div>
                    )}
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
                    {extras.length > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Extras:</span>
                        <span className="font-medium">${calculateExtrasCost().toFixed(2)}</span>
                      </div>
                    )}
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
                    {extras.length > 0 && (
                      <div className="flex justify-between py-2">
                        <span>Extras:</span>
                        <span className="font-medium">${calculateExtrasCost().toFixed(2)}</span>
                      </div>
                    )}
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

              <div className="mt-6 pt-4 border-t">
                <h3 className="font-medium mb-2">Additional Extras</h3>
                
                {extras.length > 0 && (
                  <div className="mb-4 space-y-2">
                    {extras.map(extra => (
                      <div key={extra.id} className="flex items-center justify-between bg-slate-200 p-2 rounded">
                        <span className="flex-1">{extra.name}</span>
                        <span className="font-medium mr-2">${extra.price.toFixed(2)}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleRemoveExtra(extra.id)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  <div className="flex-1">
                    <Input 
                      placeholder="Extra name" 
                      value={newExtraName}
                      onChange={(e) => setNewExtraName(e.target.value)}
                    />
                  </div>
                  <div className="w-28">
                    <Input 
                      type="number"
                      placeholder="Price" 
                      value={newExtraPrice || ""}
                      onChange={(e) => setNewExtraPrice(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleAddExtra}
                    className="whitespace-nowrap"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Extra
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              {selectedJob && (
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  Apply Pricing to Job #{selectedJob.jobNumber}
                </Button>
              )}
            </CardFooter>
          </Card>
          
          <Card className="bg-slate-300">
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
              <Button variant="outline" className="mt-4 w-full border-blue-500 text-blue-500 hover:bg-blue-50">Edit Default Rates</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </SettingsPageTemplate>
  );
}
