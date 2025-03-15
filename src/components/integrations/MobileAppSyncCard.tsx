
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone } from "lucide-react";

export function MobileAppSyncCard() {
  return (
    <Card className="glass-card">
      <CardHeader className="bg-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-purple-100 p-2 rounded-full">
            <Smartphone className="h-5 w-5 text-purple-600" />
          </div>
          <CardTitle>Mobile App Sync</CardTitle>
        </div>
        <CardDescription>
          Sync data with the mobile application
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-200">
        <p className="text-sm text-gray-600 mb-4">
          Configure how data is synchronized between the web platform and mobile applications.
          Control frequency and which data types are synced.
        </p>
        <Button className="w-full flex items-center justify-center gap-1 bg-slate-400 hover:bg-slate-300">
          Configure Sync Settings
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
