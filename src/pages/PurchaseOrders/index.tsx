import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PurchaseOrdersPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Purchase Orders management section. This page will allow you to create, track, and manage purchase orders for your business.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default PurchaseOrdersPage;
