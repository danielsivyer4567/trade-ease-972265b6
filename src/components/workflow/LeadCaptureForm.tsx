import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { LeadSource } from '@/types/workflow';

interface LeadCaptureFormProps {
  onSubmit: (lead: {
    source: LeadSource;
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    description: string;
  }) => void;
  onCancel: () => void;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    source: 'website' as LeadSource,
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.customerEmail && !formData.customerPhone) {
      toast.error('Please provide at least one contact method (email or phone)');
      return;
    }

    onSubmit(formData);
    toast.success('Lead captured successfully!');
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Capture New Lead</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="source">Lead Source *</Label>
          <Select
            value={formData.source}
            onValueChange={(value) => setFormData({ ...formData, source: value as LeadSource })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="social_media">Social Media</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone_call">Phone Call</SelectItem>
              <SelectItem value="website">Website</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            placeholder="John Smith"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerEmail">Email</Label>
            <Input
              id="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label htmlFor="customerPhone">Phone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={formData.customerPhone}
              onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
              placeholder="0412 345 678"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the customer's inquiry or request..."
            rows={4}
            required
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Capture Lead
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default LeadCaptureForm; 