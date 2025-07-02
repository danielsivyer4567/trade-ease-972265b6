import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Download, Trash2, FileText, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface SavedEstimate {
  id: string;
  name: string;
  client: string;
  total: number;
  createdAt: string;
  status: 'draft' | 'sent' | 'approved' | 'completed';
  data: any;
}

interface EstimateHistoryProps {
  onLoad: (estimate: any) => void;
  onClose: () => void;
}

export const EstimateHistory: React.FC<EstimateHistoryProps> = ({ onLoad, onClose }) => {
  const [estimates, setEstimates] = React.useState<SavedEstimate[]>([]);

  React.useEffect(() => {
    // Load estimates from localStorage
    const loadEstimates = () => {
      const saved = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('estimate_')) {
          try {
            const data = JSON.parse(localStorage.getItem(key) || '');
            saved.push({
              id: key,
              name: data.projectDetails?.name || 'Unnamed Project',
              client: data.projectDetails?.client || 'Unknown Client',
              total: data.breakdown?.total || 0,
              createdAt: data.createdAt || new Date().toISOString(),
              status: data.status || 'draft',
              data
            });
          } catch (e) {
            console.error('Error loading estimate:', e);
          }
        }
      }
      setEstimates(saved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    };

    loadEstimates();
  }, []);

  const deleteEstimate = (id: string) => {
    if (confirm('Are you sure you want to delete this estimate?')) {
      localStorage.removeItem(id);
      setEstimates(estimates.filter(e => e.id !== id));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'sent': return 'default';
      case 'approved': return 'default';
      case 'completed': return 'outline';
      default: return 'secondary';
    }
  };

  const exportEstimate = (estimate: SavedEstimate) => {
    const dataStr = JSON.stringify(estimate.data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `estimate_${estimate.name.replace(/\s+/g, '_')}_${format(new Date(estimate.createdAt), 'yyyy-MM-dd')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Card style={{ 
      background: '#e2e8f0', 
      borderRadius: '20px', 
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', 
      border: '2px solid #94a3b8',
      maxWidth: '1200px',
      width: '100%',
      margin: '0 auto'
    }}>
      <CardHeader style={{ borderBottom: '2px solid #dee2e6' }}>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2" style={{ color: '#333' }}>
            <Clock className="h-5 w-5" style={{ color: '#6c757d' }} />
            Estimate History
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onClose}
            style={{
              background: '#dee2e6',
              color: '#6c757d',
              border: '2px solid #dee2e6',
              borderRadius: '20px',
              padding: '8px 16px'
            }}
          >
            Close
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent style={{ padding: '25px' }}>
        {estimates.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4" style={{ color: '#dee2e6' }} />
            <p style={{ color: '#6c757d', fontSize: '1.1rem' }}>No saved estimates found</p>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '8px' }}>Your estimates will appear here when you save them</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div style={{ 
              background: '#f8f9fa', 
              borderRadius: '10px', 
              padding: '15px', 
              border: '2px dashed #dee2e6' 
            }}>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" style={{ color: '#3b82f6' }} />
                <span style={{ color: '#555', fontSize: '0.95rem' }}>
                  You have {estimates.length} saved estimates totaling ${estimates.reduce((sum, e) => sum + e.total, 0).toLocaleString()}
                </span>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow style={{ borderBottom: '2px solid #dee2e6' }}>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Project Name</TableHead>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Client</TableHead>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Total</TableHead>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Status</TableHead>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Created</TableHead>
                  <TableHead style={{ color: '#555', fontWeight: '600' }}>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {estimates.map(estimate => (
                  <TableRow key={estimate.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <TableCell style={{ color: '#333', fontWeight: '500' }}>{estimate.name}</TableCell>
                    <TableCell style={{ color: '#6c757d' }}>{estimate.client}</TableCell>
                    <TableCell style={{ color: '#333', fontWeight: '600' }}>
                      ${estimate.total.toLocaleString('en-US', { 
                        minimumFractionDigits: 2, 
                        maximumFractionDigits: 2 
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusColor(estimate.status)}
                        style={{
                          background: estimate.status === 'draft' ? '#dee2e6' : '#3b82f6',
                          color: estimate.status === 'draft' ? '#6c757d' : 'white',
                          border: 'none',
                          padding: '4px 12px',
                          borderRadius: '15px',
                          fontSize: '0.85rem'
                        }}
                      >
                        {estimate.status}
                      </Badge>
                    </TableCell>
                    <TableCell style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      {format(new Date(estimate.createdAt), 'MMM d, yyyy h:mm a')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => onLoad(estimate.data)}
                          style={{
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.85rem'
                          }}
                        >
                          Load
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => exportEstimate(estimate)}
                          style={{
                            background: 'white',
                            color: '#6c757d',
                            border: '2px solid #dee2e6',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteEstimate(estimate.id)}
                          style={{
                            background: 'transparent',
                            color: '#dc3545',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.85rem'
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 