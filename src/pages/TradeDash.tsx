import { useState, useEffect } from "react";
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
  AlertCircle,
  TrendingUp,
  Star,
  Award,
  Settings,
  ToggleLeft,
  AlertTriangle,
  Sliders
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { DashboardStats } from "./TradeDash/components/DashboardStats";
import { RatingStats } from "./TradeDash/components/RatingStats";
import { TopPerformerCard } from "./TradeDash/components/TopPerformerCard";

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

const mockRankings = [
  { id: 1, tradeName: "Sydney Plumbing Pro", category: "Plumbing", area: "Sydney CBD", responseRate: 95, jobsCompleted: 142, rating: 4.9 },
  { id: 2, tradeName: "Elite Electricians", category: "Electrical", area: "North Sydney", responseRate: 92, jobsCompleted: 118, rating: 4.8 },
  { id: 3, tradeName: "Master Carpenters", category: "Carpentry", area: "Eastern Suburbs", responseRate: 89, jobsCompleted: 97, rating: 4.7 },
  { id: 4, tradeName: "Premium Painters", category: "Painting", area: "Inner West", responseRate: 91, jobsCompleted: 88, rating: 4.6 },
  { id: 5, tradeName: "Complete Roofing", category: "Roofing", area: "Northern Beaches", responseRate: 87, jobsCompleted: 73, rating: 4.5 },
  { id: 6, tradeName: "Green Gardens Landscaping", category: "Landscaping", area: "North Shore", responseRate: 85, jobsCompleted: 64, rating: 4.4 },
  { id: 7, tradeName: "Perfect Tilers", category: "Tiling", area: "Sutherland Shire", responseRate: 84, jobsCompleted: 51, rating: 4.3 },
];

const userStats = {
  totalJobs: 87,
  fiveStarReviews: 72,
  overallRating: 4.8,
  ranking: 3,
  responseRate: 94,
  isTopTen: true,
  freeLeadsAvailable: 3
};

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
  
  const [activeTab, setActiveTab] = useState("marketplace");
  const [freeLeads, setFreeLeads] = useState(userStats.freeLeadsAvailable);
  const [creditsBalance, setCreditsBalance] = useState(25);
  const [showAutoLeadDialog, setShowAutoLeadDialog] = useState(false);
  const [autoPurchaseEnabled, setAutoPurchaseEnabled] = useState(false);
  const [autoLeadPreferences, setAutoLeadPreferences] = useState({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: ["Kitchen Renovation", "Bathroom Remodel"],
    postcodes: []
  });
  const [showAdvancedFiltersDialog, setShowAdvancedFiltersDialog] = useState(false);
  const [advancedAutoLeadEnabled, setAdvancedAutoLeadEnabled] = useState(false);
  const [advancedAutoLeadPreferences, setAdvancedAutoLeadPreferences] = useState({
    maxPerWeek: 3,
    minBudget: "5000",
    maxDistance: "25",
    preferredTypes: [],
    postcodes: [],
    minSize: "0",
    maxSize: "500",
    serviceAreas: []
  });
  const [serviceArea, setServiceArea] = useState("");
  const [usedLeadsThisWeek, setUsedLeadsThisWeek] = useState(1);
  const [preferredPostcode, setPreferredPostcode] = useState("");

  const loadAutoLeadPreferences = async () => {
    try {
      console.log("Loading auto-lead preferences...");
    } catch (error) {
      console.error("Error loading auto-lead preferences:", error);
    }
  };

  const saveAutoLeadPreferences = async () => {
    try {
      toast.success("Auto-purchase preferences saved successfully!");
      setShowAutoLeadDialog(false);
    } catch (error) {
      console.error("Error saving auto-lead preferences:", error);
      toast.error("Failed to save auto-purchase preferences");
    }
  };

  const addPreferredPostcode = () => {
    if (preferredPostcode && !autoLeadPreferences.postcodes.includes(preferredPostcode)) {
      setAutoLeadPreferences({
        ...autoLeadPreferences,
        postcodes: [...autoLeadPreferences.postcodes, preferredPostcode]
      });
      setPreferredPostcode("");
    }
  };

  const removePreferredPostcode = (postcode) => {
    setAutoLeadPreferences({
      ...autoLeadPreferences,
      postcodes: autoLeadPreferences.postcodes.filter(p => p !== postcode)
    });
  };

  const saveAdvancedAutoLeadPreferences = async () => {
    try {
      toast.success("Advanced auto-purchase preferences saved successfully!");
      setShowAdvancedFiltersDialog(false);
    } catch (error) {
      console.error("Error saving advanced auto-lead preferences:", error);
      toast.error("Failed to save advanced auto-purchase preferences");
    }
  };

  const addServiceArea = () => {
    if (serviceArea && !advancedAutoLeadPreferences.serviceAreas.includes(serviceArea)) {
      setAdvancedAutoLeadPreferences({
        ...advancedAutoLeadPreferences,
        serviceAreas: [...advancedAutoLeadPreferences.serviceAreas, serviceArea]
      });
      setServiceArea("");
    }
  };

  const removeServiceArea = (area) => {
    setAdvancedAutoLeadPreferences({
      ...advancedAutoLeadPreferences,
      serviceAreas: advancedAutoLeadPreferences.serviceAreas.filter(a => a !== area)
    });
  };

  const availableLeads = mockLeads.filter(lead => lead.status === "available").length;
  const purchasedLeads = mockLeads.filter(lead => lead.status === "purchased").length;
  
  useEffect(() => {
    const fetchFreeLeads = async () => {
      // This would be replaced with actual API call in production
      // const { data, error } = await supabase
      //   .from('free_leads')
      //   .select('leads_available')
      //   .eq('trade_id', 'current-user-id')
      //   .single();
      
      // if (data) {
      //   setFreeLeads(data.leads_available);
      // }
    };
    
    fetchFreeLeads();
    loadAutoLeadPreferences();

    // Simulate used leads for the week
    setUsedLeadsThisWeek(Math.floor(Math.random() * 3));
  }, []);
  
  const filteredLeads = mockLeads.filter(lead => {
    if (filters.postcode && !lead.postcode.includes(filters.postcode)) return false;
    if (filters.minSize && lead.size < parseInt(filters.minSize)) return false;
    if (filters.leadType === "available" && lead.status !== "available") return false;
    if (filters.leadType === "purchased" && lead.status !== "purchased") return false;
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
    alert(`Lead #${leadId} purchased successfully! You can now contact the customer.`);
  };
  
  const claimFreeLead = async (leadId) => {
    if (freeLeads <= 0) {
      toast.error("You have no free leads available");
      return;
    }
    
    setFreeLeads(prev => prev - 1);
    toast.success(`Lead #${leadId} claimed for free! You have ${freeLeads - 1} free leads remaining.`);
  };

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-4xl font-bold text-gray-900">Easy Lead Dashboard</h1>
        
        <DashboardStats 
          availableLeads={availableLeads}
          purchasedLeads={purchasedLeads}
          userStats={userStats}
          creditsBalance={creditsBalance}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RatingStats userStats={userStats} />
        </div>
        
        {userStats.isTopTen && (
          <TopPerformerCard />
        )}

        <Tabs defaultValue="marketplace" className="w-full">
          <TabsList>
            <TabsTrigger value="marketplace">Lead Marketplace</TabsTrigger>
            <TabsTrigger value="my-leads">My Leads</TabsTrigger>
            <TabsTrigger value="rankings">Rankings</TabsTrigger>
          </TabsList>
          <TabsContent value="marketplace" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Available Leads</h2>
              <Button variant="outline" size="sm" onClick={toggleFilters}>
                <Filter className="mr-2 h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            {showFilters && (
              <div className="bg-gray-50 rounded-md p-4 space-y-4">
                <h3 className="text-lg font-medium">Filter Leads</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="postcode">Postcode</Label>
                    <Input 
                      type="text" 
                      id="postcode" 
                      placeholder="Enter postcode" 
                      value={filters.postcode}
                      onChange={(e) => handleFilterChange("postcode", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="minSize">Min. Size (sqm)</Label>
                    <Input 
                      type="number" 
                      id="minSize" 
                      placeholder="Enter minimum size" 
                      value={filters.minSize}
                      onChange={(e) => handleFilterChange("minSize", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tradeType">Trade Type</Label>
                    <Select value={filters.tradeType} onValueChange={(value) => handleFilterChange("tradeType", value)}>
                      <SelectTrigger id="tradeType">
                        <SelectValue placeholder="Select a trade" />
                      </SelectTrigger>
                      <SelectContent>
                        {TRADE_TYPES.map(trade => (
                          <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Label htmlFor="leadType">Lead Type</Label>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleFilterChange("leadType", "available")}>
                      Available
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleFilterChange("leadType", "purchased")}>
                      Purchased
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-md font-medium">Saved Filters</h4>
                  <div className="flex gap-2">
                    {savedFilters.map(filter => (
                      <Button 
                        key={filter.name} 
                        variant={filter.active ? "default" : "outline"} 
                        size="sm"
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredLeads.map(lead => (
                <Card key={lead.id}>
                  <CardHeader>
                    <CardTitle>{lead.title}</CardTitle>
                    <CardDescription>{lead.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{lead.suburb}, {lead.postcode}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Maximize2 className="h-4 w-4 text-gray-500" />
                      <span>Size: {lead.size} sqm</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Budget: {lead.budget}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Date Posted: {lead.date}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between">
                    {lead.status === "available" ? (
                      <>
                        {freeLeads > 0 ? (
                          <Button variant="secondary" onClick={() => claimFreeLead(lead.id)}>
                            Claim Free Lead ({freeLeads} left)
                          </Button>
                        ) : (
                          <Button onClick={() => buyLead(lead.id)}>Buy Lead</Button>
                        )}
                      </>
                    ) : (
                      <Badge variant="outline">Purchased</Badge>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="my-leads">
            <h2 className="text-2xl font-semibold">My Purchased Leads</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockLeads
                .filter(lead => lead.status === "purchased")
                .map(lead => (
                  <Card key={lead.id}>
                    <CardHeader>
                      <CardTitle>{lead.title}</CardTitle>
                      <CardDescription>{lead.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span>{lead.suburb}, {lead.postcode}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span>Contact: {lead.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span>Best Time: {lead.contactTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-gray-500" />
                        <span>Budget: {lead.budget}</span>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button>Contact Customer</Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="rankings">
            <h2 className="text-2xl font-semibold">Top Tradespeople Rankings</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trade
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Area
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Jobs Completed
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rating
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {mockRankings.map(rank => (
                    <tr key={rank.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{rank.tradeName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rank.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rank.area}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rank.responseRate}%</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rank.jobsCompleted}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{rank.rating}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
