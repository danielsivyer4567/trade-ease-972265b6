
import React from 'react';
import { Card } from '@/components/ui/card';

interface TeamTimeOffProps {
  teamColor: string;
}

export function TeamTimeOff({ teamColor }: TeamTimeOffProps) {
  return (
    <section>
      <h2 className={`text-xl font-semibold text-${teamColor}-600 mb-4`}>Team Time Off</h2>
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
  );
}
