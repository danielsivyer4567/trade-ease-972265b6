import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TabLink, TabButton } from '@/components/ui/TabLink';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { 
  Calendar, 
  FileText, 
  MapPin, 
  Phone, 
  Mail, 
  Wrench, 
  User, 
  Banknote,
  Clock,
  CheckCircle,
  Edit 
} from 'lucide-react';

export function JobDetails() {
  const { id } = useParams<{ id: string }>();
  
  // Mock job data for demo purposes
  const job = {
    id: id || '123',
    title: 'Kitchen Renovation',
    status: 'In Progress',
    dueDate: '2023-12-15',
    customer: {
      id: '456',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA'
    },
    description: 'Complete kitchen renovation including new cabinets, countertops, and appliance installation.',
    materials: [
      { id: '1', name: 'Granite Countertop', quantity: 1, unit: 'piece', price: 1200 },
      { id: '2', name: 'Cabinet Set', quantity: 1, unit: 'set', price: 3500 },
      { id: '3', name: 'Sink', quantity: 1, unit: 'piece', price: 350 },
      { id: '4', name: 'Faucet', quantity: 1, unit: 'piece', price: 180 }
    ],
    tasks: [
      { id: '1', name: 'Remove old cabinets', status: 'completed' },
      { id: '2', name: 'Install new cabinets', status: 'in-progress' },
      { id: '3', name: 'Install countertop', status: 'pending' },
      { id: '4', name: 'Install sink and faucet', status: 'pending' }
    ],
    totalCost: 8230
  };

  return (
    <BaseLayout>
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-sm text-gray-500">Job #{job.id}</p>
          </div>
          <div className="flex gap-2">
            <TabButton 
              to={`/jobs/${job.id}/edit`} 
              title="Edit Job"
              className="flex items-center gap-1 bg-primary text-white hover:bg-primary/90 px-3 py-2 rounded-md"
            >
              <Edit className="h-4 w-4" />
              Edit
            </TabButton>
            <TabButton 
              to={`/invoices/new?jobId=${job.id}`} 
              title="Create Invoice"
              className="flex items-center gap-1 bg-orange-600 text-white hover:bg-orange-700 px-3 py-2 rounded-md"
            >
              <FileText className="h-4 w-4" />
              Create Invoice
            </TabButton>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  job.status === 'In Progress' 
                    ? 'bg-blue-100 text-blue-800' 
                    : job.status === 'Completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {job.status}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Due Date</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(job.dueDate).toLocaleDateString()}</span>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Total Cost</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-2">
              <Banknote className="h-4 w-4 text-gray-500" />
              <span>${job.totalCost.toLocaleString()}</span>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{job.description}</p>
              </CardContent>
            </Card>
            
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Item</th>
                        <th className="text-left p-2">Quantity</th>
                        <th className="text-left p-2">Unit Price</th>
                        <th className="text-left p-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {job.materials.map(material => (
                        <tr key={material.id} className="border-b">
                          <td className="p-2">{material.name}</td>
                          <td className="p-2">{material.quantity} {material.unit}</td>
                          <td className="p-2">${material.price}</td>
                          <td className="p-2">${material.price * material.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.tasks.map(task => (
                    <li key={task.id} className="flex items-center gap-2">
                      {task.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : task.status === 'in-progress' ? (
                        <Clock className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Wrench className="h-5 w-5 text-gray-400" />
                      )}
                      <span className={task.status === 'completed' ? 'line-through text-gray-500' : ''}>
                        {task.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="mb-4">
              <CardHeader>
                <CardTitle>Customer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <TabLink to={`/customers/${job.customer.id}`} title={job.customer.name} className="text-primary hover:underline">
                      {job.customer.name}
                    </TabLink>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${job.customer.phone}`} className="hover:underline">
                      {job.customer.phone}
                    </a>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <a href={`mailto:${job.customer.email}`} className="hover:underline">
                      {job.customer.email}
                    </a>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-1" />
                    <span>{job.customer.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Related</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <TabLink to={`/quotes/${job.id}`} title="View Quote" className="flex items-center gap-2 text-primary hover:underline">
                    <FileText className="h-4 w-4" />
                    View Quote
                  </TabLink>
                  
                  <TabLink to={`/invoices?jobId=${job.id}`} title="View Invoices" className="flex items-center gap-2 text-primary hover:underline">
                    <FileText className="h-4 w-4" />
                    View Invoices
                  </TabLink>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}

export default JobDetails; 