import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Visit {
  title?: string;
  customers?: {
    name?: string;
  };
  maintenance_plans?: {
    name?: string;
  };
  status?: string;
  scheduled_date?: string;
  id?: string;
}

const filterVisits = (visits: Visit[], searchTerm: string) => {
  return visits.filter((visit) =>
    visit.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.customers?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    visit.maintenance_plans?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );
};

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'warning';
    case 'completed':
      return 'success';
    case 'cancelled':
      return 'error';
    default:
      return 'default';
  }
};

const MaintenanceWorkflowSection: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock fetch visits - would be replaced with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchVisits = async () => {
      try {
        // Mock data
        const mockVisits: Visit[] = [
          {
            id: '1',
            title: 'Annual HVAC Service',
            customers: { name: 'Johnson Residence' },
            maintenance_plans: { name: 'Residential HVAC Plan' },
            status: 'Pending',
            scheduled_date: '2023-11-15'
          },
          {
            id: '2',
            title: 'Quarterly Filter Replacement',
            customers: { name: 'Smith Office Building' },
            maintenance_plans: { name: 'Commercial Maintenance' },
            status: 'Completed',
            scheduled_date: '2023-10-22'
          },
          {
            id: '3',
            title: 'Emergency Repair',
            customers: { name: 'Downtown Restaurant' },
            maintenance_plans: { name: 'Premium Support' },
            status: 'Cancelled',
            scheduled_date: '2023-11-01'
          }
        ];
        setVisits(mockVisits);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching visits:', error);
        setLoading(false);
      }
    };

    fetchVisits();
  }, []);

  const filteredVisits = filterVisits(visits, searchTerm);

  const handleScheduleClick = () => {
    toast.info('Schedule visit feature coming soon');
  };

  const handleViewDetails = (id: string) => {
    toast.info(`View details for visit ID: ${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Maintenance Visits</CardTitle>
            <CardDescription>View your scheduled and completed maintenance visits</CardDescription>
          </div>
          <Button onClick={handleScheduleClick} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Schedule Visit
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search visits..."
              className="pl-8"
              value={searchTerm}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Loading maintenance visits...</p>
          </div>
        ) : filteredVisits.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Visit Title</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Maintenance Plan</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVisits.map((visit) => (
                <TableRow key={visit.id}>
                  <TableCell className="font-medium">{visit.title}</TableCell>
                  <TableCell>{visit.customers?.name}</TableCell>
                  <TableCell>{visit.maintenance_plans?.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      {visit.scheduled_date}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(visit.status || '')}>{visit.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" onClick={() => handleViewDetails(visit.id || '')}>View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No maintenance visits found</p>
            <Button variant="outline" onClick={handleScheduleClick}>
              Schedule Your First Visit
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default MaintenanceWorkflowSection;