
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Plus } from "lucide-react";

export function WatchList() {
  const [watchlist, setWatchlist] = React.useState([
    { name: 'Kitchen Remodel', location: 'New York, NY', status: 'In progress', lastUpdate: '2 days ago' },
    { name: 'Bathroom Renovation', location: 'Chicago, IL', status: 'Starting soon', lastUpdate: '1 day ago' },
    { name: 'Deck Construction', location: 'Seattle, WA', status: 'Pending approval', lastUpdate: '5 days ago' },
    { name: 'Home Addition', location: 'Austin, TX', status: 'Materials ordered', lastUpdate: '3 days ago' }
  ]);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xl flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Job Watchlist
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-0">
        <div className="px-4 pb-2 text-sm text-muted-foreground flex justify-between border-b">
          <span>Job</span>
          <span>Status</span>
        </div>
        <div className="divide-y">
          {watchlist.map((job, index) => (
            <div key={index} className="px-4 py-3 flex justify-between items-center">
              <div>
                <div className="font-medium">{job.name}</div>
                <div className="text-xs text-muted-foreground">{job.location}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">{job.status}</div>
                <div className="text-xs text-muted-foreground">
                  {job.lastUpdate}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 pt-4">
          <Button className="w-full text-sm" size="sm">View All Jobs</Button>
        </div>
      </CardContent>
    </Card>
  );
}
