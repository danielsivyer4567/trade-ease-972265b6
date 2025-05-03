import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

interface NodeDetailsPanelProps {
  node: any;
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
}

export function NodeDetailsPanel({ node, onClose, onUpdate }: NodeDetailsPanelProps) {
  const [formData, setFormData] = useState({
    actionName: node.data.label || '',
    type: node.type || 'notification',
    title: node.data.title || '',
    message: node.data.message || '',
    redirectPage: node.data.redirectPage || 'contact',
    assignedRole: node.data.assignedRole || 'none',
    assignedUser: node.data.assignedUser || 'none'
  });

  // Update form data when node changes
  useEffect(() => {
    setFormData({
      actionName: node.data.label || '',
      type: node.type || 'notification',
      title: node.data.title || '',
      message: node.data.message || '',
      redirectPage: node.data.redirectPage || 'contact',
      assignedRole: node.data.assignedRole || 'none',
      assignedUser: node.data.assignedUser || 'none'
    });
  }, [node]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onUpdate(node.id, {
      ...node.data,
      label: formData.actionName,
      title: formData.title,
      message: formData.message,
      redirectPage: formData.redirectPage,
      assignedRole: formData.assignedRole,
      assignedUser: formData.assignedUser
    });
    onClose();
  };

  return (
    <div className="absolute right-0 top-[116px] bottom-0 w-[400px] bg-white shadow-xl z-40">
      <Card className="h-full overflow-y-auto">
        <div className="sticky top-0 bg-white z-50 px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{formData.actionName || node.data.label || 'Node Details'}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div>
            <Label>ACTION NAME</Label>
            <Input
              value={formData.actionName}
              onChange={(e) => handleChange('actionName', e.target.value)}
              placeholder="Enter action name"
            />
          </div>

          <div>
            <Label>TYPE OF NOTIFICATION</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notification">Notification</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>TITLE</Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div>
            <Label>MESSAGE</Label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Enter your message"
              className="min-h-[100px]"
            />
          </div>

          <div>
            <Label>REDIRECT PAGE</Label>
            <Select
              value={formData.redirectPage}
              onValueChange={(value) => handleChange('redirectPage', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="dashboard">Dashboard</SelectItem>
                <SelectItem value="jobs">Jobs</SelectItem>
                <SelectItem value="quotes">Quotes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>ASSIGNED ROLE</Label>
            <Select
              value={formData.assignedRole}
              onValueChange={(value) => handleChange('assignedRole', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>ASSIGNED USER</Label>
            <Select
              value={formData.assignedUser}
              onValueChange={(value) => handleChange('assignedUser', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="user1">John Doe</SelectItem>
                <SelectItem value="user2">Jane Smith</SelectItem>
                <SelectItem value="user3">Bob Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sticky bottom-0 bg-white pt-4 pb-6 border-t mt-6">
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Action
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 