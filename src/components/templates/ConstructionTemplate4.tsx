"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useId } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  Share2, 
  Palette, 
  Type, 
  AlignLeft,
  Bold,
  Italic,
  Underline,
  Quote,
  List,
  Hash,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  Building2,
  User,
  Sparkles,
  Edit3,
  Settings,
  X,
  Plus,
  Copy,
  Trash2,
  Move
} from "lucide-react";
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

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
        "pointer-events-none absolute inset-0 h-full w-full fill-orange-500/20",
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

interface TextShimmerProps {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
}

function TextShimmer({
  children,
  as: Component = 'p',
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion(Component as any);

  const dynamicSpread = React.useMemo(() => {
    return children.length * spread;
  }, [children, spread]);

  return (
    <MotionComponent
      className={cn(
        'relative inline-block bg-[length:250%_100%,auto] bg-clip-text',
        'text-transparent [--base-color:#a1a1aa] [--base-gradient-color:#000]',
        '[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))] [background-repeat:no-repeat,padding-box]',
        'dark:[--base-color:#71717a] dark:[--base-gradient-color:#ffffff] dark:[--bg:linear-gradient(90deg,#0000_calc(50%-var(--spread)),var(--base-gradient-color),#0000_calc(50%+var(--spread)))]',
        className
      )}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{
        repeat: Infinity,
        duration,
        ease: 'linear',
      }}
      style={
        {
          '--spread': `${dynamicSpread}px`,
          backgroundImage: `var(--bg), linear-gradient(var(--base-color), var(--base-color))`,
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

interface QuoteTemplateProps {
  companyName?: string;
  companyLogo?: string;
  clientName?: string;
  projectTitle?: string;
  quoteNumber?: string;
  date?: string;
  validUntil?: string;
  items?: QuoteItem[];
  notes?: string;
  terms?: string;
  contactInfo?: ContactInfo;
  colors?: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
  website: string;
}

const defaultItems: QuoteItem[] = [
  {
    id: "1",
    description: "Foundation & Excavation Work",
    quantity: 1,
    unit: "lot",
    unitPrice: 15000,
    total: 15000
  },
  {
    id: "2", 
    description: "Concrete & Masonry",
    quantity: 2500,
    unit: "sq ft",
    unitPrice: 12,
    total: 30000
  },
  {
    id: "3",
    description: "Framing & Structural Work",
    quantity: 1,
    unit: "lot",
    unitPrice: 45000,
    total: 45000
  },
  {
    id: "4",
    description: "Roofing Installation",
    quantity: 3000,
    unit: "sq ft",
    unitPrice: 8,
    total: 24000
  },
  {
    id: "5",
    description: "Electrical & Plumbing",
    quantity: 1,
    unit: "lot",
    unitPrice: 25000,
    total: 25000
  },
  {
    id: "6",
    description: "Interior Finishing",
    quantity: 2200,
    unit: "sq ft",
    unitPrice: 15,
    total: 33000
  }
];

const defaultContactInfo: ContactInfo = {
  address: "123 Construction Ave, Builder City, BC 12345",
  phone: "(555) 123-4567",
  email: "quotes@builderpro.com",
  website: "www.builderpro.com"
};

function ConstructionTemplate4({
  companyName = "BuilderPro Construction",
  clientName = "John & Sarah Smith",
  projectTitle = "Custom Home Construction - 2,500 sq ft",
  quoteNumber = "QT-2024-001",
  date = new Date().toLocaleDateString(),
  validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  items = defaultItems,
  notes = "This quote includes all materials and labor for the specified construction work. Permits and inspections are included. Timeline estimated at 8-12 months depending on weather conditions.",
  terms = "50% deposit required to begin work. Progress payments due at completion of each major phase. Final payment due upon completion and final inspection.",
  contactInfo = defaultContactInfo,
  colors = {
    primary: "#ea580c",
    secondary: "#fed7aa", 
    accent: "#fb923c"
  }
}: QuoteTemplateProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editableData, setEditableData] = useState({
    companyName,
    clientName,
    projectTitle,
    quoteNumber,
    items,
    notes,
    terms
  });

  const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'header', type: 'header', title: 'Header', order: 0 },
      { id: 'client-project-info', type: 'client-project-info', title: 'Client & Project', order: 1 },
      { id: 'items-table', type: 'items-table', title: 'Items Table', order: 2 },
      { id: 'totals', type: 'totals', title: 'Totals', order: 3 },
      { id: 'notes-terms', type: 'notes-terms', title: 'Notes & Terms', order: 4 },
      { id: 'footer', type: 'footer', title: 'Footer', order: 5 },
    ]
  });
  
  const { getBackgroundOverlayStyles } = editor;

  const subtotal = editableData.items.reduce((sum, item) => sum + item.total, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleItemChange = (id: string, field: keyof QuoteItem, value: any) => {
    setEditableData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updated.total = updated.quantity * updated.unitPrice;
          }
          return updated;
        }
        return item;
      })
    }));
  };

  const addItem = () => {
    const newItem: QuoteItem = {
      id: Date.now().toString(),
      description: "New Item",
      quantity: 1,
      unit: "each",
      unitPrice: 0,
      total: 0
    };
    setEditableData(prev => ({
      ...prev,
      items: [...prev.items, newItem]
    }));
  };

  const removeItem = (id: string) => {
    setEditableData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }));
  };

  return (
    <div className={editor.getContainerClasses("min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8")}>
      <DotPattern width={20} height={20} className="opacity-30 dark:opacity-10" />
      
      <div className="relative z-10 max-w-4xl mx-auto template-container" style={{ position: 'relative' }}>
        {editor.backgroundImage && (
          <div style={getBackgroundOverlayStyles()} />
        )}
        <TemplateEditor {...editor} />
        {/* Header Controls */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-4 justify-between items-center mb-8 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-xl border border-orange-200 dark:border-slate-700 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-orange-600" />
            <TextShimmer 
              className="text-xl font-bold text-orange-800 dark:text-orange-200"
              duration={3}
            >
              Construction Quote Generator
            </TextShimmer>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="gap-2 bg-white/80 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
            >
              <Type className="h-4 w-4" />
              {isEditing ? "Preview" : "Edit"}
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-white/80 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600">
              <Download className="h-4 w-4" />
              Export PDF
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-white/80 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Quote Document */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-4 border-orange-500 dark:border-orange-500 overflow-hidden"
          style={{ 
            boxShadow: `0 0 0 4px ${colors.primary}, 0 25px 50px -12px rgba(0, 0, 0, 0.25)` 
          }}
        >
          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-8 h-8 bg-orange-500" />
          <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500" />
          <div className="absolute bottom-0 left-0 w-8 h-8 bg-orange-500" />
          <div className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500" />

          <div className="relative p-8 md:p-12">
            {/* Header */}
            <div 
              className={editor.getSectionClasses("flex flex-col md:flex-row justify-between items-start mb-12 pb-8 border-b-2 border-orange-200 dark:border-orange-800", "header")}
              {...editor.getSectionProps("header", "header")}
            >
              <div className="mb-6 md:mb-0">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-white" />
                  </div>
                  {isEditing ? (
                    <Input
                      value={editableData.companyName}
                      onChange={(e) => setEditableData(prev => ({ ...prev, companyName: e.target.value }))}
                      className="text-2xl font-bold border-orange-300 focus:border-orange-500 dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                      {editableData.companyName}
                    </h1>
                  )}
                </div>
                
                <div className="space-y-2 text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <span>{contactInfo.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-500" />
                    <span>{contactInfo.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-500" />
                    <span>{contactInfo.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-orange-500" />
                    <span>{contactInfo.website}</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <h2 className="text-4xl font-bold text-orange-600 dark:text-orange-400 mb-4 flex items-center gap-2">
                  <Quote className="h-8 w-8" />
                  QUOTE
                </h2>
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">Quote #:</span>
                    {isEditing ? (
                      <Input
                        value={editableData.quoteNumber}
                        onChange={(e) => setEditableData(prev => ({ ...prev, quoteNumber: e.target.value }))}
                        className="w-32 text-sm dark:bg-slate-800 dark:border-slate-600 dark:text-white"
                      />
                    ) : (
                      <span>{editableData.quoteNumber}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">Date:</span>
                    <span>{date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-semibold">Valid Until:</span>
                    <span>{validUntil}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Client & Project Info */}
            <div 
              className={editor.getSectionClasses("grid md:grid-cols-2 gap-8 mb-8", "client-project-info")}
              {...editor.getSectionProps("client-project-info", "client-project-info")}
            >
              <div className="bg-orange-50 dark:bg-slate-800 p-6 rounded-xl border border-orange-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  Quote For:
                </h3>
                {isEditing ? (
                  <Input
                    value={editableData.clientName}
                    onChange={(e) => setEditableData(prev => ({ ...prev, clientName: e.target.value }))}
                    className="text-lg font-medium dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{editableData.clientName}</p>
                )}
              </div>

              <div className="bg-orange-50 dark:bg-slate-800 p-6 rounded-xl border border-orange-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-orange-600" />
                  Project:
                </h3>
                {isEditing ? (
                  <Input
                    value={editableData.projectTitle}
                    onChange={(e) => setEditableData(prev => ({ ...prev, projectTitle: e.target.value }))}
                    className="text-lg font-medium dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                ) : (
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200">{editableData.projectTitle}</p>
                )}
              </div>
            </div>

            {/* Items Table */}
            <div 
              className={editor.getSectionClasses("mb-8", "items-table")}
              {...editor.getSectionProps("items-table", "items-table")}
            >
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <List className="h-5 w-5 text-orange-600" />
                Project Breakdown
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-orange-200 dark:border-orange-800 rounded-lg overflow-hidden">
                  <thead>
                    <tr className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                      <th className="border border-orange-300 dark:border-orange-700 p-4 text-left font-semibold">Description</th>
                      <th className="border border-orange-300 dark:border-orange-700 p-4 text-center font-semibold">Qty</th>
                      <th className="border border-orange-300 dark:border-orange-700 p-4 text-center font-semibold">Unit</th>
                      <th className="border border-orange-300 dark:border-orange-700 p-4 text-right font-semibold">Unit Price</th>
                      <th className="border border-orange-300 dark:border-orange-700 p-4 text-right font-semibold">Total</th>
                      {isEditing && <th className="border border-orange-300 dark:border-orange-700 p-4 text-center font-semibold">Actions</th>}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {editableData.items.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className={index % 2 === 0 ? "bg-orange-25 dark:bg-slate-800" : "bg-white dark:bg-slate-800/50"}
                        >
                          <td className="border border-orange-200 dark:border-orange-800 p-4">
                            {isEditing ? (
                              <Input
                                value={item.description}
                                onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                                className="w-full dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                            ) : (
                              <span className="font-medium text-gray-800 dark:text-gray-200">{item.description}</span>
                            )}
                          </td>
                          <td className="border border-orange-200 dark:border-orange-800 p-4 text-center">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                                className="w-20 text-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                            ) : (
                              <span className="dark:text-gray-300">{item.quantity.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="border border-orange-200 dark:border-orange-800 p-4 text-center">
                            {isEditing ? (
                              <Input
                                value={item.unit}
                                onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                                className="w-20 text-center dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                            ) : (
                              <span className="dark:text-gray-300">{item.unit}</span>
                            )}
                          </td>
                          <td className="border border-orange-200 dark:border-orange-800 p-4 text-right">
                            {isEditing ? (
                              <Input
                                type="number"
                                value={item.unitPrice}
                                onChange={(e) => handleItemChange(item.id, 'unitPrice', Number(e.target.value))}
                                className="w-24 text-right dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                              />
                            ) : (
                              <span className="dark:text-gray-300">${item.unitPrice.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="border border-orange-200 dark:border-orange-800 p-4 text-right font-semibold dark:text-gray-200">
                            ${item.total.toLocaleString()}
                          </td>
                          {isEditing && (
                            <td className="border border-orange-200 dark:border-orange-800 p-4 text-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                              >
                                Remove
                              </Button>
                            </td>
                          )}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {isEditing && (
                <Button
                  onClick={addItem}
                  className="mt-4 gap-2 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600"
                  variant="outline"
                >
                  <Building2 className="h-4 w-4" />
                  Add Item
                </Button>
              )}
            </div>

            {/* Totals */}
            <div 
              className={editor.getSectionClasses("flex justify-end mb-8", "totals")}
              {...editor.getSectionProps("totals", "totals")}
            >
              <div className="w-full md:w-96 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-slate-800 dark:to-slate-700 p-6 rounded-xl border-2 border-orange-200 dark:border-orange-700">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                    <span className="text-lg font-semibold dark:text-gray-100">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 dark:text-gray-300">Tax (8%):</span>
                    <span className="text-lg font-semibold dark:text-gray-100">${tax.toLocaleString()}</span>
                  </div>
                  <div className="border-t-2 border-orange-300 dark:border-orange-600 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Total:</span>
                      <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">${total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Notes & Terms */}
            <div 
              className={editor.getSectionClasses("grid md:grid-cols-2 gap-8", "notes-terms")}
              {...editor.getSectionProps("notes-terms", "notes-terms")}
            >
              <div className="bg-amber-50 dark:bg-slate-800 p-6 rounded-xl border border-amber-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Project Notes
                </h3>
                {isEditing ? (
                  <Textarea
                    value={editableData.notes}
                    onChange={(e) => setEditableData(prev => ({ ...prev, notes: e.target.value }))}
                    className="min-h-[120px] dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{editableData.notes}</p>
                )}
              </div>

              <div className="bg-amber-50 dark:bg-slate-800 p-6 rounded-xl border border-amber-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Terms & Conditions
                </h3>
                {isEditing ? (
                  <Textarea
                    value={editableData.terms}
                    onChange={(e) => setEditableData(prev => ({ ...prev, terms: e.target.value }))}
                    className="min-h-[120px] dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                  />
                ) : (
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{editableData.terms}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div 
              className={editor.getSectionClasses("mt-12 pt-8 border-t-2 border-orange-200 dark:border-orange-800 text-center", "footer")}
              {...editor.getSectionProps("footer", "footer")}
            >
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Thank you for considering {editableData.companyName} for your construction project.
              </p>
              <div className="flex items-center justify-center gap-2 text-orange-600 dark:text-orange-400">
                <Sparkles className="h-5 w-5" />
                <span className="font-semibold">Building Excellence, One Project at a Time</span>
                <Sparkles className="h-5 w-5" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ConstructionTemplate4; 