import { CrmContact, CrmPipelineType } from "../components/messaging/hooks/useCrmContacts";

// Generate random avatar URLs
const getRandomAvatar = (name: string) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  const colors = ['4299E1', '48BB78', 'ED8936', 'ECC94B', '9F7AEA', 'ED64A6'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return `https://ui-avatars.com/api/?name=${initials}&background=${color}&color=fff`;
};

// Sample platforms
const platforms = [
  'facebook', 
  'whatsapp', 
  'email', 
  'instagram', 
  'linkedin', 
  'sms', 
  'phone', 
  'twitter', 
  'tiktok'
];

// Generate random contact data
export const generateMockContacts = (): CrmContact[] => {
  const contacts: CrmContact[] = [];
  
  // Pre-quote contacts
  contacts.push(
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      avatar: getRandomAvatar('John Smith'),
      status: 'new',
      pipeline: 'pre-quote',
      platforms: ['email', 'whatsapp'],
      last_message: 'Hello, I'm interested in your services. Can you send me a quote for a website?',
      last_updated: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      priority: 'medium',
      tags: ['new lead', 'website']
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 987-6543',
      avatar: getRandomAvatar('Sarah Johnson'),
      status: 'needs-reply',
      pipeline: 'pre-quote',
      platforms: ['facebook', 'email'],
      last_message: 'I need to get a quote for my business. We need branding and a website.',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      priority: 'high',
      tags: ['branding', 'website']
    },
    {
      id: '3',
      name: 'Michael Brown',
      email: 'mbrown@example.com',
      phone: '+1 (555) 456-7890',
      avatar: getRandomAvatar('Michael Brown'),
      status: 'responded',
      pipeline: 'pre-quote',
      platforms: ['whatsapp', 'sms'],
      last_message: 'Thanks for the information! I'll review the details and get back to you.',
      last_updated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      priority: 'medium',
      assigned_to: 'sales-rep-1',
      tags: ['e-commerce']
    },
    {
      id: '4',
      name: 'Emily Wilson',
      email: 'emily.w@example.com',
      phone: '+1 (555) 234-5678',
      avatar: getRandomAvatar('Emily Wilson'),
      status: 'follow-up',
      pipeline: 'pre-quote',
      platforms: ['linkedin', 'email'],
      last_message: 'I haven't heard back from you in a while. Are you still interested in our services?',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: 'low',
      tags: ['follow-up', 'cold lead']
    },
    {
      id: '5',
      name: 'Daniel Lee',
      email: 'daniel.lee@example.com',
      phone: '+1 (555) 345-6789',
      avatar: getRandomAvatar('Daniel Lee'),
      status: 'done',
      pipeline: 'pre-quote',
      platforms: ['email', 'phone'],
      last_message: 'I've decided to go with another provider. Thanks for your time.',
      last_updated: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
      priority: 'low',
      tags: ['lost deal']
    }
  );

  // Post-quote contacts
  contacts.push(
    {
      id: '6',
      name: 'Jennifer Garcia',
      email: 'jgarcia@example.com',
      phone: '+1 (555) 567-8901',
      avatar: getRandomAvatar('Jennifer Garcia'),
      status: 'accepted',
      pipeline: 'post-quote',
      platforms: ['email', 'whatsapp'],
      last_message: 'I've approved the quote. When can we start?',
      last_updated: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(), // 8 hours ago
      priority: 'high',
      quote_id: 'QUOTE-001',
      customer_id: 'CUST-001',
      tags: ['new customer', 'approved']
    },
    {
      id: '7',
      name: 'Robert Martinez',
      email: 'robert.m@example.com',
      phone: '+1 (555) 678-9012',
      avatar: getRandomAvatar('Robert Martinez'),
      status: 'processing',
      pipeline: 'post-quote',
      platforms: ['sms', 'email'],
      last_message: 'Thanks for the update. Looking forward to seeing the first draft.',
      last_updated: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(), // 1.5 days ago
      priority: 'medium',
      quote_id: 'QUOTE-002',
      customer_id: 'CUST-002',
      assigned_to: 'designer-1',
      tags: ['in progress', 'design phase']
    },
    {
      id: '8',
      name: 'Lisa Thompson',
      email: 'lisa.t@example.com',
      phone: '+1 (555) 789-0123',
      avatar: getRandomAvatar('Lisa Thompson'),
      status: 'shipped',
      pipeline: 'post-quote',
      platforms: ['email', 'phone'],
      last_message: 'We've shipped your order. Here's the tracking information: TRK123456789',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      priority: 'medium',
      quote_id: 'QUOTE-003',
      customer_id: 'CUST-003',
      tags: ['shipped', 'physical product']
    },
    {
      id: '9',
      name: 'David Clark',
      email: 'dclark@example.com',
      phone: '+1 (555) 890-1234',
      avatar: getRandomAvatar('David Clark'),
      status: 'delivered',
      pipeline: 'post-quote',
      platforms: ['whatsapp', 'email'],
      last_message: 'I've received the product. It looks great!',
      last_updated: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
      priority: 'low',
      quote_id: 'QUOTE-004',
      customer_id: 'CUST-004',
      tags: ['delivered', 'follow-up for feedback']
    },
    {
      id: '10',
      name: 'Amanda Rodriguez',
      email: 'amanda.r@example.com',
      phone: '+1 (555) 901-2345',
      avatar: getRandomAvatar('Amanda Rodriguez'),
      status: 'feedback',
      pipeline: 'post-quote',
      platforms: ['facebook', 'email'],
      last_message: 'I'm very happy with the service. I'll definitely recommend you to others!',
      last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      priority: 'low',
      quote_id: 'QUOTE-005',
      customer_id: 'CUST-005',
      tags: ['positive feedback', 'potential referral']
    }
  );

  // Complaints
  contacts.push(
    {
      id: '11',
      name: 'James Wilson',
      email: 'jwilson@example.com',
      phone: '+1 (555) 012-3456',
      avatar: getRandomAvatar('James Wilson'),
      status: 'new-complaint',
      pipeline: 'complaints',
      platforms: ['email', 'phone'],
      last_message: 'The product I received was damaged during shipping. I'd like a replacement.',
      last_updated: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      priority: 'high',
      quote_id: 'QUOTE-006',
      customer_id: 'CUST-006',
      tags: ['damaged product', 'shipping issue']
    },
    {
      id: '12',
      name: 'Patricia Moore',
      email: 'pmoore@example.com',
      phone: '+1 (555) 123-4567',
      avatar: getRandomAvatar('Patricia Moore'),
      status: 'investigating',
      pipeline: 'complaints',
      platforms: ['twitter', 'email'],
      last_message: 'I'm still waiting for a response about my refund request from last week.',
      last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      priority: 'urgent',
      quote_id: 'QUOTE-007',
      customer_id: 'CUST-007',
      assigned_to: 'support-rep-1',
      tags: ['refund request', 'priority']
    },
    {
      id: '13',
      name: 'Christopher Jackson',
      email: 'cjackson@example.com',
      phone: '+1 (555) 234-5678',
      avatar: getRandomAvatar('Christopher Jackson'),
      status: 'responding',
      pipeline: 'complaints',
      platforms: ['facebook', 'email'],
      last_message: 'Thank you for looking into this issue. I appreciate your help.',
      last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      priority: 'medium',
      quote_id: 'QUOTE-008',
      customer_id: 'CUST-008',
      assigned_to: 'support-rep-2',
      tags: ['service issue', 'in progress']
    },
    {
      id: '14',
      name: 'Elizabeth Davis',
      email: 'elizabeth.d@example.com',
      phone: '+1 (555) 345-6789',
      avatar: getRandomAvatar('Elizabeth Davis'),
      status: 'resolved',
      pipeline: 'complaints',
      platforms: ['whatsapp', 'email'],
      last_message: 'Issue has been resolved to my satisfaction. Thank you for your assistance.',
      last_updated: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      priority: 'low',
      quote_id: 'QUOTE-009',
      customer_id: 'CUST-009',
      tags: ['resolved', 'satisfied customer']
    }
  );

  return contacts;
};

// Export mock data
export const mockCrmContacts = generateMockContacts(); 