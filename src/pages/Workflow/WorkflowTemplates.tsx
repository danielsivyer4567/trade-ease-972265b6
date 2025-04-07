
import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { toast } from 'sonner';
import { Badge } from "@/components/ui/badge";
import { Search, ArrowLeft, Workflow as WorkflowIcon, Building, Construction, CreditCard, HardHat, Truck, UserPlus, ClipboardList, Calendar, Zap, WrenchIcon, HomeIcon, ShieldCheck, Receipt, BarChart, Ruler, Clock, PlusCircle, Bookmark, Star } from "lucide-react";
import { GlassCard } from '@/components/ui/GlassCard';
import { WorkflowService, Workflow } from '@/services/WorkflowService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WorkflowSaveDialog } from './components/WorkflowSaveDialog';

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

// Detailed construction workflow templates with variations and colors
const WORKFLOW_TEMPLATES = [
  // Residential Construction Templates
  {
    id: crypto.randomUUID(),
    name: "Residential New Build - Standard",
    description: "Complete workflow for building a standard residential property from initial client consultation to handover.",
    category: "Residential",
    data: {
      nodes: [
        { id: 'client-consultation', type: 'customer', position: { x: 0, y: 0 }, data: { label: 'Initial Client Consultation' } },
        { id: 'site-assessment', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Site Assessment & Survey' } },
        { id: 'design-development', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Design Development' } },
        { id: 'council-approval', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Council Approval Process' } },
        { id: 'contract-signing', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Contract Signing' } },
        { id: 'material-ordering', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Material Ordering' } },
        { id: 'foundation-work', type: 'job', position: { x: 0, y: 600 }, data: { label: 'Foundation Work' } },
        { id: 'framing', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Framing & Roof Installation' } },
        { id: 'rough-ins', type: 'job', position: { x: 0, y: 800 }, data: { label: 'Electrical & Plumbing Rough-ins' } },
        { id: 'insulation', type: 'job', position: { x: 0, y: 900 }, data: { label: 'Insulation & Drywall' } },
        { id: 'interior-finishes', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Interior Finishes' } },
        { id: 'final-inspection', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Final Inspection' } },
        { id: 'handover', type: 'customer', position: { x: 0, y: 1200 }, data: { label: 'Client Handover' } },
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
        { id: 'client-consultation', type: 'customer', position: { x: 0, y: 0 }, data: { label: 'VIP Client Consultation' } },
        { id: 'site-assessment', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Detailed Site Assessment & Geo Survey' } },
        { id: 'architect-design', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Architect Design Development' } },
        { id: 'interior-designer', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Interior Designer Engagement' } },
        { id: 'material-selection', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Premium Material Selection' } },
        { id: 'council-approval', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Council & Heritage Approval' } },
        { id: 'detailed-contract', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Detailed Contract Signing' } },
        { id: 'pre-construction', type: 'task', position: { x: 0, y: 700 }, data: { label: 'Pre-construction Meeting' } },
        { id: 'foundation-work', type: 'job', position: { x: 0, y: 800 }, data: { label: 'Engineered Foundation Work' } },
        { id: 'custom-framing', type: 'job', position: { x: 0, y: 900 }, data: { label: 'Custom Framing & Structural Elements' } },
        { id: 'premium-systems', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Smart Home & Premium Systems' } },
        { id: 'custom-interiors', type: 'job', position: { x: 0, y: 1100 }, data: { label: 'Custom Interior Finishes' } },
        { id: 'landscaping', type: 'job', position: { x: 0, y: 1200 }, data: { label: 'Professional Landscaping' } },
        { id: 'quality-inspection', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Multi-point Quality Inspection' } },
        { id: 'client-walkthrough', type: 'customer', position: { x: 0, y: 1400 }, data: { label: 'Client Walkthrough & Adjustments' } },
        { id: 'handover', type: 'customer', position: { x: 0, y: 1500 }, data: { label: 'VIP Handover Package' } },
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
        { id: 'initial-consultation', type: 'customer', position: { x: 0, y: 0 }, data: { label: 'Initial Consultation' } },
        { id: 'kitchen-assessment', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Kitchen Assessment' } },
        { id: 'design-plans', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Design Plans & 3D Rendering' } },
        { id: 'material-selection', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Material & Appliance Selection' } },
        { id: 'quote-approval', type: 'quote', position: { x: 0, y: 400 }, data: { label: 'Quote Approval' } },
        { id: 'permits', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Permits (if required)' } },
        { id: 'demolition', type: 'job', position: { x: 0, y: 600 }, data: { label: 'Demolition & Removal' } },
        { id: 'plumbing-electrical', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Plumbing & Electrical Work' } },
        { id: 'drywall-flooring', type: 'job', position: { x: 0, y: 800 }, data: { label: 'Drywall & Flooring' } },
        { id: 'cabinet-installation', type: 'job', position: { x: 0, y: 900 }, data: { label: 'Cabinet Installation' } },
        { id: 'countertop-installation', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Countertop Installation' } },
        { id: 'appliance-installation', type: 'job', position: { x: 0, y: 1100 }, data: { label: 'Appliance Installation' } },
        { id: 'final-touches', type: 'job', position: { x: 0, y: 1200 }, data: { label: 'Backsplash & Final Touches' } },
        { id: 'final-inspection', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Final Inspection' } },
        { id: 'handover', type: 'customer', position: { x: 0, y: 1400 }, data: { label: 'Client Handover' } },
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
        { id: 'feasibility-study', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Feasibility Study' } },
        { id: 'land-acquisition', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Land Acquisition & Due Diligence' } },
        { id: 'concept-design', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Concept Design Development' } },
        { id: 'stakeholder-approval', type: 'customer', position: { x: 0, y: 300 }, data: { label: 'Stakeholder Approval' } },
        { id: 'detailed-design', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Detailed Design & Engineering' } },
        { id: 'regulatory-approval', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Regulatory Approval & Permits' } },
        { id: 'contractor-selection', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Contractor Selection' } },
        { id: 'site-preparation', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Site Preparation & Foundation' } },
        { id: 'core-shell', type: 'job', position: { x: 0, y: 800 }, data: { label: 'Core & Shell Construction' } },
        { id: 'mechanical-systems', type: 'job', position: { x: 0, y: 900 }, data: { label: 'Mechanical & Electrical Systems' } },
        { id: 'interior-fitout', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Interior Fit-out' } },
        { id: 'tenant-improvements', type: 'job', position: { x: 0, y: 1100 }, data: { label: 'Tenant Improvements' } },
        { id: 'commissioning', type: 'task', position: { x: 0, y: 1200 }, data: { label: 'Building Commissioning' } },
        { id: 'occupancy-certificate', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Occupancy Certificate' } },
        { id: 'tenant-move-in', type: 'customer', position: { x: 0, y: 1400 }, data: { label: 'Tenant Move-in' } },
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
        { id: 'lease-agreement', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Lease Agreement' } },
        { id: 'brand-briefing', type: 'customer', position: { x: 0, y: 100 }, data: { label: 'Brand & Requirements Briefing' } },
        { id: 'space-planning', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Space Planning & Customer Flow' } },
        { id: 'design-development', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Design Development & Visualization' } },
        { id: 'permit-application', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Permit Application' } },
        { id: 'contractor-selection', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Contractor Selection' } },
        { id: 'demolition', type: 'job', position: { x: 0, y: 600 }, data: { label: 'Demolition & Preparation' } },
        { id: 'structural-changes', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Structural Changes (if needed)' } },
        { id: 'utility-connections', type: 'job', position: { x: 0, y: 800 }, data: { label: 'Utility Connections & Services' } },
        { id: 'flooring-ceiling', type: 'job', position: { x: 0, y: 900 }, data: { label: 'Flooring & Ceiling Installation' } },
        { id: 'lighting-systems', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Lighting Systems' } },
        { id: 'fixture-installation', type: 'job', position: { x: 0, y: 1100 }, data: { label: 'Fixture & Display Installation' } },
        { id: 'signage-graphics', type: 'job', position: { x: 0, y: 1200 }, data: { label: 'Signage & Graphics' } },
        { id: 'technology-integration', type: 'job', position: { x: 0, y: 1300 }, data: { label: 'POS & Technology Integration' } },
        { id: 'final-styling', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Final Styling & Merchandising' } },
        { id: 'inspection', type: 'task', position: { x: 0, y: 1500 }, data: { label: 'Final Inspection' } },
        { id: 'store-opening', type: 'customer', position: { x: 0, y: 1600 }, data: { label: 'Store Opening' } },
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
        { id: 'safety-planning', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Safety Planning & Risk Assessment' } },
        { id: 'safety-documentation', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Safety Documentation Preparation' } },
        { id: 'site-setup', type: 'job', position: { x: 0, y: 200 }, data: { label: 'Site Setup & Safety Signage' } },
        { id: 'induction-training', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Worker Induction & Training' } },
        { id: 'ppe-distribution', type: 'job', position: { x: 0, y: 400 }, data: { label: 'PPE Distribution & Verification' } },
        { id: 'daily-toolbox', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Daily Toolbox Talks' } },
        { id: 'hazard-identification', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Hazard Identification Process' } },
        { id: 'equipment-inspections', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Equipment & Machinery Inspections' } },
        { id: 'compliance-audits', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Regular Compliance Audits' } },
        { id: 'incident-reporting', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Incident Reporting System' } },
        { id: 'corrective-actions', type: 'task', position: { x: 0, y: 1000 }, data: { label: 'Corrective Actions Implementation' } },
        { id: 'monthly-review', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Monthly Safety Review' } },
        { id: 'documentation-update', type: 'task', position: { x: 0, y: 1200 }, data: { label: 'Documentation Updates' } },
        { id: 'continuous-improvement', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Continuous Improvement Process' } },
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
        { id: 'project-estimate', type: 'quote', position: { x: 0, y: 0 }, data: { label: 'Initial Project Estimate' } },
        { id: 'budget-approval', type: 'customer', position: { x: 0, y: 100 }, data: { label: 'Budget Approval' } },
        { id: 'cost-breakdown', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Detailed Cost Breakdown' } },
        { id: 'vendor-bidding', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Vendor Bidding Process' } },
        { id: 'contract-negotiation', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Contract Negotiation' } },
        { id: 'purchase-orders', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Purchase Orders System' } },
        { id: 'progress-payment', type: 'quote', position: { x: 0, y: 600 }, data: { label: 'Progress Payment Schedule' } },
        { id: 'change-order-management', type: 'task', position: { x: 0, y: 700 }, data: { label: 'Change Order Management' } },
        { id: 'invoice-verification', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Invoice Verification & Approval' } },
        { id: 'payment-processing', type: 'quote', position: { x: 0, y: 900 }, data: { label: 'Payment Processing' } },
        { id: 'cost-tracking', type: 'task', position: { x: 0, y: 1000 }, data: { label: 'Ongoing Cost Tracking' } },
        { id: 'variance-analysis', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Variance Analysis' } },
        { id: 'forecast-updates', type: 'task', position: { x: 0, y: 1200 }, data: { label: 'Forecast Updates' } },
        { id: 'final-reconciliation', type: 'quote', position: { x: 0, y: 1300 }, data: { label: 'Final Cost Reconciliation' } },
        { id: 'financial-closeout', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Financial Closeout' } },
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
        { id: 'requirement-definition', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Subcontractor Requirements Definition' } },
        { id: 'prequalification', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Subcontractor Prequalification' } },
        { id: 'bid-package', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Bid Package Preparation' } },
        { id: 'bid-solicitation', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Bid Solicitation' } },
        { id: 'bid-evaluation', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Bid Evaluation & Comparison' } },
        { id: 'subcontractor-selection', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Subcontractor Selection' } },
        { id: 'contract-preparation', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Contract Preparation & Negotiation' } },
        { id: 'insurance-verification', type: 'task', position: { x: 0, y: 700 }, data: { label: 'Insurance & License Verification' } },
        { id: 'onboarding', type: 'customer', position: { x: 0, y: 800 }, data: { label: 'Subcontractor Onboarding' } },
        { id: 'schedule-integration', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Schedule Integration' } },
        { id: 'work-execution', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Work Execution & Monitoring' } },
        { id: 'quality-inspections', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Quality Inspections' } },
        { id: 'payment-processing', type: 'quote', position: { x: 0, y: 1200 }, data: { label: 'Progress Payment Processing' } },
        { id: 'issue-resolution', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Issue Resolution Process' } },
        { id: 'work-completion', type: 'job', position: { x: 0, y: 1400 }, data: { label: 'Work Completion Verification' } },
        { id: 'final-payment', type: 'quote', position: { x: 0, y: 1500 }, data: { label: 'Final Payment Processing' } },
        { id: 'performance-evaluation', type: 'task', position: { x: 0, y: 1600 }, data: { label: 'Performance Evaluation' } },
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
        { id: 'quality-planning', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Quality Management Planning' } },
        { id: 'quality-standards', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Quality Standards Definition' } },
        { id: 'inspection-checklists', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Inspection Checklists Creation' } },
        { id: 'material-testing', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Material Testing Protocols' } },
        { id: 'team-training', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Quality Team Training' } },
        { id: 'baseline-inspection', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Baseline Quality Inspection' } },
        { id: 'material-verification', type: 'vision', position: { x: 0, y: 600 }, data: { label: 'Material Quality Verification' } },
        { id: 'work-inspection', type: 'vision', position: { x: 0, y: 700 }, data: { label: 'Work-in-Progress Inspections' } },
        { id: 'nonconformance', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Nonconformance Reporting' } },
        { id: 'corrective-action', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Corrective Action Implementation' } },
        { id: 'milestone-inspections', type: 'vision', position: { x: 0, y: 1000 }, data: { label: 'Milestone Quality Inspections' } },
        { id: 'documentation', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Quality Documentation' } },
        { id: 'client-walkthroughs', type: 'customer', position: { x: 0, y: 1200 }, data: { label: 'Client Quality Walkthroughs' } },
        { id: 'final-inspection', type: 'vision', position: { x: 0, y: 1300 }, data: { label: 'Final Quality Inspection' } },
        { id: 'quality-certification', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Quality Certification' } },
        { id: 'lessons-learned', type: 'task', position: { x: 0, y: 1500 }, data: { label: 'Quality Lessons Learned' } },
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
        { id: 'needs-assessment', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Equipment Needs Assessment' } },
        { id: 'fleet-inventory', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Fleet Inventory Audit' } },
        { id: 'purchase-vs-rent', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Purchase vs. Rent Analysis' } },
        { id: 'procurement', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Equipment Procurement' } },
        { id: 'registration', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Registration & Documentation' } },
        { id: 'operator-training', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Operator Training & Certification' } },
        { id: 'maintenance-schedule', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Preventive Maintenance Schedule' } },
        { id: 'equipment-assignment', type: 'job', position: { x: 0, y: 700 }, data: { label: 'Equipment Assignment to Projects' } },
        { id: 'usage-tracking', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Usage & Performance Tracking' } },
        { id: 'fuel-management', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Fuel & Consumables Management' } },
        { id: 'maintenance-execution', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Maintenance Execution' } },
        { id: 'repair-management', type: 'job', position: { x: 0, y: 1100 }, data: { label: 'Repair Management' } },
        { id: 'equipment-inspection', type: 'vision', position: { x: 0, y: 1200 }, data: { label: 'Regular Equipment Inspection' } },
        { id: 'cost-tracking', type: 'quote', position: { x: 0, y: 1300 }, data: { label: 'Cost Tracking & Analysis' } },
        { id: 'lifecycle-assessment', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Lifecycle Assessment' } },
        { id: 'replacement-planning', type: 'task', position: { x: 0, y: 1500 }, data: { label: 'Replacement Planning' } },
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
        { id: 'wbs-creation', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Work Breakdown Structure Creation' } },
        { id: 'activity-definition', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Activity Definition' } },
        { id: 'sequence-determination', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Activity Sequencing' } },
        { id: 'duration-estimation', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Duration Estimation' } },
        { id: 'resource-planning', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Resource Planning' } },
        { id: 'critical-path', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Critical Path Analysis' } },
        { id: 'schedule-development', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Schedule Development' } },
        { id: 'schedule-optimization', type: 'task', position: { x: 0, y: 700 }, data: { label: 'Schedule Optimization' } },
        { id: 'baseline-schedule', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Baseline Schedule Approval' } },
        { id: 'resource-allocation', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Resource Allocation' } },
        { id: 'schedule-distribution', type: 'task', position: { x: 0, y: 1000 }, data: { label: 'Schedule Distribution' } },
        { id: 'progress-tracking', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Progress Tracking' } },
        { id: 'delay-analysis', type: 'task', position: { x: 0, y: 1200 }, data: { label: 'Delay Analysis' } },
        { id: 'recovery-planning', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Recovery Planning' } },
        { id: 'schedule-updates', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Schedule Updates' } },
        { id: 'documentation', type: 'task', position: { x: 0, y: 1500 }, data: { label: 'Schedule Documentation' } },
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
        { id: 'lean-assessment', type: 'task', position: { x: 0, y: 0 }, data: { label: 'Current State Assessment' } },
        { id: 'education', type: 'task', position: { x: 0, y: 100 }, data: { label: 'Lean Construction Education' } },
        { id: 'value-stream', type: 'task', position: { x: 0, y: 200 }, data: { label: 'Value Stream Mapping' } },
        { id: 'waste-identification', type: 'task', position: { x: 0, y: 300 }, data: { label: 'Waste Identification' } },
        { id: 'process-redesign', type: 'task', position: { x: 0, y: 400 }, data: { label: 'Process Redesign' } },
        { id: 'pull-planning', type: 'task', position: { x: 0, y: 500 }, data: { label: 'Pull Planning Implementation' } },
        { id: 'last-planner', type: 'task', position: { x: 0, y: 600 }, data: { label: 'Last Planner System Setup' } },
        { id: 'visual-management', type: 'task', position: { x: 0, y: 700 }, data: { label: 'Visual Management Systems' } },
        { id: 'standard-work', type: 'task', position: { x: 0, y: 800 }, data: { label: 'Standard Work Development' } },
        { id: 'continuous-flow', type: 'task', position: { x: 0, y: 900 }, data: { label: 'Continuous Flow Creation' } },
        { id: 'prefabrication', type: 'job', position: { x: 0, y: 1000 }, data: { label: 'Prefabrication Strategy' } },
        { id: 'just-in-time', type: 'task', position: { x: 0, y: 1100 }, data: { label: 'Just-in-Time Delivery System' } },
        { id: 'daily-huddles', type: 'task', position: { x: 0, y: 1200 }, data: { label: 'Daily Huddles Implementation' } },
        { id: 'metrics-tracking', type: 'task', position: { x: 0, y: 1300 }, data: { label: 'Performance Metrics Tracking' } },
        { id: 'kaizen-events', type: 'task', position: { x: 0, y: 1400 }, data: { label: 'Kaizen Events' } },
        { id: 'continuous-improvement', type: 'task', position: { x: 0, y: 1500 }, data: { label: 'Continuous Improvement Culture' } },
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
  const [userTemplates, setUserTemplates] = useState<Workflow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("templates");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  
  // Load user workflows and templates when component mounts
  useEffect(() => {
    loadUserWorkflows();
    loadUserTemplates();
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

  const loadUserTemplates = async () => {
    try {
      const { success, templates } = await WorkflowService.getUserTemplates();
      if (success && templates) {
        setUserTemplates(templates);
      }
    } catch (error) {
      console.error("Error loading user templates:", error);
    }
  };

  const handleSaveAsTemplate = async (name: string, description: string) => {
    if (!selectedWorkflow) return;
    
    const templateToSave = {
      ...selectedWorkflow,
      name,
      description,
    };
    
    try {
      const { success } = await WorkflowService.saveAsTemplate(templateToSave);
      if (success) {
        toast.success("Workflow saved as template");
        setSaveDialogOpen(false);
        loadUserTemplates();
      } else {
        toast.error("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("An error occurred");
    }
  };

  const filteredPredefinedTemplates = WORKFLOW_TEMPLATES.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filteredCategory || template.category.toLowerCase() === filteredCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const filteredUserTemplates = userTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !filteredCategory || 
                           (template.category && template.category.toLowerCase() === filteredCategory.toLowerCase());
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

  // Function to determine card border color based on node types
  const getCardBorderColor = (workflow: Workflow) => {
    const nodeTypes = workflow.data?.nodes?.map((node: any) => node.type) || [];
    
    if (nodeTypes.includes('customer')) return "border-l-blue-500";
    if (nodeTypes.includes('job')) return "border-l-green-500";
    if (nodeTypes.includes('quote')) return "border-l-yellow-500";
    if (nodeTypes.includes('task')) return "border-l-purple-500";
    if (nodeTypes.includes('vision')) return "border-l-red-500";
    
    return "border-l-gray-300";
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
            <TabsTrigger value="user-templates">My Templates</TabsTrigger>
            <TabsTrigger value="recent">Recent Workflows</TabsTrigger>
          </TabsList>
          
          {/* Search and Filters - Common to all tabs */}
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
          
          {/* Predefined Templates Tab */}
          <TabsContent value="templates">
            {filteredPredefinedTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPredefinedTemplates.map((template) => (
                  <Card key={template.id} className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${getCardBorderColor(template)}`}>
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
          
          {/* User Templates Tab */}
          <TabsContent value="user-templates">
            {userTemplates.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUserTemplates.map((template) => (
                  <Card key={template.id} className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${getCardBorderColor(template)}`}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.category && <Badge>{template.category}</Badge>}
                      </div>
                      <CardDescription>{template.description || "No description"}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-500 flex items-center mt-1">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDate(template.data?.created_at)}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        <div>Nodes: {template.data?.nodes?.length || 0}</div>
                        <div>Connections: {template.data?.edges?.length || 0}</div>
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
                  <Star className="h-16 w-16 text-gray-400" />
                  <h2 className="text-xl font-semibold">No custom templates found</h2>
                  <p className="text-gray-500 max-w-md">
                    You haven't saved any workflows as templates yet. You can convert your workflows to templates from the "Recent Workflows" tab.
                  </p>
                </div>
              </GlassCard>
            )}
          </TabsContent>
          
          {/* Recent User Workflows Content */}
          <TabsContent value="recent">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <p>Loading recent workflows...</p>
              </div>
            ) : filteredUserWorkflows.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUserWorkflows.map((workflow) => (
                  <Card key={workflow.id} className={`overflow-hidden hover:shadow-md transition-shadow border-l-4 ${getCardBorderColor(workflow)}`}>
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
                      <div className="flex gap-2 mt-4">
                        <Button 
                          onClick={() => navigate(`/workflow?id=${workflow.id}`)} 
                          className="flex-1"
                        >
                          Use Workflow
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => {
                            setSelectedWorkflow(workflow);
                            setSaveDialogOpen(true);
                          }}
                          className="flex items-center"
                        >
                          <Bookmark className="h-4 w-4 mr-1" />
                          Save as Template
                        </Button>
                      </div>
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
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Create New Workflow
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <WorkflowSaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        onSave={handleSaveAsTemplate}
        isLoading={false}
        initialName={selectedWorkflow?.name ? `${selectedWorkflow.name} Template` : ''}
        initialDescription={selectedWorkflow?.description || ''}
      />
    </AppLayout>
  );
}
