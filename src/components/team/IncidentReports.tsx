
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface IncidentReport {
  type: string;
  description: string;
  location: string;
  date: Date;
  severity: string;
}

interface IncidentReportsProps {
  teamColor: string;
  incidentReport: IncidentReport;
  setIncidentReport: (report: IncidentReport) => void;
  handleIncidentSubmit: (e: React.FormEvent) => void;
}

export function IncidentReports({ 
  teamColor, 
  incidentReport, 
  setIncidentReport, 
  handleIncidentSubmit 
}: IncidentReportsProps) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4 text-zinc-950 flex items-center gap-2">
        <AlertTriangle className={`text-${teamColor}-600 w-6 h-6`} />
        Incident/Injury Reports
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-zinc-950">Submit New Report</h3>
          <form onSubmit={handleIncidentSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type of Incident
              </label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 h-10" 
                value={incidentReport.type} 
                onChange={e => setIncidentReport({ ...incidentReport, type: e.target.value })} 
                required
              >
                <option value="">Select type</option>
                <option value="injury">Injury</option>
                <option value="near-miss">Near Miss</option>
                <option value="property-damage">Property Damage</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <Input 
                type="text" 
                value={incidentReport.location} 
                onChange={e => setIncidentReport({ ...incidentReport, location: e.target.value })} 
                placeholder="Where did it happen?" 
                required 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity
              </label>
              <select 
                className="w-full rounded-md border border-input bg-background px-3 h-10" 
                value={incidentReport.severity} 
                onChange={e => setIncidentReport({ ...incidentReport, severity: e.target.value })} 
                required
              >
                <option value="">Select severity</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea 
                value={incidentReport.description} 
                onChange={e => setIncidentReport({ ...incidentReport, description: e.target.value })} 
                placeholder="Describe what happened..." 
                className="min-h-[100px]" 
                required 
              />
            </div>

            <Button type="submit" className={`w-full bg-${teamColor}-600 hover:bg-${teamColor}-700`}>
              Submit Report
            </Button>
          </form>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4 text-zinc-950">Recent Reports</h3>
          <div className="space-y-4">
            <div className="text-sm text-gray-500">No recent reports</div>
          </div>
        </Card>
      </div>
    </section>
  );
}
