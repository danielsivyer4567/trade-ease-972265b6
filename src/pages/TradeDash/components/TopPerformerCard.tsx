
import { Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

export function TopPerformerCard() {
  return (
    <Card className="bg-gradient-to-r from-amber-50 to-yellow-100 border-yellow-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-600" />
          <CardTitle className="text-sm font-medium text-amber-800">
            Top Performer Recognition
          </CardTitle>
        </div>
        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300">
          Top 10
        </Badge>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-amber-800">
          Congratulations! You're ranked among the top 10 tradespeople in your area. This gives you priority in the lead marketplace.
        </p>
        <div className="mt-2 flex items-center gap-2">
          <Button size="sm" variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
            View Benefits
          </Button>
          <Button size="sm" variant="outline" className="bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-200">
            Claim Free Leads
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
