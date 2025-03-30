
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Upload } from 'lucide-react';

export function SubcontractorView() {
  return (
    <div className="space-y-8 bg-[#E2E8F0] p-6 rounded-lg">
      {/* Jobs Overview Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-950">Jobs Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-zinc-950">Today's Jobs</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No jobs scheduled for today</div>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-zinc-950">Tomorrow's Jobs</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No jobs scheduled for tomorrow</div>
            </div>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-zinc-950">Upcoming Jobs</h3>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No upcoming jobs scheduled</div>
            </div>
          </Card>
        </div>
      </section>

      {/* Document Management Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-950">Document Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Upload */}
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-zinc-950">Document Upload</h3>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="general" className="bg-blue-100 data-[state=active]:bg-blue-200">General</TabsTrigger>
                <TabsTrigger value="insurance">Insurance</TabsTrigger>
                <TabsTrigger value="job">Job Related</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-4">
                <h4 className="font-medium text-gray-700">General Documents</h4>
                <div className="space-y-4">
                  <div className="w-full">
                    <select className="w-full rounded-md border border-blue-200 bg-blue-100 px-3 py-2">
                      <option value="">Select team member to notify</option>
                      <option value="member1">John Doe</option>
                      <option value="member2">Jane Smith</option>
                    </select>
                  </div>
                  <Button className="w-full flex items-center justify-center bg-blue-100 hover:bg-blue-200 text-blue-800">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Documents
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="insurance" className="space-y-4">
                <div className="text-sm text-gray-500">Insurance document upload form</div>
              </TabsContent>
              
              <TabsContent value="job" className="space-y-4">
                <div className="text-sm text-gray-500">Job related document upload form</div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Document Summary */}
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-zinc-950">Document Summary</h3>
            <div className="space-y-6">
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-700 mb-2">Insurance Documents</h4>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-500">0</span>
                  <span className="text-sm text-gray-500">documents uploaded</span>
                </div>
              </div>
              
              <div className="border-b pb-4">
                <h4 className="font-medium text-gray-700 mb-2">General Documents</h4>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-500">0</span>
                  <span className="text-sm text-gray-500">documents uploaded</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Job Related Documents</h4>
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-blue-500">0</span>
                  <span className="text-sm text-gray-500">documents uploaded</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Team Time Off Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-blue-600">Team Time Off</h2>
        <Card className="p-4 bg-white shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-3">
              <h3 className="font-medium text-gray-700 mb-2">Individual of team time off</h3>
              <div className="text-sm text-gray-500">No pending time off indications</div>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-medium text-gray-700 mb-2">Acknowledged team Time Off</h3>
              <div className="text-sm text-gray-500">No acknowledged time off</div>
            </div>
            <div className="border rounded-lg p-3">
              <h3 className="font-medium text-gray-700 mb-2">Upcoming Time Off</h3>
              <div className="text-sm text-gray-500">No upcoming time off scheduled</div>
            </div>
          </div>
        </Card>
      </section>

      {/* Incident/Injury Reports Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 text-zinc-950 flex items-center gap-2">
          <AlertTriangle className="text-red-500 w-6 h-6" />
          Incident/Injury Reports
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-zinc-950">Submit New Report</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type of Incident
                </label>
                <select className="w-full rounded-md border border-input bg-background px-3 h-10">
                  <option value="">Select type</option>
                  <option value="injury">Injury</option>
                  <option value="near-miss">Near Miss</option>
                  <option value="property-damage">Property Damage</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Input type="text" placeholder="Where did it happen?" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Severity
                </label>
                <select className="w-full rounded-md border border-input bg-background px-3 h-10">
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
                <Textarea placeholder="Describe what happened..." className="min-h-[100px]" />
              </div>

              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Submit Report
              </Button>
            </form>
          </Card>

          <Card className="p-4 bg-white shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-zinc-950">Recent Reports</h3>
            <div className="space-y-4">
              <div className="text-sm text-gray-500">No recent reports</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
