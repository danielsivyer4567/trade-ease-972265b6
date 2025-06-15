import { 
  MessageSquare, CreditCard, Mail, Calendar, FileText, Phone, Facebook, 
  Building, Calculator, PenTool, Users, Database, Briefcase, HardHat, 
  Construction, Hammer, Wrench, BookOpen, Server
} from "lucide-react";
import { Integration } from "./types";

// Extended list of integrations including accounting, CRM and construction apps
export const availableIntegrations: Integration[] = [
  // CRM Integrations
  {
    title: "Go High Level",
    icon: MessageSquare,
    description: "Sync messages and communication with Go High Level",
    path: "/messaging",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "Salesforce",
    icon: Users,
    description: "Connect with the world's leading CRM platform",
    path: "/settings/integrations/salesforce",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "HubSpot",
    icon: Database,
    description: "Manage customer relationships and marketing campaigns",
    path: "/settings/integrations/hubspot",
    apiKeyRequired: true,
    category: "crm"
  },
  {
    title: "Zoho CRM",
    icon: Users,
    description: "Manage your sales, marketing and customer support",
    path: "/settings/integrations/zoho",
    apiKeyRequired: true,
    category: "crm"
  },
  
  // Communication Integrations
  {
    title: "WhatsApp Business",
    icon: Phone,
    description: "Connect with customers via WhatsApp Business API",
    path: "/settings/integrations/whatsapp",
    apiKeyRequired: true,
    category: "communication"
  },
  {
    title: "Facebook",
    icon: Facebook,
    description: "Connect with Facebook for messaging and social media",
    path: "/settings/integrations/facebook",
    apiKeyRequired: true,
    category: "communication"
  },
  {
    title: "SendGrid",
    icon: Mail,
    description: "Send automated emails and notifications",
    path: "/settings/integrations/sendgrid",
    category: "communication"
  },
  
  // Payment Integrations
  {
    title: "Stripe",
    icon: CreditCard,
    description: "Process payments and manage subscriptions",
    path: "/settings/integrations/stripe",
    category: "payment"
  },
  {
    title: "PayPal",
    icon: CreditCard,
    description: "Accept payments online with PayPal",
    path: "/settings/integrations/paypal",
    category: "payment"
  },
  {
    title: "Square",
    icon: CreditCard,
    description: "Process payments in-person and online",
    path: "/settings/integrations/square",
    apiKeyRequired: true,
    category: "payment"
  },
  
  // Accounting Integrations
  {
    title: "Xero",
    icon: Calculator,
    description: "Sync invoices, payments and accounting data with Xero",
    path: "/settings/integrations/xero",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "QuickBooks",
    icon: Calculator,
    description: "Connect your accounting data with QuickBooks",
    path: "/settings/integrations/quickbooks",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "MYOB",
    icon: Calculator,
    description: "Sync with MYOB accounting software",
    path: "/settings/integrations/myob",
    apiKeyRequired: true,
    category: "accounting"
  },
  {
    title: "Sage",
    icon: BookOpen,
    description: "Connect with Sage accounting software",
    path: "/settings/integrations/sage",
    apiKeyRequired: true,
    category: "accounting"
  },
  
  // Construction Specific Integrations
  {
    title: "Procore",
    icon: HardHat,
    description: "Manage construction projects and documents",
    path: "/settings/integrations/procore",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "PlanGrid",
    icon: PenTool,
    description: "Construction blueprint and document management",
    path: "/settings/integrations/plangrid",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "BuilderTrend",
    icon: Hammer,
    description: "Construction project management software",
    path: "/settings/integrations/buildertrend",
    apiKeyRequired: true,
    category: "construction"
  },
  {
    title: "CoConstruct",
    icon: Wrench,
    description: "Custom home builder and remodeler software",
    path: "/settings/integrations/coconstruct",
    apiKeyRequired: true,
    category: "construction"
  },
  
  // Calendar/Scheduling
  {
    title: "Google Calendar",
    icon: Calendar,
    description: "Sync appointments and schedules",
    path: "/settings/integrations/google-calendar",
    category: "calendar"
  },
  {
    title: "Microsoft 365",
    icon: Calendar,
    description: "Connect with Microsoft 365 calendar and email",
    path: "/settings/integrations/microsoft365",
    apiKeyRequired: true,
    category: "calendar"
  }
];

export const categoryOptions = [
  { value: "all", label: "All Integrations" },
  { value: "accounting", label: "Accounting" },
  { value: "crm", label: "CRM" },
  { value: "construction", label: "Construction" },
  { value: "payment", label: "Payment" },
  { value: "communication", label: "Communication" },
  { value: "calendar", label: "Calendar" },
];
