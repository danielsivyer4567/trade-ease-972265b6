import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  ArrowLeft, Upload, FilePlus, FileText, BarChartBig, Paperclip, 
  Palette, Settings, CheckCircle, Layers, Search, Download, 
  MessageSquare, Filter, FileSignature, Send, User, Clock, HardHat
} from "lucide-react";
import ConstructionTemplate2 from "@/components/templates/ConstructionTemplate2";
import ConstructionTemplate3 from "@/components/templates/ConstructionTemplate3";
import ConstructionTemplate4 from "@/components/templates/ConstructionTemplate4";
import ConstructionTemplate5 from "@/components/templates/ConstructionTemplate5";
import ConstructionTemplate6 from "@/components/templates/ConstructionTemplate6";
import ConstructionTemplate7 from "@/components/templates/ConstructionTemplate7";
import ConstructionTemplate8 from "@/components/templates/ConstructionTemplate8";
import ConstructionTemplate9 from "@/components/templates/ConstructionTemplate9";
import { useToast } from "@/hooks/use-toast";
import { templateStorageService } from "@/services/templateStorageService";
import { CustomerForm } from "./components/CustomerForm";
import { QuoteItemsForm, QuoteItem } from "./components/QuoteItemsForm";
import { PriceListForm } from "./components/PriceListForm";
import { TermsForm } from "./components/TermsForm";
import { QuotePreview } from "./components/QuotePreview";
import { FinalPreview } from "./components/FinalPreview";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { ErrorBoundary } from "react-error-boundary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocuSealWrapper } from './components/DocuSealWrapper';
import { createSignatureRequest } from '@/services/docuSealService';
import { QuoteBuilder } from "./components/QuoteBuilder";

// Template Preview Component
const TemplatePreview: React.FC<{ template: any }> = ({ template }) => {
  // For custom templates with background images
  if (template.special === "supabase-template" && template.templateData?.backgroundImageUrl) {
    return (
      <div className="h-40 w-full overflow-hidden relative bg-gray-100">
        <img 
          src={template.templateData.backgroundImageUrl} 
          alt={template.name} 
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-white text-center">
            <h3 className="text-lg font-bold">{template.templateData.projectName || template.name}</h3>
            <p className="text-sm opacity-90">Custom Template</p>
          </div>
        </div>
      </div>
    );
  }

  // For construction templates, render scaled-down versions showing full layout
  if (template.special === "advanced-construction") {
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.25] origin-top-left" style={{width: '400%', height: '400%'}}>
          {/* Header */}
          <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-700 text-white p-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Professional Construction Co.</h1>
              <p className="text-lg">License #CC-2024-789</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold">CONSTRUCTION QUOTE</h2>
              <p className="text-lg">#CQ-2024-001</p>
            </div>
          </div>
          
          {/* Company and Client Info */}
          <div className="grid grid-cols-2 gap-6 p-6 bg-gray-50">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-3">Company Information</h3>
              <div className="space-y-2 text-sm">
                <p>📍 123 Builder's Lane, Construction City</p>
                <p>📞 (555) 123-4567</p>
                <p>✉️ quotes@construction.com</p>
                <p>🌐 www.construction.com</p>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-3">Client Information</h3>
              <div className="space-y-2 text-sm">
                <p>John & Sarah Smith</p>
                <p>📍 456 Homeowner St, Residential Area</p>
                <p>📞 (555) 987-6543</p>
                <p>✉️ smithfamily@email.com</p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-3 gap-6 p-6">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Project Details</h3>
              <p className="text-2xl font-bold mt-2">Kitchen Renovation</p>
              <p className="text-sm text-gray-600">🏠 Residential Renovation</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Quote Date</h3>
              <p className="text-lg mt-2">15/01/2024</p>
              <p className="text-sm text-gray-600">Valid until: 15/02/2024</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold">Timeline</h3>
              <p className="text-sm mt-2">Total project duration: 3-4 weeks</p>
              <p className="text-sm text-gray-600">from start date</p>
            </div>
          </div>

          {/* Project Breakdown */}
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Project Breakdown</h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-gray-100 p-4 border-b flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-bold">Phase 1: Demolition & Preparation</h3>
                  <p className="text-sm text-gray-600">Duration: 3-5 days</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$1,500.00</p>
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-4 gap-4 text-sm font-semibold text-gray-700">
                  <span>Description</span>
                  <span>Qty</span>
                  <span>Unit Price</span>
                  <span>Total</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 8) { // ConstructionTemplate2
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
          {/* Geometric header */}
          <div className="h-32 bg-gradient-to-r from-slate-800 to-slate-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full transform translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500 rounded-full transform -translate-x-24 translate-y-24 opacity-20"></div>
            <div className="relative z-10 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Construction Quote</h1>
                <p className="text-lg opacity-90">Professional Template</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">#CQ-2024-002</p>
                <p className="text-sm">January 2024</p>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          <div className="p-6 bg-gray-50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-sm mb-2">Client Details</h3>
                <div className="text-xs space-y-1">
                  <p>Smith Family</p>
                  <p>Residential Project</p>
                  <p>Kitchen & Bath Renovation</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-sm mb-2">Project Timeline</h3>
                <div className="text-xs space-y-1">
                  <p>Duration: 4-6 weeks</p>
                  <p>Start: Feb 2024</p>
                  <p>Completion: Mar 2024</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-bold text-sm mb-3">Project Phases</h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-blue-50 p-3 rounded text-center">
                  <p className="text-xs font-semibold">Phase 1</p>
                  <p className="text-xs">Preparation</p>
                  <p className="text-xs font-bold text-blue-600">$2,500</p>
                </div>
                <div className="bg-green-50 p-3 rounded text-center">
                  <p className="text-xs font-semibold">Phase 2</p>
                  <p className="text-xs">Construction</p>
                  <p className="text-xs font-bold text-green-600">$8,500</p>
                </div>
                <div className="bg-orange-50 p-3 rounded text-center">
                  <p className="text-xs font-semibold">Phase 3</p>
                  <p className="text-xs">Finishing</p>
                  <p className="text-xs font-bold text-orange-600">$3,200</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Total Project Cost</h3>
                <p className="text-2xl font-bold text-green-600">$14,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 9) { // ConstructionTemplate3
    return (
      <div className="h-40 w-full overflow-hidden relative bg-gray-100">
        <div className="absolute inset-0 transform scale-[0.25] origin-top-left" style={{width: '400%', height: '400%'}}>
          {/* Background with overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-800"></div>
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          
          {/* Content overlay */}
          <div className="relative z-10 p-8 text-white">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-2">Custom Build Template</h1>
              <p className="text-xl">Drag & Drop • Background Images • Live Preview</p>
            </div>
            
            {/* Form sections preview */}
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 p-4 rounded">
                  <h3 className="font-bold mb-2">Project Information</h3>
                  <div className="space-y-2">
                    <div className="bg-white bg-opacity-30 h-4 rounded"></div>
                    <div className="bg-white bg-opacity-30 h-4 rounded w-3/4"></div>
                    <div className="bg-white bg-opacity-30 h-4 rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded">
                  <h3 className="font-bold mb-2">Measurements</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white bg-opacity-30 h-4 rounded"></div>
                    <div className="bg-white bg-opacity-30 h-4 rounded"></div>
                    <div className="bg-white bg-opacity-30 h-4 rounded"></div>
                    <div className="bg-white bg-opacity-30 h-4 rounded"></div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-white bg-opacity-20 p-4 rounded">
                  <h3 className="font-bold mb-2">Materials & Labor</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <div className="bg-white bg-opacity-30 h-3 rounded flex-1 mr-2"></div>
                      <div className="bg-white bg-opacity-30 h-3 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="bg-white bg-opacity-30 h-3 rounded flex-1 mr-2"></div>
                      <div className="bg-white bg-opacity-30 h-3 rounded w-16"></div>
                    </div>
                    <div className="flex justify-between">
                      <div className="bg-white bg-opacity-30 h-3 rounded flex-1 mr-2"></div>
                      <div className="bg-white bg-opacity-30 h-3 rounded w-16"></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white bg-opacity-20 p-4 rounded">
                  <h3 className="font-bold mb-2">Total Estimate</h3>
                  <div className="text-center">
                    <div className="bg-white bg-opacity-30 h-8 rounded w-32 mx-auto"></div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Control indicators */}
            <div className="mt-8 flex justify-center space-x-4">
              <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
              <div className="w-4 h-4 bg-green-400 rounded-full"></div>
              <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
              <div className="w-4 h-4 bg-purple-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 10) { // ConstructionTemplate4
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
          {/* Orange themed construction quote with animations */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full transform translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 rounded-full transform -translate-x-24 translate-y-24 opacity-20"></div>
            <div className="relative z-10 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">BuilderPro Construction</h1>
                <p className="text-lg opacity-90">Animated • Interactive • Modern</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">#QT-2024-004</p>
                <p className="text-sm">January 2024</p>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          <div className="grid grid-cols-2 gap-8 p-8 bg-orange-50">
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
              <h3 className="text-lg font-bold mb-3 text-orange-800">Client Details</h3>
              <div className="space-y-2 text-sm">
                <p>John & Sarah Smith</p>
                <p>📍 Residential Project</p>
                <p>📞 (555) 987-6543</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
              <h3 className="text-lg font-bold mb-3 text-orange-800">Project Info</h3>
              <div className="space-y-2 text-sm">
                <p>Custom Home Construction</p>
                <p>🏗️ 2,500 sq ft</p>
                <p>📅 Start: March 2024</p>
              </div>
            </div>
          </div>

          {/* Services table */}
          <div className="mx-8 mb-8 bg-white rounded-lg shadow-lg overflow-hidden border border-orange-200">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4">
              <h3 className="text-lg font-bold">Project Breakdown</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-orange-100">
                  <span className="font-medium">Foundation & Excavation</span>
                  <span className="text-orange-600 font-bold">$15,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-orange-100">
                  <span className="font-medium">Framing & Structure</span>
                  <span className="text-orange-600 font-bold">$45,000</span>
                </div>
                <div className="flex justify-between py-2 border-b border-orange-100">
                  <span className="font-medium">Finishing Work</span>
                  <span className="text-orange-600 font-bold">$30,000</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-orange-300 font-bold text-lg">
                  <span>Total Project Cost</span>
                  <span className="text-orange-600">$97,200</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 11) { // ConstructionTemplate5
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
          {/* Grid pattern construction quote */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <svg className="w-full h-full stroke-white/40">
                <pattern id="grid5" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" strokeDasharray="2 4"/>
                </pattern>
                <rect width="100%" height="100%" fill="url(#grid5)" />
              </svg>
            </div>
            <div className="relative z-10 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">BuildCraft Construction</h1>
                <p className="text-lg opacity-90">Grid Pattern • Professional • Clean</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">QUOTE</p>
                <p className="text-sm">#QT-2024-005</p>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          <div className="grid grid-cols-2 gap-8 p-8 bg-gray-50">
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-bold mb-3 text-blue-700">Bill To</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">John Smith</p>
                <p>📍 456 Residential St</p>
                <p>Home Town, HT 67890</p>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border">
              <h3 className="text-lg font-bold mb-3 text-blue-700">Project Details</h3>
              <div className="space-y-2 text-sm">
                <p className="font-medium">Kitchen Renovation</p>
                <p>🏗️ Complete remodel</p>
                <p>📅 3-4 weeks timeline</p>
              </div>
            </div>
          </div>

          {/* Services table */}
          <div className="mx-8 mb-8 bg-white rounded-lg shadow overflow-hidden border">
            <div className="bg-blue-600 text-white p-4">
              <h3 className="text-lg font-bold">Quote Details</h3>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Demolition work</span>
                  <span className="text-blue-600 font-bold">$2,500</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Cabinet installation</span>
                  <span className="text-blue-600 font-bold">$2,700</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Countertop installation</span>
                  <span className="text-blue-600 font-bold">$3,825</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="font-medium">Electrical work</span>
                  <span className="text-blue-600 font-bold">$1,800</span>
                </div>
                <div className="flex justify-between py-3 border-t-2 border-blue-300 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-blue-600">$16,519</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 12) { // ConstructionTemplate6
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
          {/* Orange bordered construction quote with dot patterns */}
          <div className="relative border-4 border-orange-500 bg-white h-full">
            {/* Dot pattern background */}
            <div className="absolute inset-0 opacity-10">
              <svg className="w-full h-full fill-orange-500/20">
                <pattern id="dots6" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="4" r="0.5" />
                </pattern>
                <rect width="100%" height="100%" fill="url(#dots6)" />
              </svg>
            </div>

            {/* Corner decorations */}
            <div className="absolute -left-2 -top-2 h-4 w-4 bg-orange-500"></div>
            <div className="absolute -bottom-2 -left-2 h-4 w-4 bg-orange-500"></div>
            <div className="absolute -right-2 -top-2 h-4 w-4 bg-orange-500"></div>
            <div className="absolute -bottom-2 -right-2 h-4 w-4 bg-orange-500"></div>

            <div className="relative z-10 p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-orange-500 rounded"></div>
                  <h1 className="text-3xl font-bold text-gray-900">CONSTRUCTION QUOTE</h1>
                </div>
                <div className="bg-orange-100 border border-orange-500 rounded px-4 py-1 w-fit mx-auto">
                  <span className="text-orange-600 font-medium">Professional Estimate</span>
                </div>
              </div>

              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div className="bg-orange-50 border border-orange-200 rounded p-6">
                  <h3 className="text-lg font-bold mb-3 text-orange-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    From
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">BuildCraft Construction Co.</p>
                    <p>📍 123 Builder Street</p>
                    <p>📞 (555) 123-4567</p>
                  </div>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded p-6">
                  <h3 className="text-lg font-bold mb-3 text-orange-800 flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    To
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p className="font-medium">John Smith</p>
                    <p>📍 456 Client Avenue</p>
                    <p>📞 (555) 987-6543</p>
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="bg-white border border-orange-200 rounded p-6 mb-8">
                <h3 className="text-lg font-bold mb-4 text-orange-800 flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded"></div>
                  Project: Kitchen Renovation
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <p><span className="font-medium">Quote #:</span> QT-2024-006</p>
                  <p><span className="font-medium">Date:</span> March 15, 2024</p>
                </div>
              </div>

              {/* Quote Items */}
              <div className="bg-white border border-orange-200 rounded overflow-hidden mb-8">
                <div className="bg-orange-500 text-white p-4">
                  <h3 className="text-lg font-bold">Quote Breakdown</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-orange-100">
                      <span className="font-medium">Demolition work</span>
                      <span className="text-orange-600 font-bold">$2,500</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-100">
                      <span className="font-medium">Cabinet installation (20 ft)</span>
                      <span className="text-orange-600 font-bold">$7,000</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-100">
                      <span className="font-medium">Countertop installation</span>
                      <span className="text-orange-600 font-bold">$3,825</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-orange-100">
                      <span className="font-medium">Electrical work</span>
                      <span className="text-orange-600 font-bold">$1,800</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-orange-300 font-bold text-lg">
                      <span>Total</span>
                      <span className="text-orange-600">$20,223</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="text-center">
                <div className="flex justify-center gap-4">
                  <button className="bg-orange-500 text-white px-6 py-2 rounded font-medium">
                    Accept Quote
                  </button>
                  <button className="border border-orange-500 text-orange-500 px-6 py-2 rounded font-medium">
                    Request Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 13) { // ConstructionTemplate7
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.25] origin-top-left" style={{width: '400%', height: '400%'}}>
          {/* Hard hat construction quote with color-coded sections */}
          <div className="bg-gray-50">
            {/* Header */}
            <div className="p-6 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <div className="h-6 w-6 text-white flex items-center justify-center">🏗️</div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-orange-900">BuildCraft Construction</h1>
                    <p className="text-orange-700 font-medium">Professional Services • Licensed & Insured</p>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-800 rounded px-4 py-2">
                  <span className="text-lg font-semibold">Quote #QT-2024-007</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-orange-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>info@buildcraft.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>123 Construction Ave</span>
                </div>
              </div>
            </div>

            {/* Client and Project Info */}
            <div className="grid grid-cols-2 gap-6 p-8">
              <div className="bg-white border rounded p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <h2 className="text-lg font-semibold text-blue-700">Client Information</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">John Smith</span></p>
                  <p>Smith Properties LLC</p>
                  <p>📍 456 Client Street</p>
                  <p>📞 (555) 987-6543</p>
                </div>
              </div>

              <div className="bg-white border rounded p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <h2 className="text-lg font-semibold text-green-700">Project Details</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Residential Kitchen Renovation</span></p>
                  <p>🏗️ Complete remodel</p>
                  <p>📅 Start: March 15, 2024</p>
                  <p>⏱️ Duration: 6-8 weeks</p>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div className="mx-8 mb-8 bg-white border rounded border-l-4 border-purple-500">
              <div className="bg-purple-100 text-purple-800 p-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <h2 className="text-lg font-semibold">Services & Materials</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Demolition & Prep Work</p>
                      <p className="text-xs text-gray-500">Remove existing cabinets and prep area</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Custom Cabinetry (15 linear ft)</p>
                      <p className="text-xs text-gray-500">Supply and install custom cabinets</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,700</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Granite Countertops (45 sq ft)</p>
                      <p className="text-xs text-gray-500">Template, fabricate and install</p>
                    </div>
                    <span className="text-purple-600 font-bold">$3,825</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Electrical Work</p>
                      <p className="text-xs text-gray-500">Update electrical for new layout</p>
                    </div>
                    <span className="text-purple-600 font-bold">$1,800</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Flooring Installation (200 sq ft)</p>
                      <p className="text-xs text-gray-500">Luxury vinyl plank flooring</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,400</span>
                  </div>
                  
                  <div className="border-t-2 border-purple-300 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Project Cost</span>
                      <span className="text-green-600">$14,283</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 14) { // ConstructionTemplate8
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.25] origin-top-left" style={{width: '400%', height: '400%'}}>
          {/* Hard hat construction quote with color-coded sections */}
          <div className="bg-gray-50">
            {/* Header */}
            <div className="p-6 border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-orange-500 rounded-full">
                    <div className="h-6 w-6 text-white flex items-center justify-center">🏗️</div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-orange-900">BuildCraft Construction</h1>
                    <p className="text-orange-700 font-medium">Professional Services • Licensed & Insured</p>
                  </div>
                </div>
                <div className="bg-orange-100 text-orange-800 rounded px-4 py-2">
                  <span className="text-lg font-semibold">Quote #QT-2024-008</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm text-orange-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>info@buildcraft.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-700 rounded"></div>
                  <span>123 Construction Ave</span>
                </div>
              </div>
            </div>

            {/* Client and Project Info */}
            <div className="grid grid-cols-2 gap-6 p-8">
              <div className="bg-white border rounded p-6 border-l-4 border-blue-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-blue-600 rounded"></div>
                  <h2 className="text-lg font-semibold text-blue-700">Client Information</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">John Smith</span></p>
                  <p>Smith Properties LLC</p>
                  <p>📍 456 Client Street</p>
                  <p>📞 (555) 987-6543</p>
                </div>
              </div>

              <div className="bg-white border rounded p-6 border-l-4 border-green-500">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-green-600 rounded"></div>
                  <h2 className="text-lg font-semibold text-green-700">Project Details</h2>
                </div>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Residential Kitchen Renovation</span></p>
                  <p>🏗️ Complete remodel</p>
                  <p>📅 Start: March 15, 2024</p>
                  <p>⏱️ Duration: 6-8 weeks</p>
                </div>
              </div>
            </div>

            {/* Services Table */}
            <div className="mx-8 mb-8 bg-white border rounded border-l-4 border-purple-500">
              <div className="bg-purple-100 text-purple-800 p-4 flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <h2 className="text-lg font-semibold">Services & Materials</h2>
              </div>
              
              <div className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Demolition & Prep Work</p>
                      <p className="text-xs text-gray-500">Remove existing cabinets and prep area</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,500</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Custom Cabinetry (15 linear ft)</p>
                      <p className="text-xs text-gray-500">Supply and install custom cabinets</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,700</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Granite Countertops (45 sq ft)</p>
                      <p className="text-xs text-gray-500">Template, fabricate and install</p>
                    </div>
                    <span className="text-purple-600 font-bold">$3,825</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Electrical Work</p>
                      <p className="text-xs text-gray-500">Update electrical for new layout</p>
                    </div>
                    <span className="text-purple-600 font-bold">$1,800</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-medium">Flooring Installation (200 sq ft)</p>
                      <p className="text-xs text-gray-500">Luxury vinyl plank flooring</p>
                    </div>
                    <span className="text-purple-600 font-bold">$2,400</span>
                  </div>
                  
                  <div className="border-t-2 border-purple-300 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total Project Cost</span>
                      <span className="text-green-600">$14,283</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (template.id === 15) { // ConstructionTemplate9
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
          {/* Hard hat construction quote with color-coded sections */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full transform translate-x-32 -translate-y-32 opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-500 rounded-full transform -translate-x-24 translate-y-24 opacity-20"></div>
            <div className="relative z-10 p-8 text-white flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold">Hard Hat Theme Quote</h1>
                <p className="text-lg opacity-90">A professional, themed construction quote with a hard hat icon and dark mode support.</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">#QT-2024-009</p>
                <p className="text-sm">January 2024</p>
              </div>
            </div>
          </div>
          
          {/* Content sections */}
          <div className="p-6 bg-gray-50 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-sm mb-2">Client Details</h3>
                <div className="text-xs space-y-1">
                  <p>John & Sarah Smith</p>
                  <p>📍 456 Client Avenue</p>
                  <p>📞 (555) 987-6543</p>
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow">
                <h3 className="font-bold text-sm mb-2">Project Details</h3>
                <div className="text-xs space-y-1">
                  <p>Custom Home Construction</p>
                  <p>🏗️ 2,500 sq ft</p>
                  <p>📅 Start: March 2024</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg">Total Project Cost</h3>
                <p className="text-2xl font-bold text-green-600">$14,200</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default preview for other templates or as a fallback
  return (
    <div className="h-40 w-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center p-4">
      <div className="text-center">
        <FileText className="h-8 w-8 text-slate-500 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">{template.name}</h3>
        <p className="text-xs text-slate-500">{template.category}</p>
      </div>
    </div>
  );
};

const baseTemplates = [
  { 
    id: 8, 
    name: 'Geometric Construction Quote', 
    component: ConstructionTemplate2, 
    category: 'Construction', 
    tags: ['construction', 'modern', 'quote'],
    price: 'Free',
    description: 'A modern construction quote with geometric patterns and a clean layout.'
  },
  { 
    id: 9, 
    name: 'Custom Builder Template', 
    component: ConstructionTemplate3, 
    category: 'Construction', 
    tags: ['construction', 'customizable', 'drag-and-drop'],
    price: 'Free',
    description: 'A highly customizable construction template with drag-and-drop features and live preview.'
  },
  { 
    id: 10, 
    name: 'Animated Construction Quote', 
    component: ConstructionTemplate4, 
    category: 'Construction',
    tags: ['construction', 'animated', 'interactive'],
    price: 'Free',
    description: 'An engaging construction quote with shimmer text effects and animations.'
  },
  { 
    id: 11, 
    name: 'Grid Pattern Construction Quote', 
    component: ConstructionTemplate5, 
    category: 'Construction',
    tags: ['construction', 'grid', 'professional'],
    price: 'Free',
    description: 'A professional construction quote using a grid pattern and clean typography.'
  },
  { 
    id: 12, 
    name: 'Dot Pattern Construction Quote', 
    component: ConstructionTemplate6, 
    category: 'Construction',
    tags: ['construction', 'modern', 'minimalist'],
    price: 'Free',
    description: 'A modern construction quote with dot patterns and a card-based layout.'
  },
  { 
    id: 13, 
    name: 'Hard Hat Construction Quote', 
    component: ConstructionTemplate7, 
    category: 'Construction',
    tags: ['construction', 'themed', 'professional'],
    price: 'Free',
    description: 'A construction-themed quote with a hard hat icon and color-coded sections.'
  },
  { 
    id: 14, 
    name: 'Phased Construction Quote', 
    component: ConstructionTemplate8, 
    category: 'Construction',
    tags: ['construction', 'phased', 'detailed'],
    price: 'Free',
    description: 'A detailed construction quote broken down by project phases.'
  },
  { 
    id: 15, 
    name: 'Hard Hat Theme Quote', 
    component: ConstructionTemplate9, 
    category: 'Construction',
    tags: ['construction', 'themed', 'dark-mode'],
    price: 'Free',
    description: 'A professional, themed construction quote with a hard hat icon and dark mode support.'
  },
];

const popularTags = [
  { id: 'new', name: 'New', color: 'bg-green-100 text-green-800' },
  { id: 'popular', name: 'Popular', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'premium', name: 'Premium', color: 'bg-pink-100 text-pink-800' },
  { id: 'free', name: 'Free', color: 'bg-blue-100 text-blue-800' },
];

const templateCategories = [
  {
    name: 'My Templates',
    icon: User,
    color: 'text-blue-500',
  },
  {
    name: 'Construction',
    icon: HardHat,
    color: 'text-orange-500',
  },
];

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'My Templates': return 'border-blue-500';
    case 'Construction': return 'border-orange-500';
    default: return 'border-gray-300';
  }
};

const getCategoryIcon = (category: string) => {
  const cat = templateCategories.find(c => c.name === category);
  return cat ? cat.icon : FileText;
};

const getAllCategories = (templates: any[]) => {
  const categories = templates.map(t => t.category);
  const uniqueCategories = [...new Set(categories)];
  return ['All Templates', 'My Templates', ...uniqueCategories];
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <Button onClick={resetErrorBoundary}>Try again</Button>
    </div>
  );
}

const QuotesMain = () => {
  const [activeSection, setActiveSection] = useState('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customer, setCustomer] = useState(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [terms, setTerms] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeCategory, setActiveCategory] = useState('All Templates');
  const [searchTerm, setSearchTerm] = useState('');
  const [popularTag, setPopularTag] = useState<string | null>(null);
  const [filteredTemplates, setFilteredTemplates] = useState(baseTemplates);
  const [allTemplates, setAllTemplates] = useState(baseTemplates);
  const [categories, setCategories] = useState(getAllCategories(baseTemplates));
  const [signingUrl, setSigningUrl] = useState('');
  const [showDocuSeal, setShowDocuSeal] = useState(false);
  const [documentSigned, setDocumentSigned] = useState(false);

  useEffect(() => {
    const loadTemplatesAndCategories = async () => {
      const result = await templateStorageService.loadTemplates();
      let loadedTemplates: any[] = [];
      if (result.success && result.templates) {
        loadedTemplates = result.templates;
      }
      const combinedTemplates = [
        ...baseTemplates,
        ...loadedTemplates.map(t => ({...t, special: "supabase-template"}))
      ];
      setAllTemplates(combinedTemplates);
      setCategories(getAllCategories(combinedTemplates));
    };

    loadTemplatesAndCategories();
  }, []);

  useEffect(() => {
    let newFilteredTemplates = allTemplates;

    if (activeCategory && activeCategory !== 'All Templates') {
      newFilteredTemplates = newFilteredTemplates.filter(t => t.category === activeCategory);
    }
    
    if (searchTerm) {
      newFilteredTemplates = newFilteredTemplates.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (popularTag) {
      if (popularTag === 'free') {
        newFilteredTemplates = newFilteredTemplates.filter(t => t.price === 'Free');
      } else {
        newFilteredTemplates = newFilteredTemplates.filter(t => t.tags.includes(popularTag));
      }
    }

    setFilteredTemplates(newFilteredTemplates);
  }, [activeCategory, searchTerm, popularTag, allTemplates]);

  const handleBack = () => {
    setActiveSection('templates');
    setSelectedTemplate(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleAddPriceListItem = (item: any) => {
    const newQuoteItem: QuoteItem = {
      description: item.name,
      quantity: 1, // Default quantity
      rate: item.price,
      total: item.price,
    };
    setQuoteItems([...quoteItems, newQuoteItem]);
  };

  const handleSaveQuote = () => {
    // Logic to save the quote
    console.log("Quote saved!");
  };

  const handleSendQuote = () => {
    // Logic to send the quote
    console.log("Quote sent!");
  };

  const handleUseTemplate = (template?: any) => {
    if (template) {
      setSelectedTemplate(template);
      setActiveSection('editor');
    } else {
      // Logic for creating a blank quote
      setSelectedTemplate({ id: 'blank', name: 'Blank Quote', component: () => <div>Blank Quote</div> });
      setActiveSection('quote-builder');
    }
  };

  const handleFinalizeQuote = (details: { customer: any; items: QuoteItem[]; terms: string[] }) => {
    setCustomer(details.customer);
    setQuoteItems(details.items);
    setTerms(details.terms);
    setActiveSection('preview');
  };

  const handleDeleteTemplate = async (template: any) => {
    if (template.special !== "supabase-template") {
      alert("You can only delete your custom templates.");
      return;
    }
    
    const isConfirmed = window.confirm(`Are you sure you want to delete "${template.name}"?`);
    if (isConfirmed) {
      const result = await templateStorageService.deleteTemplate(template.id);
      if (result.success) {
        alert("Template deleted successfully!");
        // Refresh templates
        const loadTemplatesAndCategories = async () => {
          const result = await templateStorageService.loadTemplates();
          let loadedTemplates: any[] = [];
          if (result.success && result.templates) {
            loadedTemplates = result.templates;
          }
          const combinedTemplates = [
            ...baseTemplates,
            ...loadedTemplates.map(t => ({...t, special: "supabase-template"}))
          ];
          setAllTemplates(combinedTemplates);
          setCategories(getAllCategories(combinedTemplates));
        };
        loadTemplatesAndCategories();
      } else {
        alert(`Error deleting template: ${result.error}`);
      }
    }
  };

  const { toast } = useToast();

  const handleRequestSignature = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Error",
        description: "No template selected.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const response = await createSignatureRequest(
        selectedTemplate.id, 
        customer.email, 
        {...customer, items: quoteItems, terms: terms }
      );
      
      if (response && response.signingUrl) {
        setSigningUrl(response.signingUrl);
        setShowDocuSeal(true);
        toast({
          title: "Signature Request Created",
          description: `The document is ready to be signed.`,
        });
      } else {
        throw new Error('Failed to create signature request.');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Could not create signature request: ${error.message}`,
        variant: "destructive",
      });
    }
  };
  
  const handleDocumentSigned = () => {
    toast({
      title: "Document Signed!",
      description: "The quote has been signed successfully.",
    });
  };

  const renderActiveSection = () => {
    switch(activeSection) {
      case 'templates':
        return renderTemplateGallery();
      case 'editor':
        return renderQuoteEditor();
      case 'quote-builder':
        return <QuoteBuilder template={selectedTemplate} onBack={() => setActiveSection('templates')} onFinalize={handleFinalizeQuote} />;
      case 'preview':
        return <FinalPreview 
          template={selectedTemplate}
          customer={customer} 
          items={quoteItems} 
          terms={terms}
          onBack={() => setActiveSection('quote-builder')} 
          onSave={handleSaveQuote}
          onSend={handleSendQuote}
          onRequestSignature={handleRequestSignature}
          signingUrl={signingUrl}
          documentSigned={documentSigned}
          onDocumentSigned={handleDocumentSigned}
        />;
      default:
        return renderTemplateGallery();
    }
  };

  const renderTemplateGallery = () => {
      return (
        <div className="h-full flex flex-col">
          <header className="p-6 border-b flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Template Gallery</h1>
              <p className="text-muted-foreground">Select a template to start your quote</p>
            </div>
          </header>
          <div className="flex flex-1 overflow-hidden">
            <aside className="w-64 border-r p-6 overflow-y-auto">
              <h2 className="text-lg font-semibold mb-4">Categories</h2>
              <ul>
                {categories.map((category) => {
                  const Icon = getCategoryIcon(category);
                  return (
                    <li key={category} className="mb-2">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${activeCategory === category ? 'bg-accent text-accent-foreground' : ''}`}
                        onClick={() => setActiveCategory(category)}
                      >
                        <Icon className={`mr-2 h-4 w-4 ${getCategoryColor(category).replace('border-', 'text-')}`} />
                        {category}
                      </Button>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Popular Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map(tag => (
                    <Badge
                      key={tag.id}
                      className={`cursor-pointer ${popularTag === tag.id ? 'ring-2 ring-primary' : ''} ${tag.color}`}
                      onClick={() => setPopularTag(popularTag === tag.id ? null : tag.id)}
                    >
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </aside>
            <main className="flex-1 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="relative">
                  <Input 
                    placeholder="Search templates..." 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div>
                {filteredTemplates.length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-lg font-semibold">No templates found</p>
                    <p className="text-muted-foreground">Try adjusting your search or filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map(template => (
                      <Card key={template.id} className="group overflow-hidden">
                        <CardHeader className="p-0">
                          <TemplatePreview template={template} />
                        </CardHeader>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center mb-2">
                            <Badge variant="outline" className={`text-xs ${getCategoryColor(template.category)}`}>{template.category}</Badge>
                            <span className="text-sm font-semibold">{template.price}</span>
                          </div>
                          <h3 className="font-semibold">{template.name}</h3>
                        </CardContent>
                        <CardFooter className="p-4 bg-muted/30">
                          <Button 
                            variant="ghost" 
                            className="w-full"
                            onClick={() => handleUseTemplate(template)}
                          >
                            Preview
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      );
    };

  const renderQuoteEditor = () => {
    if (!selectedTemplate) {
      return (
        <div className="p-8 text-center">
          <p>No template selected. Please go back to the gallery.</p>
          <Button onClick={handleBack} className="mt-4">Back to Gallery</Button>
        </div>
      );
    }

    const TemplateComponent = selectedTemplate.component;

    return (
      <div className="h-full flex flex-col">
        <header className="p-4 border-b bg-white dark:bg-slate-900 sticky top-0 z-20 flex justify-between items-center no-print">
          <div>
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Gallery
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-lg font-semibold">{selectedTemplate.name}</h2>
            <p className="text-sm text-muted-foreground">Template Preview</p>
          </div>
          <div>
            <Button onClick={() => setActiveSection('quote-builder')} className="bg-green-600 hover:bg-green-700 text-white">
              <FilePlus className="mr-2 h-4 w-4" />
              Use This Template
            </Button>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto">
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <TemplateComponent />
          </ErrorBoundary>
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="h-full">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          {renderActiveSection()}
        </ErrorBoundary>
      </div>
    </AppLayout>
  );
};

export default QuotesMain;
