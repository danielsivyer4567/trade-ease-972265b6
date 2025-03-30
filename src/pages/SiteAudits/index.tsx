
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileSearch, Clipboard, Calendar, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function SiteAudits() {
  return (
    <BaseLayout>
      <div className="container mx-auto py-6 space-y-6 max-w-7xl">
        <SectionHeader
          title="Site Audits"
          description="Manage and review all site inspections and audits"
          icon={<FileSearch className="h-6 w-6" />}
        />
        
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-4 max-w-lg">
            <TabsTrigger value="active">Active Audits</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="pt-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border border-border hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">Remodeling Site Audit #{i}</CardTitle>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">In Progress</span>
                    </div>
                    <CardDescription>123 Main St, Anytown, CA</CardDescription>
                  </CardHeader>
                  <CardContent className="text-sm pb-2">
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Started: Oct 10, 2023</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckSquare className="h-3 w-3" />
                        <span>15/24 completed</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-2 border-t text-sm">
                    <div className="flex justify-between w-full">
                      <span>Assigned to: John Smith</span>
                      <button className="text-primary hover:underline">View details</button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="scheduled" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <FileSearch className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No scheduled audits</h3>
              <p>Schedule a new site audit to get started</p>
            </div>
          </TabsContent>
          
          <TabsContent value="completed" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <CheckSquare className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No completed audits</h3>
              <p>Complete an audit to see it here</p>
            </div>
          </TabsContent>
          
          <TabsContent value="templates" className="pt-4">
            <div className="text-center py-10 text-muted-foreground">
              <Clipboard className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <h3 className="text-lg font-medium mb-2">No audit templates</h3>
              <p>Create a template to streamline your audit process</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </BaseLayout>
  );
}
