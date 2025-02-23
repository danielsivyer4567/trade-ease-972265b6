
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Settings, DollarSign, Receipt, Clock, Users, Shield, FileText, Calendar, List, CreditCard, User, Bot, Briefcase, Network, Mail, FileJson, Building, Share, Zap, Search, Link2 } from "lucide-react";
import { Link } from "react-router-dom";

const settingsSections = [{
  title: "Trade Rates",
  icon: DollarSign,
  description: "Manage trade and service rates",
  path: "/settings/trade-rates"
}, {
  title: "Bills & Purchase Orders",
  icon: Receipt,
  description: "Track bills and purchase orders"
}, {
  title: "Time Sheets",
  icon: Clock,
  description: "Manage employee time tracking"
}, {
  title: "Office Staff",
  icon: Users,
  description: "Manage office personnel"
}, {
  title: "On-site Staff",
  icon: Users,
  description: "Manage field workers"
}, {
  title: "Contractors",
  icon: Users,
  description: "Manage external contractors",
  path: "/settings/contractors"
}, {
  title: "Security 2FA",
  icon: Shield,
  description: "Two-factor authentication settings"
}, {
  title: "Estimates",
  icon: FileText,
  description: "Configure estimate templates"
}, {
  title: "Calendar/Scheduling",
  icon: Calendar,
  description: "Manage scheduling settings"
}, {
  title: "Price Lists",
  icon: List,
  description: "Manage product and service prices"
}, {
  title: "Trade Ease Plan Details",
  icon: FileText,
  description: "View and manage your plan"
}, {
  title: "Payments",
  icon: CreditCard,
  description: "Configure payment settings"
}, {
  title: "Customer Portfolios",
  icon: User,
  description: "Manage customer information"
}, {
  title: "API Integrations",
  icon: Link2,
  description: "Configure external API integrations",
  path: "/settings/integrations"
}, {
  title: "Jobs",
  icon: Briefcase,
  description: "Job management settings"
}, {
  title: "Integrations",
  icon: Network,
  description: "Manage third-party integrations"
}, {
  title: "Inquiries",
  icon: Search,
  description: "Configure inquiry handling"
}, {
  title: "Email",
  icon: Mail,
  description: "Email settings and templates"
}, {
  title: "Document Styles",
  icon: FileJson,
  description: "Customize document templates"
}, {
  title: "Company Information",
  icon: Building,
  description: "Update company details"
}, {
  title: "Refer a Friend",
  icon: Share,
  description: "Share Trade Ease"
}, {
  title: "AI Assistant Settings",
  icon: Zap,
  description: "Configure AI assistant"
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
                to={section.path || `/settings/${section.title.toLowerCase().replace(/\s+/g, '-')}`} 
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
