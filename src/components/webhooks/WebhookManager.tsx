import React, { useEffect, useState } from 'react';
import { webhookService, WebhookData } from '../../services/WebhookService';
import { logger } from '../../utils/logger';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Pencil, Trash2 } from "lucide-react";

interface Webhook extends WebhookData {
  id: string;
  created_at: string;
}

const WebhookManager: React.FC = () => {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();
  const [formData, setFormData] = useState<WebhookData>({
    url: '',
    events: [],
    enabled: true
  });

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await webhookService.getWebhooks();
      setWebhooks(data);
    } catch (error) {
      logger.error('Failed to fetch webhooks:', error);
      toast({
        title: "Error",
        description: "Failed to load webhooks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await webhookService.updateWebhook(editingId, formData);
        toast({
          title: "Success",
          description: "Webhook updated successfully"
        });
      } else {
        await webhookService.createWebhook(formData);
        toast({
          title: "Success",
          description: "Webhook created successfully"
        });
      }
      setFormData({ url: '', events: [], enabled: true });
      setEditingId(null);
      fetchWebhooks();
    } catch (error) {
      logger.error('Failed to save webhook:', error);
      toast({
        title: "Error",
        description: "Failed to save webhook",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      await webhookService.deleteWebhook(id);
      toast({
        title: "Success",
        description: "Webhook deleted successfully"
      });
      fetchWebhooks();
    } catch (error) {
      logger.error('Failed to delete webhook:', error);
      toast({
        title: "Error",
        description: "Failed to delete webhook",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (webhook: Webhook) => {
    setEditingId(webhook.id);
    setFormData(webhook);
  };

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="url">Webhook URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://your-webhook-url.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="events">Events</Label>
              <Input
                id="events"
                value={formData.events.join(',')}
                onChange={(e) => setFormData({ ...formData, events: e.target.value.split(',') })}
                placeholder="customer.created,job.completed"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="enabled"
                checked={formData.enabled}
                onCheckedChange={(checked) => setFormData({ ...formData, enabled: checked })}
              />
              <Label htmlFor="enabled">Enabled</Label>
            </div>
            <Button type="submit" disabled={loading}>
              {editingId ? 'Update Webhook' : 'Add Webhook'}
            </Button>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {webhooks.map((webhook) => (
                <TableRow key={webhook.id}>
                  <TableCell>{webhook.url}</TableCell>
                  <TableCell>{webhook.events.join(', ')}</TableCell>
                  <TableCell>
                    <Switch
                      checked={webhook.enabled}
                      onCheckedChange={async (checked) => {
                        try {
                          await webhookService.toggleWebhook(webhook.id, checked);
                          fetchWebhooks();
                        } catch (error) {
                          logger.error('Failed to toggle webhook:', error);
                          toast({
                            title: "Error",
                            description: "Failed to update webhook status",
                            variant: "destructive"
                          });
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{new Date(webhook.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(webhook)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(webhook.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default WebhookManager; 