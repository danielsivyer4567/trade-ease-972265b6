import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, FileText, Clipboard, Calendar, AlertCircle, Image, DollarSign, FileCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CustomerNote, CustomerJobHistory } from "@/pages/Banking/types";
import { CustomerPhotos } from './CustomerPhotos';
import { CustomerFinancials } from './CustomerFinancials';
import { CustomerForms } from './CustomerForms';
import { CustomerReviews } from './CustomerReviews';

interface CustomerDetailsProps {
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    status: 'active' | 'inactive';
    created_at: string;
  };
  notes?: CustomerNote[];
  jobHistory?: CustomerJobHistory[];
  onAddNote?: (note: string, important: boolean) => Promise<void>;
  onCreateJob?: (customerId: string) => void;
  onCreateQuote?: (customerId: string) => void;
}

export function CustomerDetails({ 
  customer,
  notes = [],
  jobHistory = [],
  onAddNote,
  onCreateJob,
  onCreateQuote 
}: CustomerDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [newNote, setNewNote] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNote = async () => {
    if (!newNote.trim() || !onAddNote) return;
    
    setIsSaving(true);
    try {
      await onAddNote(newNote, isImportant);
      setNewNote("");
      setIsImportant(false);
    } catch (error) {
      console.error("Failed to add note:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {customer.name}
              <Badge variant={customer.status === 'active' ? "default" : "secondary"}>
                {customer.status}
              </Badge>
            </CardTitle>
            <div className="flex gap-2">
              {onCreateQuote && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onCreateQuote(customer.id)}
                  className="text-sm"
                >
                  <FileText className="h-4 w-4 mr-1" /> New Quote
                </Button>
              )}
              {onCreateJob && (
                <Button 
                  size="sm" 
                  onClick={() => onCreateJob(customer.id)}
                  className="text-sm"
                >
                  <Clipboard className="h-4 w-4 mr-1" /> New Job
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full border-b rounded-none bg-white overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="jobs">Jobs & Quotes</TabsTrigger>
              <TabsTrigger value="photos">
                <Image className="h-4 w-4 mr-1 inline" /> Photos
              </TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="financials">
                <DollarSign className="h-4 w-4 mr-1 inline" /> Financials
              </TabsTrigger>
              <TabsTrigger value="forms">
                <FileCheck className="h-4 w-4 mr-1 inline" /> Forms
              </TabsTrigger>
              <TabsTrigger value="reviews">
                <Star className="h-4 w-4 mr-1 inline" /> Reviews
              </TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">{customer.email || "No email provided"}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Phone className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{customer.phone || "No phone provided"}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-sm text-gray-600">
                        {customer.address}, {customer.city}, {customer.state} {customer.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Calendar className="h-4 w-4 text-gray-500 mt-1" />
                    <div>
                      <p className="font-medium">Customer since</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(customer.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 border-t pt-4">
                <h3 className="font-medium mb-2">Recent Activity</h3>
                {jobHistory.length > 0 ? (
                  <div className="space-y-2">
                    {jobHistory.slice(0, 3).map(job => (
                      <div key={job.job_id} className="flex items-center justify-between bg-slate-50 p-2 rounded">
                        <div>
                          <p className="font-medium">{job.title}</p>
                          <p className="text-xs text-gray-500">{job.job_number} • {formatDate(job.date)}</p>
                        </div>
                        <Badge variant="outline">{job.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No recent activity</p>
                )}
              </div>
            </TabsContent>
            
            {/* Jobs Tab */}
            <TabsContent value="jobs" className="p-4">
              <h3 className="font-medium mb-3">Jobs & Quotes History</h3>
              {jobHistory.length > 0 ? (
                <div className="space-y-3">
                  {jobHistory.map(job => (
                    <Card key={job.job_id} className="bg-slate-50">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{job.title}</p>
                            <p className="text-xs text-gray-500">
                              {job.job_number} • {formatDate(job.date)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {job.amount && (
                              <span className="text-sm font-medium">
                                ${job.amount.toFixed(2)}
                              </span>
                            )}
                            <Badge variant="outline">{job.status}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">No jobs or quotes yet</p>
                  <div className="flex justify-center gap-2 mt-4">
                    {onCreateQuote && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => onCreateQuote(customer.id)}
                      >
                        <FileText className="h-4 w-4 mr-1" /> Create Quote
                      </Button>
                    )}
                    {onCreateJob && (
                      <Button 
                        size="sm" 
                        onClick={() => onCreateJob(customer.id)}
                      >
                        <Clipboard className="h-4 w-4 mr-1" /> Create Job
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            
            {/* Photos Tab */}
            <TabsContent value="photos" className="p-4">
              <CustomerPhotos customerId={customer.id} />
            </TabsContent>
            
            {/* Notes Tab */}
            <TabsContent value="notes" className="p-4">
              <div className="space-y-4">
                <div className="border rounded p-3">
                  <h3 className="font-medium mb-2">Add a Note</h3>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full border rounded p-2 text-sm mb-2"
                    rows={3}
                    placeholder="Enter a note about this customer..."
                  />
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-1 text-sm cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={isImportant} 
                        onChange={() => setIsImportant(!isImportant)} 
                      />
                      Mark as important
                    </label>
                    <Button 
                      size="sm"
                      onClick={handleAddNote}
                      disabled={!newNote.trim() || isSaving}
                    >
                      {isSaving ? "Saving..." : "Save Note"}
                    </Button>
                  </div>
                </div>
                
                <h3 className="font-medium">Customer Notes</h3>
                {notes.length > 0 ? (
                  <div className="space-y-3">
                    {notes.map(note => (
                      <div 
                        key={note.id} 
                        className={`border rounded p-3 ${note.important ? 'border-amber-200 bg-amber-50' : ''}`}
                      >
                        {note.important && (
                          <div className="flex items-center gap-1 text-amber-600 mb-1">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-xs font-medium">Important</span>
                          </div>
                        )}
                        <p className="text-sm">{note.content}</p>
                        <div className="mt-2 flex justify-between items-center text-xs text-gray-500">
                          <span>By: {note.created_by}</span>
                          <span>{formatDate(note.created_at)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No notes for this customer</p>
                )}
              </div>
            </TabsContent>

            {/* Financials Tab */}
            <TabsContent value="financials" className="p-4">
              <CustomerFinancials customerId={customer.id} />
            </TabsContent>

            {/* Forms Tab */}
            <TabsContent value="forms" className="p-4">
              <CustomerForms customerId={customer.id} />
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="p-4">
              <CustomerReviews customerId={customer.id} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
