import { ReactNode } from "react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
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
  return <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-slate-200">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="bg-slate-200">
        <div className="text-2xl font-bold">{value}</div>
        {description && <p className="text-xs text-muted-foreground">
            {description}
          </p>}
      </CardContent>
    </Card>;
}