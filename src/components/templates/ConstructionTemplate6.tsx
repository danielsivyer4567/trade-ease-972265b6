"use client";
import React, { useId } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, MapPin, Phone, Mail, User, FileText, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

interface DotPatternProps {
  width?: any;
  height?: any;
  x?: any;
  y?: any;
  cx?: any;
  cy?: any;
  cr?: any;
  className?: string;
  [key: string]: any;
}

function DotPattern({
  width = 24,
  height = 24,
  x = 0,
  y = 0,
  cx = 1,
  cy = 0.5,
  cr = 0.5,
  className,
  ...props
}: DotPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-slate-500/20",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          patternContentUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <circle id="pattern-circle" cx={cx} cy={cy} r={cr} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
    </svg>
  );
}

interface QuoteItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

interface ConstructionQuoteProps {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  clientName?: string;
  clientAddress?: string;
  clientPhone?: string;
  projectTitle?: string;
  projectLocation?: string;
  quoteNumber?: string;
  quoteDate?: string;
  validUntil?: string;
  items?: QuoteItem[];
  subtotal?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

function ConstructionTemplate6({
  companyName = "BuildCraft Construction Co.",
  companyAddress = "123 Builder Street, Construction City, CC 12345",
  companyPhone = "(555) 123-4567",
  companyEmail = "info@buildcraft.com",
  clientName = "John Smith",
  clientAddress = "456 Client Avenue, Project Town, PT 67890",
  clientPhone = "(555) 987-6543",
  projectTitle = "Kitchen Renovation Project",
  projectLocation = "456 Client Avenue, Project Town, PT 67890",
  quoteNumber = "QT-2024-006",
  quoteDate = "March 15, 2024",
  validUntil = "April 15, 2024",
  items = [
    {
      description: "Demolition of existing kitchen cabinets and countertops",
      quantity: 1,
      unitPrice: 2500,
      total: 2500
    },
    {
      description: "Custom kitchen cabinet installation (20 linear feet)",
      quantity: 20,
      unitPrice: 350,
      total: 7000
    },
    {
      description: "Granite countertop installation",
      quantity: 45,
      unitPrice: 85,
      total: 3825
    },
    {
      description: "Electrical work - new outlets and lighting",
      quantity: 1,
      unitPrice: 1800,
      total: 1800
    },
    {
      description: "Plumbing - sink and dishwasher installation",
      quantity: 1,
      unitPrice: 1200,
      total: 1200
    },
    {
      description: "Flooring - luxury vinyl plank (300 sq ft)",
      quantity: 300,
      unitPrice: 8,
      total: 2400
    }
  ],
  subtotal = 18725,
  tax = 1498,
  total = 20223,
  notes = "This quote includes all materials and labor. Work will be completed within 3-4 weeks from start date. 50% deposit required to begin work."
}: ConstructionQuoteProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white dark:bg-zinc-900 min-h-screen">
      <div className="relative border-2 border-orange-500 p-8">
        <DotPattern width={8} height={8} className="fill-orange-500/10" />
        
        {/* Corner decorations */}
        <div className="absolute -left-1.5 -top-1.5 h-3 w-3 bg-orange-500" />
        <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 bg-orange-500" />
        <div className="absolute -right-1.5 -top-1.5 h-3 w-3 bg-orange-500" />
        <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 bg-orange-500" />

        <div className="relative z-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <Building2 className="w-8 h-8 text-orange-500" />
              <h1 className="text-3xl font-bold text-zinc-900 dark:text-white">
                CONSTRUCTION QUOTE
              </h1>
            </div>
            <Badge variant="outline" className="text-orange-500 border-orange-500 px-4 py-1">
              Professional Estimate
            </Badge>
          </div>

          {/* Company and Client Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Company Info */}
            <Card className="p-6 border-orange-200 dark:border-orange-800">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">From</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-zinc-900 dark:text-white">{companyName}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{companyAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{companyPhone}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{companyEmail}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Client Info */}
            <Card className="p-6 border-orange-200 dark:border-orange-800">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-orange-500" />
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-white">To</h3>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-zinc-900 dark:text-white">{clientName}</p>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{clientAddress}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-500" />
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">{clientPhone}</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Project Details */}
          <Card className="p-6 border-orange-200 dark:border-orange-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Project Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Project Title</p>
                  <p className="text-zinc-900 dark:text-white">{projectTitle}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Location</p>
                  <p className="text-zinc-900 dark:text-white">{projectLocation}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quote Number</p>
                  <p className="text-zinc-900 dark:text-white font-mono">{quoteNumber}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Quote Date</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-orange-500" />
                    <p className="text-zinc-900 dark:text-white">{quoteDate}</p>
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
                  Valid until: {validUntil}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Quote Items */}
          <Card className="p-6 border-orange-200 dark:border-orange-800">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Quote Breakdown</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-orange-200 dark:border-orange-800">
                      <th className="text-left py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Description</th>
                      <th className="text-center py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Qty</th>
                      <th className="text-right py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Unit Price</th>
                      <th className="text-right py-3 text-sm font-medium text-zinc-500 dark:text-zinc-400">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b border-zinc-100 dark:border-zinc-800">
                        <td className="py-3 text-sm text-zinc-900 dark:text-white">{item.description}</td>
                        <td className="py-3 text-sm text-center text-zinc-600 dark:text-zinc-400">{item.quantity}</td>
                        <td className="py-3 text-sm text-right text-zinc-600 dark:text-zinc-400">${item.unitPrice.toLocaleString()}</td>
                        <td className="py-3 text-sm text-right font-medium text-zinc-900 dark:text-white">${item.total.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Separator className="bg-orange-200 dark:bg-orange-800" />

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-400">Subtotal:</span>
                  <span className="font-medium text-zinc-900 dark:text-white">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-600 dark:text-zinc-400">Tax (8%):</span>
                  <span className="font-medium text-zinc-900 dark:text-white">${tax.toLocaleString()}</span>
                </div>
                <Separator className="bg-orange-200 dark:bg-orange-800" />
                <div className="flex justify-between items-center text-lg">
                  <span className="font-bold text-zinc-900 dark:text-white">Total:</span>
                  <span className="font-bold text-orange-500 text-xl">${total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card className="p-6 border-orange-200 dark:border-orange-800">
            <div className="space-y-4">
              <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Terms & Notes</h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{notes}</p>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4 pt-8">
            <div className="flex justify-center gap-4">
              <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                Accept Quote
              </Button>
              <Button variant="outline" className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950">
                Request Changes
              </Button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Thank you for considering {companyName} for your construction needs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConstructionTemplate6; 