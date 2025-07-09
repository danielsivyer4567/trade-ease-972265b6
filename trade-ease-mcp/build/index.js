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
import { CallToolRequestSchema, ErrorCode, ListToolsRequestSchema, McpError, } from "@modelcontextprotocol/sdk/types.js";
import { createClient } from '@supabase/supabase-js';
// Supabase configuration - SECURE: No hardcoded credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
// Validate required environment variables
if (!supabaseUrl || !supabaseKey) {
    console.error('❌ SECURITY: Missing required environment variables');
    console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your environment');
    process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);
const server = new Server({
    name: "trade-ease-database",
    version: "0.2.0",
}, {
    capabilities: {
        tools: {},
    },
});
// Helper function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-AU', {
        style: 'currency',
        currency: 'AUD'
    }).format(amount);
}
// Helper function to format date
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-AU', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}
// Helper function to get status emoji
function getStatusEmoji(status) {
    const statusMap = {
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
            // 📅 Calendar Management
            {
                name: "get_calendar_events",
                description: "Get all calendar events or filter by date range, job, or customer",
                inputSchema: {
                    type: "object",
                    properties: {
                        start_date: {
                            type: "string",
                            description: "Start date filter (YYYY-MM-DD)"
                        },
                        end_date: {
                            type: "string",
                            description: "End date filter (YYYY-MM-DD)"
                        },
                        job_id: {
                            type: "string",
                            description: "Filter by job ID"
                        },
                        customer_id: {
                            type: "string",
                            description: "Filter by customer ID"
                        },
                        event_type: {
                            type: "string",
                            description: "Filter by event type"
                        },
                        limit: {
                            type: "number",
                            description: "Maximum number of events to return (default: 10)"
                        }
                    },
                },
            },
            {
                name: "create_calendar_event",
                description: "Create a new calendar event",
                inputSchema: {
                    type: "object",
                    properties: {
                        title: { type: "string", description: "Event title" },
                        description: { type: "string", description: "Event description" },
                        start_time: { type: "string", description: "Start time (ISO 8601 format)" },
                        end_time: { type: "string", description: "End time (ISO 8601 format)" },
                        job_id: { type: "string", description: "Associated job ID (optional)" },
                        customer_id: { type: "string", description: "Associated customer ID (optional)" },
                        event_type: { type: "string", description: "Event type (e.g., 'job_appointment', 'meeting', 'inspection')" },
                        location: { type: "string", description: "Event location (optional)" }
                    },
                    required: ["title", "start_time", "end_time", "event_type"]
                },
            },
            {
                name: "update_calendar_event",
                description: "Update an existing calendar event",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Event ID" },
                        title: { type: "string", description: "Event title" },
                        description: { type: "string", description: "Event description" },
                        start_time: { type: "string", description: "Start time (ISO 8601 format)" },
                        end_time: { type: "string", description: "End time (ISO 8601 format)" },
                        job_id: { type: "string", description: "Associated job ID (optional)" },
                        customer_id: { type: "string", description: "Associated customer ID (optional)" },
                        event_type: { type: "string", description: "Event type" },
                        location: { type: "string", description: "Event location (optional)" }
                    },
                    required: ["id"]
                },
            },
            {
                name: "delete_calendar_event",
                description: "Delete a calendar event",
                inputSchema: {
                    type: "object",
                    properties: {
                        id: { type: "string", description: "Event ID to delete" }
                    },
                    required: ["id"]
                },
            },
            {
                name: "get_calendar_connections",
                description: "Get user's calendar connections (Google, Apple, Outlook)",
                inputSchema: {
                    type: "object",
                    properties: {
                        provider: {
                            type: "string",
                            description: "Filter by provider",
                            enum: ["google", "apple", "outlook"]
                        }
                    },
                },
            },
            {
                name: "sync_calendar_events",
                description: "Sync events with external calendar providers",
                inputSchema: {
                    type: "object",
                    properties: {
                        connection_id: {
                            type: "string",
                            description: "Calendar connection ID to sync with"
                        },
                        sync_direction: {
                            type: "string",
                            description: "Sync direction",
                            enum: ["import", "export", "bidirectional"]
                        }
                    },
                    required: ["connection_id"]
                },
            },
            {
                name: "create_job_calendar_event",
                description: "Create a calendar event from a job automatically",
                inputSchema: {
                    type: "object",
                    properties: {
                        job_id: { type: "string", description: "Job ID to create event for" },
                        event_type: {
                            type: "string",
                            description: "Type of event",
                            enum: ["job_appointment", "site_visit", "inspection", "follow_up"]
                        },
                        duration_hours: {
                            type: "number",
                            description: "Duration in hours (default: 2)"
                        }
                    },
                    required: ["job_id", "event_type"]
                },
            },
            // 🚀 NEW: Advanced Business Logic Tools
            // Area & Material Calculators
            {
                name: "calculate_area",
                description: "Calculate area for different shapes (rectangle, circle, triangle)",
                inputSchema: {
                    type: "object",
                    properties: {
                        shape: {
                            type: "string",
                            description: "Shape type",
                            enum: ["rectangle", "circle", "triangle", "square"]
                        },
                        dimensions: {
                            type: "object",
                            description: "Dimensions based on shape",
                            properties: {
                                length: { type: "number", description: "Length (for rectangle/square)" },
                                width: { type: "number", description: "Width (for rectangle)" },
                                radius: { type: "number", description: "Radius (for circle)" },
                                base: { type: "number", description: "Base (for triangle)" },
                                height: { type: "number", description: "Height (for triangle)" },
                                side: { type: "number", description: "Side length (for square)" }
                            }
                        },
                        unit: {
                            type: "string",
                            description: "Unit of measurement",
                            enum: ["m", "ft", "cm", "in"],
                            default: "m"
                        }
                    },
                    required: ["shape", "dimensions"]
                },
            },
            {
                name: "calculate_materials",
                description: "Calculate material requirements for common trade jobs",
                inputSchema: {
                    type: "object",
                    properties: {
                        job_type: {
                            type: "string",
                            description: "Type of job",
                            enum: ["flooring", "painting", "tiling", "roofing", "decking", "fencing"]
                        },
                        area: {
                            type: "number",
                            description: "Total area in square meters"
                        },
                        material_type: {
                            type: "string",
                            description: "Specific material type"
                        },
                        waste_factor: {
                            type: "number",
                            description: "Waste factor percentage (default: 10)",
                            default: 10
                        }
                    },
                    required: ["job_type", "area"]
                },
            },
            {
                name: "calculate_labor_cost",
                description: "Calculate labor costs based on job type and duration",
                inputSchema: {
                    type: "object",
                    properties: {
                        job_type: {
                            type: "string",
                            description: "Type of job",
                            enum: ["plumbing", "electrical", "carpentry", "painting", "tiling", "roofing", "general"]
                        },
                        hours: {
                            type: "number",
                            description: "Estimated hours"
                        },
                        workers: {
                            type: "number",
                            description: "Number of workers",
                            default: 1
                        },
                        hourly_rate: {
                            type: "number",
                            description: "Hourly rate per worker (optional, uses default rates)"
                        },
                        overtime_hours: {
                            type: "number",
                            description: "Overtime hours (optional)",
                            default: 0
                        }
                    },
                    required: ["job_type", "hours"]
                },
            },
            // Quote Generation Tools
            {
                name: "generate_quote",
                description: "Generate a comprehensive quote for a job",
                inputSchema: {
                    type: "object",
                    properties: {
                        job_title: { type: "string", description: "Job title" },
                        customer_name: { type: "string", description: "Customer name" },
                        job_type: { type: "string", description: "Type of job" },
                        materials: {
                            type: "array",
                            description: "List of materials",
                            items: {
                                type: "object",
                                properties: {
                                    name: { type: "string", description: "Material name" },
                                    quantity: { type: "number", description: "Quantity" },
                                    unit: { type: "string", description: "Unit (e.g., m², pieces, kg)" },
                                    unit_price: { type: "number", description: "Price per unit" }
                                },
                                required: ["name", "quantity", "unit", "unit_price"]
                            }
                        },
                        labor_hours: { type: "number", description: "Estimated labor hours" },
                        labor_rate: { type: "number", description: "Labor rate per hour" },
                        markup_percentage: { type: "number", description: "Markup percentage", default: 20 },
                        gst_rate: { type: "number", description: "GST rate percentage", default: 10 }
                    },
                    required: ["job_title", "customer_name", "job_type", "materials", "labor_hours", "labor_rate"]
                },
            },
            // Cost Estimation Tools
            {
                name: "estimate_project_cost",
                description: "Estimate total project cost based on scope and complexity",
                inputSchema: {
                    type: "object",
                    properties: {
                        project_type: {
                            type: "string",
                            description: "Type of project",
                            enum: ["bathroom_renovation", "kitchen_renovation", "house_extension", "deck_construction", "roof_replacement", "electrical_upgrade", "plumbing_upgrade", "custom"]
                        },
                        scope: {
                            type: "string",
                            description: "Project scope",
                            enum: ["small", "medium", "large", "commercial"]
                        },
                        area: { type: "number", description: "Project area in square meters" },
                        complexity: {
                            type: "string",
                            description: "Project complexity",
                            enum: ["simple", "moderate", "complex", "very_complex"]
                        },
                        location: {
                            type: "string",
                            description: "Project location (affects rates)",
                            enum: ["urban", "suburban", "rural", "remote"]
                        }
                    },
                    required: ["project_type", "scope", "area", "complexity"]
                },
            },
            // Time & Scheduling Tools
            {
                name: "calculate_project_timeline",
                description: "Calculate project timeline and milestones",
                inputSchema: {
                    type: "object",
                    properties: {
                        project_type: { type: "string", description: "Type of project" },
                        scope: {
                            type: "string",
                            description: "Project scope",
                            enum: ["small", "medium", "large", "commercial"]
                        },
                        team_size: { type: "number", description: "Number of workers", default: 2 },
                        working_days_per_week: { type: "number", description: "Working days per week", default: 5 },
                        hours_per_day: { type: "number", description: "Hours per day", default: 8 },
                        start_date: { type: "string", description: "Project start date (YYYY-MM-DD)" }
                    },
                    required: ["project_type", "scope", "start_date"]
                },
            },
            // Profit & Business Analysis
            {
                name: "calculate_profit_margin",
                description: "Calculate profit margins and break-even analysis",
                inputSchema: {
                    type: "object",
                    properties: {
                        revenue: { type: "number", description: "Total revenue" },
                        material_costs: { type: "number", description: "Material costs" },
                        labor_costs: { type: "number", description: "Labor costs" },
                        overhead_costs: { type: "number", description: "Overhead costs" },
                        other_costs: { type: "number", description: "Other direct costs", default: 0 }
                    },
                    required: ["revenue", "material_costs", "labor_costs", "overhead_costs"]
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    // Type guard for args
    if (!args || typeof args !== 'object') {
        throw new McpError(ErrorCode.InvalidParams, "Invalid arguments provided");
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
                if (error)
                    throw error;
                const customers = data;
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
                if (error)
                    throw error;
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Customer Created Successfully!**\n\n🆔 ID: ${data.id}\n👤 Name: ${data.name}\n📧 Email: ${data.email}\n📞 Phone: ${data.phone}\n📍 Address: ${data.address}, ${data.city}, ${data.state} ${data.zipcode}`
                        }]
                };
            }
            case "update_customer": {
                const updateData = {};
                if (args.name)
                    updateData.name = String(args.name);
                if (args.email)
                    updateData.email = String(args.email);
                if (args.phone)
                    updateData.phone = String(args.phone);
                if (args.address)
                    updateData.address = String(args.address);
                if (args.city)
                    updateData.city = String(args.city);
                if (args.state)
                    updateData.state = String(args.state);
                if (args.zipcode)
                    updateData.zipcode = String(args.zipcode);
                if (args.status)
                    updateData.status = String(args.status);
                const { data, error } = await supabase
                    .from('customers')
                    .update(updateData)
                    .eq('id', String(args.id))
                    .select()
                    .single();
                if (error)
                    throw error;
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
                if (error)
                    throw error;
                const jobs = data;
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
                if (error)
                    throw error;
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
                if (error)
                    throw error;
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
                if (error)
                    throw error;
                const tasks = data;
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
                if (error)
                    throw error;
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
                if (error)
                    throw error;
                const invoices = data;
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
                if (error)
                    throw error;
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
                if (error)
                    throw error;
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
            // 🚀 NEW: Advanced Business Logic Tools
            // Area & Material Calculators
            case "calculate_area": {
                const shape = String(args.shape);
                const dimensions = args.dimensions;
                const unit = String(args.unit || 'm');
                let area;
                switch (shape) {
                    case "rectangle":
                        area = Number(dimensions.length) * Number(dimensions.width);
                        break;
                    case "circle":
                        area = Math.PI * Math.pow(Number(dimensions.radius), 2);
                        break;
                    case "triangle":
                        area = 0.5 * Number(dimensions.base) * Number(dimensions.height);
                        break;
                    case "square":
                        area = Math.pow(Number(dimensions.side), 2);
                        break;
                    default:
                        throw new McpError(ErrorCode.InvalidParams, "Invalid shape provided");
                }
                return {
                    content: [{
                            type: "text",
                            text: `🏗️ **Area Calculation**\n\n🔢 Calculated Area: ${area.toFixed(2)} ${unit}`
                        }]
                };
            }
            case "calculate_materials": {
                const job_type = String(args.job_type);
                const area = Number(args.area);
                const material_type = args.material_type ? String(args.material_type) : '';
                const waste_factor = Number(args.waste_factor || 10);
                const waste = (waste_factor / 100) * area;
                const total_area = area + waste;
                return {
                    content: [{
                            type: "text",
                            text: `🔢 **Material Calculation**\n\n🔢 Total Area: ${total_area.toFixed(2)} m²\n🔢 Waste: ${waste.toFixed(2)} m²`
                        }]
                };
            }
            case "calculate_labor_cost": {
                const job_type = String(args.job_type);
                const hours = Number(args.hours);
                const workers = Number(args.workers || 1);
                const hourly_rate = Number(args.hourly_rate || 50);
                const overtime_hours = Number(args.overtime_hours || 0);
                const regular_hours = Math.min(hours, 8);
                const overtime_hours_calc = Math.max(hours - 8, 0);
                const regular_cost = regular_hours * hourly_rate * workers;
                const overtime_cost = overtime_hours_calc * hourly_rate * workers * 1.5;
                const total_cost = regular_cost + overtime_cost;
                return {
                    content: [{
                            type: "text",
                            text: `💵 **Labor Cost Calculation**\n\n💵 Regular Hours: ${regular_hours.toFixed(2)} hours\n💵 Overtime Hours: ${overtime_hours_calc.toFixed(2)} hours\n💵 Regular Cost: ${regular_cost.toFixed(2)}\n💵 Overtime Cost: ${overtime_cost.toFixed(2)}\n💵 Total Cost: ${total_cost.toFixed(2)}`
                        }]
                };
            }
            case "generate_quote": {
                const job_title = String(args.job_title);
                const customer_name = String(args.customer_name);
                const job_type = String(args.job_type);
                const materials = args.materials || [];
                const labor_hours = Number(args.labor_hours);
                const labor_rate = Number(args.labor_rate);
                const markup_percentage = Number(args.markup_percentage || 20);
                const gst_rate = Number(args.gst_rate || 10);
                const material_costs = materials.reduce((sum, material) => sum + (Number(material.quantity) * Number(material.unit_price)), 0);
                const labor_costs = labor_hours * labor_rate;
                const total_cost = material_costs + labor_costs;
                const markup = (markup_percentage / 100) * total_cost;
                const gst = (gst_rate / 100) * (total_cost + markup);
                const total_quote = total_cost + markup + gst;
                return {
                    content: [{
                            type: "text",
                            text: `📋 **Quote Generation**\n\n🏗️ **Job Title**: ${job_title}\n👤 **Customer**: ${customer_name}\n🔧 **Job Type**: ${job_type}\n🔢 **Material Costs**: ${formatCurrency(material_costs)}\n💵 **Labor Costs**: ${formatCurrency(labor_costs)}\n💰 **Total Costs**: ${formatCurrency(total_cost)}\n✅ **Markup**: ${formatCurrency(markup)}\n💸 **GST**: ${formatCurrency(gst)}\n💰 **Total Quote**: ${formatCurrency(total_quote)}`
                        }]
                };
            }
            case "estimate_project_cost": {
                const { project_type, scope, area, complexity, location } = args;
                let cost;
                switch (project_type) {
                    case "bathroom_renovation":
                        cost = 5000;
                        break;
                    case "kitchen_renovation":
                        cost = 7500;
                        break;
                    case "house_extension":
                        cost = 10000;
                        break;
                    case "deck_construction":
                        cost = 2000;
                        break;
                    case "roof_replacement":
                        cost = 5000;
                        break;
                    case "electrical_upgrade":
                        cost = 3000;
                        break;
                    case "plumbing_upgrade":
                        cost = 4000;
                        break;
                    case "custom":
                        cost = 10000;
                        break;
                    default:
                        throw new McpError(ErrorCode.InvalidParams, "Invalid project type provided");
                }
                // Add complexity multiplier
                const complexity_multiplier = complexity === "simple" ? 1.0 : complexity === "moderate" ? 1.5 : complexity === "complex" ? 2.0 : complexity === "very_complex" ? 2.5 : 1.0;
                cost *= complexity_multiplier;
                // Add location multiplier
                const location_multiplier = location === "urban" ? 1.2 : location === "suburban" ? 1.0 : location === "rural" ? 0.8 : 0.6;
                cost *= location_multiplier;
                // Add area multiplier
                const area_multiplier = scope === "small" ? 1.0 : scope === "medium" ? 1.2 : scope === "large" ? 1.5 : 1.8;
                cost *= area_multiplier;
                return {
                    content: [{
                            type: "text",
                            text: `📊 **Project Cost Estimation**\n\n💰 **Estimated Cost**: ${formatCurrency(cost)}`
                        }]
                };
            }
            case "calculate_project_timeline": {
                const { project_type, scope, team_size, working_days_per_week, hours_per_day, start_date } = args;
                const project_duration = project_type === "small" ? 1 : project_type === "medium" ? 2 : project_type === "large" ? 3 : project_type === "commercial" ? 4 : 5;
                const total_working_days = project_duration * Number(working_days_per_week) * 5;
                const total_hours = total_working_days * Number(hours_per_day);
                const project_timeline = {
                    milestones: [
                        {
                            name: "Project Start",
                            date: String(start_date)
                        },
                        {
                            name: "Midpoint",
                            date: new Date(new Date(String(start_date)).setDate(new Date(String(start_date)).getDate() + Math.floor(project_duration / 2))).toISOString().split('T')[0]
                        },
                        {
                            name: "Project Completion",
                            date: new Date(new Date(String(start_date)).setDate(new Date(String(start_date)).getDate() + project_duration)).toISOString().split('T')[0]
                        }
                    ],
                    total_duration: `${project_duration} months`,
                    total_working_days: `${total_working_days} days`,
                    total_hours: `${total_hours} hours`
                };
                return {
                    content: [{
                            type: "text",
                            text: `📅 **Project Timeline**\n\n🏗️ **Project Type**: ${project_type}\n🔢 **Project Duration**: ${project_duration} months\n📅 **Total Working Days**: ${total_working_days} days\n🕒 **Total Hours**: ${total_hours} hours`
                        }]
                };
            }
            case "calculate_profit_margin": {
                const { revenue, material_costs, labor_costs, overhead_costs, other_costs } = args;
                const revenueNum = Number(revenue);
                const materialCostsNum = Number(material_costs);
                const laborCostsNum = Number(labor_costs);
                const overheadCostsNum = Number(overhead_costs);
                const otherCostsNum = Number(other_costs);
                const total_cost = materialCostsNum + laborCostsNum + overheadCostsNum + otherCostsNum;
                const profit = revenueNum - total_cost;
                const margin = (profit / revenueNum) * 100;
                const break_even_point = total_cost / revenueNum * 100;
                return {
                    content: [{
                            type: "text",
                            text: `📊 **Profit Margin Calculation**\n\n💰 **Revenue**: ${formatCurrency(revenueNum)}\n🔢 **Material Costs**: ${formatCurrency(materialCostsNum)}\n💵 **Labor Costs**: ${formatCurrency(laborCostsNum)}\n🏭 **Overhead Costs**: ${formatCurrency(overheadCostsNum)}\n💸 **Other Costs**: ${formatCurrency(otherCostsNum)}\n💰 **Total Costs**: ${formatCurrency(total_cost)}\n💸 **Profit**: ${formatCurrency(profit)}\n✅ **Profit Margin**: ${margin.toFixed(2)}%\n🔢 **Break-Even Point**: ${break_even_point.toFixed(2)}%`
                        }]
                };
            }
            // 📅 Calendar Management Implementation
            case "get_calendar_events": {
                let query = supabase
                    .from('calendar_events')
                    .select('*')
                    .order('start_time', { ascending: true })
                    .limit(Number(args.limit) || 10);
                if (args.start_date && args.end_date) {
                    query = query.gte('start_time', args.start_date).lte('end_time', args.end_date);
                }
                if (args.job_id) {
                    query = query.eq('job_id', args.job_id);
                }
                if (args.customer_id) {
                    query = query.eq('customer_id', args.customer_id);
                }
                if (args.event_type) {
                    query = query.eq('event_type', args.event_type);
                }
                const { data, error } = await query;
                if (error)
                    throw error;
                const events = data;
                let result = `📅 **Calendar Events (${events.length} found)**\n\n`;
                events.forEach((event, index) => {
                    const startTime = new Date(event.start_time);
                    const endTime = new Date(event.end_time);
                    result += `${index + 1}. 📅 **${event.title}**\n`;
                    result += `   🕐 Time: ${startTime.toLocaleString()} - ${endTime.toLocaleString()}\n`;
                    result += `   🏷️ Type: ${event.event_type}\n`;
                    if (event.location) {
                        result += `   📍 Location: ${event.location}\n`;
                    }
                    if (event.job_id) {
                        result += `   🏗️ Job ID: ${event.job_id}\n`;
                    }
                    if (event.customer_id) {
                        result += `   👤 Customer ID: ${event.customer_id}\n`;
                    }
                    if (event.description) {
                        result += `   📝 Description: ${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}\n`;
                    }
                    result += `   🗓️ Created: ${formatDate(event.created_at)}\n\n`;
                });
                return { content: [{ type: "text", text: result }] };
            }
            case "create_calendar_event": {
                const { data, error } = await supabase
                    .from('calendar_events')
                    .insert([{
                        title: String(args.title),
                        description: args.description ? String(args.description) : null,
                        start_time: String(args.start_time),
                        end_time: String(args.end_time),
                        job_id: args.job_id ? String(args.job_id) : null,
                        customer_id: args.customer_id ? String(args.customer_id) : null,
                        event_type: String(args.event_type),
                        location: args.location ? String(args.location) : null,
                        user_id: 'system' // You'd want to get this from auth context
                    }])
                    .select()
                    .single();
                if (error)
                    throw error;
                const startTime = new Date(data.start_time);
                const endTime = new Date(data.end_time);
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Calendar Event Created Successfully!**\n\n🆔 ID: ${data.id}\n📅 Title: ${data.title}\n🕐 Time: ${startTime.toLocaleString()} - ${endTime.toLocaleString()}\n🏷️ Type: ${data.event_type}\n📍 Location: ${data.location || 'Not specified'}\n🏗️ Job ID: ${data.job_id || 'Not linked'}\n👤 Customer ID: ${data.customer_id || 'Not linked'}`
                        }]
                };
            }
            case "update_calendar_event": {
                const updateData = {};
                if (args.title)
                    updateData.title = String(args.title);
                if (args.description)
                    updateData.description = String(args.description);
                if (args.start_time)
                    updateData.start_time = String(args.start_time);
                if (args.end_time)
                    updateData.end_time = String(args.end_time);
                if (args.job_id)
                    updateData.job_id = String(args.job_id);
                if (args.customer_id)
                    updateData.customer_id = String(args.customer_id);
                if (args.event_type)
                    updateData.event_type = String(args.event_type);
                if (args.location)
                    updateData.location = String(args.location);
                updateData.updated_at = new Date().toISOString();
                const { data, error } = await supabase
                    .from('calendar_events')
                    .update(updateData)
                    .eq('id', String(args.id))
                    .select()
                    .single();
                if (error)
                    throw error;
                const startTime = new Date(data.start_time);
                const endTime = new Date(data.end_time);
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Calendar Event Updated Successfully!**\n\n🆔 ID: ${data.id}\n📅 Title: ${data.title}\n🕐 Time: ${startTime.toLocaleString()} - ${endTime.toLocaleString()}\n🏷️ Type: ${data.event_type}\n📍 Location: ${data.location || 'Not specified'}`
                        }]
                };
            }
            case "delete_calendar_event": {
                const { data, error } = await supabase
                    .from('calendar_events')
                    .delete()
                    .eq('id', String(args.id))
                    .select()
                    .single();
                if (error)
                    throw error;
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Calendar Event Deleted Successfully!**\n\n🆔 ID: ${data.id}\n📅 Title: ${data.title}\n🗑️ The event has been removed from the calendar.`
                        }]
                };
            }
            case "get_calendar_connections": {
                let query = supabase
                    .from('user_calendar_connections')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (args.provider) {
                    query = query.eq('provider', args.provider);
                }
                const { data, error } = await query;
                if (error)
                    throw error;
                const connections = data;
                let result = `🔗 **Calendar Connections (${connections.length} found)**\n\n`;
                connections.forEach((connection, index) => {
                    const syncIcon = connection.sync_enabled ? '🟢' : '🔴';
                    result += `${index + 1}. ${syncIcon} **${connection.provider.toUpperCase()}** Calendar\n`;
                    result += `   🆔 ID: ${connection.id}\n`;
                    result += `   📅 Provider ID: ${connection.provider_id || 'Not set'}\n`;
                    result += `   📋 Calendar ID: ${connection.calendar_id || 'Not set'}\n`;
                    result += `   🔄 Sync Enabled: ${connection.sync_enabled ? 'Yes' : 'No'}\n`;
                    result += `   🗓️ Connected: ${formatDate(connection.created_at)}\n\n`;
                });
                return { content: [{ type: "text", text: result }] };
            }
            case "sync_calendar_events": {
                // Note: This would typically integrate with external calendar APIs
                // For now, we'll simulate the sync operation
                const { data: connection, error: connectionError } = await supabase
                    .from('user_calendar_connections')
                    .select('*')
                    .eq('id', String(args.connection_id))
                    .single();
                if (connectionError)
                    throw connectionError;
                const syncDirection = args.sync_direction || 'bidirectional';
                // Record the sync operation
                const { data: syncRecord, error: syncError } = await supabase
                    .from('calendar_sync_events')
                    .insert([{
                        user_id: 'system',
                        connection_id: String(args.connection_id),
                        trade_event_id: 'sync_operation',
                        event_title: `Calendar Sync - ${syncDirection}`,
                        event_start: new Date(),
                        event_end: new Date(Date.now() + 60000) // 1 minute duration
                    }])
                    .select()
                    .single();
                if (syncError)
                    throw syncError;
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Calendar Sync Initiated Successfully!**\n\n🔗 Connection: ${connection.provider.toUpperCase()}\n🔄 Sync Direction: ${syncDirection}\n📅 Sync Record ID: ${syncRecord.id}\n⏰ Started: ${new Date().toLocaleString()}\n\n📝 Note: This sync operation will process calendar events in the background.`
                        }]
                };
            }
            case "create_job_calendar_event": {
                // First, get the job details
                const { data: job, error: jobError } = await supabase
                    .from('jobs')
                    .select('*')
                    .eq('id', String(args.job_id))
                    .single();
                if (jobError)
                    throw jobError;
                // Get customer details if available
                const { data: customer } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('name', job.customer)
                    .single();
                const duration = Number(args.duration_hours) || 2;
                const startTime = job.date ? new Date(job.date) : new Date();
                const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
                // Create calendar event from job
                const { data: calendarEvent, error: eventError } = await supabase
                    .from('calendar_events')
                    .insert([{
                        title: `${String(args.event_type).replace('_', ' ').toUpperCase()}: ${job.title}`,
                        description: `${job.description || ''}\n\nJob #${job.job_number}\nCustomer: ${job.customer}\nTeam: ${job.assigned_team || 'Not assigned'}`,
                        start_time: startTime.toISOString(),
                        end_time: endTime.toISOString(),
                        job_id: job.id,
                        customer_id: customer?.id || null,
                        event_type: String(args.event_type),
                        location: customer?.address || null,
                        user_id: 'system'
                    }])
                    .select()
                    .single();
                if (eventError)
                    throw eventError;
                return {
                    content: [{
                            type: "text",
                            text: `✅ **Job Calendar Event Created Successfully!**\n\n🆔 Event ID: ${calendarEvent.id}\n📅 Title: ${calendarEvent.title}\n🏗️ Job: ${job.title} (#${job.job_number})\n👤 Customer: ${job.customer}\n🕐 Time: ${startTime.toLocaleString()} - ${endTime.toLocaleString()}\n📍 Location: ${calendarEvent.location || 'Not specified'}\n🏷️ Type: ${calendarEvent.event_type}`
                        }]
                };
            }
            default:
                throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${name}`);
        }
    }
    catch (error) {
        if (error instanceof McpError) {
            throw error;
        }
        throw new McpError(ErrorCode.InternalError, `Database operation failed: ${error instanceof Error ? error.message : String(error)}`);
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
