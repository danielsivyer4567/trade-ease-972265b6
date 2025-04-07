
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Workflow as WorkflowIcon, Building, Construction, CreditCard, HardHat, Truck, UserPlus, ClipboardList, Calendar, Zap, WrenchIcon, HomeIcon, ShieldCheck, Receipt, BarChart, Ruler, Clock } from "lucide-react";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const TEMPLATE_CATEGORIES = [
  { id: 'construction', name: 'Construction', icon: <Construction className="h-5 w-5" /> },
  { id: 'residential', name: 'Residential', icon: <HomeIcon className="h-5 w-5" /> },
  { id: 'commercial', name: 'Commercial', icon: <Building className="h-5 w-5" /> },
  { id: 'safety', name: 'Safety', icon: <ShieldCheck className="h-5 w-5" /> },
  { id: 'financial', name: 'Financial', icon: <CreditCard className="h-5 w-5" /> },
  { id: 'quality', name: 'Quality', icon: <ClipboardList className="h-5 w-5" /> },
  { id: 'subcontractor', name: 'Subcontractor', icon: <UserPlus className="h-5 w-5" /> },
  { id: 'equipment', name: 'Equipment', icon: <Truck className="h-5 w-5" /> },
  { id: 'scheduling', name: 'Scheduling', icon: <Calendar className="h-5 w-5" /> },
  { id: 'efficiency', name: 'Efficiency', icon: <Zap className="h-5 w-5" /> },
];

// Detailed construction workflow templates with variations
const WORKFLOW_TEMPLATES = [
  // Residential Construction Templates
  {
    id: crypto.randomUUID(),
    name: "Residential New Build - Standard",
    description: "Complete workflow for building a standard residential property from initial client consultation to handover.",
    category: "Residential",
    data: {
      nodes: [
        { id: 'client-consultation', type: 'input', data: { label: 'Initial Client Consultation' } },
        { id: 'site-assessment', type: 'default', data: { label: 'Site Assessment & Survey' } },
        { id: 'design-development', type: 'default', data: { label: 'Design Development' } },
        { id: 'council-approval', type: 'default', data: { label: 'Council Approval Process' } },
        { id: 'contract-signing', type: 'default', data: { label: 'Contract Signing' } },
        { id: 'material-ordering', type: 'default', data: { label: 'Material Ordering' } },
        { id: 'foundation-work', type: 'default', data: { label: 'Foundation Work' } },
        { id: 'framing', type: 'default', data: { label: 'Framing & Roof Installation' } },
        { id: 'rough-ins', type: 'default', data: { label: 'Electrical & Plumbing Rough-ins' } },
        { id: 'insulation', type: 'default', data: { label: 'Insulation & Drywall' } },
        { id: 'interior-finishes', type: 'default', data: { label: 'Interior Finishes' } },
        { id: 'final-inspection', type: 'default', data: { label: 'Final Inspection' } },
        { id: 'handover', type: 'output', data: { label: 'Client Handover' } },
      ],
      edges: [
        { id: 'e1-2', source: 'client-consultation', target: 'site-assessment' },
        { id: 'e2-3', source: 'site-assessment', target: 'design-development' },
        { id: 'e3-4', source: 'design-development', target: 'council-approval' },
        { id: 'e4-5', source: 'council-approval', target: 'contract-signing' },
        { id: 'e5-6', source: 'contract-signing', target: 'material-ordering' },
        { id: 'e6-7', source: 'material-ordering', target: 'foundation-work' },
        { id: 'e7-8', source: 'foundation-work', target: 'framing' },
        { id: 'e8-9', source: 'framing', target: 'rough-ins' },
        { id: 'e9-10', source: 'rough-ins', target: 'insulation' },
        { id: 'e10-11', source: 'insulation', target: 'interior-finishes' },
        { id: 'e11-12', source: 'interior-finishes', target: 'final-inspection' },
        { id: 'e12-13', source: 'final-inspection', target: 'handover' },
      ],
      created_at: new Date().toISOString()
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Residential New Build - Luxury",
    description: "Premium workflow for high-end residential projects with additional quality control and custom elements.",
    category: "Residential",
    data: {
      nodes: [
        { id: 'client-consultation', type: 'input', data: { label: 'VIP Client Consultation' } },
        { id: 'site-assessment', type: 'default', data: { label: 'Detailed Site Assessment & Geo Survey' } },
        { id: 'architect-design', type: 'default', data: { label: 'Architect Design Development' } },
        { id: 'interior-designer', type: 'default', data: { label: 'Interior Designer Engagement' } },
        { id: 'material-selection', type: 'default', data: { label: 'Premium Material Selection' } },
        { id: 'council-approval', type: 'default', data: { label: 'Council & Heritage Approval' } },
        { id: 'detailed-contract', type: 'default', data: { label: 'Detailed Contract Signing' } },
        { id: 'pre-construction', type: 'default', data: { label: 'Pre-construction Meeting' } },
        { id: 'foundation-work', type: 'default', data: { label: 'Engineered Foundation Work' } },
        { id: 'custom-framing', type: 'default', data: { label: 'Custom Framing & Structural Elements' } },
        { id: 'premium-systems', type: 'default', data: { label: 'Smart Home & Premium Systems' } },
        { id: 'custom-interiors', type: 'default', data: { label: 'Custom Interior Finishes' } },
        { id: 'landscaping', type: 'default', data: { label: 'Professional Landscaping' } },
        { id: 'quality-inspection', type: 'default', data: { label: 'Multi-point Quality Inspection' } },
        { id: 'client-walkthrough', type: 'default', data: { label: 'Client Walkthrough & Adjustments' } },
        { id: 'handover', type: 'output', data: { label: 'VIP Handover Package' } },
      ],
      edges: [
        { id: 'e1-2', source: 'client-consultation', target: 'site-assessment' },
        { id: 'e2-3', source: 'site-assessment', target: 'architect-design' },
        { id: 'e3-4', source: 'architect-design', target: 'interior-designer' },
        { id: 'e4-5', source: 'interior-designer', target: 'material-selection' },
        { id: 'e5-6', source: 'material-selection', target: 'council-approval' },
        { id: 'e6-7', source: 'council-approval', target: 'detailed-contract' },
        { id: 'e7-8', source: 'detailed-contract', target: 'pre-construction' },
        { id: 'e8-9', source: 'pre-construction', target: 'foundation-work' },
        { id: 'e9-10', source: 'foundation-work', target: 'custom-framing' },
        { id: 'e10-11', source: 'custom-framing', target: 'premium-systems' },
        { id: 'e11-12', source: 'premium-systems', target: 'custom-interiors' },
        { id: 'e12-13', source: 'custom-interiors', target: 'landscaping' },
        { id: 'e13-14', source: 'landscaping', target: 'quality-inspection' },
        { id: 'e14-15', source: 'quality-inspection', target: 'client-walkthrough' },
        { id: 'e15-16', source: 'client-walkthrough', target: 'handover' },
      ],
      created_at: new Date().toISOString()
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Residential Renovation - Kitchen",
    description: "Specialized workflow for kitchen renovation projects from design to completion.",
    category: "Residential",
    data: {
      nodes: [
        { id: 'initial-consultation', type: 'input', data: { label: 'Initial Consultation' } },
        { id: 'kitchen-assessment', type: 'default', data: { label: 'Kitchen Assessment' } },
        { id: 'design-plans', type: 'default', data: { label: 'Design Plans & 3D Rendering' } },
        { id: 'material-selection', type: 'default', data: { label: 'Material & Appliance Selection' } },
        { id: 'quote-approval', type: 'default', data: { label: 'Quote Approval' } },
        { id: 'permits', type: 'default', data: { label: 'Permits (if required)' } },
        { id: 'demolition', type: 'default', data: { label: 'Demolition & Removal' } },
        { id: 'plumbing-electrical', type: 'default', data: { label: 'Plumbing & Electrical Work' } },
        { id: 'drywall-flooring', type: 'default', data: { label: 'Drywall & Flooring' } },
        { id: 'cabinet-installation', type: 'default', data: { label: 'Cabinet Installation' } },
        { id: 'countertop-installation', type: 'default', data: { label: 'Countertop Installation' } },
        { id: 'appliance-installation', type: 'default', data: { label: 'Appliance Installation' } },
        { id: 'final-touches', type: 'default', data: { label: 'Backsplash & Final Touches' } },
        { id: 'final-inspection', type: 'default', data: { label: 'Final Inspection' } },
        { id: 'handover', type: 'output', data: { label: 'Client Handover' } },
      ],
      edges: [
        { id: 'e1-2', source: 'initial-consultation', target: 'kitchen-assessment' },
        { id: 'e2-3', source: 'kitchen-assessment', target: 'design-plans' },
        { id: 'e3-4', source: 'design-plans', target: 'material-selection' },
        { id: 'e4-5', source: 'material-selection', target: 'quote-approval' },
        { id: 'e5-6', source: 'quote-approval', target: 'permits' },
        { id: 'e6-7', source: 'permits', target: 'demolition' },
        { id: 'e7-8', source: 'demolition', target: 'plumbing-electrical' },
        { id: 'e8-9', source: 'plumbing-electrical', target: 'drywall-flooring' },
        { id: 'e9-10', source: 'drywall-flooring', target: 'cabinet-installation' },
        { id: 'e10-11', source: 'cabinet-installation', target: 'countertop-installation' },
        { id: 'e11-12', source: 'countertop-installation', target: 'appliance-installation' },
        { id: 'e12-13', source: 'appliance-installation', target: 'final-touches' },
        { id: 'e13-14', source: 'final-touches', target: 'final-inspection' },
        { id: 'e14-15', source: 'final-inspection', target: 'handover' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Commercial Construction Templates
  {
    id: crypto.randomUUID(),
    name: "Commercial Office Build",
    description: "Complete workflow for commercial office building construction with tenant considerations.",
    category: "Commercial",
    data: {
      nodes: [
        { id: 'feasibility-study', type: 'input', data: { label: 'Feasibility Study' } },
        { id: 'land-acquisition', type: 'default', data: { label: 'Land Acquisition & Due Diligence' } },
        { id: 'concept-design', type: 'default', data: { label: 'Concept Design Development' } },
        { id: 'stakeholder-approval', type: 'default', data: { label: 'Stakeholder Approval' } },
        { id: 'detailed-design', type: 'default', data: { label: 'Detailed Design & Engineering' } },
        { id: 'regulatory-approval', type: 'default', data: { label: 'Regulatory Approval & Permits' } },
        { id: 'contractor-selection', type: 'default', data: { label: 'Contractor Selection' } },
        { id: 'site-preparation', type: 'default', data: { label: 'Site Preparation & Foundation' } },
        { id: 'core-shell', type: 'default', data: { label: 'Core & Shell Construction' } },
        { id: 'mechanical-systems', type: 'default', data: { label: 'Mechanical & Electrical Systems' } },
        { id: 'interior-fitout', type: 'default', data: { label: 'Interior Fit-out' } },
        { id: 'tenant-improvements', type: 'default', data: { label: 'Tenant Improvements' } },
        { id: 'commissioning', type: 'default', data: { label: 'Building Commissioning' } },
        { id: 'occupancy-certificate', type: 'default', data: { label: 'Occupancy Certificate' } },
        { id: 'tenant-move-in', type: 'output', data: { label: 'Tenant Move-in' } },
      ],
      edges: [
        { id: 'e1-2', source: 'feasibility-study', target: 'land-acquisition' },
        { id: 'e2-3', source: 'land-acquisition', target: 'concept-design' },
        { id: 'e3-4', source: 'concept-design', target: 'stakeholder-approval' },
        { id: 'e4-5', source: 'stakeholder-approval', target: 'detailed-design' },
        { id: 'e5-6', source: 'detailed-design', target: 'regulatory-approval' },
        { id: 'e6-7', source: 'regulatory-approval', target: 'contractor-selection' },
        { id: 'e7-8', source: 'contractor-selection', target: 'site-preparation' },
        { id: 'e8-9', source: 'site-preparation', target: 'core-shell' },
        { id: 'e9-10', source: 'core-shell', target: 'mechanical-systems' },
        { id: 'e10-11', source: 'mechanical-systems', target: 'interior-fitout' },
        { id: 'e11-12', source: 'interior-fitout', target: 'tenant-improvements' },
        { id: 'e12-13', source: 'tenant-improvements', target: 'commissioning' },
        { id: 'e13-14', source: 'commissioning', target: 'occupancy-certificate' },
        { id: 'e14-15', source: 'occupancy-certificate', target: 'tenant-move-in' },
      ],
      created_at: new Date().toISOString()
    }
  },
  {
    id: crypto.randomUUID(),
    name: "Commercial Retail Fit-out",
    description: "Specialized workflow for retail space fit-out with brand and customer experience focus.",
    category: "Commercial",
    data: {
      nodes: [
        { id: 'lease-agreement', type: 'input', data: { label: 'Lease Agreement' } },
        { id: 'brand-briefing', type: 'default', data: { label: 'Brand & Requirements Briefing' } },
        { id: 'space-planning', type: 'default', data: { label: 'Space Planning & Customer Flow' } },
        { id: 'design-development', type: 'default', data: { label: 'Design Development & Visualization' } },
        { id: 'permit-application', type: 'default', data: { label: 'Permit Application' } },
        { id: 'contractor-selection', type: 'default', data: { label: 'Contractor Selection' } },
        { id: 'demolition', type: 'default', data: { label: 'Demolition & Preparation' } },
        { id: 'structural-changes', type: 'default', data: { label: 'Structural Changes (if needed)' } },
        { id: 'utility-connections', type: 'default', data: { label: 'Utility Connections & Services' } },
        { id: 'flooring-ceiling', type: 'default', data: { label: 'Flooring & Ceiling Installation' } },
        { id: 'lighting-systems', type: 'default', data: { label: 'Lighting Systems' } },
        { id: 'fixture-installation', type: 'default', data: { label: 'Fixture & Display Installation' } },
        { id: 'signage-graphics', type: 'default', data: { label: 'Signage & Graphics' } },
        { id: 'technology-integration', type: 'default', data: { label: 'POS & Technology Integration' } },
        { id: 'final-styling', type: 'default', data: { label: 'Final Styling & Merchandising' } },
        { id: 'inspection', type: 'default', data: { label: 'Final Inspection' } },
        { id: 'store-opening', type: 'output', data: { label: 'Store Opening' } },
      ],
      edges: [
        { id: 'e1-2', source: 'lease-agreement', target: 'brand-briefing' },
        { id: 'e2-3', source: 'brand-briefing', target: 'space-planning' },
        { id: 'e3-4', source: 'space-planning', target: 'design-development' },
        { id: 'e4-5', source: 'design-development', target: 'permit-application' },
        { id: 'e5-6', source: 'permit-application', target: 'contractor-selection' },
        { id: 'e6-7', source: 'contractor-selection', target: 'demolition' },
        { id: 'e7-8', source: 'demolition', target: 'structural-changes' },
        { id: 'e8-9', source: 'structural-changes', target: 'utility-connections' },
        { id: 'e9-10', source: 'utility-connections', target: 'flooring-ceiling' },
        { id: 'e10-11', source: 'flooring-ceiling', target: 'lighting-systems' },
        { id: 'e11-12', source: 'lighting-systems', target: 'fixture-installation' },
        { id: 'e12-13', source: 'fixture-installation', target: 'signage-graphics' },
        { id: 'e13-14', source: 'signage-graphics', target: 'technology-integration' },
        { id: 'e14-15', source: 'technology-integration', target: 'final-styling' },
        { id: 'e15-16', source: 'final-styling', target: 'inspection' },
        { id: 'e16-17', source: 'inspection', target: 'store-opening' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Safety & Compliance Templates
  {
    id: crypto.randomUUID(),
    name: "Site Safety Management",
    description: "Comprehensive workflow for managing construction site safety and compliance.",
    category: "Safety",
    data: {
      nodes: [
        { id: 'safety-planning', type: 'input', data: { label: 'Safety Planning & Risk Assessment' } },
        { id: 'safety-documentation', type: 'default', data: { label: 'Safety Documentation Preparation' } },
        { id: 'site-setup', type: 'default', data: { label: 'Site Setup & Safety Signage' } },
        { id: 'induction-training', type: 'default', data: { label: 'Worker Induction & Training' } },
        { id: 'ppe-distribution', type: 'default', data: { label: 'PPE Distribution & Verification' } },
        { id: 'daily-toolbox', type: 'default', data: { label: 'Daily Toolbox Talks' } },
        { id: 'hazard-identification', type: 'default', data: { label: 'Hazard Identification Process' } },
        { id: 'equipment-inspections', type: 'default', data: { label: 'Equipment & Machinery Inspections' } },
        { id: 'compliance-audits', type: 'default', data: { label: 'Regular Compliance Audits' } },
        { id: 'incident-reporting', type: 'default', data: { label: 'Incident Reporting System' } },
        { id: 'corrective-actions', type: 'default', data: { label: 'Corrective Actions Implementation' } },
        { id: 'monthly-review', type: 'default', data: { label: 'Monthly Safety Review' } },
        { id: 'documentation-update', type: 'default', data: { label: 'Documentation Updates' } },
        { id: 'continuous-improvement', type: 'output', data: { label: 'Continuous Improvement Process' } },
      ],
      edges: [
        { id: 'e1-2', source: 'safety-planning', target: 'safety-documentation' },
        { id: 'e2-3', source: 'safety-documentation', target: 'site-setup' },
        { id: 'e3-4', source: 'site-setup', target: 'induction-training' },
        { id: 'e4-5', source: 'induction-training', target: 'ppe-distribution' },
        { id: 'e5-6', source: 'ppe-distribution', target: 'daily-toolbox' },
        { id: 'e6-7', source: 'daily-toolbox', target: 'hazard-identification' },
        { id: 'e7-8', source: 'hazard-identification', target: 'equipment-inspections' },
        { id: 'e8-9', source: 'equipment-inspections', target: 'compliance-audits' },
        { id: 'e9-10', source: 'compliance-audits', target: 'incident-reporting' },
        { id: 'e10-11', source: 'incident-reporting', target: 'corrective-actions' },
        { id: 'e11-12', source: 'corrective-actions', target: 'monthly-review' },
        { id: 'e12-13', source: 'monthly-review', target: 'documentation-update' },
        { id: 'e13-14', source: 'documentation-update', target: 'continuous-improvement' },
        // Feedback loop
        { id: 'e14-7', source: 'continuous-improvement', target: 'hazard-identification' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Financial Templates
  {
    id: crypto.randomUUID(),
    name: "Project Cost Management",
    description: "Workflow for tracking and managing construction project costs from estimation to reconciliation.",
    category: "Financial",
    data: {
      nodes: [
        { id: 'project-estimate', type: 'input', data: { label: 'Initial Project Estimate' } },
        { id: 'budget-approval', type: 'default', data: { label: 'Budget Approval' } },
        { id: 'cost-breakdown', type: 'default', data: { label: 'Detailed Cost Breakdown' } },
        { id: 'vendor-bidding', type: 'default', data: { label: 'Vendor Bidding Process' } },
        { id: 'contract-negotiation', type: 'default', data: { label: 'Contract Negotiation' } },
        { id: 'purchase-orders', type: 'default', data: { label: 'Purchase Orders System' } },
        { id: 'progress-payment', type: 'default', data: { label: 'Progress Payment Schedule' } },
        { id: 'change-order-management', type: 'default', data: { label: 'Change Order Management' } },
        { id: 'invoice-verification', type: 'default', data: { label: 'Invoice Verification & Approval' } },
        { id: 'payment-processing', type: 'default', data: { label: 'Payment Processing' } },
        { id: 'cost-tracking', type: 'default', data: { label: 'Ongoing Cost Tracking' } },
        { id: 'variance-analysis', type: 'default', data: { label: 'Variance Analysis' } },
        { id: 'forecast-updates', type: 'default', data: { label: 'Forecast Updates' } },
        { id: 'final-reconciliation', type: 'default', data: { label: 'Final Cost Reconciliation' } },
        { id: 'financial-closeout', type: 'output', data: { label: 'Financial Closeout' } },
      ],
      edges: [
        { id: 'e1-2', source: 'project-estimate', target: 'budget-approval' },
        { id: 'e2-3', source: 'budget-approval', target: 'cost-breakdown' },
        { id: 'e3-4', source: 'cost-breakdown', target: 'vendor-bidding' },
        { id: 'e4-5', source: 'vendor-bidding', target: 'contract-negotiation' },
        { id: 'e5-6', source: 'contract-negotiation', target: 'purchase-orders' },
        { id: 'e6-7', source: 'purchase-orders', target: 'progress-payment' },
        { id: 'e7-8', source: 'progress-payment', target: 'change-order-management' },
        { id: 'e8-9', source: 'change-order-management', target: 'invoice-verification' },
        { id: 'e9-10', source: 'invoice-verification', target: 'payment-processing' },
        { id: 'e10-11', source: 'payment-processing', target: 'cost-tracking' },
        { id: 'e11-12', source: 'cost-tracking', target: 'variance-analysis' },
        { id: 'e12-13', source: 'variance-analysis', target: 'forecast-updates' },
        { id: 'e13-14', source: 'forecast-updates', target: 'final-reconciliation' },
        { id: 'e14-15', source: 'final-reconciliation', target: 'financial-closeout' },
        // Feedback loop for change orders
        { id: 'e8-11', source: 'change-order-management', target: 'cost-tracking' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Subcontractor Management
  {
    id: crypto.randomUUID(),
    name: "Subcontractor Management",
    description: "Comprehensive workflow for managing subcontractors from selection to project completion.",
    category: "Subcontractor",
    data: {
      nodes: [
        { id: 'requirement-definition', type: 'input', data: { label: 'Subcontractor Requirements Definition' } },
        { id: 'prequalification', type: 'default', data: { label: 'Subcontractor Prequalification' } },
        { id: 'bid-package', type: 'default', data: { label: 'Bid Package Preparation' } },
        { id: 'bid-solicitation', type: 'default', data: { label: 'Bid Solicitation' } },
        { id: 'bid-evaluation', type: 'default', data: { label: 'Bid Evaluation & Comparison' } },
        { id: 'subcontractor-selection', type: 'default', data: { label: 'Subcontractor Selection' } },
        { id: 'contract-preparation', type: 'default', data: { label: 'Contract Preparation & Negotiation' } },
        { id: 'insurance-verification', type: 'default', data: { label: 'Insurance & License Verification' } },
        { id: 'onboarding', type: 'default', data: { label: 'Subcontractor Onboarding' } },
        { id: 'schedule-integration', type: 'default', data: { label: 'Schedule Integration' } },
        { id: 'work-execution', type: 'default', data: { label: 'Work Execution & Monitoring' } },
        { id: 'quality-inspections', type: 'default', data: { label: 'Quality Inspections' } },
        { id: 'payment-processing', type: 'default', data: { label: 'Progress Payment Processing' } },
        { id: 'issue-resolution', type: 'default', data: { label: 'Issue Resolution Process' } },
        { id: 'work-completion', type: 'default', data: { label: 'Work Completion Verification' } },
        { id: 'final-payment', type: 'default', data: { label: 'Final Payment Processing' } },
        { id: 'performance-evaluation', type: 'output', data: { label: 'Performance Evaluation' } },
      ],
      edges: [
        { id: 'e1-2', source: 'requirement-definition', target: 'prequalification' },
        { id: 'e2-3', source: 'prequalification', target: 'bid-package' },
        { id: 'e3-4', source: 'bid-package', target: 'bid-solicitation' },
        { id: 'e4-5', source: 'bid-solicitation', target: 'bid-evaluation' },
        { id: 'e5-6', source: 'bid-evaluation', target: 'subcontractor-selection' },
        { id: 'e6-7', source: 'subcontractor-selection', target: 'contract-preparation' },
        { id: 'e7-8', source: 'contract-preparation', target: 'insurance-verification' },
        { id: 'e8-9', source: 'insurance-verification', target: 'onboarding' },
        { id: 'e9-10', source: 'onboarding', target: 'schedule-integration' },
        { id: 'e10-11', source: 'schedule-integration', target: 'work-execution' },
        { id: 'e11-12', source: 'work-execution', target: 'quality-inspections' },
        { id: 'e12-13', source: 'quality-inspections', target: 'payment-processing' },
        { id: 'e13-14', source: 'payment-processing', target: 'issue-resolution' },
        { id: 'e14-15', source: 'issue-resolution', target: 'work-completion' },
        { id: 'e15-16', source: 'work-completion', target: 'final-payment' },
        { id: 'e16-17', source: 'final-payment', target: 'performance-evaluation' },
        // Feedback loops
        { id: 'e14-11', source: 'issue-resolution', target: 'work-execution' },
        { id: 'e12-11', source: 'quality-inspections', target: 'work-execution' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Quality Control
  {
    id: crypto.randomUUID(),
    name: "Quality Control System",
    description: "Detailed workflow for implementing quality control throughout the construction process.",
    category: "Quality",
    data: {
      nodes: [
        { id: 'quality-planning', type: 'input', data: { label: 'Quality Management Planning' } },
        { id: 'quality-standards', type: 'default', data: { label: 'Quality Standards Definition' } },
        { id: 'inspection-checklists', type: 'default', data: { label: 'Inspection Checklists Creation' } },
        { id: 'material-testing', type: 'default', data: { label: 'Material Testing Protocols' } },
        { id: 'team-training', type: 'default', data: { label: 'Quality Team Training' } },
        { id: 'baseline-inspection', type: 'default', data: { label: 'Baseline Quality Inspection' } },
        { id: 'material-verification', type: 'default', data: { label: 'Material Quality Verification' } },
        { id: 'work-inspection', type: 'default', data: { label: 'Work-in-Progress Inspections' } },
        { id: 'nonconformance', type: 'default', data: { label: 'Nonconformance Reporting' } },
        { id: 'corrective-action', type: 'default', data: { label: 'Corrective Action Implementation' } },
        { id: 'milestone-inspections', type: 'default', data: { label: 'Milestone Quality Inspections' } },
        { id: 'documentation', type: 'default', data: { label: 'Quality Documentation' } },
        { id: 'client-walkthroughs', type: 'default', data: { label: 'Client Quality Walkthroughs' } },
        { id: 'final-inspection', type: 'default', data: { label: 'Final Quality Inspection' } },
        { id: 'quality-certification', type: 'default', data: { label: 'Quality Certification' } },
        { id: 'lessons-learned', type: 'output', data: { label: 'Quality Lessons Learned' } },
      ],
      edges: [
        { id: 'e1-2', source: 'quality-planning', target: 'quality-standards' },
        { id: 'e2-3', source: 'quality-standards', target: 'inspection-checklists' },
        { id: 'e3-4', source: 'inspection-checklists', target: 'material-testing' },
        { id: 'e4-5', source: 'material-testing', target: 'team-training' },
        { id: 'e5-6', source: 'team-training', target: 'baseline-inspection' },
        { id: 'e6-7', source: 'baseline-inspection', target: 'material-verification' },
        { id: 'e7-8', source: 'material-verification', target: 'work-inspection' },
        { id: 'e8-9', source: 'work-inspection', target: 'nonconformance' },
        { id: 'e9-10', source: 'nonconformance', target: 'corrective-action' },
        { id: 'e10-11', source: 'corrective-action', target: 'milestone-inspections' },
        { id: 'e11-12', source: 'milestone-inspections', target: 'documentation' },
        { id: 'e12-13', source: 'documentation', target: 'client-walkthroughs' },
        { id: 'e13-14', source: 'client-walkthroughs', target: 'final-inspection' },
        { id: 'e14-15', source: 'final-inspection', target: 'quality-certification' },
        { id: 'e15-16', source: 'quality-certification', target: 'lessons-learned' },
        // Quality improvement loops
        { id: 'e10-8', source: 'corrective-action', target: 'work-inspection' },
        { id: 'e16-1', source: 'lessons-learned', target: 'quality-planning' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Equipment Management
  {
    id: crypto.randomUUID(),
    name: "Equipment Fleet Management",
    description: "Comprehensive workflow for managing construction equipment and machinery fleet.",
    category: "Equipment",
    data: {
      nodes: [
        { id: 'needs-assessment', type: 'input', data: { label: 'Equipment Needs Assessment' } },
        { id: 'fleet-inventory', type: 'default', data: { label: 'Fleet Inventory Audit' } },
        { id: 'purchase-vs-rent', type: 'default', data: { label: 'Purchase vs. Rent Analysis' } },
        { id: 'procurement', type: 'default', data: { label: 'Equipment Procurement' } },
        { id: 'registration', type: 'default', data: { label: 'Registration & Documentation' } },
        { id: 'operator-training', type: 'default', data: { label: 'Operator Training & Certification' } },
        { id: 'maintenance-schedule', type: 'default', data: { label: 'Preventive Maintenance Schedule' } },
        { id: 'equipment-assignment', type: 'default', data: { label: 'Equipment Assignment to Projects' } },
        { id: 'usage-tracking', type: 'default', data: { label: 'Usage & Performance Tracking' } },
        { id: 'fuel-management', type: 'default', data: { label: 'Fuel & Consumables Management' } },
        { id: 'maintenance-execution', type: 'default', data: { label: 'Maintenance Execution' } },
        { id: 'repair-management', type: 'default', data: { label: 'Repair Management' } },
        { id: 'equipment-inspection', type: 'default', data: { label: 'Regular Equipment Inspection' } },
        { id: 'cost-tracking', type: 'default', data: { label: 'Cost Tracking & Analysis' } },
        { id: 'lifecycle-assessment', type: 'default', data: { label: 'Lifecycle Assessment' } },
        { id: 'replacement-planning', type: 'output', data: { label: 'Replacement Planning' } },
      ],
      edges: [
        { id: 'e1-2', source: 'needs-assessment', target: 'fleet-inventory' },
        { id: 'e2-3', source: 'fleet-inventory', target: 'purchase-vs-rent' },
        { id: 'e3-4', source: 'purchase-vs-rent', target: 'procurement' },
        { id: 'e4-5', source: 'procurement', target: 'registration' },
        { id: 'e5-6', source: 'registration', target: 'operator-training' },
        { id: 'e6-7', source: 'operator-training', target: 'maintenance-schedule' },
        { id: 'e7-8', source: 'maintenance-schedule', target: 'equipment-assignment' },
        { id: 'e8-9', source: 'equipment-assignment', target: 'usage-tracking' },
        { id: 'e9-10', source: 'usage-tracking', target: 'fuel-management' },
        { id: 'e10-11', source: 'fuel-management', target: 'maintenance-execution' },
        { id: 'e11-12', source: 'maintenance-execution', target: 'repair-management' },
        { id: 'e12-13', source: 'repair-management', target: 'equipment-inspection' },
        { id: 'e13-14', source: 'equipment-inspection', target: 'cost-tracking' },
        { id: 'e14-15', source: 'cost-tracking', target: 'lifecycle-assessment' },
        { id: 'e15-16', source: 'lifecycle-assessment', target: 'replacement-planning' },
        // Circular connections
        { id: 'e16-1', source: 'replacement-planning', target: 'needs-assessment' },
        { id: 'e13-11', source: 'equipment-inspection', target: 'maintenance-execution' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Scheduling
  {
    id: crypto.randomUUID(),
    name: "Advanced Project Scheduling",
    description: "Detailed workflow for managing construction project schedules with resource allocation.",
    category: "Scheduling",
    data: {
      nodes: [
        { id: 'wbs-creation', type: 'input', data: { label: 'Work Breakdown Structure Creation' } },
        { id: 'activity-definition', type: 'default', data: { label: 'Activity Definition' } },
        { id: 'sequence-determination', type: 'default', data: { label: 'Activity Sequencing' } },
        { id: 'duration-estimation', type: 'default', data: { label: 'Duration Estimation' } },
        { id: 'resource-planning', type: 'default', data: { label: 'Resource Planning' } },
        { id: 'critical-path', type: 'default', data: { label: 'Critical Path Analysis' } },
        { id: 'schedule-development', type: 'default', data: { label: 'Schedule Development' } },
        { id: 'schedule-optimization', type: 'default', data: { label: 'Schedule Optimization' } },
        { id: 'baseline-schedule', type: 'default', data: { label: 'Baseline Schedule Approval' } },
        { id: 'resource-allocation', type: 'default', data: { label: 'Resource Allocation' } },
        { id: 'schedule-distribution', type: 'default', data: { label: 'Schedule Distribution' } },
        { id: 'progress-tracking', type: 'default', data: { label: 'Progress Tracking' } },
        { id: 'delay-analysis', type: 'default', data: { label: 'Delay Analysis' } },
        { id: 'recovery-planning', type: 'default', data: { label: 'Recovery Planning' } },
        { id: 'schedule-updates', type: 'default', data: { label: 'Schedule Updates' } },
        { id: 'documentation', type: 'output', data: { label: 'Schedule Documentation' } },
      ],
      edges: [
        { id: 'e1-2', source: 'wbs-creation', target: 'activity-definition' },
        { id: 'e2-3', source: 'activity-definition', target: 'sequence-determination' },
        { id: 'e3-4', source: 'sequence-determination', target: 'duration-estimation' },
        { id: 'e4-5', source: 'duration-estimation', target: 'resource-planning' },
        { id: 'e5-6', source: 'resource-planning', target: 'critical-path' },
        { id: 'e6-7', source: 'critical-path', target: 'schedule-development' },
        { id: 'e7-8', source: 'schedule-development', target: 'schedule-optimization' },
        { id: 'e8-9', source: 'schedule-optimization', target: 'baseline-schedule' },
        { id: 'e9-10', source: 'baseline-schedule', target: 'resource-allocation' },
        { id: 'e10-11', source: 'resource-allocation', target: 'schedule-distribution' },
        { id: 'e11-12', source: 'schedule-distribution', target: 'progress-tracking' },
        { id: 'e12-13', source: 'progress-tracking', target: 'delay-analysis' },
        { id: 'e13-14', source: 'delay-analysis', target: 'recovery-planning' },
        { id: 'e14-15', source: 'recovery-planning', target: 'schedule-updates' },
        { id: 'e15-16', source: 'schedule-updates', target: 'documentation' },
        // Feedback loops
        { id: 'e15-12', source: 'schedule-updates', target: 'progress-tracking' },
        { id: 'e14-10', source: 'recovery-planning', target: 'resource-allocation' },
      ],
      created_at: new Date().toISOString()
    }
  },
  
  // Efficiency & Process Improvement
  {
    id: crypto.randomUUID(),
    name: "Lean Construction Implementation",
    description: "Workflow for implementing lean construction principles to improve efficiency and reduce waste.",
    category: "Efficiency",
    data: {
      nodes: [
        { id: 'lean-assessment', type: 'input', data: { label: 'Current State Assessment' } },
        { id: 'education', type: 'default', data: { label: 'Lean Construction Education' } },
        { id: 'value-stream', type: 'default', data: { label: 'Value Stream Mapping' } },
        { id: 'waste-identification', type: 'default', data: { label: 'Waste Identification' } },
        { id: 'process-redesign', type: 'default', data: { label: 'Process Redesign' } },
        { id: 'pull-planning', type: 'default', data: { label: 'Pull Planning Implementation' } },
        { id: 'last-planner', type: 'default', data: { label: 'Last Planner System Setup' } },
        { id: 'visual-management', type: 'default', data: { label: 'Visual Management Systems' } },
        { id: 'standard-work', type: 'default', data: { label: 'Standard Work Development' } },
        { id: 'continuous-flow', type: 'default', data: { label: 'Continuous Flow Creation' } },
        { id: 'prefabrication', type: 'default', data: { label: 'Prefabrication Strategy' } },
        { id: 'just-in-time', type: 'default', data: { label: 'Just-in-Time Delivery System' } },
        { id: 'daily-huddles', type: 'default', data: { label: 'Daily Huddles Implementation' } },
        { id: 'metrics-tracking', type: 'default', data: { label: 'Performance Metrics Tracking' } },
        { id: 'kaizen-events', type: 'default', data: { label: 'Kaizen Events' } },
        { id: 'continuous-improvement', type: 'output', data: { label: 'Continuous Improvement Culture' } },
      ],
      edges: [
        { id: 'e1-2', source: 'lean-assessment', target: 'education' },
        { id: 'e2-3', source: 'education', target: 'value-stream' },
        { id: 'e3-4', source: 'value-stream', target: 'waste-identification' },
        { id: 'e4-5', source: 'waste-identification', target: 'process-redesign' },
        { id: 'e5-6', source: 'process-redesign', target: 'pull-planning' },
        { id: 'e6-7', source: 'pull-planning', target: 'last-planner' },
        { id: 'e7-8', source: 'last-planner', target: 'visual-management' },
        { id: 'e8-9', source: 'visual-management', target: 'standard-work' },
        { id: 'e9-10', source: 'standard-work', target: 'continuous-flow' },
        { id: 'e10-11', source: 'continuous-flow', target: 'prefabrication' },
        { id: 'e11-12', source: 'prefabrication', target: 'just-in-time' },
        { id: 'e12-13', source: 'just-in-time', target: 'daily-huddles' },
        { id: 'e13-14', source: 'daily-huddles', target: 'metrics-tracking' },
        { id: 'e14-15', source: 'metrics-tracking', target: 'kaizen-events' },
        { id: 'e15-16', source: 'kaizen-events', target: 'continuous-improvement' },
        // Continuous improvement loops
        { id: 'e16-15', source: 'continuous-improvement', target: 'kaizen-events' },
        { id: 'e16-4', source: 'continuous-improvement', target: 'waste-identification' },
      ],
      created_at: new Date().toISOString()
    }
  }
];

export default function WorkflowTemplates() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategory, setFilteredCategory] = useState("");
  const [userWorkflows, setUserWorkflows] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  
  // Load user workflows when component mounts
  useEffect(() => {
    loadUserWorkflows();
  }, []);

  const loadUserWorkflows = async () => {
    setIsLoading(true);
    try {
      const { success, workflows } = await WorkflowService.getUserWorkflows();
      if (success && workflows) {
        setUserWorkflows(workflows);
      }
    } catch (error) {
      console.error("Error loading user workflows:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTemplates = WORKFLOW_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filteredCategory || template.category.toLowerCase() === filteredCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredUserWorkflows = userWorkflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (workflow.description && workflow.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filteredCategory || 
                           (workflow.category && workflow.category.toLowerCase() === filteredCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });
  
  const handleTemplateSelect = async (template: Workflow) => {
    try {
      // First save the template to the user's account
      const { success, id } = await WorkflowService.saveWorkflow(template);
      
      if (success) {
        toast.success("Template saved to your account");
        // Navigate to workflow editor with the saved template ID
        navigate(`/workflow?id=${id}`);
      } else {
        toast.error("Failed to save template");
      }
    } catch (error) {
      console.error("Error selecting template:", error);
      toast.error("An error occurred");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <WorkflowIcon className="mr-2 h-6 w-6" />
              Workflow Library
            </h1>
            <p className="text-gray-500 mt-1">
              Choose a template or recent workflow to use as a starting point
            </p>
          </div>
          <Button
            onClick={() => navigate("/workflow/list")}
            variant="outline"
            className="whitespace-nowrap"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Workflows
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="templates">Predefined Templates</TabsTrigger>
            <TabsTrigger value="recent">Recent Workflows</TabsTrigger>
          </TabsList>
          
          {/* Search and Filters - Common to both tabs */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search workflows..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={filteredCategory === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setFilteredCategory("")}
              >
                All Categories
              </Badge>
              {TEMPLATE_CATEGORIES.map((category) => (
                <Badge
                  key={category.id}
                  variant={filteredCategory === category.name ? "default" : "outline"}
                  className="cursor-pointer flex items-center gap-1"
                  onClick={() => setFilteredCategory(category.name)}
                >
                  {React.cloneElement(category.icon, { className: "h-3 w-3" })}
                  {category.name}
                </Badge>
              ))}
            </div>
          </div>
          
          <TabsContent value="templates">
            {/* Templates Content */}
            {filteredTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map((template) => (
                  <Card key={template.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <Badge>{template.category}</Badge>
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500">
                        <div>Nodes: {template.data.nodes.length}</div>
                        <div>Connections: {template.data.edges.length}</div>
                      </div>
                      <Button 
                        onClick={() => handleTemplateSelect(template)} 
                        className="w-full mt-4"
                      >
                        Use This Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <WorkflowIcon className="h-16 w-16 text-gray-400" />
                  <h2 className="text-xl font-semibold">No templates found</h2>
                  <p className="text-gray-500 max-w-md">
                    No templates match your current search criteria. Try adjusting your search or clear the filters.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("");
                      setFilteredCategory("");
                    }}
                    variant="outline"
                    className="mt-2"
                  >
                    Clear Filters
                  </Button>
                </div>
              </GlassCard>
            )}
          </TabsContent>
          
          <TabsContent value="recent">
            {/* Recent User Workflows Content */}
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading recent workflows...</p>
              </div>
            ) : filteredUserWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUserWorkflows.map((workflow) => (
                  <Card key={workflow.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{workflow.name}</CardTitle>
                        {workflow.category && <Badge>{workflow.category}</Badge>}
                      </div>
                      <CardDescription>{workflow.description || "No description"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(workflow.data?.created_at)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div>Nodes: {workflow.data?.nodes?.length || 0}</div>
                        <div>Connections: {workflow.data?.edges?.length || 0}</div>
                      </div>
                      <Button 
                        onClick={() => navigate(`/workflow?id=${workflow.id}`)} 
                        className="w-full mt-4"
                      >
                        Use This Workflow
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <GlassCard className="p-8 text-center">
                <div className="flex flex-col items-center gap-4">
                  <WorkflowIcon className="h-16 w-16 text-gray-400" />
                  <h2 className="text-xl font-semibold">No recent workflows found</h2>
                  <p className="text-gray-500 max-w-md">
                    {searchTerm || filteredCategory ? 
                      "No workflows match your current search criteria. Try adjusting your search or clear the filters." :
                      "You haven't created any workflows yet. Create your first workflow to get started."}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center mt-2">
                    {(searchTerm || filteredCategory) && (
                      <Button 
                        onClick={() => {
                          setSearchTerm("");
                          setFilteredCategory("");
                        }}
                        variant="outline"
                      >
                        Clear Filters
                      </Button>
                    )}
                    <Button 
                      onClick={() => navigate("/workflow")}
                      className="mt-2"
                    >
                      Create New Workflow
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
