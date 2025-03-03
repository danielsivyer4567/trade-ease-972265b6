
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { DashboardContent } from "./TradeDash/components/DashboardContent";
import { useInitialLoad } from "./TradeDash/hooks/useInitialLoad";
import { userStats } from "./TradeDash/constants";

export default function TradeDash() {
  const [usedLeadsThisWeek, setUsedLeadsThisWeek] = useState(1);
  const [creditsBalance, setCreditsBalance] = useState(25);

  const loadAutoLeadPreferences = async () => {
    try {
      console.log("Loading auto-lead preferences...");
    } catch (error) {
      console.error("Error loading auto-lead preferences:", error);
    }
  };

  useInitialLoad(setUsedLeadsThisWeek, loadAutoLeadPreferences);

  return (
    <AppLayout>
      <div className="space-y-6 p-6">
        <h1 className="text-4xl font-bold text-gray-900">Easy Lead Dashboard</h1>
        
        <DashboardContent 
          userStats={userStats}
          creditsBalance={creditsBalance}
        />
      </div>
    </AppLayout>
  );
}
