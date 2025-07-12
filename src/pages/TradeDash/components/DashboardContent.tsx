
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Users, DollarSign, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { PurchasedLeadsTab } from './PurchasedLeadsTab';
import { MarketplaceTab } from './MarketplaceTab';
import { RankingsTab } from './RankingsTab';

// UserAvatar component matching notification avatar style
const UserAvatar = () => {
  const { user } = useAuth();
  
  // Extract initials from user email or name
  const getInitials = () => {
    if (!user) return 'U';
    
    // Try to get name first, fallback to email
    const name = user.user_metadata?.name || user.email || 'User';
    
    if (name.includes('@')) {
      // If it's an email, use the first letter of the local part
      return name.charAt(0).toUpperCase();
    }
    
    // If it's a name, get initials from each word
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        {getInitials()}
      </div>
    </div>
  );
};

export function DashboardContent() {
  return (
    <div className="container p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trade Dashboard</h1>
        <UserAvatar />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$24,365.85</div>
              <div className="p-2 bg-green-100 rounded-full">
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
            </div>
            <div className="text-xs text-green-500 mt-1">+5.2% from last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <div className="p-2 bg-blue-100 rounded-full">
                <Users className="h-4 w-4 text-blue-500" />
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">8 on schedule, 4 delayed</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Available Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">$4,250.00</div>
              <div className="p-2 bg-yellow-100 rounded-full">
                <DollarSign className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
            <div className="text-xs text-blue-500 mt-1 cursor-pointer group flex items-center gap-1">
              Manage budget <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="portfolio" className="space-y-4">
        <TabsList className="grid w-full md:w-auto grid-cols-3 h-auto p-1 gap-1">
          <TabsTrigger value="portfolio">Current Jobs</TabsTrigger>
          <TabsTrigger value="marketplace">Job Marketplace</TabsTrigger>
          <TabsTrigger value="rankings">Trade Rankings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="portfolio" className="space-y-4">
          <PurchasedLeadsTab />
        </TabsContent>
        
        <TabsContent value="marketplace" className="space-y-4">
          <MarketplaceTab />
        </TabsContent>
        
        <TabsContent value="rankings" className="space-y-4">
          <RankingsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
