
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTabNavigation } from "@/hooks/useTabNavigation";
import {
  ArrowUpDown,
  BarChart4,
  Clock,
  DollarSign,
  History,
  TrendingUp,
} from "lucide-react";

export default function Trading() {
  const { openInTab } = useTabNavigation();

  const handleQuoteOpen = () => {
    openInTab("/quotes/new", "New Quote");
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold">Trading Dashboard</h1>
          <div className="flex gap-2">
            <Button 
              className="flex items-center gap-2" 
              onClick={handleQuoteOpen}
            >
              <DollarSign className="h-4 w-4" />
              Create Quote
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Open Trades
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground mt-1">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +2 since last week
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Trading Volume
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$24,562</div>
              <p className="text-xs text-muted-foreground mt-1">
                <ArrowUpDown className="inline h-3 w-3 mr-1" />
                Daily average: $2,450
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trading Profit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,890</div>
              <p className="text-xs text-muted-foreground mt-1">
                <BarChart4 className="inline h-3 w-3 mr-1" />
                19.8% profit margin
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="active" className="space-y-4">
          <TabsList>
            <TabsTrigger value="active">Active Trades</TabsTrigger>
            <TabsTrigger value="pending">Pending Orders</TabsTrigger>
            <TabsTrigger value="history">Trade History</TabsTrigger>
          </TabsList>
          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No active trades at the moment</p>
                    <Button onClick={handleQuoteOpen}>Create New Quote</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="pending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No pending orders at the moment</p>
                    <Button onClick={handleQuoteOpen}>Create New Quote</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trade History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center p-12 border-2 border-dashed rounded-lg">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No trade history yet</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
