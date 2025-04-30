import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTrigger: (triggerId: string) => void;
}

interface Trigger {
  id: string;
  title: string;
  icon: string;
  category: string;
}

const triggers: { [key: string]: Trigger[] } = {
  Contact: [
    { id: 'birthday-reminder', title: 'Birthday Reminder', icon: '🎂', category: 'Contact' },
    { id: 'contact-changed', title: 'Contact Changed', icon: '👤', category: 'Contact' },
    { id: 'contact-created', title: 'Contact Created', icon: '➕', category: 'Contact' },
    { id: 'contact-dnd', title: 'Contact DND', icon: '🚫', category: 'Contact' },
    { id: 'contact-tag', title: 'Contact Tag', icon: '🏷️', category: 'Contact' },
    { id: 'custom-date-reminder', title: 'Custom Date Reminder', icon: '📅', category: 'Contact' },
    { id: 'note-added', title: 'Note Added', icon: '📝', category: 'Contact' },
    { id: 'note-changed', title: 'Note Changed', icon: '✏️', category: 'Contact' },
    { id: 'task-added', title: 'Task Added', icon: '✔️', category: 'Contact' },
    { id: 'task-reminder', title: 'Task Reminder', icon: '⏰', category: 'Contact' },
    { id: 'task-completed', title: 'Task Completed', icon: '✅', category: 'Contact' },
    { id: 'contact-engagement-score', title: 'Contact Engagement Score', icon: '🏆', category: 'Contact' }
  ],
  Events: [
    { id: 'inbound-webhook', title: 'Inbound Webhook', icon: '🔗', category: 'Events' },
    { id: 'call-status', title: 'Call Status', icon: '📞', category: 'Events' },
    { id: 'email-events', title: 'Email Events', icon: '📧', category: 'Events' },
    { id: 'customer-replied', title: 'Customer Replied', icon: '💬', category: 'Events' },
    { id: 'form-submitted', title: 'Form Submitted', icon: '📝', category: 'Events' },
    { id: 'survey-submitted', title: 'Survey Submitted', icon: '📊', category: 'Events' },
    { id: 'trigger-link-clicked', title: 'Trigger Link Clicked', icon: '🔗', category: 'Events' }
  ],
  Appointments: [
    { id: 'appointment-status', title: 'Appointment Status', icon: '📅', category: 'Appointments' },
    { id: 'customer-booked-appointment', title: 'Customer Booked Appointment', icon: '✅', category: 'Appointments' }
  ],
  Opportunities: [
    { id: 'opportunity-status-changed', title: 'Opportunity Status Changed', icon: '🔄', category: 'Opportunities' },
    { id: 'opportunity-created', title: 'Opportunity Created', icon: '➕', category: 'Opportunities' },
    { id: 'opportunity-changed', title: 'Opportunity Changed', icon: '✏️', category: 'Opportunities' },
    { id: 'pipeline-stage-changed', title: 'Pipeline Stage Changed', icon: '📊', category: 'Opportunities' },
    { id: 'stale-opportunities', title: 'Stale Opportunities', icon: '⚠️', category: 'Opportunities' }
  ],
  Payments: [
    { id: 'invoice', title: 'Invoice', icon: '📄', category: 'Payments' },
    { id: 'payment-received', title: 'Payment Received', icon: '💰', category: 'Payments' },
    { id: 'order-form-submission', title: 'Order Form Submission', icon: '📝', category: 'Payments' },
    { id: 'order-submitted', title: 'Order Submitted', icon: '✅', category: 'Payments' },
    { id: 'documents-contracts', title: 'Documents & Contracts', icon: '📑', category: 'Payments' },
    { id: 'estimates', title: 'Estimates', icon: '📊', category: 'Payments' },
    { id: 'subscription', title: 'Subscription', icon: '🔄', category: 'Payments' },
    { id: 'refund', title: 'Refund', icon: '↩️', category: 'Payments' }
  ],
  Shopify: [
    { id: 'abandoned-checkout', title: 'Abandoned Checkout', icon: '🛒', category: 'Shopify' },
    { id: 'order-placed', title: 'Order Placed', icon: '✅', category: 'Shopify' },
    { id: 'order-fulfilled', title: 'Order Fulfilled', icon: '📦', category: 'Shopify' }
  ]
};

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  isOpen,
  onClose,
  onSelectTrigger
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const searchResults = searchTerm
    ? Object.values(triggers).flat().filter(trigger => 
        trigger.title.toLowerCase().includes(searchTerm.toLowerCase()))
    : Object.values(triggers).flat();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-[800px] mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Workflow Trigger</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-4">
            Adds a workflow trigger, and on execution, the Contact gets added to the workflow.
          </p>
          
          <Input
            type="text"
            placeholder="Search Trigger"
            className="mb-4"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="mb-4">
            <Button
              variant="default"
              onClick={() => window.location.href = '/templates'}
              className="w-full"
            >
              Templates List
            </Button>
          </div>

          <div className="space-y-4">
            {Object.entries(triggers).map(([category, categoryTriggers]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-700 mb-2">{category}</h3>
                <div className="space-y-2">
                  {categoryTriggers.map((trigger) => (
                    <div
                      key={trigger.id}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => onSelectTrigger(trigger.id)}
                    >
                      <span className="mr-3">{trigger.icon}</span>
                      <span>{trigger.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector; 