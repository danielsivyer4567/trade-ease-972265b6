
import { useState } from "react";
import { toast } from "sonner";

export const useLeadActions = (initialFreeLeads: number) => {
  const [freeLeads, setFreeLeads] = useState(initialFreeLeads);
  const [creditsBalance, setCreditsBalance] = useState(25);

  const claimFreeLead = async (leadId: number) => {
    if (freeLeads <= 0) {
      toast.error("You have no free leads available");
      return;
    }
    
    setFreeLeads(prev => prev - 1);
    toast.success(`Lead #${leadId} claimed for free! You have ${freeLeads - 1} free leads remaining.`);
  };

  const buyLead = (leadId: number) => {
    toast.success(`Lead #${leadId} purchased successfully! You can now contact the customer.`);
  };

  return {
    freeLeads,
    creditsBalance,
    claimFreeLead,
    buyLead
  };
};
