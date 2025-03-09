import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardStats } from "./DashboardStats";
import { RatingStats } from "./RatingStats";
import { TopPerformerCard } from "./TopPerformerCard";
import { MarketplaceTab } from "./MarketplaceTab";
import { PurchasedLeadsTab } from "./PurchasedLeadsTab";
import { RankingsTab } from "./RankingsTab";
import { mockLeads, mockRankings } from "../constants";
import { useLeadFilters } from "../hooks/useLeadFilters";
import { useLeadActions } from "../hooks/useLeadActions";

// Define the UserStats interface to match what RatingStats expects
interface UserStats {
  totalJobs: number;
  fiveStarReviews: number;
  overallRating: number;
  ranking: number;
  responseRate: number;
  isTopTen: boolean;
  freeLeadsAvailable: number;
}
interface DashboardContentProps {
  userStats: UserStats;
  creditsBalance: number;
}
export const DashboardContent: React.FC<DashboardContentProps> = ({
  userStats,
  creditsBalance
}) => {
  const {
    filters,
    savedFilters,
    handleFilterChange,
    toggleSavedFilter
  } = useLeadFilters();
  const {
    freeLeads,
    claimFreeLead,
    buyLead
  } = useLeadActions(userStats.freeLeadsAvailable);
  const availableLeads = mockLeads.filter(lead => lead.status === "available").length;
  const purchasedLeads = mockLeads.filter(lead => lead.status === "purchased").length;
  const filteredLeads = mockLeads.filter(lead => {
    if (filters.postcode && !lead.postcode.includes(filters.postcode)) return false;
    if (filters.minSize && lead.size < parseInt(filters.minSize)) return false;
    if (filters.leadType === "available" && lead.status !== "available") return false;
    if (filters.leadType === "purchased" && lead.status !== "purchased") return false;
    return true;
  });
  return <div className="space-y-4 md:space-y-6">
      <DashboardStats availableLeads={availableLeads} purchasedLeads={purchasedLeads} userStats={userStats} creditsBalance={creditsBalance} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-slate-200">
        <RatingStats userStats={userStats} />
      </div>
      
      {userStats.isTopTen && <TopPerformerCard />}

      <Tabs defaultValue="marketplace" className="w-full bg-slate-200">
        
        
        <TabsContent value="marketplace">
          <MarketplaceTab leads={filteredLeads} freeLeads={freeLeads} filters={filters} savedFilters={savedFilters} onFilterChange={handleFilterChange} onSavedFilterToggle={toggleSavedFilter} onClaimFreeLead={claimFreeLead} onBuyLead={buyLead} />
        </TabsContent>
        
        <TabsContent value="my-leads">
          <PurchasedLeadsTab purchasedLeads={mockLeads.filter(lead => lead.status === "purchased")} />
        </TabsContent>
        
        <TabsContent value="rankings">
          <RankingsTab rankings={mockRankings} />
        </TabsContent>
      </Tabs>
    </div>;
};