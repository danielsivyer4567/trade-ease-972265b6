
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
      ],
      created_at: new Date().toISOString()
    }
  }
];

const WorkflowTemplates: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<Workflow | null>(null);
  const [userTemplates, setUserTemplates] = useState<Workflow[]>([]);

  useEffect(() => {
    // Load user templates when the component mounts
    const loadUserTemplates = async () => {
      const result = await WorkflowService.getUserTemplates();
      if (result.success && result.templates) {
        setUserTemplates(result.templates);
      }
    };
    
    loadUserTemplates();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const handleGoBack = () => {
    navigate('/workflow');
  };

  const filterTemplates = () => {
    // Combine built-in templates with user templates
    const allTemplates = [...WORKFLOW_TEMPLATES, ...userTemplates];
    
    return allTemplates.filter(template => {
      const matchesCategory = selectedCategory === 'all' || 
        template.category?.toLowerCase() === selectedCategory.toLowerCase();
      
      const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesCategory && matchesSearch;
    });
  };

  const handleUseTemplate = (template: Workflow) => {
    setCurrentTemplate(template);
    setShowSaveDialog(true);
  };

  const handleSaveDialogClose = () => {
    setShowSaveDialog(false);
    setCurrentTemplate(null);
  };

  const handleCreateWorkflow = async (name: string, description: string, category: string) => {
    if (!currentTemplate) return;
    
    try {
      // Create a new workflow from the template
      const newWorkflow: Workflow = {
        id: crypto.randomUUID(), // Generate a new ID for the workflow
        name,
        description,
        category,
        data: currentTemplate.data,
        is_template: false // This is a workflow, not a template
      };
      
      const result = await WorkflowService.saveWorkflow(newWorkflow);
      
      if (result.success) {
        toast.success("Workflow created successfully!");
        navigate(`/workflow/edit/${result.id}`);
      } else {
        toast.error("Failed to create workflow");
      }
    } catch (error) {
      console.error("Error creating workflow:", error);
      toast.error("An error occurred while creating the workflow");
    } finally {
      setShowSaveDialog(false);
      setCurrentTemplate(null);
    }
  };

  const filteredTemplates = filterTemplates();

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center mb-6 gap-4">
          <Button
            variant="outline"
            onClick={handleGoBack}
            className="flex items-center gap-2 mb-4 md:mb-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Workflows
          </Button>
          
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold">Workflow Templates</h1>
            <p className="text-gray-500 mt-1">Use templates to quickly create workflows for your projects</p>
          </div>
          
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
        </div>

        <Tabs defaultValue="library">
          <TabsList className="mb-4">
            <TabsTrigger value="library">Template Library</TabsTrigger>
            <TabsTrigger value="my-templates">My Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="library" className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge
                onClick={() => handleCategorySelect('all')}
                className={`cursor-pointer px-3 py-1 ${
                  selectedCategory === 'all'
                    ? 'bg-blue-500 hover:bg-blue-600'
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                All
              </Badge>
              
              {TEMPLATE_CATEGORIES.map((category) => (
                <Badge
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className={`cursor-pointer px-3 py-1 flex items-center gap-1 ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 hover:bg-blue-600'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  {category.icon}
                  {category.name}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <GlassCard key={template.id} className="relative">
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-blue-100 text-blue-700 border border-blue-300">
                      {template.category || 'General'}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold mt-2 mb-2">{template.name}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex justify-between items-center mt-auto">
                    <Button
                      variant="default"
                      onClick={() => handleUseTemplate(template)}
                      className="w-full"
                    >
                      Use This Template
                    </Button>
                  </div>
                </GlassCard>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="my-templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userTemplates.length > 0 ? (
                userTemplates.map((template) => (
                  <GlassCard key={template.id} className="relative">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-green-100 text-green-700 border border-green-300">
                        {template.category || 'Custom'}
                      </Badge>
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-2 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{template.description}</p>
                    
                    <div className="flex justify-between items-center mt-auto">
                      <Button
                        variant="default"
                        onClick={() => handleUseTemplate(template)}
                        className="w-full"
                      >
                        Use This Template
                      </Button>
                    </div>
                  </GlassCard>
                ))
              ) : (
                <div className="col-span-full text-center py-8">
                  <div className="text-gray-400 mb-4">
                    <Bookmark className="h-12 w-12 mx-auto mb-2" />
                    <h3 className="text-xl font-medium">No Custom Templates Yet</h3>
                  </div>
                  <p className="text-gray-500 mb-4">
                    You haven't saved any custom workflow templates yet. Create a workflow and save it as a template.
                  </p>
                  <Button onClick={() => navigate('/workflow/new')}>
                    Create New Workflow
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Save Dialog for creating a workflow from a template */}
      {showSaveDialog && currentTemplate && (
        <WorkflowSaveDialog
          open={showSaveDialog}
          onClose={handleSaveDialogClose}
          onSave={handleCreateWorkflow}
          initialName={currentTemplate.name}
          initialDescription={currentTemplate.description || ''}
          initialCategory={currentTemplate.category || ''}
          title="Create Workflow from Template"
        />
      )}
    </AppLayout>
  );
};

export default WorkflowTemplates;
