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
  Wrench,
  Edit3,
  Settings,
  X,
  FileText,
  List,
  Hash
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

const ConstructionTemplate7 = ({
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
  quoteNumber = "QT-2024-007"
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
    <div className={editor.getContainerClasses("max-w-4xl mx-auto p-8 bg-background min-h-screen")}>
      <div className="template-container" style={{ position: 'relative' }}>
        {editor.backgroundImage && (
          <div style={getBackgroundOverlayStyles()} />
        )}
        <TemplateEditor {...editor} />

        {/* Header */}
        <Card 
          className={editor.getSectionClasses("mb-6 p-6 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50", "header")}
          {...editor.getSectionProps("header", "header")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-500 rounded-full">
                <HardHat className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-orange-900">{companyName}</h1>
                <p className="text-orange-700 font-medium">Professional Construction Services</p>
              </div>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2 bg-orange-100 text-orange-800">
              Quote #{quoteNumber}
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-orange-700">
              <Phone className="h-4 w-4" />
              <span>{contactInfo.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-orange-700">
              <Mail className="h-4 w-4" />
              <span>{contactInfo.email}</span>
            </div>
            <div className="flex items-center gap-2 text-orange-700">
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
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-blue-600" />
              <h2 className="text-xl font-semibold text-foreground">Client Information</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {clientInfo.name}</p>
              <p><span className="font-medium">Company:</span> {clientInfo.company}</p>
              <p><span className="font-medium">Address:</span> {clientInfo.address}</p>
              <p><span className="font-medium">Phone:</span> {clientInfo.phone}</p>
              <p><span className="font-medium">Email:</span> {clientInfo.email}</p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-green-600" />
              <h2 className="text-xl font-semibold text-foreground">Project Details</h2>
            </div>
            <div className="space-y-2 text-sm">
              <p><span className="font-medium">Project:</span> {projectDetails.title}</p>
              <p><span className="font-medium">Description:</span> {projectDetails.description}</p>
              <p><span className="font-medium">Location:</span> {projectDetails.location}</p>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span className="font-medium">Start Date:</span> {projectDetails.startDate}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Duration:</span> {projectDetails.duration}
              </div>
            </div>
          </Card>
        </div>

        {/* Services Table */}
        <Card 
          className={editor.getSectionClasses("mb-6 p-6", "services-table")}
          {...editor.getSectionProps("services-table", "services-table")}
        >
          <div className="flex items-center gap-2 mb-4">
            <Wrench className="h-5 w-5 text-purple-600" />
            <h2 className="text-xl font-semibold text-foreground">Services & Materials</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-3 font-medium">Service/Item</th>
                  <th className="text-center p-3 font-medium">Qty</th>
                  <th className="text-center p-3 font-medium">Unit</th>
                  <th className="text-right p-3 font-medium">Rate</th>
                  <th className="text-right p-3 font-medium">Total</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={index} className="border-b hover:bg-muted/30">
                    <td className="p-3">
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-muted-foreground text-xs">{service.description}</p>
                      </div>
                    </td>
                    <td className="text-center p-3">{service.quantity}</td>
                    <td className="text-center p-3">{service.unit}</td>
                    <td className="text-right p-3">${service.rate.toLocaleString()}</td>
                    <td className="text-right p-3 font-medium">${service.total.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${totals.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8%):</span>
                <span>${totals.tax.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span className="text-green-600">${totals.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Terms and Conditions */}
        <Card 
          className={editor.getSectionClasses("mb-6 p-6", "terms")}
          {...editor.getSectionProps("terms", "terms")}
        >
          <h2 className="text-xl font-semibold text-foreground mb-4">Terms & Conditions</h2>
          <ul className="space-y-2 text-sm">
            {terms.map((term, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-orange-500 font-bold">•</span>
                <span>{term}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Footer */}
        <Card 
          className={editor.getSectionClasses("p-6 bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200", "footer")}
          {...editor.getSectionProps("footer", "footer")}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Quote valid until: <span className="font-medium">{validUntil}</span>
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Thank you for considering {companyName} for your construction needs.
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">Ready to get started?</p>
              <p className="text-sm text-muted-foreground">Contact us to schedule a consultation</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionTemplate7; 