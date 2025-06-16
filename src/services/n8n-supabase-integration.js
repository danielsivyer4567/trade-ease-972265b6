// n8n-Supabase Integration Service
// This service provides helper functions for integrating n8n workflows with Supabase

import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

/**
 * n8n and Supabase Integration Service
 * This service provides utilities for integrating n8n workflows with Supabase
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// n8n configuration
const n8nConfig = {
  baseUrl: import.meta.env.VITE_N8N_URL || 'http://localhost:5678',
  apiKey: import.meta.env.VITE_N8N_API_KEY || '',
  webhookUrl: import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook'
};

/**
 * Trigger n8n workflow from Supabase event
 */
export async function triggerN8nWorkflow(workflowId, data) {
  try {
    const response = await axios.post(
      `${n8nConfig.webhookUrl}/${workflowId}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': n8nConfig.apiKey
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error triggering n8n workflow:', error);
    throw error;
  }
}

/**
 * Set up Supabase realtime subscription that triggers n8n
 */
export function setupRealtimeToN8n(table, workflowId) {
  const subscription = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table
      },
      async (payload) => {
        console.log('Change received:', payload);
        
        // Trigger n8n workflow with the change data
        await triggerN8nWorkflow(workflowId, {
          event: payload.eventType,
          table: table,
          new: payload.new,
          old: payload.old,
          timestamp: new Date().toISOString()
        });
      }
    )
    .subscribe();

  return subscription;
}

/**
 * Execute Supabase operations from n8n
 * This would be called from n8n Function nodes
 */
export const supabaseOperations = {
  // Insert data
  async insert(table, data) {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .insert(data)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Update data
  async update(table, id, data) {
    const { data: result, error } = await supabaseAdmin
      .from(table)
      .update(data)
      .eq('id', id)
      .select();
    
    if (error) throw error;
    return result;
  },

  // Delete data
  async delete(table, id) {
    const { error } = await supabaseAdmin
      .from(table)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return { success: true };
  },

  // Query data with filters
  async query(table, filters = {}) {
    let query = supabaseAdmin.from(table).select('*');
    
    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'limit') {
        query = query.limit(value);
      } else if (key === 'order') {
        query = query.order(value.column, { ascending: value.ascending });
      } else {
        query = query.eq(key, value);
      }
    });
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Call RPC function
  async rpc(functionName, params = {}) {
    const { data, error } = await supabaseAdmin
      .rpc(functionName, params);
    
    if (error) throw error;
    return data;
  },

  // Upload file to storage
  async uploadFile(bucket, path, file) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file);
    
    if (error) throw error;
    
    // Get public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return { ...data, publicUrl };
  }
};

/**
 * Example workflow triggers for Trade Ease
 */
export const tradeEaseWorkflows = {
  // Trigger when new trade is created
  async onNewTrade(tradeData) {
    return triggerN8nWorkflow('new-trade-workflow', {
      action: 'trade_created',
      trade: tradeData,
      notifications: {
        email: true,
        sms: true,
        push: true
      }
    });
  },

  // Trigger when shipment status changes
  async onShipmentUpdate(shipmentId, newStatus, oldStatus) {
    return triggerN8nWorkflow('shipment-status-workflow', {
      action: 'status_changed',
      shipmentId,
      newStatus,
      oldStatus,
      timestamp: new Date().toISOString()
    });
  },

  // Trigger document processing workflow
  async processDocument(documentData) {
    return triggerN8nWorkflow('document-processing-workflow', {
      action: 'process_document',
      document: documentData,
      operations: ['validate', 'extract', 'store']
    });
  },

  // Trigger compliance check workflow
  async runComplianceCheck(tradeId) {
    return triggerN8nWorkflow('compliance-check-workflow', {
      action: 'check_compliance',
      tradeId,
      checks: ['sanctions', 'regulations', 'documentation']
    });
  }
};

/**
 * Initialize all realtime subscriptions
 */
export function initializeRealtimeWorkflows() {
  // Monitor trades table
  setupRealtimeToN8n('trades', 'trade-monitor-workflow');
  
  // Monitor shipments table
  setupRealtimeToN8n('shipments', 'shipment-monitor-workflow');
  
  // Monitor documents table
  setupRealtimeToN8n('documents', 'document-monitor-workflow');
  
  // Monitor notifications table
  setupRealtimeToN8n('notifications', 'notification-workflow');
}

/**
 * Webhook handler for n8n to update Supabase
 * This would be used in your API routes
 */
export async function handleN8nWebhook(req, res) {
  try {
    const { action, table, data } = req.body;
    
    let result;
    switch (action) {
      case 'insert':
        result = await supabaseOperations.insert(table, data);
        break;
      case 'update':
        result = await supabaseOperations.update(table, data.id, data);
        break;
      case 'delete':
        result = await supabaseOperations.delete(table, data.id);
        break;
      case 'query':
        result = await supabaseOperations.query(table, data.filters);
        break;
      case 'rpc':
        result = await supabaseOperations.rpc(data.function, data.params);
        break;
      default:
        throw new Error(`Unknown action: ${action}`);
    }
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
}

// Export for use in n8n Function nodes
export default {
  supabase,
  supabaseAdmin,
  supabaseOperations,
  triggerN8nWorkflow,
  setupRealtimeToN8n,
  tradeEaseWorkflows,
  initializeRealtimeWorkflows,
  handleN8nWebhook
}; 