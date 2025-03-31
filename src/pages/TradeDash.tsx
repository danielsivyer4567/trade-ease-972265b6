
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, CircleDollarSign, CheckCircle } from 'lucide-react';

const data = [
  { name: 'Jan', earnings: 4000, expenses: 2400, profit: 1600 },
  { name: 'Feb', earnings: 3000, expenses: 1398, profit: 1602 },
  { name: 'Mar', earnings: 2000, expenses: 1800, profit: 200 },
  { name: 'Apr', earnings: 2780, expenses: 1908, profit: 872 },
  { name: 'May', earnings: 1890, expenses: 1800, profit: 90 },
  { name: 'Jun', earnings: 2390, expenses: 1800, profit: 590 },
  { name: 'Jul', earnings: 3490, expenses: 2300, profit: 1190 },
];

const TradeDash = () => {
  return (
    <BaseLayout>
      <div className="p-6 space-y-6 animate-fadeIn">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Trade Dashboard</h1>
          <div className="flex gap-2">
            <select className="px-3 py-2 border rounded-md text-sm">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 90 Days</option>
              <option>This Year</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">$17,550</div>
                <CircleDollarSign className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">24</div>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">3 due this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">New Customers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">18</div>
                <Users className="h-5 w-5 text-indigo-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">+5 this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">32</div>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">96% satisfaction rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Card>
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
            <CardDescription>Compare earnings, expenses, and profit over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="earnings" stroke="#4f46e5" activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
                  <Line type="monotone" dataKey="profit" stroke="#10b981" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Jobs</CardTitle>
            <CardDescription>Your latest trade jobs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { id: 'JB-2023-056', customer: 'Robert Smith', address: '123 Main St', job: 'Kitchen Remodel', status: 'In Progress', value: '$8,500' },
                { id: 'JB-2023-055', customer: 'Jane Cooper', address: '456 Oak Ave', job: 'Bathroom Plumbing', status: 'Completed', value: '$2,200' },
                { id: 'JB-2023-054', customer: 'Alex Johnson', address: '789 Pine Rd', job: 'Electrical Upgrade', status: 'Quoted', value: '$3,750' },
                { id: 'JB-2023-053', customer: 'Maria Garcia', address: '321 Elm St', job: 'Roof Repair', status: 'Scheduled', value: '$4,800' },
              ].map(job => (
                <div key={job.id} className="bg-muted/30 p-3 rounded-md flex flex-col sm:flex-row sm:items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{job.id}: {job.job}</h4>
                      <span className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'Quoted' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {job.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{job.customer} · {job.address}</p>
                  </div>
                  <div className="mt-2 sm:mt-0 text-right">
                    <span className="font-medium">{job.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center">
              <a href="/jobs" className="text-sm text-primary font-medium hover:underline">View all jobs →</a>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default TradeDash;
