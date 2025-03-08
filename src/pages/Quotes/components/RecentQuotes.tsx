import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for recent quotes
const RECENT_ACTIVITY = [{
  id: "Q-2024-006",
  customer: "Thomas Wilson",
  description: "HVAC Installation",
  timestamp: "2 hours ago",
  amount: 3200
}, {
  id: "Q-2024-007",
  customer: "Jessica Miller",
  description: "Driveway Paving",
  timestamp: "4 hours ago",
  amount: 5800
}, {
  id: "Q-2024-008",
  customer: "Robert Taylor",
  description: "Window Replacement",
  timestamp: "Yesterday",
  amount: 2400
}];
export function RecentQuotes() {
  const navigate = useNavigate();
  const viewQuote = (id: string) => {
    // In a real app, navigate to the quote detail page
    console.log(`Viewing quote ${id}`);
  };
  return <Card className="bg-slate-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Recent Quote Activity</CardTitle>
        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/quotes")}>
          View All
          <ArrowRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {RECENT_ACTIVITY.map(item => <div key={item.id} className="flex items-center gap-4 border-b pb-4">
              <div className="bg-blue-100 p-2 rounded">
                <Clock className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between">
                  <p className="font-medium truncate">{item.customer}</p>
                  <Badge variant="outline">${item.amount}</Badge>
                </div>
                <div className="flex justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">{item.description}</p>
                  <span className="text-xs text-gray-400">{item.timestamp}</span>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => viewQuote(item.id)}>
                View
              </Button>
            </div>)}
        </div>
      </CardContent>
    </Card>;
}