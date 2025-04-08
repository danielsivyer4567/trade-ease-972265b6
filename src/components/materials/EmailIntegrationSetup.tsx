
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, CheckCircle2, AlertCircle } from "lucide-react";

export function EmailIntegrationSetup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [filterSuppliers, setFilterSuppliers] = useState(true);
  const [filterInvoices, setFilterInvoices] = useState(true);
  const [filterQuotes, setFilterQuotes] = useState(true);
  const { toast } = useToast();

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      // In a real implementation, this would securely store credentials and set up email fetching
      // This is a mock implementation
      setTimeout(() => {
        setIsConnected(true);
        setIsLoading(false);
        
        toast({
          title: "Email connected",
          description: "Your email has been successfully connected for monitoring",
        });
      }, 1500);
    } catch (error) {
      console.error("Error connecting email:", error);
      setIsLoading(false);
      toast({
        title: "Connection failed",
        description: "Failed to connect your email account. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Email Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isConnected ? (
          <div className="space-y-4">
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-600">
                Email connected successfully. We are now monitoring for material orders and invoices.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Email Filters</h3>
              <div className="space-y-2 border rounded-md p-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="filter-suppliers" className="flex items-center gap-2 cursor-pointer">
                    Filter supplier emails
                    <span className="text-xs text-gray-500">(Orders, shipping notices)</span>
                  </Label>
                  <Switch 
                    id="filter-suppliers" 
                    checked={filterSuppliers}
                    onCheckedChange={setFilterSuppliers}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="filter-invoices" className="flex items-center gap-2 cursor-pointer">
                    Filter invoice emails
                    <span className="text-xs text-gray-500">(Automatically process invoices)</span>
                  </Label>
                  <Switch 
                    id="filter-invoices" 
                    checked={filterInvoices}
                    onCheckedChange={setFilterInvoices}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="filter-quotes" className="flex items-center gap-2 cursor-pointer">
                    Filter quote emails
                    <span className="text-xs text-gray-500">(Price change notifications)</span>
                  </Label>
                  <Switch 
                    id="filter-quotes" 
                    checked={filterQuotes}
                    onCheckedChange={setFilterQuotes}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setIsConnected(false)}>
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleConnect} className="space-y-4">
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-600">
                Connect your email to automatically track material orders, invoices, and price changes.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Email Password or App Password</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <p className="text-xs text-gray-500">
                We recommend using an app-specific password for increased security.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Connecting..." : "Connect Email"}
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
