
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AutoLeadPurchaseCard } from "@/components/integrations/AutoLeadPurchaseCard";
import { PaymentGatewaysCard } from "@/components/integrations/PaymentGatewaysCard";
import { MobileAppSyncCard } from "@/components/integrations/MobileAppSyncCard";
import { ApiAccessCard } from "@/components/integrations/ApiAccessCard";
import { ServiceSyncCard } from "@/components/messaging/ServiceSyncCard";
import { GoogleCalendarCard } from "@/components/integrations/GoogleCalendarCard";
import { XeroIntegrationCard } from "@/components/integrations/XeroIntegrationCard";

export default function Integrations() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/settings')} className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Integrations</h1>
        </div>
        <p className="text-gray-600">Connect your account with these services to enhance your workflow.</p>
        
        <ServiceSyncCard />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <XeroIntegrationCard />
          <GoogleCalendarCard />
          <AutoLeadPurchaseCard />
          <PaymentGatewaysCard />
          <MobileAppSyncCard />
          <ApiAccessCard />
        </div>
      </div>
    </AppLayout>
  );
}
