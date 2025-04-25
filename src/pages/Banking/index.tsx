import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const BankingPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Banking Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the Banking management section. This page will allow you to manage your bank accounts, transactions, and financial records.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default BankingPage;
