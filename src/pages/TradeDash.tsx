import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { DashboardStats } from "./TradeDash/components/DashboardStats";
import { RatingStats } from "./TradeDash/components/RatingStats";
import { TopPerformerCard } from "./TradeDash/components/TopPerformerCard";
import { MarketplaceTab } from "./TradeDash/components/MarketplaceTab";
import { PurchasedLeadsTab } from "./TradeDash/components/PurchasedLeadsTab";
import { RankingsTab } from "./TradeDash/components/RankingsTab";
import { mockLeads, mockRankings, userStats } from "./TradeDash/constants";

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

  const toggleSavedFilter = (index: number) => {
    const newFilters = [...savedFilters];
    newFilters[index].active = !newFilters[index].active;
    setSavedFilters(newFilters);
    
    if (newFilters[index].active) {
      if (index === 0) { // Sydney CBD Jobs
        setFilters({...filters, postcode: "2000"});
      } else if (index === 1) { // Large Renovations
        setFilters({...filters, minSize: "100"});
      } else if (index === 2) { // Small Quick Jobs
        setFilters({...filters, maxBudget: "2000"});
      }
    }
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
          
          <TabsContent value="marketplace">
            <MarketplaceTab 
              leads={filteredLeads}
              freeLeads={freeLeads}
              filters={filters}
              savedFilters={savedFilters}
              onFilterChange={handleFilterChange}
              onSavedFilterToggle={toggleSavedFilter}
              onClaimFreeLead={claimFreeLead}
              onBuyLead={buyLead}
            />
          </TabsContent>
          
          <TabsContent value="my-leads">
            <PurchasedLeadsTab 
              purchasedLeads={mockLeads.filter(lead => lead.status === "purchased")}
            />
          </TabsContent>
          
          <TabsContent value="rankings">
            <RankingsTab rankings={mockRankings} />
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
