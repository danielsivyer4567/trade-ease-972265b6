
import React from "react";
import { ArrowUpRight, AlertCircle, CheckCircle, TrendingUp } from "lucide-react";
import { StatisticCard } from "./StatisticCard";
import { LeadCreditsCard } from "./LeadCreditsCard";

interface DashboardStatsProps {
  availableLeads: number;
  purchasedLeads: number;
  userStats: {
    ranking: number;
    totalJobs: number;
  };
  creditsBalance?: number;
}

export const DashboardStats = ({ 
  availableLeads, 
  purchasedLeads, 
  userStats,
  creditsBalance = 25 // Default value if not provided
}: DashboardStatsProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatisticCard 
          title="Available Leads" 
          value={availableLeads} 
          description="+2 from yesterday" 
          icon={<AlertCircle className="h-4 w-4 text-blue-500" />} 
        />
        
        <StatisticCard 
          title="Purchased Leads" 
          value={purchasedLeads} 
          description="+1 from yesterday" 
          icon={<CheckCircle className="h-4 w-4 text-green-500" />} 
        />
        
        <StatisticCard 
          title="Your Ranking" 
          value={`#${userStats.ranking}`} 
          description={`Based on ${userStats.totalJobs} completed jobs`} 
          icon={<TrendingUp className="h-4 w-4 text-purple-500" />} 
        />
      </div>
      
      {/* Lead Credits Card moved down and stretched full width */}
      <div className="w-full">
        <LeadCreditsCard creditsBalance={creditsBalance} />
      </div>
    </div>
  );
};
