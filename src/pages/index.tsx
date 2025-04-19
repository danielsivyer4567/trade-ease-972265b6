import { BaseLayout } from "@/components/ui/BaseLayout";
import JobSiteMap from "@/components/dashboard/JobSiteMap";
import RecentActivity from "@/components/dashboard/RecentActivity";
import UpcomingJobs from "@/components/dashboard/UpcomingJobs";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TradeDashboardContent } from "@/components/trade-dashboard/TradeDashboardContent";
import { PerformanceSection } from "@/components/dashboard/PerformanceSection";
import { StatisticsSection } from "@/components/dashboard/StatisticsSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [calendarDate, setCalendarDate] = useState<Date | undefined>(new Date());
  
  return (
    <BaseLayout showQuickTabs>
      <div className="pb-10">
        <div className="mb-4 p-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Welcome back to your dashboard.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <div className="xl:col-span-2">
              <Card className="shadow-md">
                <JobSiteMap />
              </Card>
            </div>
            <div>
              <Card className="shadow-md h-full">
                <RecentActivity />
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="shadow-md">
              <UpcomingJobs />
            </Card>
          </div>

          <Collapsible
            open={!isCollapsed}
            onOpenChange={(open) => setIsCollapsed(!open)}
            className="w-full"
          >
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full p-2 flex justify-between items-center border rounded-md mb-4"
              >
                <span className="text-lg font-semibold">Team Calendar</span>
                {isCollapsed ? (
                  <ChevronDown className="h-5 w-5" />
                ) : (
                  <ChevronUp className="h-5 w-5" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <Card className="shadow-md mb-4">
                <TeamCalendar 
                  date={calendarDate}
                  setDate={setCalendarDate}
                  teamColor="blue"
                />
              </Card>
            </CollapsibleContent>
          </Collapsible>

          <TradeDashboardContent />
          
          {/* Statistics Section (was previously on Statistics page) */}
          <Separator className="my-8" />
          <StatisticsSection />
          
          {/* Performance Section (was previously on Performance page) */}
          <Separator className="my-8" />
          <PerformanceSection />
        </div>
      </div>
    </BaseLayout>
  );
}
