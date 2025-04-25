import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const SuppliersPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Suppliers Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Suppliers management section. This page will allow you to manage your suppliers, view their information, and track your supplier relationships.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuppliersPage;
