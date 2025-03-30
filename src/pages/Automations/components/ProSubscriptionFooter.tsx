
import React from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';

const ProSubscriptionFooter = () => {
  return (
    <div className="pt-4 border-t">
      <p className="text-sm text-muted-foreground">
        <Flame className="h-4 w-4 inline text-orange-500 mr-1" /> 
        Pro automations require a premium subscription. 
        <Button variant="link" className="p-0 h-auto text-sm">Upgrade now</Button>
      </p>
    </div>
  );
};

export default ProSubscriptionFooter;
