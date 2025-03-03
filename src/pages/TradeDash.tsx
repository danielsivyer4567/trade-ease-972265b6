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
      // In a real app, this would save to the database
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                Your Ranking
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">#{userStats.ranking}</div>
              <p className="text-xs text-muted-foreground">
                Based on {userStats.totalJobs} completed jobs
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
              <div className="flex flex-col gap-2 mt-2">
                <Button size="sm" className="w-full">
                  Buy More Credits
                </Button>
                <div className="flex gap-2">
                  <Dialog open={showAutoLeadDialog} onOpenChange={setShowAutoLeadDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full flex items-center gap-1"
                      >
                        <Settings className="h-4 w-4" />
                        Standard Auto-Purchase
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                      <DialogHeader>
                        <DialogTitle>Auto-Purchase Lead Settings</DialogTitle>
                        <DialogDescription>
                          Configure automatic lead purchases (max 3 per week)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="auto-purchase-toggle" className="font-medium">
                            Enable Auto-Purchase
                          </Label>
                          <Switch
                            id="auto-purchase-toggle"
                            checked={autoPurchaseEnabled}
                            onCheckedChange={setAutoPurchaseEnabled}
                          />
                        </div>
                        
                        {autoPurchaseEnabled && (
                          <>
                            <div className="space-y-2">
                              <Label htmlFor="max-per-week">Maximum Leads Per Week</Label>
                              <Select 
                                value={autoLeadPreferences.maxPerWeek.toString()} 
                                onValueChange={v => setAutoLeadPreferences({
                                  ...autoLeadPreferences,
                                  maxPerWeek: parseInt(v)
                                })}
                              >
                                <SelectTrigger id="max-per-week">
                                  <SelectValue placeholder="Select maximum" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 per week</SelectItem>
                                  <SelectItem value="2">2 per week</SelectItem>
                                  <SelectItem value="3">3 per week</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="min-budget">Minimum Budget</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">$</span>
                                <Input
                                  id="min-budget"
                                  type="number"
                                  value={autoLeadPreferences.minBudget}
                                  onChange={(e) => setAutoLeadPreferences({
                                    ...autoLeadPreferences,
                                    minBudget: e.target.value
                                  })}
                                  placeholder="5000"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="max-distance">Maximum Distance (km)</Label>
                              <Input
                                id="max-distance"
                                type="number"
                                value={autoLeadPreferences.maxDistance}
                                onChange={(e) => setAutoLeadPreferences({
                                  ...autoLeadPreferences,
                                  maxDistance: e.target.value
                                })}
                                placeholder="25"
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Preferred Postcodes</Label>
                              <div className="flex gap-2">
                                <Input
                                  value={preferredPostcode}
                                  onChange={(e) => setPreferredPostcode(e.target.value)}
                                  placeholder="e.g. 2000"
                                />
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  onClick={addPreferredPostcode}
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {autoLeadPreferences.postcodes.map((postcode) => (
                                  <div 
                                    key={postcode}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                  >
                                    {postcode}
                                    <button 
                                      onClick={() => removePreferredPostcode(postcode)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {autoLeadPreferences.postcodes.length === 0 && (
                                  <p className="text-sm text-gray-500">No preferred postcodes added</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Job Types</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation"].map((type) => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`job-type-${type}`}
                                      checked={autoLeadPreferences.preferredTypes.includes(type)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setAutoLeadPreferences({
                                            ...autoLeadPreferences,
                                            preferredTypes: [...autoLeadPreferences.preferredTypes, type]
                                          });
                                        } else {
                                          setAutoLeadPreferences({
                                            ...autoLeadPreferences,
                                            preferredTypes: autoLeadPreferences.preferredTypes.filter(t => t !== type)
                                          });
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`job-type-${type}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {type}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAutoLeadDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveAutoLeadPreferences}>Save Preferences</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog open={showAdvancedFiltersDialog} onOpenChange={setShowAdvancedFiltersDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="w-full flex items-center gap-1 bg-purple-50 text-purple-800 border-purple-300 hover:bg-purple-100"
                      >
                        <Sliders className="h-4 w-4" />
                        Advanced Auto-Purchase
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[550px]">
                      <DialogHeader>
                        <DialogTitle>Advanced Auto-Purchase Lead Settings</DialogTitle>
                        <DialogDescription>
                          Configure targeted auto-purchase with advanced filters (max 3 per week)
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="advanced-auto-purchase-toggle" className="font-medium">
                            Enable Advanced Auto-Purchase
                          </Label>
                          <Switch
                            id="advanced-auto-purchase-toggle"
                            checked={advancedAutoLeadEnabled}
                            onCheckedChange={setAdvancedAutoLeadEnabled}
                          />
                        </div>
                        
                        {advancedAutoLeadEnabled && (
                          <>
                            <div className="bg-amber-50 p-3 rounded-md border border-amber-200 flex items-center gap-3">
                              <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                              <p className="text-sm text-amber-800">
                                You have used <span className="font-bold">{usedLeadsThisWeek}/3</span> auto-purchased leads this week.
                              </p>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="advanced-max-per-week">Maximum Leads Per Week</Label>
                              <div className="text-sm text-gray-500 mb-1">
                                Maximum of 3 leads can be auto-purchased per week
                              </div>
                              <Select 
                                value={advancedAutoLeadPreferences.maxPerWeek.toString()} 
                                onValueChange={v => setAdvancedAutoLeadPreferences({
                                  ...advancedAutoLeadPreferences,
                                  maxPerWeek: parseInt(v)
                                })}
                              >
                                <SelectTrigger id="advanced-max-per-week">
                                  <SelectValue placeholder="Select maximum" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="1">1 per week</SelectItem>
                                  <SelectItem value="2">2 per week</SelectItem>
                                  <SelectItem value="3">3 per week</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="adv-min-budget">Minimum Budget</Label>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">$</span>
                                <Input
                                  id="adv-min-budget"
                                  type="number"
                                  value={advancedAutoLeadPreferences.minBudget}
                                  onChange={(e) => setAdvancedAutoLeadPreferences({
                                    ...advancedAutoLeadPreferences,
                                    minBudget: e.target.value
                                  })}
                                  placeholder="5000"
                                />
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="adv-min-size">Minimum Size (sqm)</Label>
                                <Input
                                  id="adv-min-size"
                                  type="number"
                                  value={advancedAutoLeadPreferences.minSize}
                                  onChange={(e) => setAdvancedAutoLeadPreferences({
                                    ...advancedAutoLeadPreferences,
                                    minSize: e.target.value
                                  })}
                                  placeholder="0"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="adv-max-size">Maximum Size (sqm)</Label>
                                <Input
                                  id="adv-max-size"
                                  type="number"
                                  value={advancedAutoLeadPreferences.maxSize}
                                  onChange={(e) => setAdvancedAutoLeadPreferences({
                                    ...advancedAutoLeadPreferences,
                                    maxSize: e.target.value
                                  })}
                                  placeholder="500"
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Preferred Postcodes</Label>
                              <div className="text-sm text-gray-500 mb-1">
                                Auto-purchase leads only from these postal codes
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={preferredPostcode}
                                  onChange={(e) => setPreferredPostcode(e.target.value)}
                                  placeholder="e.g. 2000"
                                />
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  onClick={addPreferredPostcode}
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {advancedAutoLeadPreferences.postcodes.map((postcode) => (
                                  <div 
                                    key={postcode}
                                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                  >
                                    {postcode}
                                    <button 
                                      onClick={() => removePreferredPostcode(postcode)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {advancedAutoLeadPreferences.postcodes.length === 0 && (
                                  <p className="text-sm text-gray-500">No preferred postcodes added</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Service Areas</Label>
                              <div className="text-sm text-gray-500 mb-1">
                                Add suburbs or regions you're willing to service
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  value={serviceArea}
                                  onChange={(e) => setServiceArea(e.target.value)}
                                  placeholder="e.g. Northern Beaches"
                                />
                                <Button 
                                  type="button" 
                                  variant="secondary" 
                                  onClick={addServiceArea}
                                >
                                  Add
                                </Button>
                              </div>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {advancedAutoLeadPreferences.serviceAreas.map((area) => (
                                  <div 
                                    key={area}
                                    className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm flex items-center gap-1"
                                  >
                                    {area}
                                    <button 
                                      onClick={() => removeServiceArea(area)}
                                      className="text-green-600 hover:text-green-800"
                                    >
                                      ×
                                    </button>
                                  </div>
                                ))}
                                {advancedAutoLeadPreferences.serviceAreas.length === 0 && (
                                  <p className="text-sm text-gray-500">No service areas added</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Preferred Services</Label>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {["Kitchen Renovation", "Bathroom Remodel", "Deck Construction", "House Painting", "Flooring Installation", "Plastering", "Tiling", "Plumbing", "Electrical Work"].map((type) => (
                                  <div key={type} className="flex items-center space-x-2">
                                    <Checkbox 
                                      id={`adv-job-type-${type}`}
                                      checked={advancedAutoLeadPreferences.preferredTypes.includes(type)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setAdvancedAutoLeadPreferences({
                                            ...advancedAutoLeadPreferences,
                                            preferredTypes: [...advancedAutoLeadPreferences.preferredTypes, type]
                                          });
                                        } else {
                                          setAdvancedAutoLeadPreferences({
                                            ...advancedAutoLeadPreferences,
                                            preferredTypes: advancedAutoLeadPreferences.preferredTypes.filter(t => t !== type)
                                          });
                                        }
                                      }}
                                    />
                                    <label
                                      htmlFor={`adv-job-type-${type}`}
                                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                      {type}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowAdvancedFiltersDialog(false)}>
                          Cancel
                        </Button>
                        <Button onClick={saveAdvancedAutoLeadPreferences}>Save Preferences</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                5-Star Reviews
              </CardTitle>
              <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">{userStats.fiveStarReviews}</div>
                <Progress value={(userStats.fiveStarReviews / userStats.totalJobs) * 100} className="h-2 flex-1" />
                <div className="text-sm text-muted-foreground">{Math.round((userStats.fiveStarReviews / userStats.totalJobs) * 100)}%</div>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {userStats.fiveStarReviews} out of {userStats.totalJobs} jobs rated 5 stars
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Rating
              </CardTitle>
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < Math.floor(userStats.overallRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold">{userStats.overallRating}</div>
                <Progress value={(userStats.overallRating / 5) * 100} className="h-2 flex-1" />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Based on {userStats.totalJobs} completed jobs
              </p>
            </CardContent>
          </Card>
        </div>
        
        {userStats.isTopTen && (
          <Card className="bg-gradient-to-r from-amber-50 to-yellow-100 border-yellow-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div
