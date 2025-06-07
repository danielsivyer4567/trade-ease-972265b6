import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  HardHat,
  Phone,
  Mail,
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  User,
  Building,
  Wrench
} from 'lucide-react';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

interface QuoteTemplateProps {
  companyName?: string;
  companyLogo?: string;
  contactInfo?: {
    phone: string;
    email: string;
    address: string;
  };
  clientInfo?: {
    name: string;
    company: string;
    address: string;
    phone: string;
    email: string;
  };
  projectDetails?: {
    title: string;
    description: string;
    location: string;
    startDate: string;
    duration: string;
  };
  services?: Array<{
    name: string;
    description: string;
    quantity: number;
    unit: string;
    rate: number;
    total: number;
  }>;
  totals?: {
    subtotal: number;
    tax: number;
    total: number;
  };
  terms?: string[];
  validUntil?: string;
  quoteNumber?: string;
}

const ConstructionTemplate9: React.FC<QuoteTemplateProps> = ({
  companyName = "BuildCraft Construction",
  companyLogo = "",
  contactInfo = {
    phone: "(555) 123-4567",
    email: "info@buildcraft.com",
    address: "123 Construction Ave, Builder City, BC 12345"
  },
  clientInfo = {
    name: "John Smith",
    company: "Smith Properties LLC",
    address: "456 Client Street, Client City, CC 67890",
    phone: "(555) 987-6543",
    email: "john@smithproperties.com"
  },
  projectDetails = {
    title: "Residential Kitchen Renovation",
    description: "Complete kitchen remodel including cabinets, countertops, flooring, and electrical work",
    location: "789 Renovation Road, Home City, HC 11111",
    startDate: "March 15, 2024",
    duration: "6-8 weeks"
  },
  services = [
    {
      name: "Demolition & Prep Work",
      description: "Remove existing cabinets, countertops, and flooring",
      quantity: 1,
      unit: "project",
      rate: 2500,
      total: 2500
    },
    {
      name: "Custom Cabinetry Installation",
      description: "Supply and install custom kitchen cabinets",
      quantity: 15,
      unit: "linear ft",
      rate: 180,
      total: 2700
    },
    {
      name: "Granite Countertops",
      description: "Template, fabricate and install granite countertops",
      quantity: 45,
      unit: "sq ft",
      rate: 85,
      total: 3825
    },
    {
      name: "Electrical Work",
      description: "Update electrical for new layout and appliances",
      quantity: 1,
      unit: "project",
      rate: 1800,
      total: 1800
    },
    {
      name: "Flooring Installation",
      description: "Install luxury vinyl plank flooring",
      quantity: 200,
      unit: "sq ft",
      rate: 12,
      total: 2400
    }
  ],
  totals = {
    subtotal: 13225,
    tax: 1058,
    total: 14283
  },
  terms = [
    "50% deposit required upon contract signing",
    "Progress payments due at completion of each phase",
    "Final payment due upon project completion and approval",
    "All materials and labor guaranteed for 2 years",
    "Change orders must be approved in writing",
    "Quote valid for 30 days from issue date"
  ],
  validUntil = "February 28, 2024",
  quoteNumber = "QT-2024-001"
}: QuoteTemplateProps) => {
    const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'header', type: 'header', title: 'Header', order: 0 },
      { id: 'client-project-info', type: 'client-project-info', title: 'Client & Project', order: 1 },
      { id: 'services-table', type: 'services-table', title: 'Services Table', order: 2 },
      { id: 'terms', type: 'terms', title: 'Terms & Conditions', order: 3 },
      { id: 'footer', type: 'footer', title: 'Footer', order: 4 }
    ]
  });

  const { getBackgroundOverlayStyles } = editor;
  return (
    <div className={editor.getContainerClasses("max-w-4xl mx-auto p-8 bg-background text-foreground min-h-screen")}>
       <div className="template-container" style={{ position: 'relative' }}>
         {editor.backgroundImage && (
          <div style={getBackgroundOverlayStyles()} />
        )}
        <TemplateEditor {...editor} />
      {/* Header */}
      <Card 
        className={editor.getSectionClasses("mb-6 p-6 border-2 border-orange-200 dark:border-orange-800 bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950 dark:to-yellow-950", "header")}
        {...editor.getSectionProps("header", "header")}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-500 rounded-full">
              <HardHat className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-900 dark:text-orange-100">{companyName}</h1>
              <p className="text-orange-700 dark:text-orange-300 font-medium">Professional Construction Services</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2 bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
            Quote #{quoteNumber}
          </Badge>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Phone className="h-4 w-4" />
            <span>{contactInfo.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <Mail className="h-4 w-4" />
            <span>{contactInfo.email}</span>
          </div>
          <div className="flex items-center gap-2 text-orange-700 dark:text-orange-300">
            <MapPin className="h-4 w-4" />
            <span>{contactInfo.address}</span>
          </div>
        </div>
      </Card>

      {/* Client and Project Info */}
      <div 
        className={editor.getSectionClasses("grid md:grid-cols-2 gap-6 mb-6", "client-project-info")}
        {...editor.getSectionProps("client-project-info", "client-project-info")}
      >
        <Card className="p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Client Information</h2>
          </div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Name:</span> {clientInfo.name}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Company:</span> {clientInfo.company}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Address:</span> {clientInfo.address}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Phone:</span> {clientInfo.phone}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Email:</span> {clientInfo.email}</p>
          </div>
        </Card>

        <Card className="p-6 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <Building className="h-5 w-5 text-green-600 dark:text-green-400" />
            <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Project Details</h2>
          </div>
          <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Project:</span> {projectDetails.title}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Description:</span> {projectDetails.description}</p>
            <p><span className="font-medium text-slate-900 dark:text-slate-100">Location:</span> {projectDetails.location}</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Start Date:</span> {projectDetails.startDate}
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium text-slate-900 dark:text-slate-100">Duration:</span> {projectDetails.duration}
            </div>
          </div>
        </Card>
      </div>

      {/* Services Table */}
      <Card 
        className={editor.getSectionClasses("mb-6 p-6 bg-white dark:bg-slate-800", "services-table")}
        {...editor.getSectionProps("services-table", "services-table")}
      >
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-xl font-semibold text-foreground dark:text-slate-100">Services & Materials</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 dark:bg-slate-700/50">
                <th className="text-left p-3 font-medium text-slate-700 dark:text-slate-200">Service/Item</th>
                <th className="text-center p-3 font-medium text-slate-700 dark:text-slate-200">Qty</th>
                <th className="text-center p-3 font-medium text-slate-700 dark:text-slate-200">Unit</th>
                <th className="text-right p-3 font-medium text-slate-700 dark:text-slate-200">Rate</th>
                <th className="text-right p-3 font-medium text-slate-700 dark:text-slate-200">Total</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr key={index} className="border-b dark:border-slate-700 hover:bg-muted/30 dark:hover:bg-muted/50">
                  <td className="p-3">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{service.name}</p>
                      <p className="text-muted-foreground dark:text-slate-400 text-xs">{service.description}</p>
                    </div>
                  </td>
                  <td className="text-center p-3 text-slate-700 dark:text-slate-300">{service.quantity}</td>
                  <td className="text-center p-3 text-slate-700 dark:text-slate-300">{service.unit}</td>
                  <td className="text-right p-3 text-slate-700 dark:text-slate-300">${service.rate.toLocaleString()}</td>
                  <td className="text-right p-3 font-medium text-slate-900 dark:text-slate-100">${service.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Separator className="my-4 dark:bg-slate-700" />

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-64 space-y-2 text-slate-800 dark:text-slate-200">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${totals.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%):</span>
              <span>${totals.tax.toLocaleString()}</span>
            </div>
            <Separator className="dark:bg-slate-700" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-green-600 dark:text-green-400">${totals.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Terms and Conditions */}
      <Card 
        className={editor.getSectionClasses("mb-6 p-6 bg-white dark:bg-slate-800", "terms")}
        {...editor.getSectionProps("terms", "terms")}
      >
        <h2 className="text-xl font-semibold text-foreground dark:text-slate-100 mb-4">Terms & Conditions</h2>
        <ul className="space-y-2 text-sm">
          {terms.map((term, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-orange-500 dark:text-orange-400 font-bold">•</span>
              <span className="text-slate-700 dark:text-slate-300">{term}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Footer */}
      <Card 
        className={editor.getSectionClasses("p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 dark:from-slate-900 dark:to-slate-950 dark:border-slate-800", "footer")}
        {...editor.getSectionProps("footer", "footer")}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Quote valid until: <span className="font-medium text-slate-700 dark:text-slate-200">{validUntil}</span>
            </p>
            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-1">
              Thank you for considering {companyName} for your construction needs.
            </p>
          </div>
          <div className="text-right">
            <p className="font-medium text-slate-800 dark:text-slate-200">Ready to get started?</p>
            <p className="text-sm text-muted-foreground dark:text-slate-400">Contact us to schedule a consultation</p>
          </div>
        </div>
      </Card>
      </div>
    </div>
  );
};

export default ConstructionTemplate9; 