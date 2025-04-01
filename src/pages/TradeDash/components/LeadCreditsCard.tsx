import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Plus, Settings } from "lucide-react";
import { AutoLeadDialogManager } from "./AutoLeadDialogManager";
import { Separator } from "@/components/ui/separator";

interface LeadCreditsCardProps {
  creditsBalance: number;
  usedLeadsThisWeek: number;
}

export const LeadCreditsCard = ({
  creditsBalance,
  usedLeadsThisWeek
}: LeadCreditsCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          Lead Credits Balance
        </CardTitle>
        <div className="p-2 rounded-full bg-yellow-50">
          <DollarSign className="h-4 w-4 text-yellow-500" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-2xl font-bold text-gray-900">{creditsBalance}</div>
          <p className="text-sm text-gray-500 mt-1">
            {usedLeadsThisWeek} leads used this week
          </p>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            size="sm" 
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
          >
            <Plus className="h-4 w-4 mr-1" />
            Buy Credits
          </Button>
          <AutoLeadDialogManager usedLeadsThisWeek={usedLeadsThisWeek} />
        </div>
      </CardContent>
    </Card>
  );
};