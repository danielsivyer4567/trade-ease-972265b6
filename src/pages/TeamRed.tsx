import React from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function TeamRed() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [documentCount, setDocumentCount] = React.useState({
    insurance: 0,
    general: 0,
    jobRelated: 0
  });
  const [jobNumber, setJobNumber] = React.useState('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => {
    if (event.target.files && event.target.files.length > 0) {
      setDocumentCount(prev => ({
        ...prev,
        [type]: prev[type] + event.target.files!.length
      }));
    }
  };

  return <AppLayout>
      <div className="space-y-8">
        <h1 className="text-2xl font-bold text-red-600">Team Red Dashboard</h1>
        
        {/* Calendar Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Team Calendar</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <Calendar mode="single" selected={date} onSelect={setDate} className="w-full border text-lg font-semibold rounded-3xl py-[2px] px-[225px] my-0 mx-[181px]" />
          </div>
        </section>

        {/* Jobs Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Jobs Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Today's Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Today's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for today</div>
              </div>
            </Card>

            {/* Tomorrow's Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Tomorrow's Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
              </div>
            </Card>

            {/* Upcoming Jobs */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Upcoming Jobs</h3>
              <div className="space-y-2">
                <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
              </div>
            </Card>
          </div>
        </section>

        {/* Document Management Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Document Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Section */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Document Upload</h3>
              <Tabs defaultValue="general" className="space-y-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="general">General</TabsTrigger>
                  <TabsTrigger value="insurance">Insurance</TabsTrigger>
                  <TabsTrigger value="job">Job Related</TabsTrigger>
                </TabsList>
                
                <TabsContent value="general" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'general')}
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
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
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={(e) => handleFileUpload(e, 'insurance')}
                        accept=".pdf,.doc,.docx"
                      />
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
                      <Input
                        type="text"
                        placeholder="Enter Job Number"
                        value={jobNumber}
                        onChange={(e) => setJobNumber(e.target.value)}
                        className="mb-4"
                      />
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          multiple
                          onChange={(e) => handleFileUpload(e, 'jobRelated')}
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        />
                        <Button variant="outline" className="w-full" disabled={!jobNumber}>
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Job Files
                        </Button>
                      </label>
                      {!jobNumber && (
                        <p className="text-sm text-red-500">Please enter a job number first</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Document Count Section */}
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Document Summary</h3>
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

        {/* Meter Rates Section */}
        <section>
          <h2 className="text-xl font-semibold text-red-600 mb-4">Meter Rates</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Standard Work</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Regular Hours</h4>
                  <p className="text-2xl font-bold text-red-600">$85/hr</p>
                  <p className="text-sm text-gray-500">Monday - Friday, 8am - 5pm</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">After Hours</h4>
                  <p className="text-2xl font-bold text-red-600">$127.50/hr</p>
                  <p className="text-sm text-gray-500">Weekdays after 5pm</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Emergency Work</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Regular Hours</h4>
                  <p className="text-2xl font-bold text-red-600">$127.50/hr</p>
                  <p className="text-sm text-gray-500">Emergency Response</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">After Hours</h4>
                  <p className="text-2xl font-bold text-red-600">$170/hr</p>
                  <p className="text-sm text-gray-500">Emergency After Hours</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <h3 className="text-lg font-semibold mb-3 text-red-600">Special Services</h3>
              <div className="space-y-3">
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Consultation</h4>
                  <p className="text-2xl font-bold text-red-600">$95/hr</p>
                  <p className="text-sm text-gray-500">On-site Assessment</p>
                </div>
                <div className="border rounded-lg p-3">
                  <h4 className="font-medium text-gray-700 mb-2">Project Planning</h4>
                  <p className="text-2xl font-bold text-red-600">$105/hr</p>
                  <p className="text-sm text-gray-500">Detailed Planning Services</p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Time Off Section */}
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
      </div>
    </AppLayout>;
}
