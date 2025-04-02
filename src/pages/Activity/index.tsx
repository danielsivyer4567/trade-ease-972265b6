
import React, { useState } from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity as ActivityIcon, Clock, Calendar, User, MessageSquare, Check, X, Info, AlertTriangle, Settings, Filter, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

// Mock data for activities
const mockActivities = [
  {
    id: 1,
    type: 'trade',
    action: 'BTC/USD Buy',
    description: 'Purchased 0.25 BTC at $43,250.00',
    timestamp: new Date(2023, 6, 12, 10, 15),
    user: 'You',
    status: 'completed',
    amount: '+$10,812.50'
  },
  {
    id: 2,
    type: 'login',
    action: 'Login Detected',
    description: 'New login from Chrome on macOS',
    timestamp: new Date(2023, 6, 12, 8, 30),
    user: 'You',
    status: 'alert',
    amount: null
  },
  {
    id: 3,
    type: 'trade',
    action: 'ETH/USD Sell',
    description: 'Sold 5.0 ETH at $3,270.00',
    timestamp: new Date(2023, 6, 11, 16, 45),
    user: 'You',
    status: 'completed',
    amount: '+$16,350.00'
  },
  {
    id: 4,
    type: 'transfer',
    action: 'Fund Transfer',
    description: 'Transferred $5,000 to external wallet',
    timestamp: new Date(2023, 6, 10, 12, 20),
    user: 'You',
    status: 'pending',
    amount: '-$5,000.00'
  },
  {
    id: 5,
    type: 'account',
    action: 'Profile Update',
    description: 'Updated contact information',
    timestamp: new Date(2023, 6, 9, 9, 10),
    user: 'You',
    status: 'completed',
    amount: null
  },
  {
    id: 6,
    type: 'trade',
    action: 'SOL/USD Buy',
    description: 'Purchased 25 SOL at $125.50',
    timestamp: new Date(2023, 6, 8, 15, 30),
    user: 'You',
    status: 'completed',
    amount: '+$3,137.50'
  },
  {
    id: 7,
    type: 'notification',
    action: 'Price Alert',
    description: 'BTC exceeded your target price of $45,000',
    timestamp: new Date(2023, 6, 8, 11, 45),
    user: 'System',
    status: 'info',
    amount: null
  },
  {
    id: 8,
    type: 'trade',
    action: 'ADA/USD Sell',
    description: 'Sold 1000 ADA at $0.50',
    timestamp: new Date(2023, 6, 7, 10, 20),
    user: 'You',
    status: 'failed',
    amount: '$0.00'
  },
  {
    id: 9,
    type: 'account',
    action: 'Two-Factor Authentication',
    description: 'Enabled 2FA for your account',
    timestamp: new Date(2023, 6, 6, 14, 15),
    user: 'You',
    status: 'completed',
    amount: null
  },
  {
    id: 10,
    type: 'trade',
    action: 'XRP/USD Buy',
    description: 'Purchased 2000 XRP at $0.54',
    timestamp: new Date(2023, 6, 5, 9, 30),
    user: 'You',
    status: 'completed',
    amount: '+$1,080.00'
  }
];

// Activity type icons
const activityIcons = {
  trade: <ActivityIcon className="h-5 w-5" />,
  login: <User className="h-5 w-5" />,
  transfer: <Settings className="h-5 w-5" />,
  account: <Settings className="h-5 w-5" />,
  notification: <Info className="h-5 w-5" />
};

// Activity status badges
const getStatusBadge = (status) => {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
    case 'pending':
      return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Pending</Badge>;
    case 'failed':
      return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Failed</Badge>;
    case 'alert':
      return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Alert</Badge>;
    case 'info':
      return <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">Info</Badge>;
    default:
      return null;
  }
};

// Format dates
const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const ActivityPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeTab, setActiveTab] = useState('all');

  // Apply filters to activities
  const filteredActivities = mockActivities.filter(activity => {
    const matchesSearch = 
      activity.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
      activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Group by date for the timeline view
  const groupedByDate = filteredActivities.reduce((groups, activity) => {
    const date = new Date(activity.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {});

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center">
            <ActivityIcon className="mr-2 h-6 w-6" />
            Activity Dashboard
          </h1>
          
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-2">
            <Input
              placeholder="Search activities..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-64"
              icon={<Search className="h-4 w-4" />}
            />
            <div className="flex gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="trade">Trades</SelectItem>
                  <SelectItem value="transfer">Transfers</SelectItem>
                  <SelectItem value="login">Logins</SelectItem>
                  <SelectItem value="account">Account</SelectItem>
                  <SelectItem value="notification">Notifications</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full md:w-[150px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="alert">Alerts</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Activities</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {filteredActivities.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(groupedByDate).map(([date, activities]) => (
                      <div key={date} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <h3 className="font-medium text-gray-700">{date}</h3>
                        </div>
                        <div className="ml-5 border-l-2 border-gray-200 pl-5 space-y-6">
                          {activities.map(activity => (
                            <div 
                              key={activity.id} 
                              className="relative flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg border bg-white shadow-sm hover:bg-gray-50 transition-colors"
                            >
                              <div className="absolute -left-[37px] top-5 bg-white rounded-full p-1 border-2 border-gray-200">
                                {activityIcons[activity.type] || <Info className="h-5 w-5" />}
                              </div>
                              <div className="flex flex-col flex-grow">
                                <div className="flex flex-col md:flex-row md:items-center gap-2">
                                  <h4 className="font-semibold">{activity.action}</h4>
                                  {getStatusBadge(activity.status)}
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                                <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                                  <Clock className="h-3 w-3" />
                                  <span>{formatDate(activity.timestamp)}</span>
                                  <User className="h-3 w-3 ml-2" />
                                  <span>{activity.user}</span>
                                </div>
                              </div>
                              {activity.amount && (
                                <div className={cn(
                                  "mt-2 md:mt-0 text-right font-semibold",
                                  activity.amount.startsWith('+') ? "text-green-600" : "text-red-600"
                                )}>
                                  {activity.amount}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <ActivityIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium">No activities found</h3>
                  <p className="text-gray-500 text-center mt-1">
                    No activities match your current filters. Try adjusting your search or filters.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm('');
                      setFilterType('all');
                      setFilterStatus('all');
                    }}
                  >
                    Clear filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="trades" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trade Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredActivities.filter(a => a.type === 'trade').length > 0 ? (
                  <div className="space-y-4">
                    {filteredActivities
                      .filter(a => a.type === 'trade')
                      .map(activity => (
                        <div 
                          key={activity.id} 
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border bg-white"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <ActivityIcon className="h-5 w-5 text-blue-500" />
                              <h4 className="font-semibold">{activity.action}</h4>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                          {activity.amount && (
                            <div className={cn(
                              "mt-2 md:mt-0 font-semibold",
                              activity.amount.startsWith('+') ? "text-green-600" : "text-red-600"
                            )}>
                              {activity.amount}
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No trade activities found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredActivities.filter(a => a.type === 'account').length > 0 ? (
                  <div className="space-y-4">
                    {filteredActivities
                      .filter(a => a.type === 'account')
                      .map(activity => (
                        <div 
                          key={activity.id} 
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border bg-white"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <Settings className="h-5 w-5 text-purple-500" />
                              <h4 className="font-semibold">{activity.action}</h4>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No account activities found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Security Activities</CardTitle>
              </CardHeader>
              <CardContent>
                {filteredActivities.filter(a => a.type === 'login').length > 0 ? (
                  <div className="space-y-4">
                    {filteredActivities
                      .filter(a => a.type === 'login')
                      .map(activity => (
                        <div 
                          key={activity.id} 
                          className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg border bg-white"
                        >
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <User className="h-5 w-5 text-yellow-500" />
                              <h4 className="font-semibold">{activity.action}</h4>
                              {getStatusBadge(activity.status)}
                            </div>
                            <p className="text-gray-600 text-sm mt-1">{activity.description}</p>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
                              <Clock className="h-3 w-3" />
                              <span>{formatDate(activity.timestamp)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No security activities found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
};

export default ActivityPage;
