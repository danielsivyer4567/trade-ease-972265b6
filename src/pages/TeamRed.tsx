
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
export default function TeamRed() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <AppLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-red-600">Team Red Dashboard</h1>
        
        {/* Calendar Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Team Calendar</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="w-full border rounded-2xl text-lg font-semibold"
            />
          </div>
        </section>

        {/* Jobs Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Jobs Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Today's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for today</div>
              </div>
            </Card>

            {/* Tomorrow's Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Tomorrow's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
              </div>
            </Card>

            {/* Upcoming Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Upcoming Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Time Off Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Team Time Off</h2>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">individual of team time off</h3>
                  <div className="text-sm text-gray-500">No pending time off indications</div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">acknowledged team Time Off</h3>
                  <div className="text-sm text-gray-500">No acknowledged time off</div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">Upcoming Time Off</h3>
                  <div className="text-sm text-gray-500">No upcoming time off scheduled</div>
                </div>
              </div>
            </div>
          </Card>
        </section>
      </div>
    </AppLayout>;
}
