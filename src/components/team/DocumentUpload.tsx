
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface TeamMember {
  id: string;
  name: string;
}

interface DocumentUploadProps {
  teamMembers: TeamMember[];
  selectedTeamMember: string;
  setSelectedTeamMember: (value: string) => void;
  jobNumber: string;
  setJobNumber: (value: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>, type: 'insurance' | 'general' | 'jobRelated') => void;
}

export function DocumentUpload({
  teamMembers,
  selectedTeamMember,
  setSelectedTeamMember,
  jobNumber,
  setJobNumber,
  handleFileUpload
}: DocumentUploadProps) {
  return (
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
            <select 
              className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
              value={selectedTeamMember} 
              onChange={e => setSelectedTeamMember(e.target.value)}
            >
              <option value="">Select team member to notify</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={e => handleFileUpload(e, 'general')} 
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
            <select 
              className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
              value={selectedTeamMember} 
              onChange={e => setSelectedTeamMember(e.target.value)}
            >
              <option value="">Select team member to notify</option>
              {teamMembers.map(member => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <label className="cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={e => handleFileUpload(e, 'insurance')} 
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
                onChange={e => setJobNumber(e.target.value)} 
                className="mb-4" 
              />
              <select 
                className="w-full rounded-md border border-input bg-background px-3 h-10 mb-4" 
                value={selectedTeamMember} 
                onChange={e => setSelectedTeamMember(e.target.value)}
              >
                <option value="">Select team member to notify</option>
                {teamMembers.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <label className="cursor-pointer">
                <input 
                  type="file" 
                  className="hidden" 
                  multiple 
                  onChange={e => handleFileUpload(e, 'jobRelated')} 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                />
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
  );
}
