import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { MarketOverview } from './MarketOverview';
import { RecentTrades } from './RecentTrades';
import { WatchList } from './WatchList';
import { useIsMobile } from '@/hooks/use-mobile';
import { DashboardStats } from '@/pages/TradeDash/components/DashboardStats';
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

const TradeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showFullMap, setShowFullMap] = useState(false);
  
  return (
    <div className="space-y-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Trade Dashboard</h1>
        <p className="text-muted-foreground">Monitor construction jobs and manage activities</p>
      </header>
      
      {/* Job Site Map */}
      <div className="mt-0 relative mb-6">
        <div className="flex justify-between items-center px-4 py-2">
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Job Site Map
          </h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFullMap(!showFullMap)}
          >
            {showFullMap ? "Compact View" : "Expand Map"}
          </Button>
        </div>
        
        <div className={`transition-all duration-300 ease-in-out ${showFullMap ? 'h-[600px]' : 'h-[400px]'}`}>
          <JobSiteMap />
        </div>
      </div>
      
      <DashboardStats 
        creditsBalance={25}
        availableLeads={12}
        purchasedLeads={8}
        userStats={{
          totalJobs: 45,
          fiveStarReviews: 32,
          overallRating: 4.8,
          ranking: 5,
          responseRate: 92,
          isTopTen: true,
          freeLeadsAvailable: 3
        }}
      />
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'w-[400px] grid-cols-3'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Job Monitor</TabsTrigger>
          <TabsTrigger value="trades">Recent Jobs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 pt-4">
          <MarketOverview />
        </TabsContent>
        
        <TabsContent value="watchlist" className="space-y-4 pt-4">
          <WatchList />
        </TabsContent>
        
        <TabsContent value="trades" className="space-y-4 pt-4">
          <RecentTrades />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TradeDashboard;
