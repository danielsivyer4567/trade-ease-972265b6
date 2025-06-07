import React, { useId } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building2, FileText, MapPin, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

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
  const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'header', type: 'header', title: 'Header', order: 0 },
      { id: 'client-info', type: 'client-info', title: 'Client Info', order: 1 },
      { id: 'items-table', type: 'items-table', title: 'Items Table', order: 2 },
      { id: 'totals', type: 'totals', title: 'Totals', order: 3 },
      { id: 'notes', type: 'notes', title: 'Notes', order: 4 },
      { id: 'footer', type: 'footer', title: 'Footer', order: 5 },
    ]
  });

  const { getBackgroundOverlayStyles } = editor;

  return (
    <div className={editor.getContainerClasses("min-h-screen bg-background dark:bg-slate-900 relative overflow-hidden")}>
      <GridPattern
        width={30}
        height={30}
        x={-1}
        y={-1}
        strokeDasharray="2 4"
        className={cn(
          "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
          "opacity-20 dark:opacity-10"
        )}
      />
      
      <div className="relative z-10 max-w-4xl mx-auto p-8 space-y-6 template-container" style={{ position: 'relative' }}>
        {editor.backgroundImage && (
          <div style={getBackgroundOverlayStyles()} />
        )}
        <TemplateEditor {...editor} />
        
        {/* Header */}
        <Card 
          className={editor.getSectionClasses("border-2 border-primary/20 dark:border-primary/40 bg-white dark:bg-slate-800", "header")}
          {...editor.getSectionProps("header", "header")}
        >
          <CardHeader className="bg-primary/5 dark:bg-primary/10">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold text-primary dark:text-blue-400 flex items-center gap-2">
                  <Building2 className="h-8 w-8" />
                  {companyName}
                </CardTitle>
                <div className="mt-4 space-y-1 text-sm text-muted-foreground dark:text-slate-400">
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
                <h1 className="text-4xl font-bold text-primary dark:text-blue-400">QUOTE</h1>
                <div className="mt-4 space-y-1 text-sm text-foreground dark:text-slate-200">
                  <div><strong>Quote #:</strong> {quoteNumber}</div>
                  <div><strong>Date:</strong> {quoteDate}</div>
                  <div><strong>Valid Until:</strong> {validUntil}</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Client Information */}
        <div 
          className={editor.getSectionClasses("grid md:grid-cols-2 gap-6", "client-info")}
          {...editor.getSectionProps("client-info", "client-info")}
        >
          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-foreground dark:text-slate-200">Bill To:</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <div className="font-semibold text-foreground dark:text-slate-100">{clientName}</div>
                <div className="text-sm text-muted-foreground dark:text-slate-400">{clientAddress}</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-slate-800">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 text-foreground dark:text-slate-200">
                <FileText className="h-5 w-5" />
                Project Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="font-semibold text-foreground dark:text-slate-100">{projectTitle}</div>
            </CardContent>
          </Card>
        </div>

        {/* Items Table */}
        <Card
          className={editor.getSectionClasses("bg-white dark:bg-slate-800", "items-table")}
          {...editor.getSectionProps("items-table", "items-table")}
        >
          <CardHeader>
            <CardTitle className="text-xl text-foreground dark:text-slate-100">Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 dark:bg-slate-700/50">
                  <TableHead className="font-semibold text-foreground dark:text-slate-200">Description</TableHead>
                  <TableHead className="text-center font-semibold text-foreground dark:text-slate-200">Qty</TableHead>
                  <TableHead className="text-center font-semibold text-foreground dark:text-slate-200">Unit</TableHead>
                  <TableHead className="text-right font-semibold text-foreground dark:text-slate-200">Unit Price</TableHead>
                  <TableHead className="text-right font-semibold text-foreground dark:text-slate-200">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item, index) => (
                  <TableRow key={index} className="dark:border-slate-700">
                    <TableCell className="font-medium text-foreground dark:text-slate-200">{item.description}</TableCell>
                    <TableCell className="text-center text-muted-foreground dark:text-slate-400">{item.quantity}</TableCell>
                    <TableCell className="text-center text-muted-foreground dark:text-slate-400">{item.unit}</TableCell>
                    <TableCell className="text-right text-muted-foreground dark:text-slate-400">${item.unitPrice.toLocaleString()}</TableCell>
                    <TableCell className="text-right font-medium text-foreground dark:text-slate-200">${item.total.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Totals */}
        <div 
          className={editor.getSectionClasses("flex justify-end", "totals")}
          {...editor.getSectionProps("totals", "totals")}
        >
          <Card className="w-full max-w-md bg-white dark:bg-slate-800">
            <CardContent className="p-6">
              <div className="space-y-3 text-foreground dark:text-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({taxRate}%):</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                <div className="border-t dark:border-slate-700 pt-3">
                  <div className="flex justify-between text-xl font-bold text-primary dark:text-blue-400">
                    <span>Total:</span>
                    <span>${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes */}
        <Card
          className={editor.getSectionClasses("bg-white dark:bg-slate-800", "notes")}
          {...editor.getSectionProps("notes", "notes")}
        >
          <CardHeader>
            <CardTitle className="text-lg text-foreground dark:text-slate-100">Terms & Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground dark:text-slate-400 leading-relaxed">{notes}</p>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card 
          className={editor.getSectionClasses("border-primary/20 dark:border-primary/40 bg-white dark:bg-slate-800", "footer")}
          {...editor.getSectionProps("footer", "footer")}
        >
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground dark:text-slate-400">
              Thank you for considering {companyName} for your construction needs.
            </p>
            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-2">
              We look forward to working with you on this project.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConstructionTemplate5; 