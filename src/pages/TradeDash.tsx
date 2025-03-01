
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  ArrowUpRight, 
  Hammer, 
  DollarSign, 
  Users, 
  Clock, 
  Building, 
  Filter, 
  MapPin, 
  Maximize2, 
  Calendar, 
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

// Comprehensive list of trade types
const TRADE_TYPES = [
  "All Trades",
  "Building & Construction",
  "Plumbing",
  "Electrical",
  "Carpentry",
  "Painting",
  "Plastering",
  "Roofing",
  "Landscaping",
  "Tiling",
  "Flooring",
  "HVAC (Heating, Ventilation, Air Conditioning)",
  "Fencing",
  "Concreting",
  "Bricklaying",
  "Cabinetmaking",
  "Glazing",
  "Waterproofing",
  "Pest Control",
  "Demolition",
  "Asbestos Removal",
  "Pool Installation",
  "Solar Panel Installation",
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Handyman Services",
  "Joinery",
  "Metal Fabrication",
  "Stone Masonry",
  "Excavation",
  "Paving"
];

// Mock lead data
const mockLeads = [
  {
    id: 1,
    title: "Kitchen Renovation",
    description: "Complete kitchen renovation including new cabinets, countertops, and appliances.",
    postcode: "2000",
    suburb: "Sydney CBD",
    size: 25,
    budget: "$15,000-$20,000",
    date: "2023-09-15",
    status: "available",
    customerName: "John Smith",
    contactTime: "Morning"
  },
  {
    id: 2,
    title: "Bathroom Remodel",
    description: "Full bathroom remodel with new shower, vanity, and tiling.",
    postcode: "2010",
    suburb: "Surry Hills",
    size: 10,
    budget: "$8,000-$12,000",
    date: "2023-09-14",
    status: "available",
    customerName: "Sarah Johnson",
    contactTime: "Evening"
  },
  {
    id: 3,
    title: "Deck Construction",
    description: "New outdoor deck construction with railing and stairs.",
    postcode: "2031",
    suburb: "Randwick",
    size: 30,
    budget: "$10,000-$15,000",
    date: "2023-09-13",
    status: "purchased",
    customerName: "Michael Brown",
    contactTime: "Afternoon"
  },
  {
    id: 4,
    title: "House Painting",
    description: "Interior painting for 3 bedroom house",
    postcode: "2095",
    suburb: "Manly",
    size: 120,
    budget: "$5,000-$7,500",
    date: "2023-09-12",
    status: "available",
    customerName: "Emma Wilson",
    contactTime: "Morning"
  },
  {
    id: 5,
    title: "Flooring Installation",
    description: "Hardwood floor installation throughout living areas",
    postcode: "2060",
    suburb: "North Sydney",
    size: 85,
    budget: "$7,500-$10,000",
    date: "2023-09-11",
    status: "purchased",
    customerName: "David Taylor",
    contactTime: "Afternoon"
  }
];

export default function TradeDash() {
  const [filters, setFilters] = useState({
    postcode: "",
    minSize: "",
    maxBudget: "",
    leadType: "all",
    tradeType: "All Trades"
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [savedFilters, setSavedFilters] = useState([
    { name: "Sydney CBD Jobs", active: true },
    { name: "Large Renovations", active: false },
    { name: "Small Quick Jobs", active: false },
  ]);

  const availableLeads = mockLeads.filter(lead => lead.status === "available").length;
  const purchasedLeads = mockLeads.filter(lead => lead.status === "purchased").length;
  
  // Filter leads
  const filteredLeads = mockLeads.filter(lead => {
    if (filters.postcode && !lead.postcode.includes(filters.postcode)) return false;
    if (filters.minSize && lead.size < parseInt(filters.minSize)) return false;
    if (filters.leadType === "available" && lead.status !== "available") return false;
    if (filters.leadType === "purchased" && lead.status !== "purchased") return false;
    // We're not filtering by trade type yet since our mock data doesn't have that field
    // In a real app, you would add: if (filters.tradeType !== "All Trades" && lead.tradeType !== filters.tradeType) return false;
    return true;
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (field, value) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const buyLead = (leadId) => {
    // In a real app, this would call an API to purchase the lead
    alert(`Lead #${leadId} purchased successfully! You can now contact the customer.`);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-4xl font-bold text-gray-900">Easy Lead Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Dashboard stats */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Leads
              </CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableLeads}</div>
              <p className="text-xs text-muted-foreground">
                +2 from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Purchased Leads
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{purchasedLeads}</div>
              <p className="text-xs text-muted-foreground">
                +1 from yesterday
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Lead Credits Balance
              </CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">25</div>
              <Button size="sm" className="mt-2 w-full">
                Buy More Credits
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Filters section */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Lead Marketplace</h2>
          <Button 
            onClick={toggleFilters} 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {showFilters ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
        
        {showFilters && (
          <Card className="border border-blue-100 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="text-lg">Lead Filters</CardTitle>
              <CardDescription>Set your preferences to find the right leads for your business</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postcode">Postcode/Area</Label>
                  <Input 
                    id="postcode" 
                    placeholder="e.g. 2000" 
                    value={filters.postcode}
                    onChange={(e) => handleFilterChange('postcode', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minSize">Minimum Size (sqm)</Label>
                  <Input 
                    id="minSize" 
                    type="number" 
                    placeholder="e.g. 20" 
                    value={filters.minSize}
                    onChange={(e) => handleFilterChange('minSize', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="leadType">Lead Type</Label>
                  <Select 
                    value={filters.leadType} 
                    onValueChange={(value) => handleFilterChange('leadType', value)}
                  >
                    <SelectTrigger id="leadType">
                      <SelectValue placeholder="All Leads" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Leads</SelectItem>
                      <SelectItem value="available">Available Only</SelectItem>
                      <SelectItem value="purchased">Purchased Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tradeType">Trade Type</Label>
                  <Select 
                    value={filters.tradeType} 
                    onValueChange={(value) => handleFilterChange('tradeType', value)}
                  >
                    <SelectTrigger id="tradeType">
                      <SelectValue placeholder="Select trade type" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px] overflow-y-auto">
                      {TRADE_TYPES.map((trade) => (
                        <SelectItem key={trade} value={trade}>
                          {trade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2 flex items-end">
                  <Button className="w-full">Save Filter</Button>
                </div>
              </div>
              
              <div className="mt-4">
                <Label>Saved Filters</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {savedFilters.map((filter, index) => (
                    <div 
                      key={index}
                      className={`px-3 py-1 rounded-full text-sm cursor-pointer ${
                        filter.active 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {filter.name}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Leads display */}
        <div className="space-y-4">
          {filteredLeads.map((lead) => (
            <Card key={lead.id} className={`border-l-4 ${lead.status === 'available' ? 'border-l-blue-500' : 'border-l-green-500'}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{lead.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">
                      {lead.description}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      lead.status === 'available' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {lead.status === 'available' ? 'Available' : 'Purchased'}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{lead.suburb} ({lead.postcode})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Maximize2 className="h-4 w-4 text-gray-500" />
                    <span>{lead.size} sqm</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>{lead.budget}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{lead.date}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="text-sm">
                  {lead.status === 'purchased' ? (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{lead.customerName} • Best contact: {lead.contactTime}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500">Contact details available after purchase</span>
                  )}
                </div>
                {lead.status === 'available' && (
                  <Button 
                    onClick={() => buyLead(lead.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Buy Lead (5 credits)
                  </Button>
                )}
                {lead.status === 'purchased' && (
                  <Button variant="outline">
                    View Details
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
