import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import JobMap from '@/components/JobMap';
import { MapPin, Cloud, Info } from 'lucide-react';
import type { Job } from '@/types/job';

// Sample job data for demonstration
const sampleJobs: Job[] = [
  {
    id: '1',
    job_number: 'JOB-2024-001',
    customer: 'John Smith',
    title: 'Kitchen Renovation',
    type: 'Renovation',
    address: '123 Main St, Brisbane QLD 4000',
    location: [153.0251, -27.4705], // Brisbane coordinates
    status: 'in-progress',
    date: '2024-01-15',
    date_undecided: false,
    description: 'Complete kitchen renovation including new cabinets and appliances'
  },
  {
    id: '2',
    job_number: 'JOB-2024-002',
    customer: 'Sarah Johnson',
    title: 'Bathroom Remodel',
    type: 'Renovation',
    address: '456 Queen St, Brisbane QLD 4000',
    location: [153.0281, -27.4675], // Brisbane coordinates (slightly offset)
    status: 'ready',
    date: '2024-01-16',
    date_undecided: false,
    description: 'Modern bathroom renovation with new fixtures'
  },
  {
    id: '3',
    job_number: 'JOB-2024-003',
    customer: 'Mike Wilson',
    title: 'Deck Construction',
    type: 'Construction',
    address: '789 Edward St, Brisbane QLD 4000',
    location: [153.0301, -27.4695], // Brisbane coordinates (offset)
    status: 'ready',
    date: '2024-01-17',
    date_undecided: false,
    description: 'Outdoor deck construction with weather-resistant materials'
  }
];

export default function WeatherMapDemo() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
          <Cloud className="w-8 h-8 text-blue-500" />
          Weather Overlay Demo
        </h1>
        <p className="text-gray-600">
          Interactive job map with weather overlay functionality
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Job Locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-2">
              {sampleJobs.length} jobs displayed on the map
            </p>
            <div className="space-y-2">
              {sampleJobs.map((job) => (
                <div key={job.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-2 h-2 rounded-full ${
                    job.status === 'in-progress' ? 'bg-blue-500' :
                    job.status === 'ready' ? 'bg-green-500' : 'bg-yellow-500'
                  }`} />
                  {job.job_number}: {job.customer}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Weather Layers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
                Clouds
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-600" />
                Rain
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-red-400" />
                Temperature
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-400" />
                Wind
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-purple-400" />
                Pressure
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              How to Use
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p>1. Click "Show Weather" button</p>
              <p>2. Select weather layers to view</p>
              <p>3. Click job markers for details</p>
              <p>4. Use map controls to navigate</p>
              <p>5. Weather data updates automatically</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interactive Job Map with Weather</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="h-[600px] w-full">
            <JobMap 
              jobs={sampleJobs}
              showWeatherControls={true}
              autoFit={true}
              zoom={12}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-gray-600">
            <p>
              <strong>Weather API:</strong> OpenWeatherMap (Free Tier: 1,000 calls/day)
            </p>
            <p>
              <strong>Map API:</strong> Google Maps JavaScript API
            </p>
            <p>
              <strong>Weather Layers:</strong> Clouds, Rain, Temperature, Wind, Pressure
            </p>
            <p>
              <strong>API Key Status:</strong> {import.meta.env.VITE_OPENWEATHERMAP_API_KEY ? 
                <span className="text-green-600">✓ Configured</span> : 
                <span className="text-red-600">✗ Not configured</span>
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 