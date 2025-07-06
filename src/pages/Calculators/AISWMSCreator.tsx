import React, { useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';

const AISWMSCreator = () => {
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    location: '',
    projectType: '',
    supervisor: '',
    date: new Date().toISOString().split('T')[0],
    crew: ''
  });

  const [hazards, setHazards] = useState([]);
  const [newHazard, setNewHazard] = useState('');
  const [selectedTrade, setSelectedTrade] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSWMS, setGeneratedSWMS] = useState('');

  const tradeTypes = [
    'Carpentry',
    'Electrical',
    'Plumbing',
    'Excavation',
    'Concreting',
    'Roofing',
    'Painting',
    'Landscaping',
    'Demolition',
    'General Construction'
  ];

  const commonHazards = [
    'Working at height',
    'Manual handling',
    'Electrical hazards',
    'Machinery operation',
    'Chemical exposure',
    'Noise exposure',
    'Slips, trips, falls',
    'Confined spaces',
    'Excavation hazards',
    'Hot work (welding/cutting)',
    'Asbestos exposure',
    'Dust and silica',
    'Vehicle and plant movement',
    'Weather conditions'
  ];

  const addHazard = (hazard) => {
    if (hazard && !hazards.includes(hazard)) {
      setHazards([...hazards, hazard]);
      setNewHazard('');
    }
  };

  const removeHazard = (hazard) => {
    setHazards(hazards.filter(h => h !== hazard));
  };

  const generateSWMS = async () => {
    setIsGenerating(true);
    
    // Simulate AI generation - in real implementation, this would call an AI service
    setTimeout(() => {
      const swmsContent = `
# SAFE WORK METHOD STATEMENT
**Project:** ${projectInfo.projectName}
**Location:** ${projectInfo.location}
**Trade:** ${selectedTrade}
**Date:** ${projectInfo.date}
**Supervisor:** ${projectInfo.supervisor}

## SCOPE OF WORK
${selectedTrade} work at ${projectInfo.location} for ${projectInfo.projectName}.

## IDENTIFIED HAZARDS AND CONTROLS
${hazards.map(hazard => `
### ${hazard}
**Risk Level:** Medium
**Control Measures:**
- Implement appropriate safety procedures
- Use required PPE
- Conduct regular safety inspections
- Maintain communication with supervisor

`).join('')}

## PERSONAL PROTECTIVE EQUIPMENT (PPE)
- Hard hat
- Safety glasses
- High-visibility clothing
- Steel-capped boots
- Hearing protection (where required)
- Respiratory protection (where required)

## EMERGENCY PROCEDURES
- Emergency contact: Site Supervisor
- First Aid Officer on site
- Emergency evacuation procedures in place
- Incident reporting procedures documented

## SIGN-OFF
**Supervisor:** ${projectInfo.supervisor}
**Date:** ${projectInfo.date}
**Crew Members:** ${projectInfo.crew}

*This SWMS has been generated using AI assistance and should be reviewed by a qualified safety professional before use.*
      `;
      
      setGeneratedSWMS(swmsContent);
      setIsGenerating(false);
    }, 2000);
  };

  const downloadSWMS = () => {
    const blob = new Blob([generatedSWMS], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SWMS_${projectInfo.projectName}_${projectInfo.date}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppLayout>
      <div className="container mx-auto py-6 px-4 max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Shield className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI SWMS Creator</h1>
              <p className="text-gray-600">Generate Safe Work Method Statements using AI</p>
            </div>
          </div>
          
          <Alert className="mb-6">
            <Brain className="h-4 w-4" />
            <AlertDescription>
              This AI-powered tool generates SWMS documents based on your project details and identified hazards. 
              Always have generated documents reviewed by a qualified safety professional before use.
            </AlertDescription>
          </Alert>
        </div>

        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Project Details</TabsTrigger>
            <TabsTrigger value="hazards">Hazard Identification</TabsTrigger>
            <TabsTrigger value="generate">Generate SWMS</TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Project Information
                </CardTitle>
                <CardDescription>
                  Enter the basic details for your construction project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="projectName">Project Name</Label>
                    <Input
                      id="projectName"
                      value={projectInfo.projectName}
                      onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
                      placeholder="e.g., Residential Extension"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={projectInfo.location}
                      onChange={(e) => setProjectInfo({...projectInfo, location: e.target.value})}
                      placeholder="e.g., 123 Main Street, Brisbane"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Trade Type</Label>
                    <Select value={selectedTrade} onValueChange={setSelectedTrade}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trade type" />
                      </SelectTrigger>
                      <SelectContent>
                        {tradeTypes.map(trade => (
                          <SelectItem key={trade} value={trade}>{trade}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="supervisor">Supervisor</Label>
                    <Input
                      id="supervisor"
                      value={projectInfo.supervisor}
                      onChange={(e) => setProjectInfo({...projectInfo, supervisor: e.target.value})}
                      placeholder="e.g., John Smith"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={projectInfo.date}
                      onChange={(e) => setProjectInfo({...projectInfo, date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="crew">Crew Members</Label>
                    <Input
                      id="crew"
                      value={projectInfo.crew}
                      onChange={(e) => setProjectInfo({...projectInfo, crew: e.target.value})}
                      placeholder="e.g., John Smith, Jane Doe"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hazards" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Hazard Identification
                </CardTitle>
                <CardDescription>
                  Identify potential hazards for your project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newHazard}
                    onChange={(e) => setNewHazard(e.target.value)}
                    placeholder="Add custom hazard"
                    onKeyPress={(e) => e.key === 'Enter' && addHazard(newHazard)}
                  />
                  <Button onClick={() => addHazard(newHazard)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div>
                  <Label>Common Hazards</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                    {commonHazards.map(hazard => (
                      <Button
                        key={hazard}
                        variant={hazards.includes(hazard) ? "default" : "outline"}
                        size="sm"
                        onClick={() => hazards.includes(hazard) ? removeHazard(hazard) : addHazard(hazard)}
                        className="justify-start"
                      >
                        {hazards.includes(hazard) ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Plus className="h-3 w-3 mr-1" />
                        )}
                        {hazard}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Selected Hazards</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {hazards.map(hazard => (
                      <Badge key={hazard} variant="secondary" className="flex items-center gap-1">
                        {hazard}
                        <X 
                          className="h-3 w-3 cursor-pointer hover:text-red-500" 
                          onClick={() => removeHazard(hazard)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-blue-600" />
                  Generate SWMS
                </CardTitle>
                <CardDescription>
                  Generate your Safe Work Method Statement using AI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={generateSWMS}
                    disabled={!projectInfo.projectName || !selectedTrade || hazards.length === 0 || isGenerating}
                    className="flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Zap className="h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        Generate SWMS
                      </>
                    )}
                  </Button>
                  
                  {generatedSWMS && (
                    <Button variant="outline" onClick={downloadSWMS}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>

                {generatedSWMS && (
                  <div className="mt-6">
                    <Label>Generated SWMS Preview</Label>
                    <Textarea
                      value={generatedSWMS}
                      readOnly
                      className="mt-2 min-h-[400px] font-mono text-sm"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default AISWMSCreator; 