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
  workflowDarkMode?: boolean;
}

export function NodeDetailsPanel({ node, onClose, onUpdate, workflowDarkMode }: NodeDetailsPanelProps) {
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

  const gold = '#bfa14a';
  const darkBg = '#18140c';
  const darkText = '#ffe082';

  return (
    <div className="absolute right-0 top-0 bottom-0 w-[400px] shadow-xl z-50"
      style={workflowDarkMode ? { 
        background: darkBg, 
        color: darkText, 
        borderLeft: `3px solid ${gold}` 
      } : {}}>
      <Card className="h-full overflow-y-auto" style={workflowDarkMode ? { 
        background: darkBg, 
        color: darkText, 
        borderColor: gold,
        borderRadius: 0
      } : { borderRadius: 0 }}>
        <div className="sticky top-0 z-50 px-6 py-4 border-b" style={workflowDarkMode ? { 
          background: darkBg, 
          color: darkText, 
          borderColor: gold 
        } : {}}>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold" style={{ color: workflowDarkMode ? gold : '' }}>{formData.actionName || node.data.label || 'Node Details'}</h2>
            <Button variant="ghost" size="icon" onClick={onClose} style={workflowDarkMode ? { color: gold } : {}}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              Action Name
            </Label>
            <Input
              value={formData.actionName}
              onChange={(e) => handleChange('actionName', e.target.value)}
              placeholder="Enter action name"
              style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              Type
            </Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleChange('type', value)}
            >
              <SelectTrigger style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectItem value="notification" style={workflowDarkMode ? { color: darkText } : {}}>Notification</SelectItem>
                <SelectItem value="email" style={workflowDarkMode ? { color: darkText } : {}}>Email</SelectItem>
                <SelectItem value="sms" style={workflowDarkMode ? { color: darkText } : {}}>SMS</SelectItem>
                <SelectItem value="task" style={workflowDarkMode ? { color: darkText } : {}}>Task</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              Title
            </Label>
            <Input
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
              style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              Message
            </Label>
            <Textarea
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              placeholder="Enter message"
              rows={4}
              style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}
            />
          </div>

          <div>
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              REDIRECT PAGE
            </Label>
            <Select
              value={formData.redirectPage}
              onValueChange={(value) => handleChange('redirectPage', value)}
            >
              <SelectTrigger style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectItem value="contact" style={workflowDarkMode ? { color: darkText } : {}}>Contact</SelectItem>
                <SelectItem value="dashboard" style={workflowDarkMode ? { color: darkText } : {}}>Dashboard</SelectItem>
                <SelectItem value="jobs" style={workflowDarkMode ? { color: darkText } : {}}>Jobs</SelectItem>
                <SelectItem value="quotes" style={workflowDarkMode ? { color: darkText } : {}}>Quotes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              Assigned Role
            </Label>
            <Select
              value={formData.assignedRole}
              onValueChange={(value) => handleChange('assignedRole', value)}
            >
              <SelectTrigger style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectItem value="none" style={workflowDarkMode ? { color: darkText } : {}}>None</SelectItem>
                <SelectItem value="admin" style={workflowDarkMode ? { color: darkText } : {}}>Admin</SelectItem>
                <SelectItem value="manager" style={workflowDarkMode ? { color: darkText } : {}}>Manager</SelectItem>
                <SelectItem value="user" style={workflowDarkMode ? { color: darkText } : {}}>User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium" style={{ color: workflowDarkMode ? darkText : '' }}>
              ASSIGNED USER
            </Label>
            <Select
              value={formData.assignedUser}
              onValueChange={(value) => handleChange('assignedUser', value)}
            >
              <SelectTrigger style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                <SelectItem value="none" style={workflowDarkMode ? { color: darkText } : {}}>None</SelectItem>
                <SelectItem value="user1" style={workflowDarkMode ? { color: darkText } : {}}>John Doe</SelectItem>
                <SelectItem value="user2" style={workflowDarkMode ? { color: darkText } : {}}>Jane Smith</SelectItem>
                <SelectItem value="user3" style={workflowDarkMode ? { color: darkText } : {}}>Bob Johnson</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="sticky bottom-0 pt-4 pb-6 border-t mt-6" style={workflowDarkMode ? { 
            background: darkBg, 
            borderColor: gold 
          } : { background: 'white' }}>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={onClose} style={workflowDarkMode ? { 
                background: darkBg, 
                color: darkText, 
                borderColor: gold 
              } : {}}>
                Cancel
              </Button>
              <Button onClick={handleSave} style={workflowDarkMode ? { 
                background: gold, 
                color: '#000000'
              } : {}}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
} 