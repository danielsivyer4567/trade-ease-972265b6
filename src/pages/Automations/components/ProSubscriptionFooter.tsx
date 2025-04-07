
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Flame } from 'lucide-react';
import ProUpgradeModal from './ProUpgradeModal';

const ProSubscriptionFooter = () => {
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  return (
    <div className="pt-4 border-t">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          <Flame className="h-4 w-4 inline text-orange-500 mr-1" /> 
          Pro automations require a premium subscription.
        </p>
        <Button 
          variant="outline" 
          className="sm:w-auto w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 border-none font-medium"
          onClick={() => setIsUpgradeModalOpen(true)}
        >
          Upgrade now
        </Button>
      </div>

      <ProUpgradeModal 
        open={isUpgradeModalOpen} 
        onOpenChange={setIsUpgradeModalOpen} 
      />
    </div>
  );
};

export default ProSubscriptionFooter;
