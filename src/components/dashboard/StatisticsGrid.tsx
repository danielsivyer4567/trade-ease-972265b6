
import { Card } from "@/components/ui/card";
import { Calendar, DollarSign, FileText, Users } from "lucide-react";

interface Stat {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  trend: "up" | "down";
}

const stats: Stat[] = [{
  title: "Active Jobs",
  value: "12",
  icon: Calendar,
  change: "+2 from last week",
  trend: "up"
}, {
  title: "Pending Quotes",
  value: "8",
  icon: FileText,
  change: "-3 from last week",
  trend: "down"
}, {
  title: "Total Customers",
  value: "156",
  icon: Users,
  change: "+5 this month",
  trend: "up"
}, {
  title: "Revenue (MTD)",
  value: "$24,500",
  icon: DollarSign,
  change: "+15% vs last month",
  trend: "up"
}];

export function StatisticsGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-6">
      {stats.map(stat => (
        <Card key={stat.title} className="p-3 md:p-6 animate-slideUp">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs md:text-sm font-medium text-gray-600">{stat.title}</p>
              <h3 className="text-lg md:text-2xl font-semibold text-gray-900 mt-1 md:mt-2">
                {stat.value}
              </h3>
              <p className={`text-xs md:text-sm mt-1 md:mt-2 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {stat.change}
              </p>
            </div>
            <stat.icon className="w-4 h-4 md:w-6 md:h-6 text-gray-400" />
          </div>
        </Card>
      ))}
    </div>
  );
}
