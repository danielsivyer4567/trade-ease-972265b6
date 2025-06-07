import React, { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, Calendar, FileText, MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface GridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  squares?: Array<[x: number, y: number]>;
  strokeDasharray?: string;
  className?: string;
  [key: string]: unknown;
}

function GridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = "0",
  squares,
  className,
  ...props
}: GridPatternProps) {
  const id = useId();

  return (
    <svg
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
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
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" strokeWidth={0} fill={`url(#${id})`} />
      {squares && (
        <svg x={x} y={y} className="overflow-visible">
          {squares.map(([x, y]) => (
            <rect
              strokeWidth="0"
              key={`${x}-${y}`}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
            />
          ))}
        </svg>
      )}
    </svg>
  );
}

interface QuoteItem {
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface ConstructionQuoteTemplateProps {
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
  clientName?: string;
  clientAddress?: string;
  projectTitle?: string;
  quoteNumber?: string;
  quoteDate?: string;
  validUntil?: string;
  items?: QuoteItem[];
  subtotal?: number;
  taxRate?: number;
  tax?: number;
  total?: number;
  notes?: string;
}

const ConstructionTemplate5 = ({
  companyName = "BuildCraft Construction",
  companyAddress = "123 Construction Ave, Builder City, BC 12345",
  companyPhone = "(555) 123-4567",
  companyEmail = "info@buildcraft.com",
  clientName = "John Smith",
  clientAddress = "456 Residential St, Home Town, HT 67890",
  projectTitle = "Kitchen Renovation Project",
  quoteNumber = "QT-2024-005",
  quoteDate = "March 15, 2024",
  validUntil = "April 15, 2024",
  items = [
    {
      description: "Demolition of existing kitchen cabinets and countertops",
      quantity: 1,
      unit: "job",
      unitPrice: 2500,
      total: 2500
    },
    {
      description: "Custom kitchen cabinets installation",
      quantity: 15,
      unit: "linear ft",
      unitPrice: 180,
      total: 2700
    },
    {
      description: "Granite countertop supply and installation",
      quantity: 45,
      unit: "sq ft",
      unitPrice: 85,
      total: 3825
    },
    {
      description: "Electrical work - new outlets and lighting",
      quantity: 1,
      unit: "job",
      unitPrice: 1800,
      total: 1800
    },
    {
      description: "Plumbing modifications",
      quantity: 1,
      unit: "job",
      unitPrice: 1200,
      total: 1200
    },
    {
      description: "Flooring installation (luxury vinyl plank)",
      quantity: 200,
      unit: "sq ft",
      unitPrice: 12,
      total: 2400
    },
    {
      description: "Paint and finishing work",
      quantity: 1,
      unit: "job",
      unitPrice: 800,
      total: 800
    }
  ],
  subtotal = 15225,
  taxRate = 8.5,
  tax = 1294.13,
  total = 16519.13,
  notes = "This quote is valid for 30 days. A 50% deposit is required to begin work. All materials are included in the quoted prices. Timeline: 3-4 weeks upon project commencement."
}: ConstructionQuoteTemplateProps) => {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="2 4"
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "opacity-20"
        )}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto p-8 space-y-6">
        {/* Header */}
        <Card className="border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-primary flex items-center gap-2">
                  <Building2 className="h-8 w-8" />
                  {companyName}
                </CardTitle>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {companyAddress}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {companyPhone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {companyEmail}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold text-primary">QUOTE</h1>
                <div className="mt-4 space-y-1 text-sm">
                  <div><strong>Quote #:</strong> {quoteNumber}</div>
                  <div><strong>Date:</strong> {quoteDate}</div>
                  <div><strong>Valid Until:</strong> {validUntil}</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Client Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bill To:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-semibold">{clientName}</div>
                <div className="text-sm text-muted-foreground">{clientAddress}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold">{projectTitle}</div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="font-semibold">Description</TableHead>
                  <TableHead className="text-center font-semibold">Qty</TableHead>
                  <TableHead className="text-center font-semibold">Unit</TableHead>
                  <TableHead className="text-right font-semibold">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-center">{item.unit}</TableCell>
                    <TableCell className="text-right">${item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium">${item.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Totals */}
        <div className="flex justify-end">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold text-primary">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Terms & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{notes}</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card className="border-primary/20">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Thank you for considering {companyName} for your construction needs.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              We look forward to working with you on this project.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionTemplate5; 