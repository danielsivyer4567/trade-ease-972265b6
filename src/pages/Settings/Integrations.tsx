
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link2, MessageSquare, CreditCard, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const availableIntegrations = [
  {
    title: "Go High Level",
    icon: MessageSquare,
    description: "Sync messages and communication with Go High Level",
    path: "/messaging",
    status: "Not Connected"
  },
  {
    title: "Stripe",
    icon: CreditCard,
    description: "Process payments and manage subscriptions",
    path: "/settings/integrations/stripe",
    status: "Not Connected"
  },
  {
    title: "SendGrid",
    icon: Mail,
    description: "Send automated emails and notifications",
    path: "/settings/integrations/sendgrid",
    status: "Not Connected"
  },
  {
    title: "Google Calendar",
    icon: Calendar,
    description: "Sync appointments and schedules",
    path: "/settings/integrations/google-calendar",
    status: "Not Connected"
  }
];

export default function IntegrationsPage() {
  return (
    <AppLayout>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-2">
          <Link2 className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">API Integrations</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {availableIntegrations.map((integration) => (
            <Card key={integration.title}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <integration.icon className="h-5 w-5 text-gray-600" />
                    <CardTitle>{integration.title}</CardTitle>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    integration.status === "Connected" 
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}>
                    {integration.status}
                  </span>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to={integration.path}>
                  <Button className="w-full">
                    {integration.status === "Connected" ? "Manage Integration" : "Connect"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
