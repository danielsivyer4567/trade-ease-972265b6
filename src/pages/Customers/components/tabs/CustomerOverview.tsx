
import React from 'react';
import { Mail, Phone, MapPin, Calendar } from "lucide-react";

interface CustomerOverviewProps {
  customer: {
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    created_at: string;
  };
  jobHistory: Array<{
    job_id: string;
    title: string;
    job_number: string;
    date: string;
    status: string;
  }>;
  formatDate: (dateString: string) => string;
}

export function CustomerOverview({ 
  customer, 
  jobHistory, 
  formatDate 
}: CustomerOverviewProps) {
  return (
    <div className="p-4 space-y-4">
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
                <div className="text-sm px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                  {job.status}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
}
