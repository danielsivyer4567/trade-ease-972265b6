
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { mockLeads, userStats } from "./constants";
import { DashboardStats } from "./components/DashboardStats";
import { RatingStats } from "./components/RatingStats";
import { TopPerformerCard } from "./components/TopPerformerCard";

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

  const loadAutoLeadPreferences = async () => {
    try {
      console.log("Loading auto-lead preferences...");
    } catch (error) {
      console.error("Error loading auto-lead preferences:", error);
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

  const handleFilterChange = (field: string, value: string) => {
    setFilters({
      ...filters,
      [field]: value
    });
  };

  const buyLead = (leadId: number) => {
    alert(`Lead #${leadId} purchased successfully! You can now contact the customer.`);
  };
  
  const claimFreeLead = async (leadId: number) => {
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
        
        <RatingStats 
          userStats={userStats}
        />
        
        {userStats.isTopTen && <TopPerformerCard />}
      </div>
    </AppLayout>
  );
}
