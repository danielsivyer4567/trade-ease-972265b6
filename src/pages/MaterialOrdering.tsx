
import React from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package2, ClipboardList, Truck } from "lucide-react";

export default function MaterialOrdering() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/suppliers");
  };

  return (
    <AppLayout>
      <div className="container p-6 max-w-5xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="outline" size="icon" className="mr-4" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Material Ordering</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Package2 className="h-5 w-5 text-blue-500" />
                Materials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Search and order materials from approved suppliers.
              </p>
              <Button variant="outline" className="w-full text-sm" size="sm" 
                onClick={() => navigate("/jobs/:jobId/materials")}>
                Order Materials
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ClipboardList className="h-5 w-5 text-green-500" />
                Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View your active and past material orders.
              </p>
              <Button variant="outline" className="w-full text-sm" size="sm">
                View Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Truck className="h-5 w-5 text-purple-500" />
                Deliveries
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Track incoming deliveries and manage receipts.
              </p>
              <Button variant="outline" className="w-full text-sm" size="sm">
                Track Deliveries
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Material Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-12 border-2 border-dashed rounded-lg flex justify-center">
              <p className="text-muted-foreground">No recent orders found. Click "Order Materials" to place a new order.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
