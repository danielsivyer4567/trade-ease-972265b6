import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { 
  ArrowLeft, Upload, FilePlus, FileText, BarChartBig, Paperclip, 
  Palette, Settings, CheckCircle, Layers, Search, Download, 
  MessageSquare, Filter, FileSignature, Send, User, Clock
} from "lucide-react";
import AdvancedConstructionQuote from "@/components/templates/AdvancedConstructionQuote";
import ConstructionTemplate2 from "@/components/templates/ConstructionTemplate2";
import ConstructionTemplate3 from "@/components/templates/ConstructionTemplate3";
import ConstructionTemplate4 from "@/components/templates/ConstructionTemplate4";
import ConstructionTemplate5 from "@/components/templates/ConstructionTemplate5";
import ConstructionTemplate6 from "@/components/templates/ConstructionTemplate6";
import ConstructionTemplate7 from "@/components/templates/ConstructionTemplate7";
import { useToast } from "@/hooks/use-toast";
import { templateStorageService } from "@/services/templateStorageService";
import { CustomerForm } from "./components/CustomerForm";
import { QuoteItemsForm, QuoteItem } from "./components/QuoteItemsForm";
import { PriceListForm } from "./components/PriceListForm";
import { TermsForm } from "./components/TermsForm";
import { QuotePreview } from "./components/QuotePreview";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { ErrorBoundary } from "react-error-boundary";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DocuSealWrapper } from './components/DocuSealWrapper';
import { createSignatureRequest } from '@/services/docuSealService';

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

  if (template.special === "construction-template-2") {
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

  if (template.special === "construction-template-3") {
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

  if (template.special === "construction-template-4") {
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

  if (template.special === "construction-template-5") {
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

  if (template.special === "construction-template-6") {
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

  if (template.special === "construction-template-7") {
    return (
      <div className="h-40 w-full overflow-hidden bg-white relative">
        <div className="absolute inset-0 transform scale-[0.3] origin-top-left" style={{width: '333%', height: '333%'}}>
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

  // For basic templates, create a generic preview
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Tech & IT": return "from-blue-500 to-purple-600";
      case "Business Services": return "from-green-500 to-teal-600";
      case "Finance & Insurance": return "from-yellow-500 to-orange-600";
      case "Real Estate": return "from-red-500 to-pink-600";
      case "Hospitality & Events": return "from-purple-500 to-indigo-600";
      case "Construction": return "from-orange-500 to-red-600";
      default: return "from-gray-500 to-slate-600";
    }
  };

  return (
    <div className={`h-40 w-full overflow-hidden relative bg-gradient-to-br ${getCategoryColor(template.category)}`}>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white text-center p-4">
        <div>
          <h3 className="text-lg font-bold mb-2">{template.name}</h3>
          <p className="text-sm opacity-90">{template.category}</p>
          <div className="mt-3">
            <div className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs">
              {template.price === 0 ? "Free" : `$${template.price}`}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Base templates for the template gallery
const baseTemplates = [
  { id: 1, name: "CRM Integration Proposal", category: "Tech & IT", imgUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070", price: 9.99 },
  { id: 2, name: "Consulting Proposal", category: "Business Services", imgUrl: "https://images.unsplash.com/photo-1600880292089-90a7e086ee0c?q=80&w=987", price: 9.99 },
  { id: 3, name: "Insurance Proposal", category: "Finance & Insurance", imgUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?q=80&w=2070", price: 9.99 },
  { id: 5, name: "Real Estate Agreement", category: "Real Estate", imgUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1973", price: 9.99 },
  { id: 6, name: "Catering Contract", category: "Hospitality & Events", imgUrl: "https://images.unsplash.com/photo-1465351230898-5de95d07f51a?q=80&w=2069", price: 9.99 },
  { id: 7, name: "Construction Template 1", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070", price: 0.00, special: "advanced-construction" },
  { id: 8, name: "Construction Template 2", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=2070", price: 0.00, special: "construction-template-2" },
  { id: 9, name: "Construction Template 3", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070", price: 0.00, special: "construction-template-3" },
  { id: 10, name: "Construction Template 4", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1590725175453-4ac5d2694b64?q=80&w=2070", price: 0.00, special: "construction-template-4" },
  { id: 11, name: "Construction Template 5", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=2070", price: 0.00, special: "construction-template-5" },
  { id: 12, name: "Construction Template 6", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=2070", price: 0.00, special: "construction-template-6" },
  { id: 13, name: "Construction Template 7", category: "Construction", imgUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070", price: 0.00, special: "construction-template-7" }
];

// Function to get all templates including custom ones
const getAllTemplates = async () => {
  try {
    // Load custom templates from Supabase
    const result = await templateStorageService.loadTemplates();
    if (result.success && result.templates) {
      // Convert Supabase templates to the expected format
      const supabaseTemplates = result.templates.map(template => ({
        id: template.id || Date.now(),
        name: template.name,
        category: template.category,
        imgUrl: template.backgroundImageUrl || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070",
        price: template.price,
        special: "supabase-template",
        templateData: template // Store the full template data
      }));
      return [...baseTemplates, ...supabaseTemplates];
    }
  } catch (error) {
    console.error('Error loading custom templates from Supabase:', error);
  }
  
  // Fallback to localStorage for backward compatibility
  const localTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
  return [...baseTemplates, ...localTemplates];
};

// Function to get all categories including My Templates if custom templates exist
const getAllCategories = (templates: any[]) => {
  const allCategories = Array.from(new Set(templates.map((t: any) => t.category)));
  
  // Sort categories to put "My Templates" first if it exists
  return allCategories.sort((a: any, b: any) => {
    if (a === "My Templates") return -1;
    if (b === "My Templates") return 1;
    return a.localeCompare(b);
  });
};

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="p-6 text-center">
      <h2 className="text-lg font-semibold text-red-600">Something went wrong:</h2>
      <pre className="mt-2 text-sm overflow-auto p-4 bg-gray-100 rounded">{error.message}</pre>
      <Button onClick={resetErrorBoundary} className="mt-4">Try again</Button>
    </div>
  );
}

const QuotesMain = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  // Check for template in URL parameters
  const urlParams = new URLSearchParams(location.search);
  const templateParam = urlParams.get('template');
  const [activeSection, setActiveSection] = useState("customer");
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([{
    description: "",
    quantity: 1,
    rate: 0,
    total: 0
  }]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [quoteLetterSpecs, setQuoteLetterSpecs] = useState("");
  const [requestForQuote, setRequestForQuote] = useState("");
  const [quoteName, setQuoteName] = useState("New Quote");
  const [showTemplates, setShowTemplates] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTemplateCategory, setSelectedTemplateCategory] = useState("All Categories");
  const [templates, setTemplates] = useState<any[]>(baseTemplates);
  const [categories, setCategories] = useState<string[]>(Array.from(new Set(baseTemplates.map(t => t.category))));
  
  // Load templates and categories when component mounts or when we return from a template
  useEffect(() => {
    const loadTemplatesAndCategories = async () => {
      try {
        const allTemplates = await getAllTemplates();
        setTemplates(allTemplates);
        setCategories(getAllCategories(allTemplates));
      } catch (error) {
        console.error('Error loading templates:', error);
        // Fallback to base templates
        setTemplates(baseTemplates);
        setCategories(Array.from(new Set(baseTemplates.map(t => t.category))));
      }
    };

    loadTemplatesAndCategories();
  }, [location]);
  
  // DocuSeal state
  const [showDocuSeal, setShowDocuSeal] = useState(false);
  const [signingUrl, setSigningUrl] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [documentSigned, setDocumentSigned] = useState(false);

  const handleBack = () => {
    navigate("/quotes");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles(prev => [...prev, ...newFiles]);

      // Create preview URLs for images
      const newPreviewUrls = newFiles.map(file => {
        if (file.type.startsWith('image/')) {
          return URL.createObjectURL(file);
        }
        return '';
      }).filter(url => url !== '');
      setPreviewImages(prev => [...prev, ...newPreviewUrls]);
      toast({
        title: "Files Uploaded",
        description: `${newFiles.length} file(s) added to quote`
      });
    }
  };

  const handleAddPriceListItem = (item: any) => {
    const newItem = {
      description: item.name,
      quantity: 1,
      rate: item.price,
      total: item.price
    };
    setQuoteItems([...quoteItems, newItem]);
    toast({
      title: "Item Added",
      description: `${item.name} has been added to your quote`
    });
  };

  const handleSaveQuote = () => {
    toast({
      title: "Quote Saved",
      description: "Quote has been saved successfully"
    });
  };

  const handleSendQuote = () => {
    toast({
      title: "Quote Sent",
      description: "Quote has been sent to the customer"
    });
    navigate("/quotes");
  };

  const handleUseTemplate = (template?: any) => {
    if (template && template.special === "advanced-construction") {
      // Navigate to Construction Template 1
      navigate('/quotes/new?template=advanced-construction');
    } else if (template && template.special === "construction-template-2") {
      // Navigate to Construction Template 2
      navigate('/quotes/new?template=construction-template-2');
    } else if (template && template.special === "construction-template-3") {
      // Navigate to Construction Template 3
      navigate('/quotes/new?template=construction-template-3');
    } else if (template && template.special === "construction-template-4") {
      // Navigate to Construction Template 4
      navigate('/quotes/new?template=construction-template-4');
    } else if (template && template.special === "construction-template-5") {
      // Navigate to Construction Template 5
      navigate('/quotes/new?template=construction-template-5');
    } else if (template && template.special === "construction-template-6") {
      // Navigate to Construction Template 6
      navigate('/quotes/new?template=construction-template-6');
    } else if (template && template.special === "construction-template-7") {
      // Navigate to Construction Template 7
      navigate('/quotes/new?template=construction-template-7');
    } else if (template && template.special === "supabase-template") {
      // Navigate to Construction Template 3 with Supabase template data
      // Store the template data in sessionStorage for the template to load
      sessionStorage.setItem('customTemplateData', JSON.stringify(template.templateData));
      navigate('/quotes/new?template=construction-template-3&custom=true');
    } else if (template && template.special === "custom-template") {
      // Navigate to Construction Template 3 with localStorage custom data (legacy)
      // Store the custom template data in sessionStorage for the template to load
      sessionStorage.setItem('customTemplateData', JSON.stringify(template.data));
      navigate('/quotes/new?template=construction-template-3&custom=true');
    } else {
      setShowTemplates(false);
      toast({
        title: "Template Selected",
        description: "Now customizing template for your quote"
      });
    }
  };

  const handleDeleteTemplate = async (template: any) => {
    if (!template || (template.special !== "supabase-template" && template.special !== "custom-template")) {
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(`Are you sure you want to delete "${template.name}"?\n\nThis action cannot be undone.`);
    if (!confirmed) return;

    try {
      if (template.special === "supabase-template") {
        // Delete from Supabase
        const result = await templateStorageService.deleteTemplate(template.id);
        if (!result.success) {
          throw new Error(result.error?.message || 'Failed to delete template');
        }
      } else if (template.special === "custom-template") {
        // Delete from localStorage (legacy)
        const existingTemplates = JSON.parse(localStorage.getItem('customTemplates') || '[]');
        const filteredTemplates = existingTemplates.filter((t: any) => t.id !== template.id);
        localStorage.setItem('customTemplates', JSON.stringify(filteredTemplates));
      }

      // Refresh templates list
      const loadTemplatesAndCategories = async () => {
        try {
          const allTemplates = await getAllTemplates();
          setTemplates(allTemplates);
          setCategories(getAllCategories(allTemplates));
        } catch (error) {
          console.error('Error loading templates:', error);
          setTemplates(baseTemplates);
          setCategories(Array.from(new Set(baseTemplates.map(t => t.category))));
        }
      };
      
      await loadTemplatesAndCategories();

      toast({
        title: "Template Deleted! 🗑️",
        description: `"${template.name}" has been permanently deleted.`,
        duration: 3000,
      });

    } catch (error: any) {
      console.error('Error deleting template:', error);
      toast({
        title: "Delete Failed",
        description: error.message || "Failed to delete template. Please try again.",
        variant: "destructive",
        duration: 4000,
      });
    }
  };

  // Handle requesting a signature
  const handleRequestSignature = async () => {
    try {
      const quoteId = "quote_" + Math.random().toString(36).substring(2, 10);
      const documentData = {
        customerName: "Sample Customer",
        quoteName: quoteName,
        quoteItems: quoteItems,
        total: quoteItems.reduce((sum, item) => sum + (item.total || 0), 0),
      };
      
      const { signingUrl } = await createSignatureRequest(
        quoteId,
        customerEmail,
        documentData
      );
      
      setSigningUrl(signingUrl);
      setShowDocuSeal(true);
      
      toast({
        title: "Signature Request Sent",
        description: "The customer will receive an email with signing instructions"
      });
    } catch (error) {
      console.error("Error requesting signature:", error);
      toast({
        title: "Error",
        description: "Failed to request signature",
        variant: "destructive"
      });
    }
  };
  
  // Handle when document is signed
  const handleDocumentSigned = () => {
    setDocumentSigned(true);
    setShowDocuSeal(false);
    
    toast({
      title: "Document Signed",
      description: "The quote has been signed by the customer"
    });
  };

  // Render the active section component
  const renderActiveSection = () => {
    switch (activeSection) {
      case "customer":
        return <CustomerForm onNextTab={() => setActiveSection("items")} />;
      case "items":
        return <QuoteItemsForm 
          quoteItems={quoteItems} 
          setQuoteItems={setQuoteItems} 
          onPrevTab={() => setActiveSection("customer")} 
          onNextTab={() => setActiveSection("terms")} 
        />;
      case "priceList":
        return <PriceListForm onAddItemToQuote={handleAddPriceListItem} onChangeTab={() => setActiveSection("items")} />;
      case "terms":
        return <TermsForm onPrevTab={() => setActiveSection("items")} onNextTab={() => setActiveSection("customer")} />;
      case "specs":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Quote Letter Specifications</h3>
            <textarea 
              className="w-full p-3 border rounded-md h-40 focus:ring-2 focus:ring-blue-400 focus:border-blue-400" 
              placeholder="Enter quote letter specifications..."
              value={quoteLetterSpecs}
              onChange={(e) => setQuoteLetterSpecs(e.target.value)}
            />
            <Button 
              onClick={() => setActiveSection("request")}
              className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            >
              Next
            </Button>
          </div>
        );
      case "signature":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-slate-800">Request Customer Signature</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-slate-700">Customer Email</label>
                <Input 
                  type="email" 
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="font-medium text-blue-700 flex items-center">
                  <FileSignature className="w-4 h-4 mr-2" />
                  DocuSeal Integration
                </h4>
                <p className="text-sm text-blue-600 mt-1">
                  When you request a signature, the customer will receive an email with a link to sign the document electronically.
                </p>
              </div>
              
              {documentSigned ? (
                <div className="flex flex-col items-center p-6 bg-green-50 border border-green-200 rounded-md">
                  <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                  <h4 className="font-medium text-green-700">Document Signed Successfully</h4>
                  <p className="text-sm text-green-600 text-center mt-1">
                    The signed document has been saved to the customer's profile.
                  </p>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button 
                    onClick={handleRequestSignature}
                    disabled={!customerEmail}
                    className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 flex items-center"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Request Signature
                  </Button>
                </div>
              )}
            </div>
            
            {showDocuSeal && (
              <div className="mt-4 border border-gray-200 rounded-md p-4">
                <h4 className="font-medium text-gray-700 mb-2">Preview Signing Experience</h4>
                <DocuSealWrapper 
                  url={signingUrl} 
                  onDocumentSigned={handleDocumentSigned}
                />
              </div>
            )}
          </div>
        );
      default:
        return <CustomerForm onNextTab={() => setActiveSection("items")} />;
    }
  };

  // Template gallery view
  const renderTemplateGallery = () => {
    // Filter templates by selected category
    const filteredTemplates = selectedTemplateCategory === "All Categories" 
      ? templates 
      : templates.filter(t => t.category === selectedTemplateCategory);

    return (
      <div className="flex flex-col h-full">
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full" 
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Back</span>
                </Button>
                <h1 className="text-xl font-semibold text-slate-800">Quote Templates</h1>
              </div>
              
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                  placeholder="Search templates..." 
                  className="pl-10 h-10 border-slate-300 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Categories Sidebar */}
          <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 overflow-y-auto">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Categories</h2>
            
            <div className="space-y-1">
              <button 
                className={`w-full text-left p-2.5 rounded-md text-sm font-medium ${
                  selectedTemplateCategory === "All Categories" 
                    ? "bg-blue-50 text-blue-700" 
                    : "text-slate-700 hover:bg-slate-100"
                }`}
                onClick={() => setSelectedTemplateCategory("All Categories")}
              >
                All Categories
              </button>
              
              {categories.map(category => (
                <button 
                  key={category}
                  className={`w-full text-left p-2.5 rounded-md text-sm font-medium ${
                    selectedTemplateCategory === category 
                      ? "bg-blue-50 text-blue-700" 
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                  onClick={() => setSelectedTemplateCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="mt-6">
              <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">Popular Tags</h2>
              <div className="flex flex-wrap gap-2">
                {["New", "Popular", "Premium", "Free"].map(tag => (
                  <Badge 
                    key={tag} 
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Templates Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-800">
                {selectedTemplateCategory === "All Categories" ? "All Templates" : selectedTemplateCategory + " Templates"}
              </h2>
              <p className="text-slate-500 mt-1">Select a template to start your quote</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map(template => (
                <Card 
                  key={template.id} 
                  className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  onClick={() => handleUseTemplate(template)}
                >
                  <div className="h-40 w-full overflow-hidden">
                    <TemplatePreview template={template} />
                  </div>
                  <CardContent className="p-4">
                    <Badge className="mb-2">{template.category}</Badge>
                    <h3 className="font-semibold text-slate-800">{template.name}</h3>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-sm font-medium text-blue-600">
                        {template.special === "supabase-template" ? "My Build" : 
                         template.special === "custom-template" ? "My Build" :
                         template.price === 0 ? "Free" : `$${template.price}`}
                      </span>
                      
                      {/* Custom Template Actions */}
                      {(template.special === "supabase-template" || template.special === "custom-template") ? (
                        <div className="flex items-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="px-2 py-1 text-xs h-7"
                            onClick={(e) => {
                              e.stopPropagation();
                              // TODO: Implement edit functionality
                              toast({
                                title: "Edit Template",
                                description: "Edit functionality coming soon!",
                                duration: 2000,
                              });
                            }}
                          >
                            Edit
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="px-2 py-1 text-xs h-7 text-red-600 border-red-300 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template);
                            }}
                          >
                            Delete
                          </Button>
                          <Button 
                            size="sm" 
                            className="px-3 py-1 text-xs h-7 bg-green-500 hover:bg-green-600 text-white border-2 border-green-500"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUseTemplate(template);
                            }}
                          >
                            Use
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" variant="outline">
                          Preview
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Quote editor view
  const renderQuoteEditor = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Top Navigation */}
        <div className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full" 
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  <span>Back</span>
                </Button>
                <Input 
                  value={quoteName}
                  onChange={(e) => setQuoteName(e.target.value)}
                  className="max-w-[200px] font-semibold text-lg border-transparent focus:border-slate-300"
                />
                <Badge className="bg-blue-100 text-blue-700">Draft</Badge>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" onClick={handleSaveQuote}>
                  <CheckCircle className="h-4 w-4 mr-1.5" />
                  Save
                </Button>
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white" onClick={handleSendQuote}>
                  <Send className="h-4 w-4 mr-1.5" />
                  Send Quote
                </Button>
                
                {/* Notifications */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-9 w-9 rounded-full p-0 relative"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <MessageSquare className="h-5 w-5 text-slate-700" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center">3</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="flex-1 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto p-6 h-full">
            <div className="grid grid-cols-12 gap-6 h-full">
              {/* Left Sidebar - Navigation */}
              <div className="col-span-3">
                <Card className="h-full">
                  <CardHeader className="bg-slate-100 py-3 px-4">
                    <CardTitle className="text-sm font-semibold text-slate-700 flex items-center">
                      <Layers className="h-4 w-4 mr-2 text-blue-600" />
                      QUOTE SECTIONS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y divide-slate-100">
                      {[
                        { id: "customer", icon: <User className="h-4 w-4 mr-2" />, label: "Customer Details" },
                        { id: "items", icon: <FileText className="h-4 w-4 mr-2" />, label: "Quote Items" },
                        { id: "priceList", icon: <BarChartBig className="h-4 w-4 mr-2" />, label: "Price List" },
                        { id: "terms", icon: <FileText className="h-4 w-4 mr-2" />, label: "Terms & Conditions" },
                        { id: "signature", icon: <FileSignature className="h-4 w-4 mr-2" />, label: "Customer Signature" }
                      ].map(section => (
                        <Button 
                          key={section.id}
                          variant="ghost"
                          className={`justify-start w-full rounded-none py-3 px-4 ${
                            activeSection === section.id 
                              ? "bg-blue-50 text-blue-700 border-l-4 border-blue-600" 
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                          onClick={() => setActiveSection(section.id)}
                        >
                          {section.icon}
                          {section.label}
                        </Button>
                      ))}
                    </div>
                    
                    <div className="p-4 mt-2 bg-blue-50 mx-4 rounded-md">
                      <h4 className="font-medium text-blue-700 text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Last Updated
                      </h4>
                      <p className="text-xs text-blue-600 mt-1">
                        Today at {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Middle Content - Active Section */}
              <div className="col-span-5">
                <Card className="h-full">
                  <CardHeader className="bg-slate-100 py-3 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700 capitalize">
                      {activeSection} Details
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full">
                      <Settings className="h-4 w-4 text-slate-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="p-5">
                    {renderActiveSection()}
                  </CardContent>
                </Card>
              </div>
              
              {/* Right Sidebar - Preview */}
              <div className="col-span-4">
                <Card className="h-full">
                  <CardHeader className="bg-slate-100 py-3 px-4 flex flex-row items-center justify-between">
                    <CardTitle className="text-sm font-semibold text-slate-700">
                      Quote Preview
                    </CardTitle>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        PDF
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs">
                        <Send className="h-3.5 w-3.5 mr-1" />
                        Email
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="max-h-[calc(100vh-14rem)] overflow-y-auto bg-slate-50 p-5">
                      <QuotePreview 
                        quoteItems={quoteItems} 
                        onPrevTab={() => {}} 
                        customerEmail={customerEmail}
                        showSignatureSection={true}
                        onRequestSignature={handleRequestSignature}
                        signingUrl={signingUrl}
                        documentSigned={documentSigned}
                        onDocumentSigned={handleDocumentSigned}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // If this is the advanced construction template
  if (templateParam === 'advanced-construction') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <AdvancedConstructionQuote />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 2
  if (templateParam === 'construction-template-2') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate2 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 3
  if (templateParam === 'construction-template-3') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate3 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 4
  if (templateParam === 'construction-template-4') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate4 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 5
  if (templateParam === 'construction-template-5') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate5 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 6
  if (templateParam === 'construction-template-6') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate6 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // If this is Construction Template 7
  if (templateParam === 'construction-template-7') {
    return (
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <AppLayout>
          <ConstructionTemplate7 />
        </AppLayout>
      </ErrorBoundary>
    );
  }

  // Otherwise show normal template gallery or editor
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AppLayout>
        {showTemplates ? renderTemplateGallery() : renderQuoteEditor()}
        
        {/* Notifications Dropdown */}
        {showNotifications && (
          <div className="absolute top-16 right-4 mt-1 w-80 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-sm font-medium text-slate-700">Recent Messages</h3>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 rounded-full">
                <span className="sr-only">Close</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </Button>
            </div>
            
            <div className="max-h-96 overflow-y-auto p-3 divide-y divide-slate-100">
              {[
                { name: "John Smith", time: "2h ago", message: "Could you adjust the price for the fence material?" },
                { name: "Sarah Johnson", time: "3h ago", message: "Can you send me a revised quote with the additional items we discussed?" },
                { name: "Tom Williams", time: "Yesterday", message: "Thanks for the quote. Looking forward to getting started." }
              ].map((notification, i) => (
                <div key={i} className="py-2">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium text-slate-800 text-sm">{notification.name}</p>
                    <span className="text-xs text-slate-500">{notification.time}</span>
                  </div>
                  <p className="text-slate-600 text-xs">{notification.message}</p>
                  <div className="flex mt-1 justify-end">
                    <Button variant="ghost" size="sm" className="h-6 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1">Reply</Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white text-xs">
                View All Messages
              </Button>
            </div>
          </div>
        )}
      </AppLayout>
    </ErrorBoundary>
  );
};

export default QuotesMain;
