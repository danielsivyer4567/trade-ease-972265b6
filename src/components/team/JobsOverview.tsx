import React from 'react';
import { Card } from '@/components/ui/card';
export function JobsOverview() {
  return <section>
      <h2 className="text-xl font-semibold mb-4 text-zinc-950">Jobs Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-slate-200">
          <h3 className="text-lg font-semibold mb-3 text-zinc-950">Today's Jobs</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">No jobs scheduled for today</div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-200">
          <h3 className="text-lg font-semibold mb-3 text-zinc-950">Tomorrow's Jobs</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
          </div>
        </Card>

        <Card className="p-4 bg-slate-200">
          <h3 className="text-lg font-semibold mb-3 text-zinc-950">Upcoming Jobs</h3>
          <div className="space-y-2">
            <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
          </div>
        </Card>
      </div>
    </section>;
}