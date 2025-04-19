import React, { useState } from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, RefreshCw, Search, Filter, Download, Upload, AlertTriangle, Settings as SettingsIcon, Lock, Server, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DatabaseSettings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('records');
  
  // Mock data for demonstration
  const storageUsage = 68;
  const recordCount = 15482;
  const lastBackup = '2 days ago';
  
  const tableData = [
    { id: 1, table: 'customers', records: 2541, size: '42 MB', lastUpdated: '1 hour ago' },
    { id: 2, table: 'jobs', records: 3782, size: '87 MB', lastUpdated: '3 hours ago' },
    { id: 3, table: 'invoices', records: 4215, size: '54 MB', lastUpdated: '2 days ago' },
    { id: 4, table: 'quotes', records: 2176, size: '31 MB', lastUpdated: '1 day ago' },
    { id: 5, table: 'supplies', records: 892, size: '12 MB', lastUpdated: '5 days ago' },
    { id: 6, table: 'transactions', records: 1876, size: '26 MB', lastUpdated: '12 hours ago' },
  ];
  
  return (
    <BaseLayout>
      <div className="space-y-6 h-full p-6">
        <div className="flex items-center gap-2">
          <Database className="h-8 w-8 text-gray-700" />
          <h1 className="text-3xl font-bold">Database Management</h1>
        </div>
        
        {/* Overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="bg-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Server className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Storage</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500 text-sm">Usage</span>
                  <span className="font-medium">{storageUsage}%</span>
                </div>
                <Progress value={storageUsage} className="h-2" />
                <p className="text-xs text-gray-500 mt-2">324.5 MB of 500 MB used</p>
                <Button variant="outline" size="sm" className="mt-2">
                  <Cloud className="h-4 w-4 mr-2" />
                  Upgrade Storage
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Backup</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Last backup</span>
                  <p className="font-medium">{lastBackup}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Backup
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Upload className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="bg-slate-100 pb-2">
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-gray-600" />
                <CardTitle className="text-lg">Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex flex-col space-y-4">
                <div>
                  <span className="text-gray-500 text-sm">Protection status</span>
                  <p className="font-medium text-green-600">Active</p>
                </div>
                <Button variant="outline" size="sm">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Security Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Database content tabs */}
        <Tabs defaultValue="records" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="records">Records</TabsTrigger>
              <TabsTrigger value="structure">Database Structure</TabsTrigger>
              <TabsTrigger value="queries">Saved Queries</TabsTrigger>
            </TabsList>
            
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue placeholder="Filter by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tables</SelectItem>
                  <SelectItem value="customers">Customers</SelectItem>
                  <SelectItem value="jobs">Jobs</SelectItem>
                  <SelectItem value="invoices">Invoices</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  type="search" 
                  placeholder="Search tables..." 
                  className="pl-8 h-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} 
                />
              </div>
            </div>
          </div>
          
          <TabsContent value="records" className="border rounded-md mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Table Name</TableHead>
                  <TableHead className="text-right">Records</TableHead>
                  <TableHead className="text-right">Size</TableHead>
                  <TableHead className="text-right">Last Updated</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tableData.filter(item => 
                  searchQuery === '' || item.table.toLowerCase().includes(searchQuery.toLowerCase())
                ).map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.table}</TableCell>
                    <TableCell className="text-right">{item.records.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{item.size}</TableCell>
                    <TableCell className="text-right">{item.lastUpdated}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <SettingsIcon className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>
          
          <TabsContent value="structure" className="border rounded-md p-4 mt-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-gray-700">Database structure modifications require administrator privileges</p>
              </div>
              <p className="text-sm text-gray-600">
                This section allows you to view and modify the database schema, including tables, columns, indexes, and relationships. 
                Please note that structural changes may affect system functionality.
              </p>
              <Button variant="outline">
                <Lock className="h-4 w-4 mr-2" />
                Request Admin Access
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="queries" className="border rounded-md p-4 mt-4">
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Save and manage your frequently used database queries here. Custom queries allow you to quickly 
                access specific data combinations and reports.
              </p>
              <Button variant="outline">
                <Search className="h-4 w-4 mr-2" />
                Create New Query
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
} 