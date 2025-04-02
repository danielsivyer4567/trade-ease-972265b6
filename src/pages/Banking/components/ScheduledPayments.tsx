
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';

const ScheduledPayments: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Payments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-6">
          <p className="text-muted-foreground">No scheduled payments</p>
          <Button variant="link" className="mt-2 text-primary text-sm">Set up recurring payment</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduledPayments;
