import { Outlet } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Card } from "@/components/ui/card";
import { SettingsSidebar } from "./components/SettingsSidebar";

export default function SettingsLayout() {
  return (
    <AppLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <SettingsSidebar />
          </aside>
          <main className="flex-1">
            <Card className="p-6">
              <Outlet />
            </Card>
          </main>
        </div>
      </div>
    </AppLayout>
  );
} 