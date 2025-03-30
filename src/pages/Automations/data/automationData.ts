
import { Automation } from '../types';

export const automationData: Automation[] = [
  {
    id: 1,
    title: 'New Job Alert',
    description: 'Send a notification to team members when a new job is assigned',
    isActive: true,
    triggers: ['New job created', 'Job assignment changed'],
    actions: ['Send notification', 'Update calendar'],
    category: 'team'
  },
  {
    id: 2,
    title: 'Document Expiry Reminder',
    description: 'Remind customers when their documents are about to expire',
    isActive: true,
    triggers: ['Document expiry <= 30 days'],
    actions: ['Send email reminder', 'Create follow-up task'],
    category: 'customer'
  },
  {
    id: 3,
    title: 'Quote Follow-up',
    description: 'Send a follow-up message if quote hasn\'t been accepted after 3 days',
    isActive: false,
    triggers: ['Quote created > 3 days', 'Quote status = pending'],
    actions: ['Send follow-up email', 'Create reminder for sales team'],
    category: 'sales'
  },
  {
    id: 4,
    title: 'Weather Alert',
    description: 'Notify team if bad weather is forecasted for scheduled outdoor jobs',
    isActive: true,
    triggers: ['Weather forecast = rain/storm', 'Job type = outdoor'],
    actions: ['Send SMS alert', 'Suggest reschedule options'],
    category: 'team'
  },
  {
    id: 5,
    title: 'Material Shortage Detection',
    description: 'Monitor inventory and proactively order supplies before projects are affected',
    isActive: true,
    triggers: ['Inventory level <= threshold', 'Job requires material'],
    actions: ['Create purchase order', 'Notify procurement team'],
    category: 'inventory',
    premium: true
  },
  {
    id: 6,
    title: 'Customer Review Automation',
    description: 'Request reviews from satisfied customers to boost your online reputation',
    isActive: true,
    triggers: ['Job marked as complete', 'Customer satisfaction = high'],
    actions: ['Send review request', 'Offer discount on next service'],
    category: 'marketing'
  },
  {
    id: 7,
    title: 'Late Payment Follow-up',
    description: 'Automatically chase overdue invoices with escalating messages',
    isActive: false,
    triggers: ['Invoice overdue > 7 days', 'Payment status = pending'],
    actions: ['Send payment reminder', 'Escalate to accounts team'],
    category: 'finance'
  },
  {
    id: 8,
    title: 'Compliance Documentation',
    description: 'Ensure all regulatory requirements are met before job completion',
    isActive: true,
    triggers: ['Job nearing completion', 'Required documents missing'],
    actions: ['Notify site manager', 'Generate compliance checklist'],
    category: 'compliance',
    premium: true
  },
  {
    id: 9,
    title: 'Subcontractor Management',
    description: 'Automate subcontractor scheduling and documentation verification',
    isActive: false,
    triggers: ['Job requires specialty trade', 'Subcontractor availability = true'],
    actions: ['Send job details', 'Request qualification documents'],
    category: 'team'
  },
  {
    id: 10,
    title: 'Equipment Maintenance',
    description: 'Schedule preventative maintenance based on usage hours',
    isActive: true,
    triggers: ['Equipment hours > threshold', 'No scheduled maintenance'],
    actions: ['Create maintenance task', 'Order replacement parts if needed'],
    category: 'equipment',
    premium: true
  },
  {
    id: 11,
    title: 'Client Communication',
    description: 'Keep clients informed with automated progress updates',
    isActive: true,
    triggers: ['Job status changed', 'Milestone completed'],
    actions: ['Send progress update', 'Share photos of completed work'],
    category: 'customer'
  },
  {
    id: 12,
    title: 'Lead Qualification',
    description: 'Score and prioritize leads based on custom criteria',
    isActive: true,
    triggers: ['New lead received', 'Budget matches criteria'],
    actions: ['Assign priority score', 'Route to appropriate salesperson'],
    category: 'sales',
    premium: true
  },
  {
    id: 13,
    title: 'Smart Tool Tracking',
    description: 'Track tools between job sites and automatically assign responsibility',
    isActive: true,
    triggers: ['Tool scanned at job site', 'Tool assigned to team member'],
    actions: ['Update tool location', 'Notify team member of responsibility'],
    category: 'equipment'
  },
  {
    id: 14,
    title: 'Safety Certification Monitor',
    description: 'Track team certification expirations and schedule necessary training',
    isActive: true,
    triggers: ['Certification < 60 days to expiry', 'Required certification missing'],
    actions: ['Schedule training courses', 'Send renewal notifications'],
    category: 'compliance',
    premium: true
  },
  {
    id: 15,
    title: 'Weather Risk Assessment',
    description: 'Automatically evaluate weather forecasts to assess job site risks',
    isActive: true,
    triggers: ['Severe weather alert issued', 'High heat days forecasted'],
    actions: ['Send safety protocol reminders', 'Adjust work schedule if needed'],
    category: 'team'
  },
  {
    id: 16,
    title: 'Trade Waste Management',
    description: 'Schedule waste collection and recycling for different material types',
    isActive: false,
    triggers: ['Job completion form submitted', 'Waste bins nearing capacity'],
    actions: ['Schedule pickup service', 'Document disposal compliance'],
    category: 'compliance'
  },
  {
    id: 17,
    title: 'Material Cost Fluctuation',
    description: 'Monitor supplier pricing and alert when material costs change significantly',
    isActive: true,
    triggers: ['Price increase > 5%', 'Material shortage reported'],
    actions: ['Alert procurement team', 'Suggest alternative suppliers'],
    category: 'inventory',
    premium: true
  },
  {
    id: 18,
    title: 'Permit & License Tracker',
    description: 'Monitor all required permits and licenses for active jobs',
    isActive: true,
    triggers: ['Permit expiring < 30 days', 'New job requires specific permits'],
    actions: ['Create renewal tasks', 'Escalate to compliance manager'],
    category: 'compliance'
  },
  {
    id: 19,
    title: 'Seasonal Maintenance Reminder',
    description: 'Schedule recurring seasonal maintenance for customer retention',
    isActive: true,
    triggers: ['Season change detected', 'Customer due for maintenance'],
    actions: ['Generate outreach campaign', 'Create follow-up tasks'],
    category: 'customer'
  },
  {
    id: 20,
    title: 'Vehicle Fleet Maintenance',
    description: 'Schedule preventative maintenance based on mileage and usage',
    isActive: true,
    triggers: ['Vehicle mileage threshold', 'Service due based on calendar'],
    actions: ['Create service appointment', 'Assign temporary vehicle if needed'],
    category: 'equipment'
  },
  {
    id: 21,
    title: 'Project Timeline Monitoring',
    description: 'Detect potential schedule slippage and alert project managers',
    isActive: true,
    triggers: ['Task completion delay > 2 days', 'Critical path affected'],
    actions: ['Notify project manager', 'Suggest resource reallocation'],
    category: 'team',
    premium: true
  },
  {
    id: 22,
    title: 'Supplier Performance Tracking',
    description: 'Evaluate supplier reliability and product quality over time',
    isActive: false,
    triggers: ['Late delivery detected', 'Quality issue reported'],
    actions: ['Update supplier rating', 'Suggest alternative vendors'],
    category: 'inventory'
  },
  {
    id: 23,
    title: 'Cross-Selling Opportunties',
    description: 'Identify additional service opportunities based on job type',
    isActive: true,
    triggers: ['Job completed successfully', 'Customer satisfaction high'],
    actions: ['Generate related service suggestions', 'Schedule follow-up call'],
    category: 'sales'
  },
  {
    id: 24,
    title: 'Warranty Period Monitor',
    description: 'Track warranty periods for completed jobs and schedule check-ins',
    isActive: true,
    triggers: ['Warranty nearing expiration', 'Seasonal check-in due'],
    actions: ['Schedule maintenance reminder', 'Generate customer communication'],
    category: 'customer'
  },
  {
    id: 25,
    title: 'Trade Efficiency Analysis',
    description: 'Compare planned vs. actual time spent on jobs to improve estimates',
    isActive: true,
    triggers: ['Job completed', 'Actual hours > estimated hours by 20%'],
    actions: ['Generate efficiency report', 'Update estimation templates'],
    category: 'finance',
    premium: true
  },
  {
    id: 26,
    title: 'Site Safety Checklist',
    description: 'Automatically generate site-specific safety checklists based on job type',
    isActive: true,
    triggers: ['New job created', 'High-risk task scheduled'],
    actions: ['Generate safety checklist', 'Assign team review tasks'],
    category: 'compliance'
  },
  {
    id: 27,
    title: 'Client Property Protection',
    description: 'Generate protection requirements for client property before work begins',
    isActive: true,
    triggers: ['Indoor job scheduled', 'High-value property noted'],
    actions: ['Create property protection list', 'Add to job preparation tasks'],
    category: 'customer'
  },
  {
    id: 28,
    title: 'Smart Parts Ordering',
    description: 'Automatically order common parts when inventory falls below threshold',
    isActive: false,
    triggers: ['Inventory level < minimum threshold', 'Part used frequently'],
    actions: ['Generate purchase order', 'Track shipment status'],
    category: 'inventory',
    premium: true
  },
  {
    id: 29,
    title: 'Job Completion Form',
    description: 'Automatically send job completion forms when a job is marked as finished',
    isActive: true,
    triggers: ['Job status changed to completed', 'Customer email available'],
    actions: ['Generate job completion form', 'Send form to customer'],
    category: 'forms'
  },
  {
    id: 30,
    title: 'Site Inspection Form',
    description: 'Schedule and send site inspection forms to team members before job starts',
    isActive: true,
    triggers: ['Job scheduled', '48 hours before job start'],
    actions: ['Generate site inspection form', 'Assign to responsible team member'],
    category: 'forms'
  },
  {
    id: 31,
    title: 'Customer Feedback Form',
    description: 'Send customer feedback forms after job completion to gather insights',
    isActive: true,
    triggers: ['Job marked as complete', '24 hours after completion'],
    actions: ['Send feedback form to customer', 'Create follow-up task if no response'],
    category: 'forms'
  },
  {
    id: 32,
    title: 'Material Request Form',
    description: 'Enable team members to submit material requests that require approval',
    isActive: false,
    triggers: ['Material request submitted', 'Inventory level below threshold'],
    actions: ['Send approval request to manager', 'Create purchase order when approved'],
    category: 'forms'
  }
];
