import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const QuotesPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Quotes Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Quotes management section. This page will allow you to create, view, and manage quotes for your customers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuotesPage;
