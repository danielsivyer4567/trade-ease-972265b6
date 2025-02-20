
import { AppLayout } from "@/components/ui/AppLayout";
import { BarChart } from "lucide-react";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";

export default function StatisticsPage() {
  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Business Statistics</h1>
          </div>
        </div>

        <KeyStatistics />
      </div>
    </AppLayout>
  );
}
