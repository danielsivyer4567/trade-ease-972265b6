#!/usr/bin/env node

/**
 * This is a template MCP server that implements a simple notes system.
 * It demonstrates core MCP concepts like resources and tools by allowing:
 * - Listing notes as resources
 * - Reading individual notes
 * - Creating new notes via a tool
 * - Summarizing all notes via a prompt
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://wxwbxupdisbofesaygqj.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4d2J4dXBkaXNib2Zlc2F5Z3FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwMDI0OTgsImV4cCI6MjA1NTU3ODQ5OH0.xhjkVsi9XZMwobUMsdYE0e1FXQeT_uNLaTHquGvRxjI';

const supabase = createClient(supabaseUrl, supabaseKey);

// Define database types
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipcode: string;
  status: string;
  created_at: string;
  user_id: string;
}

interface Job {
  id: string;
  job_number: string;
  title: string;
  description: string;
  customer: string;
  type: string;
  status: string;
  date: string;
  assigned_team: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_team: string;
  status: string;
  due_date: string;
  created_at: string;
  updated_at: string;
  manager_id: string;
  team_leader_id: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  customer_id: string;
  amount: number;
  description: string;
  status: string;
  due_date: string;
  created_at: string;
}

const server = new Server(
  {
    name: "trade-ease-database",
    version: "0.2.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper function to format currency
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD'
  }).format(amount);
}

// Helper function to format date
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

// Helper function to get status emoji
function getStatusEmoji(status: string): string {
  const statusMap: { [key: string]: string } = {
    'pending': '⏳',
    'in_progress': '🔄',
    'completed': '✅',
    'cancelled': '❌',
    'draft': '📝',
    'sent': '📧',
    'paid': '💰',
    'overdue': '⚠️',
    'active': '🟢',
    'inactive': '🔴'
  };
  return statusMap[status] || '📋';
}

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Customer Management
      {
        name: "get_customers",
        description: "Get all customers or filter by status",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by customer status (active, inactive)",
              enum: ["active", "inactive"]
            },
            limit: {
              type: "number",
              description: "Maximum number of customers to return (default: 10)"
            }
          },
        },
      },
      {
        name: "create_customer",
        description: "Create a new customer",
        inputSchema: {
          type: "object",
          properties: {
            name: { type: "string", description: "Customer name" },
            email: { type: "string", description: "Customer email" },
            phone: { type: "string", description: "Customer phone number" },
            address: { type: "string", description: "Customer address" },
            city: { type: "string", description: "Customer city" },
            state: { type: "string", description: "Customer state" },
            zipcode: { type: "string", description: "Customer zipcode" }
          },
          required: ["name", "email", "phone", "address", "city", "state", "zipcode"]
        },
      },
      {
        name: "update_customer",
        description: "Update an existing customer",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Customer ID" },
            name: { type: "string", description: "Customer name" },
            email: { type: "string", description: "Customer email" },
            phone: { type: "string", description: "Customer phone number" },
            address: { type: "string", description: "Customer address" },
            city: { type: "string", description: "Customer city" },
            state: { type: "string", description: "Customer state" },
            zipcode: { type: "string", description: "Customer zipcode" },
            status: { type: "string", description: "Customer status", enum: ["active", "inactive"] }
          },
          required: ["id"]
        },
      },

      // Job Management
      {
        name: "get_jobs",
        description: "Get all jobs or filter by status/customer",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by job status",
              enum: ["pending", "in_progress", "completed", "cancelled"]
            },
            customer: {
              type: "string",
              description: "Filter by customer name"
            },
            limit: {
              type: "number",
              description: "Maximum number of jobs to return (default: 10)"
            }
          },
        },
      },
      {
        name: "create_job",
        description: "Create a new job",
        inputSchema: {
          type: "object",
          properties: {
            job_number: { type: "string", description: "Job number" },
            title: { type: "string", description: "Job title" },
            description: { type: "string", description: "Job description" },
            customer: { type: "string", description: "Customer name" },
            type: { type: "string", description: "Job type" },
            date: { type: "string", description: "Job date (YYYY-MM-DD)" },
            assigned_team: { type: "string", description: "Assigned team" }
          },
          required: ["job_number", "title", "customer", "type"]
        },
      },
      {
        name: "update_job_status",
        description: "Update job status",
        inputSchema: {
          type: "object",
          properties: {
            id: { type: "string", description: "Job ID" },
            status: { 
              type: "string", 
              description: "New status",
              enum: ["pending", "in_progress", "completed", "cancelled"]
            }
          },
          required: ["id", "status"]
        },
      },

      // Task Management
      {
        name: "get_tasks",
        description: "Get all tasks or filter by status/team",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by task status",
              enum: ["pending", "in_progress", "completed", "cancelled"]
            },
            assigned_team: {
              type: "string",
              description: "Filter by assigned team"
            },
            limit: {
              type: "number",
              description: "Maximum number of tasks to return (default: 10)"
            }
          },
        },
      },
      {
        name: "create_task",
        description: "Create a new task",
        inputSchema: {
          type: "object",
          properties: {
            title: { type: "string", description: "Task title" },
            description: { type: "string", description: "Task description" },
            assigned_team: { type: "string", description: "Assigned team" },
            due_date: { type: "string", description: "Due date (YYYY-MM-DD)" },
            manager_id: { type: "string", description: "Manager ID (optional)" },
            team_leader_id: { type: "string", description: "Team leader ID (optional)" }
          },
          required: ["title", "assigned_team", "due_date"]
        },
      },

      // Invoice Management
      {
        name: "get_invoices",
        description: "Get all invoices or filter by status",
        inputSchema: {
          type: "object",
          properties: {
            status: {
              type: "string",
              description: "Filter by invoice status",
              enum: ["draft", "sent", "paid", "overdue", "cancelled"]
            },
            customer_id: {
              type: "string",
              description: "Filter by customer ID"
            },
            limit: {
              type: "number",
              description: "Maximum number of invoices to return (default: 10)"
            }
          },
        },
      },
      {
        name: "create_invoice",
        description: "Create a new invoice",
        inputSchema: {
          type: "object",
          properties: {
            invoice_number: { type: "string", description: "Invoice number" },
            customer_id: { type: "string", description: "Customer ID" },
            amount: { type: "number", description: "Invoice amount" },
            description: { type: "string", description: "Invoice description" },
            due_date: { type: "string", description: "Due date (YYYY-MM-DD)" }
          },
          required: ["invoice_number", "customer_id", "amount", "due_date"]
        },
      },

      // Dashboard/Analytics
      {
        name: "get_dashboard_stats",
        description: "Get dashboard statistics and overview",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_recent_activity",
        description: "Get recent activity across all entities",
        inputSchema: {
          type: "object",
          properties: {
            limit: {
              type: "number",
              description: "Maximum number of activities to return (default: 20)"
            }
          },
        },
      },

      // Organization Management
      {
        name: "get_organizations",
        description: "Get user's organizations",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  
  // Type guard for args
  if (!args || typeof args !== 'object') {
    throw new McpError(
      ErrorCode.InvalidParams,
      "Invalid arguments provided"
    );
  }

  try {
    switch (name) {
      // Customer Management
      case "get_customers": {
        let query = supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(Number(args.limit) || 10);

        if (args.status) {
          query = query.eq('status', args.status);
        }

        const { data, error } = await query;
        if (error) throw error;

        const customers = data as Customer[];
        let result = `📋 **Customers (${customers.length} found)**\n\n`;
        
        customers.forEach((customer, index) => {
          result += `${index + 1}. ${getStatusEmoji(customer.status)} **${customer.name}**\n`;
          result += `   📧 ${customer.email} | 📞 ${customer.phone}\n`;
          result += `   📍 ${customer.address}, ${customer.city}, ${customer.state} ${customer.zipcode}\n`;
          result += `   🗓️ Created: ${formatDate(customer.created_at)}\n\n`;
        });

        return { content: [{ type: "text", text: result }] };
      }

      case "create_customer": {
        const { data, error } = await supabase
          .from('customers')
          .insert([{
            name: String(args.name),
            email: String(args.email),
            phone: String(args.phone),
            address: String(args.address),
            city: String(args.city),
            state: String(args.state),
            zipcode: String(args.zipcode),
            status: 'active',
            user_id: 'system' // You'd want to get this from auth context
          }])
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Customer Created Successfully!**\n\n🆔 ID: ${data.id}\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📞 Phone: ${data.phone}\n📍 Address: ${data.address}, ${data.city}, ${data.state} ${data.zipcode}` 
          }] 
        };
      }

      case "update_customer": {
        const updateData: any = {};
        if (args.name) updateData.name = String(args.name);
        if (args.email) updateData.email = String(args.email);
        if (args.phone) updateData.phone = String(args.phone);
        if (args.address) updateData.address = String(args.address);
        if (args.city) updateData.city = String(args.city);
        if (args.state) updateData.state = String(args.state);
        if (args.zipcode) updateData.zipcode = String(args.zipcode);
        if (args.status) updateData.status = String(args.status);

        const { data, error } = await supabase
          .from('customers')
          .update(updateData)
          .eq('id', String(args.id))
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Customer Updated Successfully!**\n\n🆔 ID: ${data.id}\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📞 Phone: ${data.phone}` 
          }] 
        };
      }

      // Job Management
      case "get_jobs": {
        let query = supabase
          .from('jobs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(Number(args.limit) || 10);

        if (args.status) {
          query = query.eq('status', args.status);
        }
        if (args.customer) {
          query = query.ilike('customer', `%${args.customer}%`);
        }

        const { data, error } = await query;
        if (error) throw error;

        const jobs = data as Job[];
        let result = `🏗️ **Jobs (${jobs.length} found)**\n\n`;
        
        jobs.forEach((job, index) => {
          result += `${index + 1}. ${getStatusEmoji(job.status)} **${job.title}** (#${job.job_number})\n`;
          result += `   👤 Customer: ${job.customer}\n`;
          result += `   🔧 Type: ${job.type} | 👥 Team: ${job.assigned_team || 'Not assigned'}\n`;
          result += `   📅 Date: ${job.date ? formatDate(job.date) : 'TBD'}\n`;
          if (job.description) {
            result += `   📝 Description: ${job.description.substring(0, 100)}${job.description.length > 100 ? '...' : ''}\n`;
          }
          result += `   🗓️ Created: ${formatDate(job.created_at)}\n\n`;
        });

        return { content: [{ type: "text", text: result }] };
      }

      case "create_job": {
        const { data, error } = await supabase
          .from('jobs')
          .insert([{
            job_number: String(args.job_number),
            title: String(args.title),
            description: args.description ? String(args.description) : null,
            customer: String(args.customer),
            type: String(args.type),
            date: args.date ? String(args.date) : null,
            assigned_team: args.assigned_team ? String(args.assigned_team) : null,
            status: 'pending',
            user_id: 'system' // You'd want to get this from auth context
          }])
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Job Created Successfully!**\n\n🆔 ID: ${data.id}\n🏗️ Job #: ${data.job_number}\n📋 Title: ${data.title}\n👤 Customer: ${data.customer}\n🔧 Type: ${data.type}\n📅 Date: ${data.date || 'TBD'}\n👥 Team: ${data.assigned_team || 'Not assigned'}` 
          }] 
        };
      }

      case "update_job_status": {
        const { data, error } = await supabase
          .from('jobs')
          .update({ status: String(args.status) })
          .eq('id', String(args.id))
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Job Status Updated!**\n\n🆔 ID: ${data.id}\n🏗️ Job #: ${data.job_number}\n📋 Title: ${data.title}\n🔄 Status: ${getStatusEmoji(data.status)} ${data.status}` 
          }] 
        };
      }

      // Task Management
      case "get_tasks": {
        let query = supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(Number(args.limit) || 10);

        if (args.status) {
          query = query.eq('status', args.status);
        }
        if (args.assigned_team) {
          query = query.eq('assigned_team', args.assigned_team);
        }

        const { data, error } = await query;
        if (error) throw error;

        const tasks = data as Task[];
        let result = `📋 **Tasks (${tasks.length} found)**\n\n`;
        
        tasks.forEach((task, index) => {
          result += `${index + 1}. ${getStatusEmoji(task.status)} **${task.title}**\n`;
          result += `   👥 Team: ${task.assigned_team}\n`;
          result += `   📅 Due: ${formatDate(task.due_date)}\n`;
          if (task.description) {
            result += `   📝 Description: ${task.description.substring(0, 100)}${task.description.length > 100 ? '...' : ''}\n`;
          }
          result += `   🗓️ Created: ${formatDate(task.created_at)}\n\n`;
        });

        return { content: [{ type: "text", text: result }] };
      }

      case "create_task": {
        const { data, error } = await supabase
          .from('tasks')
          .insert([{
            title: String(args.title),
            description: args.description ? String(args.description) : null,
            assigned_team: String(args.assigned_team),
            due_date: String(args.due_date),
            manager_id: args.manager_id ? String(args.manager_id) : null,
            team_leader_id: args.team_leader_id ? String(args.team_leader_id) : null,
            status: 'pending'
          }])
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Task Created Successfully!**\n\n🆔 ID: ${data.id}\n📋 Title: ${data.title}\n👥 Team: ${data.assigned_team}\n📅 Due: ${formatDate(data.due_date)}\n🔄 Status: ${getStatusEmoji(data.status)} ${data.status}` 
          }] 
        };
      }

      // Invoice Management
      case "get_invoices": {
        let query = supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(Number(args.limit) || 10);

        if (args.status) {
          query = query.eq('status', args.status);
        }
        if (args.customer_id) {
          query = query.eq('customer_id', args.customer_id);
        }

        const { data, error } = await query;
        if (error) throw error;

        const invoices = data as Invoice[];
        let result = `💰 **Invoices (${invoices.length} found)**\n\n`;
        
        invoices.forEach((invoice, index) => {
          result += `${index + 1}. ${getStatusEmoji(invoice.status)} **Invoice #${invoice.invoice_number}**\n`;
          result += `   💵 Amount: ${formatCurrency(invoice.amount)}\n`;
          result += `   📅 Due: ${formatDate(invoice.due_date)}\n`;
          if (invoice.description) {
            result += `   📝 Description: ${invoice.description.substring(0, 100)}${invoice.description.length > 100 ? '...' : ''}\n`;
          }
          result += `   🗓️ Created: ${formatDate(invoice.created_at)}\n\n`;
        });

        return { content: [{ type: "text", text: result }] };
      }

      case "create_invoice": {
        const { data, error } = await supabase
          .from('invoices')
          .insert([{
            invoice_number: String(args.invoice_number),
            customer_id: String(args.customer_id),
            amount: Number(args.amount),
            description: args.description ? String(args.description) : null,
            due_date: String(args.due_date),
            status: 'draft'
          }])
          .select()
          .single();

        if (error) throw error;

        return { 
          content: [{ 
            type: "text", 
            text: `✅ **Invoice Created Successfully!**\n\n🆔 ID: ${data.id}\n💰 Invoice #: ${data.invoice_number}\n💵 Amount: ${formatCurrency(data.amount)}\n📅 Due: ${formatDate(data.due_date)}\n🔄 Status: ${getStatusEmoji(data.status)} ${data.status}` 
          }] 
        };
      }

      // Dashboard/Analytics
      case "get_dashboard_stats": {
        const [customersResult, jobsResult, tasksResult, invoicesResult] = await Promise.all([
          supabase.from('customers').select('status', { count: 'exact' }),
          supabase.from('jobs').select('status', { count: 'exact' }),
          supabase.from('tasks').select('status', { count: 'exact' }),
          supabase.from('invoices').select('status, amount')
        ]);

        const totalCustomers = customersResult.count || 0;
        const totalJobs = jobsResult.count || 0;
        const totalTasks = tasksResult.count || 0;
        const invoices = invoicesResult.data || [];

        const totalInvoiceValue = invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        const paidInvoices = invoices.filter(inv => inv.status === 'paid').length;
        const overdueInvoices = invoices.filter(inv => inv.status === 'overdue').length;

        let result = `📊 **Dashboard Statistics**\n\n`;
        result += `👥 **Customers**: ${totalCustomers}\n`;
        result += `🏗️ **Jobs**: ${totalJobs}\n`;
        result += `📋 **Tasks**: ${totalTasks}\n`;
        result += `💰 **Invoices**: ${invoices.length}\n`;
        result += `💵 **Total Invoice Value**: ${formatCurrency(totalInvoiceValue)}\n`;
        result += `✅ **Paid Invoices**: ${paidInvoices}\n`;
        result += `⚠️ **Overdue Invoices**: ${overdueInvoices}\n\n`;
        result += `🗓️ **Generated**: ${formatDate(new Date().toISOString())}\n`;

        return { content: [{ type: "text", text: result }] };
      }

      case "get_recent_activity": {
        const limit = Number(args.limit) || 20;
        
        const [recentCustomers, recentJobs, recentTasks, recentInvoices] = await Promise.all([
          supabase.from('customers').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('jobs').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(5),
          supabase.from('invoices').select('*').order('created_at', { ascending: false }).limit(5)
        ]);

        let result = `📈 **Recent Activity**\n\n`;
        
        if (recentCustomers.data?.length) {
          result += `👥 **Recent Customers**\n`;
          recentCustomers.data.forEach((customer, index) => {
            result += `${index + 1}. ${customer.name} - ${formatDate(customer.created_at)}\n`;
          });
          result += `\n`;
        }

        if (recentJobs.data?.length) {
          result += `🏗️ **Recent Jobs**\n`;
          recentJobs.data.forEach((job, index) => {
            result += `${index + 1}. ${job.title} (#${job.job_number}) - ${formatDate(job.created_at)}\n`;
          });
          result += `\n`;
        }

        if (recentTasks.data?.length) {
          result += `📋 **Recent Tasks**\n`;
          recentTasks.data.forEach((task, index) => {
            result += `${index + 1}. ${task.title} - ${formatDate(task.created_at)}\n`;
          });
          result += `\n`;
        }

        if (recentInvoices.data?.length) {
          result += `💰 **Recent Invoices**\n`;
          recentInvoices.data.forEach((invoice, index) => {
            result += `${index + 1}. Invoice #${invoice.invoice_number} (${formatCurrency(invoice.amount)}) - ${formatDate(invoice.created_at)}\n`;
          });
        }

        return { content: [{ type: "text", text: result }] };
      }

      case "get_organizations": {
        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        let result = `🏢 **Organizations (${data.length} found)**\n\n`;
        
        data.forEach((org, index) => {
          result += `${index + 1}. **${org.name}**\n`;
          result += `   🏷️ Type: ${org.business_type || 'Not specified'}\n`;
          result += `   📍 Location: ${org.city || 'Not specified'}, ${org.state || 'Not specified'}\n`;
          result += `   📧 Email: ${org.email || 'Not specified'}\n`;
          result += `   🗓️ Created: ${formatDate(org.created_at)}\n\n`;
        });

        return { content: [{ type: "text", text: result }] };
      }

      default:
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${name}`
        );
    }
  } catch (error) {
    if (error instanceof McpError) {
      throw error;
    }
    
    throw new McpError(
      ErrorCode.InternalError,
      `Database operation failed: ${error instanceof Error ? error.message : String(error)}`
    );
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Trade-ease MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server failed to start:", error);
  process.exit(1);
});
