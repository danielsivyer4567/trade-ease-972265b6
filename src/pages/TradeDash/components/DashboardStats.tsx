
import { AlertCircle, CheckCircle, TrendingUp, DollarSign } from "lucide-react";
import { StatisticCard } from "./StatisticCard";
import { LeadCreditsCard } from "./LeadCreditsCard";

interface DashboardStatsProps {
  availableLeads: number;
  purchasedLeads: number;
  ranking: number;
  totalJobs: number;
}

export function DashboardStats({ availableLeads, purchasedLeads, ranking, totalJobs }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatisticCard
        title="Available Leads"
        value={availableLeads}
        icon={<AlertCircle className="h-4 w-4 text-blue-500" />}
        description="+2 from yesterday"
      />
      
      <StatisticCard
        title="Purchased Leads"
        value={purchasedLeads}
        icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        description="+1 from yesterday"
      />
      
      <StatisticCard
        title="Your Ranking"
        value={`#${ranking}`}
        icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
        description={`Based on ${totalJobs} completed jobs`}
      />
      
      <LeadCreditsCard />
    </div>
  );
}
