
import React from 'react';
import { useParams } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Mail, Phone, MapPin, FileText, Calendar, DollarSign, MessageSquare, Clock } from 'lucide-react';

const CustomerDetails = () => {
  const { id } = useParams();

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Customer Details</h1>
            <p className="text-muted-foreground">ID: {id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Customer</Button>
            <Button>Contact Customer</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 md:col-span-1">
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-gray-500">
                  JD
                </div>
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-muted-foreground">Residential Customer</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span>johndoe@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>123 Main St, Anytown, CA 90210</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-1 md:col-span-2">
            <Tabs defaultValue="overview">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Customer Overview</CardTitle>
                  <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>
                    <TabsTrigger value="invoices">Invoices</TabsTrigger>
                    <TabsTrigger value="notes">Notes</TabsTrigger>
                  </TabsList>
                </div>
              </CardHeader>
              <CardContent>
                <TabsContent value="overview">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Active Jobs
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">3</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Next Appointment
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">Feb 15, 9:00 AM</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Total Spent
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">$2,450.00</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm font-medium flex items-center gap-2">
                          <MessageSquare className="h-4 w-4" />
                          Last Contact
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="text-2xl font-bold">3 days ago</div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="jobs">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Bathroom Renovation</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>Started: Jan 15, 2023</span>
                        <Clock className="h-3 w-3 ml-2" />
                        <span>Est. Completion: Feb 28, 2023</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Complete renovation of master bathroom with new fixtures and tiling.</p>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Kitchen Faucet Replacement</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>Completed: Dec 10, 2022</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Replaced kitchen faucet with new high-end model.</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="invoices">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Invoice #1082</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>Date: Jan 25, 2023</span>
                        <DollarSign className="h-3 w-3 ml-2" />
                        <span>Amount: $1,250.00</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Bathroom renovation - partial payment</p>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Invoice #1065</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Paid</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="h-3 w-3" />
                        <span>Date: Dec 12, 2022</span>
                        <DollarSign className="h-3 w-3 ml-2" />
                        <span>Amount: $350.00</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Kitchen faucet replacement</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notes">
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Customer Preferences</h3>
                        <span className="text-xs text-muted-foreground">Added Jan 10, 2023</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer prefers appointments in the afternoon. Has two dogs that should be kept separated from workers.</p>
                    </div>
                    
                    <div className="rounded-lg border p-4">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold">Bathroom Project Notes</h3>
                        <span className="text-xs text-muted-foreground">Added Jan 20, 2023</span>
                      </div>
                      <p className="text-sm text-muted-foreground">Customer requested extra storage options in the bathroom. Provided quote for additional cabinet installation.</p>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default CustomerDetails;
