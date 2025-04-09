
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import MarketOverview from './MarketOverview';
import RecentTrades from './RecentTrades';
import WatchList from './WatchList';
import { useIsMobile } from '@/hooks/use-mobile';

const TradeDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Trading Dashboard</h1>
        <p className="text-muted-foreground">Monitor markets and execute trades</p>
      </header>
      
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className={`grid ${isMobile ? 'grid-cols-3' : 'w-[400px] grid-cols-3'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="watchlist">Watchlist</TabsTrigger>
          <TabsTrigger value="trades">Trades</TabsTrigger>
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
