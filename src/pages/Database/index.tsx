
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Database as DatabaseIcon } from "lucide-react";
import { DatabaseStatistics } from "@/components/database/DatabaseStatistics";

export default function Database() {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <DatabaseIcon className="h-8 w-8 text-gray-700" />
          <h1 className="text-2xl font-bold">Database Management</h1>
        </div>
        
        <Card className="bg-blue-50">
          <CardHeader>
            <CardTitle>Database Overview</CardTitle>
            <CardDescription>
              View statistics and information about your database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              This page provides an overview of the entities in your database and their current counts.
              Statistics are calculated in real-time whenever you visit this page.
            </p>
            
            <DatabaseStatistics />
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
