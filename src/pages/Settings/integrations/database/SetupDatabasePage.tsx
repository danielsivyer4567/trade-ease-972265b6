import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Database, Lock, Server, Check, X, AlertTriangle, RefreshCw, Terminal } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "react-router-dom";
import { sqlService } from "@/services/sqlService";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CodeBlock } from "@/components/ui/CodeBlock";

export default function SetupDatabasePage() {
  const navigate = useNavigate();
  const [customSql, setCustomSql] = useState('');
  const [isRunningQuery, setIsRunningQuery] = useState(false);
  const [isSettingUpRls, setIsSettingUpRls] = useState(false);
  const [queryResult, setQueryResult] = useState<any>(null);
  
  const handleRunCustomQuery = async () => {
    if (!customSql.trim()) {
      toast.error("Please enter a SQL query");
      return;
    }
    
    setIsRunningQuery(true);
    try {
      const result = await sqlService.executeQuery(customSql);
      setQueryResult(result);
      
      if (!result.error) {
        toast.success("Query executed successfully");
      }
    } catch (error) {
      console.error("Error running custom query:", error);
      toast.error("Failed to run query");
    } finally {
      setIsRunningQuery(false);
    }
  };
  
  const handleSetupRls = async () => {
    setIsSettingUpRls(true);
    try {
      const result = await sqlService.setupCustomersRLS();
      if (result.error) {
        toast.error(`Failed to setup RLS: ${result.error}`);
      } else {
        toast.success("RLS policies set up successfully for customers table");
      }
    } catch (error) {
      console.error("Error setting up RLS:", error);
      toast.error("An unexpected error occurred while setting up RLS");
    } finally {
      setIsSettingUpRls(false);
    }
  };
  
  // Sample SQL for customers table RLS policy
  const customerRlsPolicy = `
-- Enable Row Level Security on customers table
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policy for SELECT operations
CREATE POLICY "customers_select_policy"
ON customers
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy for INSERT operations
CREATE POLICY "customers_insert_policy"
ON customers
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE operations
CREATE POLICY "customers_update_policy"
ON customers
FOR UPDATE
USING (auth.uid() = user_id);

-- Create policy for DELETE operations
CREATE POLICY "customers_delete_policy"
ON customers
FOR DELETE
USING (auth.uid() = user_id);
  `.trim();
  
  return (
    <AppLayout>
      <div className="container mx-auto py-6 space-y-6">
        <SectionHeader 
          title="Database Configuration" 
          description="Configure and manage your database settings" 
          icon={<Database className="h-6 w-6 text-blue-600" />}
        />
        
        <Tabs defaultValue="rls" className="space-y-6">
          <TabsList className="grid grid-cols-3 w-[400px]">
            <TabsTrigger value="rls">
              <Shield className="h-4 w-4 mr-2" />
              Row Level Security
            </TabsTrigger>
            <TabsTrigger value="sql">
              <Terminal className="h-4 w-4 mr-2" />
              SQL Editor
            </TabsTrigger>
            <TabsTrigger value="backup">
              <Server className="h-4 w-4 mr-2" />
              Backup & Restore
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="rls" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lock className="h-5 w-5 mr-2 text-amber-500" />
                  Row Level Security Policies
                </CardTitle>
                <CardDescription>
                  Configure access control for your database tables by setting up RLS policies
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertTriangle className="h-4 w-4 text-blue-600" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Row Level Security (RLS) ensures that users can only access their own data. 
                    Setting up proper RLS policies is crucial for application security.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Customer Table Policies</h3>
                  <p className="text-sm text-gray-500">
                    These policies will ensure that users can only access customer records that belong to them.
                  </p>
                  
                  <CodeBlock
                    language="sql"
                    value={customerRlsPolicy}
                    className="mt-2 text-xs"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/settings/integrations')}
                >
                  Back to Integrations
                </Button>
                <Button 
                  onClick={handleSetupRls}
                  disabled={isSettingUpRls}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {isSettingUpRls ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4 mr-2" />
                      Apply RLS Policies
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="sql" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Terminal className="h-5 w-5 mr-2 text-purple-500" />
                  SQL Editor
                </CardTitle>
                <CardDescription>
                  Run custom SQL queries against your database
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertTitle>Use with caution</AlertTitle>
                  <AlertDescription>
                    Running SQL directly can permanently modify your database. Make sure you know what you're doing.
                  </AlertDescription>
                </Alert>
                
                <Textarea
                  placeholder="Enter your SQL query here..."
                  className="font-mono text-sm h-40"
                  value={customSql}
                  onChange={(e) => setCustomSql(e.target.value)}
                />
                
                {queryResult && (
                  <div className="p-4 border rounded-md bg-gray-50">
                    <div className="flex items-center mb-2">
                      <h3 className="font-medium">Query Result</h3>
                      {queryResult.error ? (
                        <Badge className="ml-auto bg-red-100 text-red-800 border-red-200">
                          <X className="h-3 w-3 mr-1" />
                          Error
                        </Badge>
                      ) : (
                        <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                          <Check className="h-3 w-3 mr-1" />
                          Success
                        </Badge>
                      )}
                    </div>
                    
                    <div className="font-mono text-xs overflow-auto max-h-40 p-2 bg-white border rounded">
                      {queryResult.error ? (
                        <pre className="text-red-600">{JSON.stringify(queryResult.error, null, 2)}</pre>
                      ) : (
                        <pre>{JSON.stringify(queryResult.data, null, 2)}</pre>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="justify-end">
                <Button 
                  onClick={handleRunCustomQuery}
                  disabled={isRunningQuery || !customSql.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isRunningQuery ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Terminal className="h-4 w-4 mr-2" />
                      Run Query
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Server className="h-5 w-5 mr-2 text-green-500" />
                  Backup & Restore
                </CardTitle>
                <CardDescription>
                  Manage database backups and restoration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">
                  This feature is coming soon. You'll be able to create backups of your database and restore them when needed.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

// Simple Badge component since we don't have import defined
const Badge = ({ children, className = "" }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${className}`}>
    {children}
  </span>
); 