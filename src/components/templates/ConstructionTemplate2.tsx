import React from 'react';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Building2, Calendar, DollarSign, FileText, Phone, Mail, MapPin, Hammer, Users, Clock } from 'lucide-react';

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
  category: string;
}

interface ProjectPhase {
  id: string;
  name: string;
  duration: string;
  items: QuoteItem[];
}

interface CompanyInfo {
  name: string;
  logo?: string;
  address: string;
  phone: string;
  email: string;
  license: string;
  website: string;
}

interface ClientInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface QuoteData {
  quoteNumber: string;
  date: string;
  validUntil: string;
  projectTitle: string;
  projectType: string;
  company: CompanyInfo;
  client: ClientInfo;
  phases: ProjectPhase[];
  terms: string[];
  paymentTerms: string;
  timeline: string;
  notes: string;
}

interface ConstructionQuoteTemplateProps {
  data?: QuoteData;
}

const ConstructionQuoteTemplate: React.FC<ConstructionQuoteTemplateProps> = ({
  data = {
    quoteNumber: "CQ-2024-001",
    date: "2024-01-15",
    validUntil: "2024-02-15",
    projectTitle: "Modern Kitchen Renovation",
    projectType: "Residential Renovation",
    company: {
      name: "Premier Construction Co.",
      address: "123 Builder's Lane, Construction City, CC 12345",
      phone: "(555) 123-4567",
      email: "quotes@premierconstruction.com",
      license: "License #CC-2024-789",
      website: "www.premierconstruction.com"
    },
    client: {
      name: "John & Sarah Smith",
      address: "456 Homeowner St, Residential Area, RA 67890",
      phone: "(555) 987-6543",
      email: "smithfamily@email.com"
    },
    phases: [
      {
        id: "phase1",
        name: "Demolition & Preparation",
        duration: "3-5 days",
        items: [
          {
            id: "1",
            description: "Kitchen cabinet removal and disposal",
            quantity: 1,
            unit: "lot",
            unitPrice: 800,
            total: 800,
            category: "Demolition"
          },
          {
            id: "2",
            description: "Flooring removal (tile and subfloor prep)",
            quantity: 200,
            unit: "sq ft",
            unitPrice: 3.50,
            total: 700,
            category: "Demolition"
          }
        ]
      },
      {
        id: "phase2",
        name: "Electrical & Plumbing",
        duration: "4-6 days",
        items: [
          {
            id: "3",
            description: "Electrical rough-in for new layout",
            quantity: 1,
            unit: "lot",
            unitPrice: 1200,
            total: 1200,
            category: "Electrical"
          },
          {
            id: "4",
            description: "Plumbing rough-in for island sink",
            quantity: 1,
            unit: "lot",
            unitPrice: 950,
            total: 950,
            category: "Plumbing"
          }
        ]
      },
      {
        id: "phase3",
        name: "Installation & Finishing",
        duration: "10-14 days",
        items: [
          {
            id: "5",
            description: "Custom cabinet installation",
            quantity: 1,
            unit: "lot",
            unitPrice: 8500,
            total: 8500,
            category: "Cabinetry"
          },
          {
            id: "6",
            description: "Quartz countertop installation",
            quantity: 45,
            unit: "sq ft",
            unitPrice: 85,
            total: 3825,
            category: "Countertops"
          },
          {
            id: "7",
            description: "Luxury vinyl plank flooring",
            quantity: 200,
            unit: "sq ft",
            unitPrice: 12,
            total: 2400,
            category: "Flooring"
          }
        ]
      }
    ],
    terms: [
      "All materials and labor included as specified",
      "Permits and inspections included in quoted price",
      "Work area will be protected and cleaned daily",
      "Any changes to scope will require written approval",
      "Final payment due upon completion and client approval"
    ],
    paymentTerms: "30% deposit, 40% at rough-in completion, 30% upon final completion",
    timeline: "Total project duration: 3-4 weeks from start date",
    notes: "Quote includes all materials, labor, permits, and cleanup. Appliances not included."
  }
}) => {
  const calculatePhaseTotal = (phase: ProjectPhase): number => {
    return phase.items.reduce((sum, item) => sum + item.total, 0);
  };

  const calculateGrandTotal = (): number => {
    return data.phases.reduce((sum, phase) => sum + calculatePhaseTotal(phase), 0);
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-background p-8 print:p-0">
      <div className="max-w-4xl mx-auto bg-white shadow-lg print:shadow-none">
        {/* Geometric Header Pattern */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-700">
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full" viewBox="0 0 100 20" preserveAspectRatio="none">
                <defs>
                  <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100" height="20" fill="url(#grid)" />
              </svg>
            </div>
          </div>
          
          {/* Header Content */}
          <div className="relative z-10 p-8 text-white">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{data.company.name}</h1>
                  <p className="text-slate-200">{data.company.license}</p>
                </div>
              </div>
              <div className="text-right">
                <h2 className="text-2xl font-semibold">CONSTRUCTION QUOTE</h2>
                <p className="text-slate-200">#{data.quoteNumber}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Company & Client Information */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Building2 className="w-5 h-5 mr-2 text-slate-600" />
              Company Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.company.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.company.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.company.email}</span>
              </div>
              <div className="flex items-center">
                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.company.website}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="w-5 h-5 mr-2 text-slate-600" />
              Client Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="font-medium">{data.client.name}</div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.client.address}</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.client.phone}</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-slate-500" />
                <span>{data.client.email}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Project Details */}
        <div className="px-8 pb-6">
          <Card className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-semibold text-slate-700 mb-2">Project Details</h3>
                <p className="text-lg font-medium">{data.projectTitle}</p>
                <Badge variant="secondary" className="mt-1">
                  <Hammer className="w-3 h-3 mr-1" />
                  {data.projectType}
                </Badge>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Quote Date
                </h3>
                <p>{new Date(data.date).toLocaleDateString()}</p>
                <p className="text-sm text-slate-600">Valid until: {new Date(data.validUntil).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-700 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Timeline
                </h3>
                <p className="text-sm">{data.timeline}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Project Phases and Line Items */}
        <div className="px-8 pb-6">
          <h3 className="text-xl font-semibold mb-6">Project Breakdown</h3>
          
          {data.phases.map((phase, phaseIndex) => (
            <Card key={phase.id} className="mb-6">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-800">
                      Phase {phaseIndex + 1}: {phase.name}
                    </h4>
                    <p className="text-sm text-slate-600">Duration: {phase.duration}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">{formatCurrency(calculatePhaseTotal(phase))}</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-2 font-medium text-slate-700">Description</th>
                        <th className="text-center py-2 font-medium text-slate-700">Qty</th>
                        <th className="text-center py-2 font-medium text-slate-700">Unit</th>
                        <th className="text-right py-2 font-medium text-slate-700">Unit Price</th>
                        <th className="text-right py-2 font-medium text-slate-700">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {phase.items.map((item) => (
                        <tr key={item.id} className="border-b border-slate-100">
                          <td className="py-3">
                            <div>
                              <span className="font-medium">{item.description}</span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {item.category}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-center py-3">{item.quantity}</td>
                          <td className="text-center py-3">{item.unit}</td>
                          <td className="text-right py-3">{formatCurrency(item.unitPrice)}</td>
                          <td className="text-right py-3 font-medium">{formatCurrency(item.total)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Total Summary */}
        <div className="px-8 pb-6">
          <Card className="p-6 bg-slate-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">Project Total</h3>
                <p className="text-sm text-slate-600">All phases included</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-slate-800 flex items-center">
                  <DollarSign className="w-6 h-6 mr-1" />
                  {formatCurrency(calculateGrandTotal()).replace('$', '')}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Payment Terms */}
        <div className="px-8 pb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-slate-600" />
              Payment Terms
            </h3>
            <p className="text-sm">{data.paymentTerms}</p>
          </Card>
        </div>

        {/* Terms and Conditions */}
        <div className="px-8 pb-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Terms & Conditions</h3>
            <ul className="space-y-2 text-sm">
              {data.terms.map((term, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-2 h-2 bg-slate-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Notes */}
        {data.notes && (
          <div className="px-8 pb-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Additional Notes</h3>
              <p className="text-sm text-slate-700">{data.notes}</p>
            </Card>
          </div>
        )}

        {/* Signature Section */}
        <div className="px-8 pb-8">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-6">Acceptance & Signatures</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium mb-4">Client Acceptance</h4>
                <div className="space-y-4">
                  <div>
                    <div className="border-b border-slate-300 h-8 mb-2"></div>
                    <p className="text-xs text-slate-600">Client Signature</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-300 h-8 mb-2"></div>
                    <p className="text-xs text-slate-600">Date</p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-4">Company Representative</h4>
                <div className="space-y-4">
                  <div>
                    <div className="border-b border-slate-300 h-8 mb-2"></div>
                    <p className="text-xs text-slate-600">Authorized Signature</p>
                  </div>
                  <div>
                    <div className="border-b border-slate-300 h-8 mb-2"></div>
                    <p className="text-xs text-slate-600">Date</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className="bg-slate-100 p-6 text-center text-sm text-slate-600">
          <p>Thank you for considering {data.company.name} for your construction project.</p>
          <p className="mt-1">Questions? Contact us at {data.company.phone} or {data.company.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ConstructionQuoteTemplate; 