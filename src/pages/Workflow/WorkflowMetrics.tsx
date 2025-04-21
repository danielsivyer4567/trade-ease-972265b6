import React, { useState, useEffect } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { WorkflowNavigation } from './components/WorkflowNavigation';
import { ArrowUpDown, Clock, FilterX, Zap, CheckCircle, XCircle, BarChart3, RefreshCw } from "lucide-react";

// Define interfaces for our data
interface WorkflowMetric {
  id: string;
  name: string;
  status: string;
  executionCount: number;
  successRate: number;
  avgExecutionTime: number;
  lastExecuted: string;
  category: string;
}

interface AutomationMetric {
  id: number;
  title: string;
  category: string;
  executionCount: number;
  successRate: number;
  avgExecutionTime: number;
  lastTriggered: string;
}

interface NodeTypeMetric {
  type: string;
  count: number;
  successRate: number;
  avgExecutionTime: number;
}

interface ExecutionLog {
  id: string;
  workflow_id: string;
  workflowName: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  executionTime: number;
}

// Helper function to format date
const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Helper to calculate execution time in seconds
const calculateExecutionTime = (startTime: string, endTime: string | null) => {
  if (!endTime) return 0;
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return Math.round((end - start) / 1000);
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function WorkflowMetrics() {
  const [period, setPeriod] = useState('7days');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // Data states
  const [workflowMetrics, setWorkflowMetrics] = useState<WorkflowMetric[]>([]);
  const [automationMetrics, setAutomationMetrics] = useState<AutomationMetric[]>([]);
  const [nodeTypeMetrics, setNodeTypeMetrics] = useState<NodeTypeMetric[]>([]);
  const [executionLogs, setExecutionLogs] = useState<ExecutionLog[]>([]);
  const [executionTrend, setExecutionTrend] = useState<any[]>([]);
  const [statusDistribution, setStatusDistribution] = useState<any[]>([]);
  
  useEffect(() => {
    loadMetricsData();
  }, [period, statusFilter, categoryFilter]);
  
  const loadMetricsData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchWorkflowMetrics(),
        fetchAutomationMetrics(),
        fetchNodeTypeMetrics(),
        fetchExecutionLogs(),
        fetchExecutionTrend(),
        fetchStatusDistribution()
      ]);
    } catch (error) {
      console.error('Error loading metrics data:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch workflow metrics
  const fetchWorkflowMetrics = async () => {
    // Get date range based on period
    const fromDate = getPeriodStartDate(period);
    
    // In a real implementation, this would be a database query
    // For now, we'll generate mock data
    const mockWorkflowMetrics: WorkflowMetric[] = [
      {
        id: 'wf-1',
        name: 'Customer Onboarding',
        status: 'active',
        executionCount: 48,
        successRate: 92,
        avgExecutionTime: 12,
        lastExecuted: new Date().toISOString(),
        category: 'customer'
      },
      {
        id: 'wf-2',
        name: 'Quote Follow-up',
        status: 'active',
        executionCount: 76,
        successRate: 88,
        avgExecutionTime: 8,
        lastExecuted: new Date().toISOString(),
        category: 'sales'
      },
      {
        id: 'wf-3',
        name: 'Job Completion',
        status: 'active',
        executionCount: 32,
        successRate: 96,
        avgExecutionTime: 15,
        lastExecuted: new Date().toISOString(),
        category: 'job'
      },
      {
        id: 'wf-4',
        name: 'Photo Sharing',
        status: 'active',
        executionCount: 64,
        successRate: 98,
        avgExecutionTime: 5,
        lastExecuted: new Date().toISOString(),
        category: 'customer'
      },
      {
        id: 'wf-5',
        name: 'Invoice Reminder',
        status: 'paused',
        executionCount: 24,
        successRate: 75,
        avgExecutionTime: 7,
        lastExecuted: new Date().toISOString(),
        category: 'finance'
      }
    ];
    
    setWorkflowMetrics(mockWorkflowMetrics.filter(wf => {
      if (statusFilter !== 'all' && wf.status !== statusFilter) return false;
      if (categoryFilter !== 'all' && wf.category !== categoryFilter) return false;
      return true;
    }));
  };
  
  // Fetch automation metrics
  const fetchAutomationMetrics = async () => {
    // Mock data
    const mockAutomationMetrics: AutomationMetric[] = [
      {
        id: 1,
        title: 'New Job Alert',
        category: 'team',
        executionCount: 86,
        successRate: 94,
        avgExecutionTime: 3,
        lastTriggered: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Quote Follow-up',
        category: 'sales',
        executionCount: 104,
        successRate: 89,
        avgExecutionTime: 4,
        lastTriggered: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Customer Feedback Form',
        category: 'forms',
        executionCount: 54,
        successRate: 97,
        avgExecutionTime: 6,
        lastTriggered: new Date().toISOString()
      },
      {
        id: 4,
        title: 'Social Media Post',
        category: 'social',
        executionCount: 42,
        successRate: 85,
        avgExecutionTime: 12,
        lastTriggered: new Date().toISOString()
      },
      {
        id: 5,
        title: 'SMS Appointment Reminder',
        category: 'messaging',
        executionCount: 128,
        successRate: 99,
        avgExecutionTime: 2,
        lastTriggered: new Date().toISOString()
      }
    ];
    
    setAutomationMetrics(mockAutomationMetrics.filter(auto => {
      if (categoryFilter !== 'all' && auto.category !== categoryFilter) return false;
      return true;
    }));
  };
  
  // Fetch node type metrics
  const fetchNodeTypeMetrics = async () => {
    // Mock data
    const mockNodeTypeMetrics: NodeTypeMetric[] = [
      { type: 'customerNode', count: 126, successRate: 94, avgExecutionTime: 8 },
      { type: 'jobNode', count: 98, successRate: 91, avgExecutionTime: 12 },
      { type: 'quoteNode', count: 76, successRate: 87, avgExecutionTime: 9 },
      { type: 'messagingNode', count: 212, successRate: 96, avgExecutionTime: 4 },
      { type: 'automationNode', count: 164, successRate: 93, avgExecutionTime: 10 },
      { type: 'visionNode', count: 42, successRate: 82, avgExecutionTime: 15 }
    ];
    
    setNodeTypeMetrics(mockNodeTypeMetrics);
  };
  
  // Fetch execution logs
  const fetchExecutionLogs = async () => {
    // Mock data
    const mockExecutionLogs: ExecutionLog[] = Array(15).fill(0).map((_, i) => {
      const started = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      const completed = Math.random() > 0.1 ? new Date(started.getTime() + Math.random() * 30 * 1000) : null;
      const status = completed ? (Math.random() > 0.2 ? 'success' : 'error') : 'in_progress';
      
      return {
        id: `log-${i+1}`,
        workflow_id: `wf-${Math.floor(Math.random() * 5) + 1}`,
        workflowName: ['Customer Onboarding', 'Quote Follow-up', 'Job Completion', 'Photo Sharing', 'Invoice Reminder'][Math.floor(Math.random() * 5)],
        status,
        started_at: started.toISOString(),
        completed_at: completed?.toISOString() || null,
        executionTime: completed ? calculateExecutionTime(started.toISOString(), completed.toISOString()) : 0
      };
    }).sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime());
    
    setExecutionLogs(mockExecutionLogs);
  };
  
  // Fetch execution trend
  const fetchExecutionTrend = async () => {
    // Generate dates for the past 7 days or 30 days
    const days = period === '7days' ? 7 : 30;
    const trendData = Array(days).fill(0).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      return {
        date: dateStr,
        total: Math.floor(Math.random() * 20) + 5,
        success: Math.floor(Math.random() * 15) + 5,
        failure: Math.floor(Math.random() * 5)
      };
    }).reverse();
    
    setExecutionTrend(trendData);
  };
  
  // Fetch status distribution
  const fetchStatusDistribution = async () => {
    const distribution = [
      { name: 'Success', value: 78 },
      { name: 'Error', value: 13 },
      { name: 'Skipped', value: 9 }
    ];
    
    setStatusDistribution(distribution);
  };
  
  // Helper to get start date based on period
  const getPeriodStartDate = (period: string) => {
    const now = new Date();
    const date = new Date();
    
    switch (period) {
      case '7days':
        date.setDate(now.getDate() - 7);
        break;
      case '30days':
        date.setDate(now.getDate() - 30);
        break;
      case '90days':
        date.setDate(now.getDate() - 90);
        break;
      default:
        date.setDate(now.getDate() - 7);
    }
    
    return date.toISOString();
  };
  
  return (
    <AppLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold">Workflow Metrics</h1>
          <WorkflowNavigation />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[140px]">
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <FilterX className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[160px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
              <SelectItem value="job">Job</SelectItem>
              <SelectItem value="quote">Quote</SelectItem>
              <SelectItem value="sales">Sales</SelectItem>
              <SelectItem value="team">Team</SelectItem>
              <SelectItem value="messaging">Messaging</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="forms">Forms</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            onClick={loadMetricsData}
            disabled={isLoading}
            className="ml-auto"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        
        <Tabs defaultValue="overview">
          <TabsList className="mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="automations">Automations</TabsTrigger>
            <TabsTrigger value="executions">Execution Logs</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {workflowMetrics.reduce((sum, w) => sum + w.executionCount, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    In the {period === '7days' ? 'last 7 days' : period === '30days' ? 'last 30 days' : 'last 90 days'}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">
                    {workflowMetrics.length ? Math.round(workflowMetrics.reduce((sum, w) => sum + w.successRate, 0) / workflowMetrics.length) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Across all workflows
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Execution Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {workflowMetrics.length ? Math.round(workflowMetrics.reduce((sum, w) => sum + w.avgExecutionTime, 0) / workflowMetrics.length) : 0}s
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Processing time
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Execution Trend</CardTitle>
                  <CardDescription>Workflow executions over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={executionTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="total" stroke="#8884d8" name="Total" />
                        <Line type="monotone" dataKey="success" stroke="#82ca9d" name="Success" />
                        <Line type="monotone" dataKey="failure" stroke="#ff7300" name="Failure" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Execution Status</CardTitle>
                  <CardDescription>Status distribution of workflow executions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Node Types */}
            <Card>
              <CardHeader>
                <CardTitle>Node Type Performance</CardTitle>
                <CardDescription>Metrics by node type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={nodeTypeMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="type" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="count" fill="#8884d8" name="Execution Count" />
                      <Bar yAxisId="right" dataKey="successRate" fill="#82ca9d" name="Success Rate (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Workflows Tab */}
          <TabsContent value="workflows">
            <Card>
              <CardHeader>
                <CardTitle>Workflow Performance</CardTitle>
                <CardDescription>Performance metrics for all workflows</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Executed</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {workflowMetrics.map((workflow) => (
                        <tr key={workflow.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{workflow.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{workflow.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              workflow.status === 'active' ? 'bg-green-100 text-green-800' : 
                              workflow.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {workflow.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{workflow.executionCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{workflow.successRate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{workflow.avgExecutionTime}s</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(workflow.lastExecuted)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Automations Tab */}
          <TabsContent value="automations">
            <Card>
              <CardHeader>
                <CardTitle>Automation Performance</CardTitle>
                <CardDescription>Performance metrics for all automations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Automation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Executions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Success Rate</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Triggered</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {automationMetrics.map((automation) => (
                        <tr key={automation.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{automation.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{automation.category}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{automation.executionCount}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{automation.successRate}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{automation.avgExecutionTime}s</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(automation.lastTriggered)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Execution Logs Tab */}
          <TabsContent value="executions">
            <Card>
              <CardHeader>
                <CardTitle>Recent Execution Logs</CardTitle>
                <CardDescription>Detailed logs of recent workflow executions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Workflow</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Started</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Execution Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {executionLogs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{log.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.workflowName}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              log.status === 'success' ? 'bg-green-100 text-green-800' : 
                              log.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {log.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(log.started_at)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.completed_at ? formatDate(log.completed_at) : 'In Progress'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{log.status === 'in_progress' ? '-' : `${log.executionTime}s`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
} 