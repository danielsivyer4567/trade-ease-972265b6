import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, AlertTriangle } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function TeamRed() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [documentCount, setDocumentCount] = React.useState({
    insurance: 0,
    general: 0,
    jobRelated: 0
  });
  const [jobNumber, setJobNumber] = React.useState('');
  const [selectedTeamMember, setSelectedTeamMember] = React.useState('');
  const [incidentReport, setIncidentReport] = React.useState({
    type: '',
    description: '',
    location: '',
    date: new Date(),
    severity: ''
  });

  const teamMembers = [{
    id: '1',
    name: 'John Smith'
  }, {
    id: '2',
    name: 'Sarah Johnson'
  }, {
    id: '3',
    name: 'Mike Williams'
  }, {
    id: '4',
    name: 'Emily Brown'
  }];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (event.target.files && event.target.files.length > 0) {
      setDocumentCount(prev => ({
        ...prev,
        [type]: prev[type] + event.target.files!.length
      }));
      if (selectedTeamMember) {
        console.log(`Notifying team member ${selectedTeamMember} about new ${type} document upload`);
      }
    }
  };

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Incident Report Submitted:', incidentReport);
    setIncidentReport({
      type: '',
      description: '',
      location: '',
      date: new Date(),
      severity: ''
    });
  };

  return <AppLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-3 mb-4">
          <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
          <h2 className="text-xl font-semibold text-zinc-950">Red Team Calendar</h2>
        </div>
        
        <section>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Calendar 
              mode="single" 
              selected={date} 
              onSelect={setDate} 
              className="w-full"
              classNames={{
                months: "w-full",
                month: "w-full",
                table: "w-full border-collapse",
                head_row: "grid grid-cols-7",
                head_cell: "text-muted-foreground text-center text-sm font-medium p-2",
                row: "grid grid-cols-7",
                cell: "h-16 text-center text-sm p-0 relative hover:bg-gray-100 rounded-md",
                day: "h-16 w-full p-2 font-normal aria-selected:bg-red-600 aria-selected:text-white hover:bg-gray-100 rounded-md",
                day_range_end: "day-range-end",
                day_selected: "bg-red-600 text-white hover:bg-red-600 hover:text-white focus:bg-red-600 focus:text-white",
                day_today: "bg-gray-100 text-gray-900",
                day_outside: "text-gray-400",
                nav: "space-x-1 flex items-center justify-between p-2",
                nav_button_previous: "absolute left-1",
                nav_button_next: "absolute right-1",
                caption: "flex justify-center py-4 relative items-center text-lg font-semibold"
              }}
            />
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-950">Jobs Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-950">Today's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for today</div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-950">Tomorrow's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-950">Upcoming Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-950">Document Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-950">Document Upload</h3>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="job">Job Related</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
                    <select className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" value={selectedTeamMember} onChange={e => setSelectedTeamMember(e.target.value)}>
                      <option value="">Select team member to notify</option>
                      {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" multiple onChange={e => handleFileUpload(e, 'general')} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Documents
                      </Button>
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="insurance" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Insurance Documents</h4>
                    <select className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" value={selectedTeamMember} onChange={e => setSelectedTeamMember(e.target.value)}>
                      <option value="">Select team member to notify</option>
                      {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                    </select>
                    <label className="cursor-pointer">
                      <input type="file" className="hidden" multiple onChange={e => handleFileUpload(e, 'insurance')} accept=".pdf,.doc,.docx" />
                      <Button variant="outline" className="w-full">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Insurance Files
                      </Button>
                    </label>
                  </div>
                </TabsContent>

                <TabsContent value="job" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">Job Related Files</h4>
                    <div className="space-y-4">
                      <Input type="text" placeholder="Enter Job Number" value={jobNumber} onChange={e => setJobNumber(e.target.value)} className="mb-4" />
                      <select className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" value={selectedTeamMember} onChange={e => setSelectedTeamMember(e.target.value)}>
                        <option value="">Select team member to notify</option>
                        {teamMembers.map(member => <option key={member.id} value={member.id}>{member.name}</option>)}
                      </select>
                      <label className="cursor-pointer">
                        <input type="file" className="hidden" multiple onChange={e => handleFileUpload(e, 'jobRelated')} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" />
                        <Button variant="outline" className="w-full" disabled={!jobNumber}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Job Files
                        </Button>
                      </label>
                      {!jobNumber && <p className="text-sm text-red-500">Please enter a job number first</p>}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-zinc-950">Document Summary</h3>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Insurance Documents</h4>
                  <p className="text-2xl font-bold text-red-600">{documentCount.insurance}</p>
                  <p className="text-sm text-gray-500">documents uploaded</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
                  <p className="text-2xl font-bold text-red-600">{documentCount.general}</p>
                  <p className="text-sm text-gray-500">documents uploaded</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium text-gray-700 mb-2">Job Related Documents</h4>
                  <p className="text-2xl font-bold text-red-600">{documentCount.jobRelated}</p>
                  <p className="text-sm text-gray-500">documents uploaded</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Team Time Off</h2>
          <Card className="p-4">
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">individual of team time off</h3>
                  <div className="text-sm text-gray-500">No pending time off indications</div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">acknowledged team Time Off</h3>
                  <div className="text-sm text-gray-500">No acknowledged time off</div>
                </div>
                <div className="border rounded-lg p-3">
                  <h3 className="font-medium text-gray-700 mb-2">Upcoming Time Off</h3>
                  <div className="text-sm text-gray-500">No upcoming time off scheduled</div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-zinc-950 flex items-center gap-2">
            <AlertTriangle className="text-red-600 w-6 h-6" />
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
                  <select className="w-full rounded-md border border-input bg-background px-3 h-10" value={incidentReport.type} onChange={e => setIncidentReport(prev => ({
                  ...prev,
                  type: e.target.value
                }))} required>
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
                  <Input type="text" value={incidentReport.location} onChange={e => setIncidentReport(prev => ({
                  ...prev,
                  location: e.target.value
                }))} placeholder="Where did it happen?" required />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Severity
                  </label>
                  <select className="w-full rounded-md border border-input bg-background px-3 h-10" value={incidentReport.severity} onChange={e => setIncidentReport(prev => ({
                  ...prev,
                  severity: e.target.value
                }))} required>
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
                  <Textarea value={incidentReport.description} onChange={e => setIncidentReport(prev => ({
                  ...prev,
                  description: e.target.value
                }))} placeholder="Describe what happened..." className="min-h-[100px]" required />
                </div>

                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
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
      </div>
    </AppLayout>;
}
