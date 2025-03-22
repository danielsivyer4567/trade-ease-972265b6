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
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <DashboardStats 
            availableLeads={availableLeads} 
            purchasedLeads={purchasedLeads} 
            userStats={userStats} 
            creditsBalance={creditsBalance} 
          />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingStats userStats={userStats} />
        {userStats.isTopTen && <TopPerformerCard />}
      </div>
      
      <Separator className="my-6" />

      <Card className="border-none shadow-none bg-transparent">
        <CardContent className="p-0">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="w-full grid grid-cols-3 mb-6">
              <TabsTrigger value="marketplace" className="data-[state=active]:bg-primary">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="my-leads" className="data-[state=active]:bg-primary">
                My Leads
              </TabsTrigger>
              <TabsTrigger value="rankings" className="data-[state=active]:bg-primary">
                Rankings
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="marketplace" className="mt-0">
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
            
            <TabsContent value="my-leads" className="mt-0">
              <PurchasedLeadsTab 
                purchasedLeads={mockLeads.filter(lead => lead.status === "purchased")} 
              />
            </TabsContent>
            
            <TabsContent value="rankings" className="mt-0">
              <RankingsTab rankings={mockRankings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};