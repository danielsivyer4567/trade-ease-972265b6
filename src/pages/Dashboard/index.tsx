
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { KeyStatistics } from '@/components/statistics/KeyStatistics';
import UpcomingJobs from '@/components/dashboard/UpcomingJobs';
import RecentActivity from '@/components/dashboard/RecentActivity';
import CleaningRequiredJobs from '@/components/dashboard/CleaningRequiredJobs';
import JobSiteMap from '@/components/dashboard/JobSiteMap';

const Dashboard = () => {
  return (
    <AppLayout>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        
        <KeyStatistics />
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Job Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <UpcomingJobs />
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-1 lg:col-span-3">
            <CardHeader>
              <CardTitle>Jobs Requiring Cleaning</CardTitle>
            </CardHeader>
            <CardContent>
              <CleaningRequiredJobs />
            </CardContent>
          </Card>
          
          <Card className="col-span-1 lg:col-span-4">
            <CardHeader>
              <CardTitle>Job Site Map</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <JobSiteMap />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;
