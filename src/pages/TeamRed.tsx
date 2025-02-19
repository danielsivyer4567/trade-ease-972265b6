
import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';

export default function TeamRed() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <AppLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-red-600">Team Red Dashboard</h1>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Calendar 
            mode="single" 
            selected={date} 
            onSelect={setDate} 
            className="border mx-[240px] my-[15px] rounded-2xl px-[169px] py-[5px]" 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Jobs */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Today's Jobs</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No jobs scheduled for today</div>
            </div>
          </Card>

          {/* Tomorrow's Jobs */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Tomorrow's Jobs</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
            </div>
          </Card>

          {/* Upcoming Jobs */}
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-3 text-red-600">Upcoming Jobs</h2>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
            </div>
          </Card>
        </div>

        {/* Time Off Section */}
        <Card className="p-4 mt-6">
          <h2 className="text-lg font-semibold mb-3 text-red-600">Team Time Off</h2>
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-2">Pending Requests</h3>
                <div className="text-sm text-gray-500">No pending time off requests</div>
              </div>
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-2">Approved Time Off</h3>
                <div className="text-sm text-gray-500">No approved time off</div>
              </div>
              <div className="border rounded-lg p-3">
                <h3 className="font-medium text-gray-700 mb-2">Upcoming Time Off</h3>
                <div className="text-sm text-gray-500">No upcoming time off scheduled</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
