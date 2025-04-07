
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Zap, Shield, Clock, Flame, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface ProUpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProUpgradeModal: React.FC<ProUpgradeModalProps> = ({ open, onOpenChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpgrade = async () => {
    setIsLoading(true);
    
    try {
      // In a real implementation, this would connect to your payment provider
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      
      toast.success("Upgrade successful! You now have access to Pro automations.");
      onOpenChange(false);
    } catch (error) {
      console.error("Upgrade error:", error);
      toast.error("There was an error processing your upgrade. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Flame className="h-5 w-5 text-amber-500" />
            Upgrade to Pro Automations
          </DialogTitle>
          <DialogDescription>
            Unlock powerful automation features to save time and streamline your workflow.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 text-amber-800 font-medium mb-1">
              <Zap className="h-4 w-4 text-amber-500" />
              What's included with Pro Automations
            </div>
            <p className="text-sm text-amber-700">
              Unlock all premium automation features for your trade business with a single subscription.
            </p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Social Media Automations</h4>
                <p className="text-sm text-muted-foreground">Automatically post job completions to your social media accounts</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">SMS Notifications</h4>
                <p className="text-sm text-muted-foreground">Send automated SMS reminders to customers and team members</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Advanced Workflows</h4>
                <p className="text-sm text-muted-foreground">Create complex automation workflows with conditional logic</p>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="font-medium">Custom Triggers</h4>
                <p className="text-sm text-muted-foreground">Define your own automation triggers based on specific events</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center border-t border-b py-4 my-4">
            <div>
              <h3 className="text-lg font-semibold">Pro Subscription</h3>
              <p className="text-sm text-muted-foreground">Unlimited access to all premium features</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold">$29.99</div>
              <div className="text-xs text-muted-foreground">per month</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm mb-4">
            <Shield className="h-4 w-4 text-blue-500" />
            <span>Secure payment processing</span>
            
            <Clock className="h-4 w-4 text-blue-500 ml-4" />
            <span>Cancel anytime</span>
          </div>
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="sm:w-auto w-full"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpgrade} 
            className="sm:w-auto w-full bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>Upgrade Now</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProUpgradeModal;
