
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { KeyStatistics } from "@/components/statistics/KeyStatistics";

export default function Index() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <CardDescription>Overview of your business performance</CardDescription>
          </CardHeader>
          <CardContent>
            <KeyStatistics />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
