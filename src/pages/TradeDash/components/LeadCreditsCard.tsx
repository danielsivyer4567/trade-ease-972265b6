
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface LeadCreditsCardProps {
  creditsBalance: number;
  usedLeadsThisWeek: number;
}

export const LeadCreditsCard = ({
  creditsBalance,
  usedLeadsThisWeek
}: LeadCreditsCardProps) => {
  const maxLeadsPerWeek = 10; // This would typically come from user's subscription
  const usagePercentage = (usedLeadsThisWeek / maxLeadsPerWeek) * 100;
  
  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Lead Credits</CardTitle>
        <CardDescription>Your available credits for purchasing new leads</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-2xl font-bold">{creditsBalance}</span>
              <span className="text-sm text-muted-foreground ml-2">credits available</span>
            </div>
            <Button size="sm">Buy More Credits</Button>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center text-sm">
              <span>Weekly Usage</span>
              <span>{usedLeadsThisWeek} of {maxLeadsPerWeek} leads</span>
            </div>
            <Progress value={usagePercentage} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
