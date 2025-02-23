
import { Card } from "@/components/ui/card";
import { CheckSquare, Clock, MessageSquare, XSquare } from "lucide-react";

const quoteStatuses = [{
  title: "Accepted Quotes",
  icon: CheckSquare,
  color: "#10B981",
  count: "5"
}, {
  title: "Awaiting Acceptance",
  icon: Clock,
  color: "#F59E0B",
  count: "3"
}, {
  title: "Replied Quotes",
  icon: MessageSquare,
  color: "#3B82F6",
  count: "2"
}, {
  title: "Denied Quotes",
  icon: XSquare,
  color: "#EF4444",
  count: "1"
}];

export function QuoteStatusGrid() {
  return (
    <Card className="p-3 md:p-4">
      <h2 className="text-base md:text-lg font-semibold mb-3 md:mb-4">Quote Status</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
        {quoteStatuses.map(quote => (
          <div key={quote.title} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
            <div className="flex items-center gap-2 md:gap-3">
              <quote.icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: quote.color }} />
              <span className="font-medium text-sm md:text-base">{quote.title}</span>
            </div>
            <span className="text-xs md:text-sm font-semibold text-gray-600">{quote.count}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
