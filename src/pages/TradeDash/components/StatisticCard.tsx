import { ReactNode } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatisticCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  className?: string;
}

export function StatisticCard({
  title,
  value,
  icon,
  description,
  className = ""
}: StatisticCardProps) {
  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow overflow-hidden",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className="p-2 rounded-full bg-gray-50">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {description && (
          <p className="text-sm text-gray-500 mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}