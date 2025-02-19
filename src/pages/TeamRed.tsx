import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Calendar } from '@/components/ui/calendar';
export default function TeamRed() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return <AppLayout>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-red-600">Team Red Dashboard</h1>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <Calendar mode="single" selected={date} onSelect={setDate} className="border mx-[240px] my-[15px] rounded-2xl px-[169px] py-[5px]" />
        </div>
      </div>
    </AppLayout>;
}