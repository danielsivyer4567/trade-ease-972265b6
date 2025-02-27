
import { ArrowLeft } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ReactNode } from "react";

interface SettingsPageTemplateProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}

export default function SettingsPageTemplate({ title, icon, children }: SettingsPageTemplateProps) {
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            {icon}
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>
        </div>
        
        {children}
      </div>
    </AppLayout>
  );
}
