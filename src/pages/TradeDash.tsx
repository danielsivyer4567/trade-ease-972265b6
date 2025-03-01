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
  AlertCircle,
  TrendingUp,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

// Mock ranking data
const mockRankings = [
  { id: 1, tradeName: "Sydney Plumbing Pro", category: "Plumbing", area: "Sydney CBD", responseRate: 95, jobsCompleted: 142, rating: 4.9 },
  { id: 2, tradeName: "Elite Electricians", category: "Electrical", area: "North Sydney", responseRate: 92, jobsCompleted: 118, rating: 4.8 },
  { id: 3, tradeName: "Master Carpenters", category: "Carpentry", area: "Eastern Suburbs", responseRate: 89, jobsCompleted: 97, rating: 4.7 },
  { id: 4, tradeName: "Premium Painters", category: "Painting", area: "Inner West", responseRate: 91, jobsCompleted: 88, rating: 4.6 },
  { id: 5, tradeName: "Complete Roofing", category: "Roofing", area: "Northern Beaches", responseRate: 87, jobsCompleted: 73, rating: 4.5 },
  { id: 6, tradeName: "Green Gardens Landscaping", category: "Landscaping", area: "North Shore", responseRate: 85, jobsCompleted: 64, rating: 4.4 },
  { id: 7, tradeName: "Perfect Tilers", category: "Tiling", area: "Sutherland Shire", responseRate: 84, jobsCompleted: 51, rating: 4.3 },
];

// Mock user stats
const userStats = {
  totalJobs: 87,
  fiveStarReviews: 72,
  overallRating: 4.8,
  ranking: 3, // User is ranked 3rd
  responseRate: 94
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
              <Button size="sm" className="mt-2 w-full">
                Buy More Credits
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* User rating and review stats */}
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
        
        {/* Main content with tabs */}
        <Tabs defaultValue="marketplace" className="w-full" onValueChange={setActiveTab}>
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="marketplace" className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Lead Marketplace
              </TabsTrigger>
              <TabsTrigger value="ranking" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Easy Ranking
              </TabsTrigger>
            </TabsList>
            
            {activeTab === "marketplace" && (
              <Button 
                onClick={toggleFilters} 
                variant="outline" 
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            )}
          </div>

          <TabsContent value="marketplace" className="mt-0">
            {showFilters && (
              <Card className="border border-blue-100 bg-blue-50/50 mb-6">
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
          </TabsContent>
          
          <TabsContent value="ranking" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Trade Professionals Ranking</CardTitle>
                <CardDescription>See how you stack up against other trades in your area</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-4 font-medium text-sm text-gray-500 pb-2 border-b">
                    <div>Rank</div>
                    <div className="col-span-2">Trade Name</div>
                    <div>Category</div>
                    <div>Response Rate</div>
                    <div>Jobs Completed</div>
                    <div>Rating</div>
                  </div>
                  
                  {mockRankings.map((ranking, index) => (
                    <div key={ranking.id} className="grid grid-cols-7 gap-4 text-sm py-2 border-b border-gray-100">
                      <div className="font-bold text-lg flex items-center">{index + 1}</div>
                      <div className="col-span-2 font-medium">{ranking.tradeName}</div>
                      <div>{ranking.category}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span>{ranking.responseRate}%</span>
                          <Progress value={ranking.responseRate} className="h-2 w-16" />
                        </div>
                      </div>
                      <div>{ranking.jobsCompleted}</div>
                      <div className="flex items-center gap-1">
                        <span>{ranking.rating}</span>
                        <div className="text-yellow-500">★</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <span className="text-sm text-gray-500">Last updated: Today, 9:45 AM</span>
                <Button variant="outline" className="text-sm">
                  See My Ranking
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Improve Your Ranking</CardTitle>
                <CardDescription>Tips to climb up the Easy Ranking ladder</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Respond quickly to new leads</p>
                      <p className="text-sm text-gray-600">Aim to respond within 1 hour for the best results</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Complete jobs on time</p>
                      <p className="text-sm text-gray-600">On-time completion boosts your reliability score</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Ask for reviews</p>
                      <p className="text-sm text-gray-600">Encourage satisfied customers to leave positive feedback</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Update your profile regularly</p>
                      <p className="text-sm text-gray-600">Keep your portfolio and trade information up to date</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Maintain accurate availability</p>
                      <p className="text-sm text-gray-600">This helps match you with leads you can actually take on</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
