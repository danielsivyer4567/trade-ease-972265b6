import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';

export default function NewQuote() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract jobId from query parameters
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');

  const handleGoBack = () => {
    // Navigate back to the previous page (the job detail page)
    navigate(-1);
  };

  const handleSaveQuote = () => {
    // In a real app, you would save the quote data here
    // and then navigate back.
    console.log("Quote saved for job:", jobId);
    handleGoBack();
  };

  return (
    <AppLayout>
      <div className="p-4 md:p-6">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="icon" onClick={handleGoBack} className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Create New Quote</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quote Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer-name">Customer Name</Label>
                <Input id="customer-name" placeholder="Enter customer name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quote-amount">Quote Amount</Label>
                <Input id="quote-amount" type="number" placeholder="Enter amount" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quote-description">Description</Label>
              <Textarea id="quote-description" placeholder="Describe the work to be quoted" />
            </div>
            {jobId && (
              <p className="text-sm text-gray-500">This quote will be linked to Job ID: {jobId}</p>
            )}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleGoBack}>Cancel</Button>
              <Button onClick={handleSaveQuote}>Save Quote and Return</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
