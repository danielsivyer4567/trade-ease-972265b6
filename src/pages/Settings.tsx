
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, Receipt, Clock, Users, Shield, FileText, Calendar, List, CreditCard, User, Bot, Briefcase, Network, Mail, FileJson, Building, Share, Zap, Search, Link2, Bell, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const settingsSections = [{
  title: "Notifications",
  icon: Bell,
  description: "Configure notification settings",
  path: "/settings/notifications"
}, {
  title: "Trade Rates",
  icon: DollarSign,
  description: "Calculate and manage trade rates",
  path: "/settings/trade-rates"
}, {
  title: "Bills & Purchase Orders",
  icon: Receipt,
  description: "Track bills and purchase orders",
  path: "/settings/bills-purchase-orders"
}, {
  title: "Time Sheets",
  icon: Clock,
  description: "Manage employee time tracking",
  path: "/settings/time-sheets"
}, {
  title: "Office Staff",
  icon: Users,
  description: "Manage office personnel",
  path: "/settings/office-staff"
}, {
  title: "On-site Staff",
  icon: Users,
  description: "Manage field workers",
  path: "/settings/on-site-staff"
}, {
  title: "Contractors",
  icon: Users,
  description: "Manage external contractors",
  path: "/settings/contractors"
}, {
  title: "Security 2FA",
  icon: Shield,
  description: "Two-factor authentication settings",
  path: "/settings/security-2fa"
}, {
  title: "Estimates",
  icon: FileText,
  description: "Configure estimate templates",
  path: "/settings/estimates"
}, {
  title: "Calendar/Scheduling",
  icon: Calendar,
  description: "Manage scheduling settings",
  path: "/settings/calendar-scheduling"
}, {
  title: "Price Lists",
  icon: List,
  description: "Manage product and service prices",
  path: "/settings/price-lists"
}, {
  title: "Trade Ease Plan Details",
  icon: FileText,
  description: "View and manage your plan",
  path: "/settings/trade-ease-plan-details"
}, {
  title: "Payments",
  icon: CreditCard,
  description: "Configure payment settings",
  path: "/settings/payments"
}, {
  title: "Customer Portfolios",
  icon: User,
  description: "Manage customer information",
  path: "/settings/customer-portfolios"
}, {
  title: "API Integrations",
  icon: Link2,
  description: "Configure external API integrations",
  path: "/settings/api-integrations"
}, {
  title: "Jobs",
  icon: Briefcase,
  description: "Job management settings",
  path: "/settings/jobs"
}, {
  title: "Integrations",
  icon: Network,
  description: "Manage third-party integrations",
  path: "/settings/integrations"
}, {
  title: "Inquiries",
  icon: Search,
  description: "Configure inquiry handling",
  path: "/settings/inquiries"
}, {
  title: "Web Enquiry Form",
  icon: Globe,
  description: "Configure web form for enquiries",
  path: "/settings/notifications?tab=web-enquiry"
}, {
  title: "Email",
  icon: Mail,
  description: "Email settings and templates",
  path: "/email"
}, {
  title: "Document Styles",
  icon: FileJson,
  description: "Customize document templates",
  path: "/settings/document-styles"
}, {
  title: "Company Information",
  icon: Building,
  description: "Update company details",
  path: "/settings/company-information"
}, {
  title: "Refer a Friend",
  icon: Share,
  description: "Share Trade Ease",
  path: "/settings/refer-a-friend"
}, {
  title: "AI Assistant Settings",
  icon: Zap,
  description: "Configure AI assistant",
  path: "/settings/ai-assistant-settings"
}];

export default function SettingsPage() {
  return <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center gap-2">
          <Settings className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        {/* Settings Grid */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Configuration</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {settingsSections.map(section => (
              <Link 
                key={section.title} 
                to={section.path} 
                className="block"
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <section.icon className="h-5 w-5 text-gray-600" />
                      <CardTitle className="text-lg">{section.title}</CardTitle>
                    </div>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>;
}
