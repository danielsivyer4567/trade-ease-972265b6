
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { AutoLeadDialogManager } from "./AutoLeadDialogManager";

interface LeadCreditsCardProps {
  creditsBalance: number;
  usedLeadsThisWeek: number;
}

export const LeadCreditsCard = ({ 
  creditsBalance,
  usedLeadsThisWeek
}: LeadCreditsCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Lead Credits Balance
        </CardTitle>
        <DollarSign className="h-4 w-4 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{creditsBalance}</div>
        <div className="flex flex-col gap-2 mt-2">
          <Button size="sm" className="w-full">
            Buy More Credits
          </Button>
          <div className="flex gap-2">
            <AutoLeadDialogManager usedLeadsThisWeek={usedLeadsThisWeek} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
