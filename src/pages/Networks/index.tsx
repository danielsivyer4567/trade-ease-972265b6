import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { BaseLayout } from "@/components/ui/BaseLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Network, Share2, Users, Server, Workflow, Fence } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const NetworksPage = () => {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <BaseLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-2 mb-6">
          <Network className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Networks</h1>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <Button onClick={() => handleNavigate('/calculators/fence')}>
            <Fence className="mr-2 h-4 w-4" /> Calculate Fence
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Partner Network Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Partner Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Connect with trusted trade partners in your region for collaboration and referrals.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">12 Active Partners</span>
                <button className="text-primary text-sm font-medium">Manage</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Supply Chain Network */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-primary" />
                Supply Chain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Access your supply network for materials, equipment and resources.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">8 Suppliers Connected</span>
                <button className="text-primary text-sm font-medium">View</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Lead Exchange */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-primary" />
                Lead Exchange
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Share and receive job leads with your trusted network partners.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">3 New Leads Available</span>
                <button className="text-primary text-sm font-medium">Exchange</button>
              </div>
            </CardContent>
          </Card>
          
          {/* Work Integration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="h-5 w-5 text-primary" />
                Work Integration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Seamlessly integrate third-party workers and contractors into your workflow.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">5 Active Integrations</span>
                <button className="text-primary text-sm font-medium">Configure</button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseLayout>
  );
};

export default NetworksPage;
