import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Gauge, Clock, Briefcase, Users, DollarSign, Tool, BarChart, Hammer, Zap, Wind } from "lucide-react";
import { useState } from "react";
import { Progress } from "@/components/ui/progress";

export default function TradeDash() {
  const [activeTab, setActiveTab] = useState("plumbing");

  // Sample data for different trades
  const tradeData = {
    plumbing: {
      jobsCompleted: 42,
      jobsInProgress: 8,
      revenue: 28650,
      customersServed: 39,
      avgJobDuration: "4.2 hrs",
      materialsCost: 9320,
      profitMargin: 68,
      teams: [
        { name: "Team Red", jobs: 18, efficiency: 92 },
        { name: "Team Blue", jobs: 24, efficiency: 88 }
      ]
    },
    electrical: {
      jobsCompleted: 36,
      jobsInProgress: 5,
      revenue: 31200,
      customersServed: 33,
      avgJobDuration: "3.8 hrs",
      materialsCost: 12400,
      profitMargin: 72,
      teams: [
        { name: "Team Red", jobs: 13, efficiency: 90 },
        { name: "Team Green", jobs: 23, efficiency: 94 }
      ]
    },
    hvac: {
      jobsCompleted: 28,
      jobsInProgress: 7,
      revenue: 42800,
      customersServed: 25,
      avgJobDuration: "6.5 hrs",
      materialsCost: 18950,
      profitMargin: 65,
      teams: [
        { name: "Team Blue", jobs: 15, efficiency: 87 },
        { name: "Team Green", jobs: 13, efficiency: 89 }
      ]
    },
    construction: {
      jobsCompleted: 19,
      jobsInProgress: 4,
      revenue: 87500,
      customersServed: 17,
      avgJobDuration: "32.5 hrs",
      materialsCost: 38200,
      profitMargin: 59,
      teams: [
        { name: "Team Red", jobs: 8, efficiency: 85 },
        { name: "Team Blue", jobs: 11, efficiency: 83 }
      ]
    }
  };

  // Aggregate data for the selected trade
  const data = tradeData[activeTab as keyof typeof tradeData];

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Gauge className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Trade Dash</h1>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-4 w-full max-w-3xl">
            <TabsTrigger value="plumbing" className="flex items-center gap-2">
              <Tool className="h-4 w-4" />
              <span>Plumbing</span>
            </TabsTrigger>
            <TabsTrigger value="electrical" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Electrical</span>
            </TabsTrigger>
            <TabsTrigger value="hvac" className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>HVAC</span>
            </TabsTrigger>
            <TabsTrigger value="construction" className="flex items-center gap-2">
              <Hammer className="h-4 w-4" />
              <span>Construction</span>
            </TabsTrigger>
          </TabsList>
          
          {Object.keys(tradeData).map((trade) => (
            <TabsContent key={trade} value={trade} className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Jobs Completed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Briefcase className="h-5 w-5 text-blue-500 mr-2" />
                      <span className="text-2xl font-bold">
                        {tradeData[trade as keyof typeof tradeData].jobsCompleted}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({tradeData[trade as keyof typeof tradeData].jobsInProgress} in progress)
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Revenue
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-2xl font-bold">
                        ${tradeData[trade as keyof typeof tradeData].revenue.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Customers Served
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 text-purple-500 mr-2" />
                      <span className="text-2xl font-bold">
                        {tradeData[trade as keyof typeof tradeData].customersServed}
                      </span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">
                      Avg. Job Duration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-orange-500 mr-2" />
                      <span className="text-2xl font-bold">
                        {tradeData[trade as keyof typeof tradeData].avgJobDuration}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Financial Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span>Materials Cost</span>
                        <span className="font-medium">${tradeData[trade as keyof typeof tradeData].materialsCost.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Revenue</span>
                        <span className="font-medium">${tradeData[trade as keyof typeof tradeData].revenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span>Profit Margin</span>
                        <span className="font-medium text-green-600">{tradeData[trade as keyof typeof tradeData].profitMargin}%</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Profit Margin</h3>
                      <Progress value={tradeData[trade as keyof typeof tradeData].profitMargin} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Team Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Team Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tradeData[trade as keyof typeof tradeData].teams.map((team) => (
                      <div key={team.name} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{team.name}</span>
                          <span>Efficiency: {team.efficiency}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={team.efficiency} className="h-2 flex-1" />
                          <span className="text-sm">{team.jobs} jobs</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </AppLayout>
  );
}
