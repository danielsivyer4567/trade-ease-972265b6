import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, MapPin, Building2, Ruler } from 'lucide-react';
import { format } from 'date-fns';
import { ProjectDetails } from '../types';

interface ProjectDetailsFormProps {
  details: ProjectDetails;
  onChange: (details: ProjectDetails) => void;
}

const projectTypes = [
  'Residential - Single Family',
  'Residential - Multi Family',
  'Commercial - Office',
  'Commercial - Retail',
  'Commercial - Warehouse',
  'Industrial',
  'Infrastructure',
  'Renovation',
  'Mixed Use'
];

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({ details, onChange }) => {
  const handleChange = (field: keyof ProjectDetails, value: any) => {
    onChange({ ...details, [field]: value });
  };

  return (
    <Card style={{ 
      background: '#f8f9fa', 
      borderRadius: '15px', 
      border: '2px solid #dee2e6' 
    }}>
      <CardHeader style={{ borderBottom: '2px solid #dee2e6' }}>
        <CardTitle className="flex items-center gap-2" style={{ color: '#333' }}>
          <Building2 className="h-5 w-5" style={{ color: '#6c757d' }} />
          Project Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Project Name</Label>
            <Input
              value={details.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter project name"
              style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            />
          </div>
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Client Name</Label>
            <Input
              value={details.client}
              onChange={(e) => handleChange('client', e.target.value)}
              placeholder="Enter client name"
              style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div>
          <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>
            <MapPin className="h-4 w-4 inline mr-1" />
            Project Location
          </Label>
          <Input
            value={details.location}
            onChange={(e) => handleChange('location', e.target.value)}
            placeholder="Enter project address"
            style={{
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Project Type</Label>
            <Select value={details.type} onValueChange={(value) => handleChange('type', value)}>
              <SelectTrigger style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem'
              }}>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>
              <Ruler className="h-4 w-4 inline mr-1" />
              Project Size
            </Label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={details.size}
                onChange={(e) => handleChange('size', parseFloat(e.target.value) || 0)}
                placeholder="Size"
                style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}
              />
              <Select value={details.sizeUnit} onValueChange={(value) => handleChange('sizeUnit', value)}>
                <SelectTrigger className="w-24" style={{
                  border: '2px solid #e9ecef',
                  borderRadius: '10px',
                  fontSize: '1rem'
                }}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sqft">sq ft</SelectItem>
                  <SelectItem value="sqm">sq m</SelectItem>
                  <SelectItem value="lf">lin ft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Complexity</Label>
            <Select value={details.complexity} onValueChange={(value: 'low' | 'medium' | 'high') => handleChange('complexity', value)}>
              <SelectTrigger style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem'
              }}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>
              <CalendarIcon className="h-4 w-4 inline mr-1" />
              Start Date
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                  style={{
                    border: '2px solid #e9ecef',
                    borderRadius: '10px',
                    fontSize: '1rem'
                  }}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {details.startDate ? format(details.startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={details.startDate}
                  onSelect={(date) => handleChange('startDate', date || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Duration (days)</Label>
            <Input
              type="number"
              value={details.duration}
              onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
              placeholder="Project duration"
              style={{
                border: '2px solid #e9ecef',
                borderRadius: '10px',
                fontSize: '1rem'
              }}
            />
          </div>
        </div>

        <div>
          <Label style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Site Conditions</Label>
          <Textarea
            value={details.siteConditions}
            onChange={(e) => handleChange('siteConditions', e.target.value)}
            placeholder="Describe site conditions, access restrictions, etc."
            rows={3}
            style={{
              border: '2px solid #e9ecef',
              borderRadius: '10px',
              fontSize: '1rem'
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4" style={{ borderTop: '2px solid #dee2e6' }}>
          <div className="flex items-center justify-between">
            <Label htmlFor="weather-risk" style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Weather Risk</Label>
            <input
              type="checkbox"
              id="weather-risk"
              checked={details.weatherRisk}
              onChange={(e) => handleChange('weatherRisk', e.target.checked)}
              className="rounded"
              style={{ width: '20px', height: '20px' }}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="union-req" style={{ color: '#555', fontWeight: '600', fontSize: '0.95rem' }}>Union Requirements</Label>
            <input
              type="checkbox"
              id="union-req"
              checked={details.unionRequirements}
              onChange={(e) => handleChange('unionRequirements', e.target.checked)}
              className="rounded"
              style={{ width: '20px', height: '20px' }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 