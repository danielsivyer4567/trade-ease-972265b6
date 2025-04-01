
import React from 'react';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ActivityPage = () => {
  return (
    <BaseLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold">Activity Dashboard</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">Your recent activities will appear here.</p>
              
              {/* Placeholder for activity timeline */}
              <div className="border rounded-md p-4 bg-gray-50">
                <p className="text-sm text-gray-500">No recent activities found.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BaseLayout>
  );
};

export default ActivityPage;
