import { supabase } from '../lib/supabaseClient';
import { logger } from '../utils/logger';
import { WorkflowService } from './WorkflowService';

interface WebhookConfig {
  url: string;
  events: string[];
  secret?: string;
  enabled: boolean;
}

interface Webhook {
  id: string;
  user_id: string;
  url: string;
  events: string[];
  secret: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface WebhookData {
  url: string;
  events: string[];
  enabled: boolean;
}

export class WebhookService {
  private static instance: WebhookService;

  private constructor() {}

  public static getInstance(): WebhookService {
    if (!WebhookService.instance) {
      WebhookService.instance = new WebhookService();
    }
    return WebhookService.instance;
  }

  /**
   * Create a new webhook
   */
  public async createWebhook(
    config: WebhookConfig
  ): Promise<{ success: boolean; webhook?: Webhook; error?: any }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data: webhook, error } = await supabase
        .from('webhooks')
        .insert({
          user_id: session.user.id,
          url: config.url,
          events: config.events,
          secret: config.secret || this.generateSecret(),
          enabled: config.enabled
        })
        .select()
        .single();

      if (error) throw error;

      logger.info(`Created webhook: ${webhook.id}`);
      return { success: true, webhook };
    } catch (error) {
      logger.error('Failed to create webhook:', error);
      return { success: false, error };
    }
  }

  /**
   * Update an existing webhook
   */
  public async updateWebhook(
    webhookId: string,
    config: Partial<WebhookConfig>
  ): Promise<{ success: boolean; webhook?: Webhook; error?: any }> {
    try {
      const { data: webhook, error } = await supabase
        .from('webhooks')
        .update({
          url: config.url,
          events: config.events,
          secret: config.secret,
          enabled: config.enabled
        })
        .eq('id', webhookId)
        .select()
        .single();

      if (error) throw error;

      logger.info(`Updated webhook: ${webhookId}`);
      return { success: true, webhook };
    } catch (error) {
      logger.error('Failed to update webhook:', error);
      return { success: false, error };
    }
  }

  /**
   * Delete a webhook
   */
  public async deleteWebhook(webhookId: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', webhookId);

      if (error) throw error;

      logger.info(`Deleted webhook: ${webhookId}`);
      return { success: true };
    } catch (error) {
      logger.error('Failed to delete webhook:', error);
      return { success: false, error };
    }
  }

  /**
   * Get all webhooks for the current user
   */
  public async getWebhooks(): Promise<{ success: boolean; webhooks?: Webhook[]; error?: any }> {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
      }

      const { data: webhooks, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('user_id', session.user.id);

      if (error) throw error;

      return { success: true, webhooks };
    } catch (error) {
      logger.error('Failed to get webhooks:', error);
      return { success: false, error };
    }
  }

  /**
   * Get a specific webhook
   */
  public async getWebhook(webhookId: string): Promise<{ success: boolean; webhook?: Webhook; error?: any }> {
    try {
      const { data: webhook, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('id', webhookId)
        .single();

      if (error) throw error;

      return { success: true, webhook };
    } catch (error) {
      logger.error('Failed to get webhook:', error);
      return { success: false, error };
    }
  }

  /**
   * Trigger webhooks for an event
   */
  public async triggerWebhooks(event: string, payload: any): Promise<void> {
    try {
      // Get all enabled webhooks that listen for this event
      const { data: webhooks, error } = await supabase
        .from('webhooks')
        .select('*')
        .eq('enabled', true)
        .contains('events', [event]);

      if (error) throw error;

      if (!webhooks || webhooks.length === 0) {
        return;
      }

      logger.info(`Triggering ${webhooks.length} webhooks for event: ${event}`);

      // Send webhook requests
      for (const webhook of webhooks) {
        try {
          await this.sendWebhookRequest(webhook, event, payload);
        } catch (error) {
          logger.error(`Failed to send webhook request: ${webhook.id}`, error);
        }
      }
    } catch (error) {
      logger.error('Failed to trigger webhooks:', error);
    }
  }

  /**
   * Send a webhook request
   */
  private async sendWebhookRequest(webhook: Webhook, event: string, payload: any): Promise<void> {
    try {
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Event': event,
          'X-Webhook-Signature': this.generateSignature(webhook.secret, payload)
        },
        body: JSON.stringify({
          event,
          payload,
          timestamp: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error(`Webhook request failed with status: ${response.status}`);
      }

      logger.info(`Successfully sent webhook request: ${webhook.id}`);
    } catch (error) {
      logger.error(`Failed to send webhook request: ${webhook.id}`, error);
      throw error;
    }
  }

  /**
   * Generate a webhook secret
   */
  private generateSecret(): string {
    return crypto.randomUUID();
  }

  /**
   * Generate a webhook signature
   */
  private generateSignature(secret: string, payload: any): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  async getWebhooks() {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error fetching webhooks:', error);
      throw error;
    }
  }

  async createWebhook(webhookData: WebhookData) {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .insert([webhookData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error creating webhook:', error);
      throw error;
    }
  }

  async updateWebhook(id: string, webhookData: WebhookData) {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .update(webhookData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error updating webhook:', error);
      throw error;
    }
  }

  async deleteWebhook(id: string) {
    try {
      const { error } = await supabase
        .from('webhooks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      logger.error('Error deleting webhook:', error);
      throw error;
    }
  }

  async toggleWebhook(id: string, enabled: boolean) {
    try {
      const { data, error } = await supabase
        .from('webhooks')
        .update({ enabled })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      logger.error('Error toggling webhook:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const webhookService = WebhookService.getInstance(); 