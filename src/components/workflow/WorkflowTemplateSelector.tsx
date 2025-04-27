import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Sparkles } from "lucide-react";
import { WorkflowTemplate } from '@/types/workflow';

interface WorkflowTemplateSelectorProps {
  onSelect: (template: WorkflowTemplate | null) => void;
}

const templates: WorkflowTemplate[] = [
  {
    id: 'blank',
    name: 'Start from scratch',
    description: 'Start from scratch with a fresh, clean slate for your automation and add your own triggers and actions.',
    category: 'blank',
    recommended: false
  },
  {
    id: 'import-campaign',
    name: 'Import from a campaign',
    description: 'Import all the steps from an already existing campaign.',
    category: 'import',
    recommended: false
  },
  {
    id: 'abandoned-cart-single',
    name: 'Stores - abandoned cart recovery email',
    description: 'Send abandoned cart recovery email to customers after dropoff during checkout',
    category: 'ecommerce',
    recommended: true
  },
  {
    id: 'abandoned-cart-double',
    name: 'Stores - Recover abandoned carts with 2 emails',
    description: 'Recover Ecommerce abandoned carts checkout by sending 2 emails to customers',
    category: 'ecommerce',
    recommended: true
  },
  {
    id: 'lead-nurture-gpt',
    name: 'Recipe - Lead Nurture Using GPT History',
    description: 'The Lead Nurture template leverages the GPT action History feature to create a personalized experience for potential clients.',
    category: 'ai',
    recommended: false
  },
  {
    id: 'shopify-gpt',
    name: 'Recipe - Shopify Order + GPT History',
    description: 'The Shopify + AI template integrates the AI Memory Key to optimize your interaction with the present and potential customers.',
    category: 'ecommerce',
    recommended: true
  },
  {
    id: 'whatsapp-delivery',
    name: 'WhatsApp Delivery Status',
    description: 'Automatically send SMS or Email to customers when a WhatsApp message fails to deliver, ensuring no communication is missed',
    category: 'messaging',
    recommended: true
  },
  {
    id: 'missed-call-whatsapp',
    name: 'Recipe - Missed Call WhatsApp-Back',
    description: 'If you miss a call from a lead, reply to them automatically via WhatsApp and notify the assigned user to get back ASAP',
    category: 'messaging',
    recommended: true
  },
  {
    id: 'product-recommendation',
    name: 'Recipe - Send product recommendation using GPT 4 Turbo',
    description: 'Sending product recommendation using GPT 4 Turbo to prepare an Email and send to the customers who have bought a product in Shopify.',
    category: 'ai',
    recommended: true
  },
  {
    id: 'instagram-comments',
    name: 'Recipe - Instagram comment automation',
    description: 'Use this recipe to automate the DM replies to comments on Instagram',
    category: 'social',
    recommended: true
  },
  {
    id: 'facebook-comments-ai',
    name: 'Recipe - Facebook comments + Workflow AI',
    description: 'Expose the user comment to Workflow AI and use the output as a response to the comment. Also use Workflow AI to analyse the comment sentiment and respond accordingly.',
    category: 'social',
    recommended: true
  },
  {
    id: 'facebook-comments',
    name: 'Recipe - Facebook comment automation',
    description: 'Use this recipe to automate the DM replies to comments on Facebook',
    category: 'social',
    recommended: true
  },
  {
    id: 'ivr',
    name: 'Recipe: IVR',
    description: 'This IVR workflow streamlines communication, allowing callers to navigate through service options, leave messages, and connect with your team effortlessly.',
    category: 'communication',
    recommended: false
  },
  {
    id: 'email-drip',
    name: 'Recipe - Email Drip Sequence',
    description: 'Add contacts to this workflow to drip them a series of Emails over time. This recipe uses the "Emailed Opened" condition to resend each email with a new subject if it wasn\'t opened within 24 hrs!',
    category: 'email',
    recommended: false
  },
  {
    id: 'long-term-nurture',
    name: 'Recipe - Long Term Nurture/Reactivation Email Sequence',
    description: 'A long-term monthly email sequence that consistently nurtures and reactivates leads over time.',
    category: 'email',
    recommended: true
  },
  {
    id: 'fast-five-lite',
    name: 'Recipe - Fast 5 Lite',
    description: 'Great for nurturing new leads into hot leads by automating email, SMS, Call Connects, and Voicemail Drops - all within five minutes!',
    category: 'lead-nurturing',
    recommended: false
  },
  {
    id: 'faq-auto-reply',
    name: 'Recipe - FAQ Auto Reply',
    description: 'Automate replies to frequently asked questions across SMS, FB, Instagram, and Google chat!',
    category: 'automation',
    recommended: false
  },
  {
    id: 'webinar-registration',
    name: 'Recipe - Webinar Registration Confirmation & Reminders',
    description: 'Use this recipe to send Webinar Registration Confirmations and reminders leading up to the webinar.',
    category: 'events',
    recommended: false
  },
  {
    id: 'fast-five',
    name: 'Recipe - Fast Five',
    description: 'The odds of closing a lead decrease dramatically after 5 mins. This Workflow delivers the ULTIMATE first-5-minute lead nurture!',
    category: 'lead-nurturing',
    recommended: false
  },
  {
    id: 'appointment-full',
    name: 'Recipe - Appointment Confirmation + Reminder + Survey + Review Request',
    description: 'For each new appointment, send a confirmation, send reminders, survey the result, and if the result was a sale, send a review request!',
    category: 'appointments',
    recommended: false
  },
  {
    id: 'review-request',
    name: 'Recipe - Send Review Request',
    description: 'This workflow sends a review request to your customers when an opportunity is marked as won (or) an appointment is marked as showed (or) a tag is added',
    category: 'feedback',
    recommended: false
  },
  {
    id: 'appointment-booking',
    name: 'Recipe - Appointment Booking',
    description: 'Detect intent on customer reply to send them booking link or create a manual SMS to help them make a decision',
    category: 'appointments',
    recommended: false
  },
  {
    id: 'gmb-message',
    name: 'Recipe - GMB Business Message',
    description: 'Notify users & auto-respond to Google Business Messaging channel',
    category: 'messaging',
    recommended: false
  },
  {
    id: 'fb-messenger',
    name: 'Recipe - FB Messenger',
    description: 'When an inbound FB message is waiting, reply & remove pending tag or we will prompt the lead to share phone number in 30 mins.',
    category: 'messaging',
    recommended: false
  },
  {
    id: 'missed-call-text',
    name: 'Recipe - Auto Missed Call Text-Back',
    description: 'If you miss a call from a lead, reply to them automatically and notify the assigned user to get back ASAP.',
    category: 'messaging',
    recommended: false
  },
  {
    id: 'no-show-nurture',
    name: 'Recipe: No-Show Nurture',
    description: 'Recover no-shows with this simple but powerful automation!',
    category: 'appointments',
    recommended: false
  },
  {
    id: 'birthday',
    name: 'Recipe - Birthday Template',
    description: 'A workflow to do Birthday promotions',
    category: 'marketing',
    recommended: false
  },
  {
    id: 'appointment-basic',
    name: 'Recipe - Appointment Confirmation + Reminder',
    description: 'Appointment confirmation and follow up reminder.',
    category: 'appointments',
    recommended: false
  },
  {
    id: 'list-reactivation',
    name: 'Recipe - List Reactivation',
    description: 'An incredible way to generate leads for any business with a list. Requires no ad spend and AI filters positive responses!',
    category: 'marketing',
    recommended: false
  }
];

const categories = [
  { id: 'all', name: 'All Templates' },
  { id: 'blank', name: 'Blank' },
  { id: 'ecommerce', name: 'E-commerce' },
  { id: 'ai', name: 'AI & Automation' },
  { id: 'messaging', name: 'Messaging' },
  { id: 'social', name: 'Social Media' },
  { id: 'communication', name: 'Communication' },
  { id: 'email', name: 'Email' },
  { id: 'lead-nurturing', name: 'Lead Nurturing' },
  { id: 'automation', name: 'Automation' },
  { id: 'events', name: 'Events' },
  { id: 'appointments', name: 'Appointments' },
  { id: 'feedback', name: 'Feedback' },
  { id: 'marketing', name: 'Marketing' }
];

export function WorkflowTemplateSelector({ onSelect }: WorkflowTemplateSelectorProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(search.toLowerCase()) ||
                         template.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Workflow</CardTitle>
          <CardDescription>
            Choose a template to get started or create a blank workflow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search templates..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className="whitespace-nowrap"
                >
                  {category.name}
                </Button>
              ))}
            </div>

            <ScrollArea className="h-[600px]">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredTemplates.map(template => (
                  <Card
                    key={template.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => onSelect(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        {template.recommended && (
                          <Sparkles className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <CardDescription>{template.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 