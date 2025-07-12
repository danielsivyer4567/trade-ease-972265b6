import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppLayout } from '@/components/ui/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, FileText, Brain, Zap, CheckCircle, Plus, X, Download, Eye, ArrowLeft } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const AISWMSCreator = () => {
  const navigate = useNavigate();
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
  const [dataAutoPopulated, setDataAutoPopulated] = useState(false);
  const [businessDetails, setBusinessDetails] = useState({
    businessName: 'Trade Ease Construction',
    abn: '12 345 678 901',
    contactPerson: 'John Smith',
    email: 'john@tradease.com.au',
    phone: '(02) 1234 5678',
    licenseNumber: 'LIC123456789',
    logo: null,
    workCoverPolicy: null,
    publicLiabilityPolicy: null,
    useLogoEverytime: true,
    useCredentialsEverytime: true
  });

  // Read URL parameters and populate form fields
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    
    const projectName = urlParams.get('projectName');
    const jobNumber = urlParams.get('jobNumber');
    const location = urlParams.get('location');
    const clientName = urlParams.get('clientName');
    const tradeType = urlParams.get('tradeType');
    const supervisor = urlParams.get('supervisor');
    const projectDate = urlParams.get('projectDate');
    
    // If we have URL parameters, populate the form
    if (projectName || location || tradeType || supervisor) {
      setProjectInfo({
        projectName: projectName || '',
        location: location || '',
        projectType: jobNumber || '',
        supervisor: supervisor || '',
        date: projectDate || new Date().toISOString().split('T')[0],
        crew: ''
      });
      
      if (tradeType) {
        setSelectedTrade(tradeType);
      }
      
      setDataAutoPopulated(true);
      toast.success('Project details loaded from job selection');
    }

    // Read business details from localStorage
    try {
      const storedBusinessDetails = localStorage.getItem('swms_business_details');
      if (storedBusinessDetails) {
        const parsedDetails = JSON.parse(storedBusinessDetails);
        setBusinessDetails(parsedDetails);
        console.log('Loaded business details from localStorage:', parsedDetails);
      }
    } catch (error) {
      console.error('Error reading business details from localStorage:', error);
    }
  }, []);

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
      toast.success(`Added hazard: ${hazard}`);
    }
  };

  const removeHazard = (hazard) => {
    setHazards(hazards.filter(h => h !== hazard));
    toast.info(`Removed hazard: ${hazard}`);
  };

  const generateSWMS = async () => {
    // Validation
    if (!projectInfo.projectName.trim()) {
      toast.error('Project name is required');
      return;
    }
    if (!selectedTrade) {
      toast.error('Trade type is required');
      return;
    }
    if (hazards.length === 0) {
      toast.error('At least one hazard must be identified');
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const swmsContent = generateProfessionalSWMS();
      setGeneratedSWMS(swmsContent);
      toast.success('SWMS generated successfully!');
    } catch (error) {
      console.error('Error generating SWMS:', error);
      toast.error('Failed to generate SWMS. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateProfessionalSWMS = () => {
    const currentDate = new Date().toLocaleDateString('en-AU');
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Safe Work Method Statement - ${projectInfo.projectName}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; line-height: 1.4; }
    .header { display: flex; justify-content: space-between; align-items: center; border: 2px solid #000; padding: 15px; margin-bottom: 20px; }
    .logo { width: 120px; height: 80px; background: #003366; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid #000; }
    .title { flex: 1; text-align: center; margin: 0 20px; }
    .title h1 { margin: 0; font-size: 24px; font-weight: bold; color: #003366; }
    .title p { margin: 5px 0; font-style: italic; color: #666; }
    .contact { text-align: right; font-size: 11px; color: #003366; }
    .date-box { background: #FFD700; border: 2px solid #000; padding: 10px; text-align: center; font-weight: bold; margin-bottom: 20px; }
    .section-header { background: #E6E6E6; padding: 10px; text-align: center; font-weight: bold; border: 1px solid #000; margin: 15px 0 5px 0; font-size: 14px; }
    .info-table { width: 100%; border-collapse: collapse; margin: 10px 0; }
    .info-table th, .info-table td { border: 1px solid #000; padding: 8px; text-align: left; }
    .info-table th { background: #E6E6E6; font-weight: bold; }
    .hazard-list { margin: 10px 0; }
    .hazard-item { background: #FFF9C4; border-left: 4px solid #FF6B35; padding: 8px; margin: 5px 0; }
    .controls-list { background: #E8F5E8; border-left: 4px solid #4CAF50; padding: 8px; margin: 5px 0; }
    .signature-section { border: 1px solid #000; padding: 15px; margin: 20px 0; }
    .signature-row { display: flex; justify-content: space-between; margin: 10px 0; }
    .signature-box { border-bottom: 1px solid #000; width: 200px; padding-bottom: 5px; }
  </style>
</head>
<body>

<div class="header">
  <div class="logo">
    ${businessDetails.logo ? `<img src="${businessDetails.logo.data}" style="max-width:100%;max-height:100%;" alt="Logo" />` : businessDetails.businessName}
  </div>
  <div class="title">
    <h1>SAFE WORK METHOD STATEMENT</h1>
    <p>High Risk Construction Work</p>
    <p>Work Health & Safety Act 2011</p>
  </div>
  <div class="contact">
    <strong>${businessDetails.businessName}</strong><br>
    ABN: ${businessDetails.abn}<br>
    Email: ${businessDetails.email}<br>
    Phone: ${businessDetails.phone}<br>
    License: ${businessDetails.licenseNumber}
  </div>
</div>

<div class="date-box">
  <strong>DATE CREATED: ${currentDate}</strong>
</div>

<div class="section-header">PROJECT INFORMATION</div>

<table class="info-table">
  <tr>
    <th style="width: 150px;">Project Name:</th>
    <td>${projectInfo.projectName}</td>
  </tr>
  <tr>
    <th>Location:</th>
    <td>${projectInfo.location}</td>
  </tr>
  <tr>
    <th>Trade Type:</th>
    <td>${selectedTrade}</td>
  </tr>
  <tr>
    <th>Supervisor:</th>
    <td>${projectInfo.supervisor}</td>
  </tr>
  <tr>
    <th>Date:</th>
    <td>${projectInfo.date}</td>
  </tr>
  <tr>
    <th>Crew Members:</th>
    <td>${projectInfo.crew || 'To be assigned'}</td>
  </tr>
</table>

<div class="section-header">IDENTIFIED HAZARDS & CONTROL MEASURES</div>

<div class="hazard-list">
  ${hazards.map(hazard => `
    <div class="hazard-item">
      <strong>⚠️ HAZARD:</strong> ${hazard}
    </div>
    <div class="controls-list">
      <strong>🛡️ CONTROL MEASURES:</strong>
      <ul>
        <li>Conduct pre-work safety assessment</li>
        <li>Ensure all workers are trained and competent</li>
        <li>Use appropriate Personal Protective Equipment (PPE)</li>
        <li>Implement safe work procedures</li>
        <li>Regular monitoring and supervision</li>
        <li>Emergency procedures in place</li>
      </ul>
    </div>
  `).join('')}
</div>

<div class="section-header">EMERGENCY PROCEDURES</div>
<table class="info-table">
  <tr>
    <th>Emergency Services:</th>
    <td><strong>000</strong></td>
  </tr>
  <tr>
    <th>Site Emergency Contact:</th>
    <td>${projectInfo.supervisor} - ${businessDetails.phone}</td>
  </tr>
  <tr>
    <th>Nearest Hospital:</th>
    <td>To be confirmed for site location</td>
  </tr>
</table>

<div class="section-header">WORKER CONSULTATION & SIGN-OFF</div>

<div class="signature-section">
  <p><strong>I have been consulted about this SWMS and understand the work to be performed and associated hazards and controls:</strong></p>
  
  <table class="info-table">
    <tr>
      <th>Worker Name</th>
      <th>Date</th>
      <th>Signature</th>
      <th>Comments</th>
    </tr>
    <tr>
      <td style="height: 30px;"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td style="height: 30px;"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
    <tr>
      <td style="height: 30px;"></td>
      <td></td>
      <td></td>
      <td></td>
    </tr>
  </table>
</div>

<div class="signature-section">
  <p><strong>Supervisor Approval:</strong></p>
  <div class="signature-row">
    <div>
      <strong>Name:</strong> ${projectInfo.supervisor}<br>
      <strong>Position:</strong> Site Supervisor<br>
      <strong>Date:</strong> ${currentDate}
    </div>
    <div>
      <strong>Signature:</strong><br>
      <div class="signature-box"></div>
    </div>
  </div>
</div>

<div style="margin-top: 30px; padding: 10px; background: #f0f0f0; border: 1px solid #ccc; font-size: 10px;">
  <p><strong>Document Control:</strong> This SWMS must be reviewed before each use and updated when work conditions change. 
  Generated by Trade Ease AI SWMS System on ${currentDate}.</p>
</div>

</body>
</html>
    `;
  };

  const downloadSWMS = () => {
    try {
      const blob = new Blob([generatedSWMS], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `SWMS_${projectInfo.projectName.replace(/[^a-zA-Z0-9]/g, '_')}_${projectInfo.date}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('SWMS document downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download SWMS document');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 text-white py-6">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/calculators/ai-swms-creator')}
                className="flex items-center gap-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Setup
              </Button>
            </div>
            <h1 className="text-3xl font-bold mb-2">AI SWMS Generator</h1>
            <p className="text-white/90">Create professional Safe Work Method Statements with AI assistance</p>
          </div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 max-w-6xl py-6">
          {dataAutoPopulated && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Project details have been automatically populated from your job selection. You can modify any fields as needed.
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="input" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="input">Project Details</TabsTrigger>
              <TabsTrigger value="hazards">Hazard Identification</TabsTrigger>
              <TabsTrigger value="generate">Generate SWMS</TabsTrigger>
            </TabsList>

            <TabsContent value="input">
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
                      <Label htmlFor="projectName">Project Name *</Label>
                      <Input
                        id="projectName"
                        value={projectInfo.projectName}
                        onChange={(e) => setProjectInfo({...projectInfo, projectName: e.target.value})}
                        placeholder="e.g., Residential Extension"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={projectInfo.location}
                        onChange={(e) => setProjectInfo({...projectInfo, location: e.target.value})}
                        placeholder="e.g., 123 Main Street, Brisbane"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Trade Type *</Label>
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

            <TabsContent value="hazards">
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
                    <Button onClick={() => addHazard(newHazard)} disabled={!newHazard.trim()}>
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
                          className="justify-start text-left h-auto py-2"
                        >
                          {hazards.includes(hazard) ? (
                            <CheckCircle className="h-3 w-3 mr-2 flex-shrink-0" />
                          ) : (
                            <Plus className="h-3 w-3 mr-2 flex-shrink-0" />
                          )}
                          <span className="truncate">{hazard}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label>Selected Hazards ({hazards.length})</Label>
                    <div className="flex flex-wrap gap-2 mt-2 min-h-[50px] p-3 border rounded-lg bg-gray-50">
                      {hazards.length === 0 ? (
                        <span className="text-gray-500 italic">No hazards selected yet</span>
                      ) : (
                        hazards.map(hazard => (
                          <Badge key={hazard} variant="secondary" className="flex items-center gap-1">
                            {hazard}
                            <X 
                              className="h-3 w-3 cursor-pointer hover:text-red-500" 
                              onClick={() => removeHazard(hazard)}
                            />
                          </Badge>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="generate">
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
                      size="lg"
                    >
                      {isGenerating ? (
                        <>
                          <Zap className="h-4 w-4 animate-spin" />
                          Generating SWMS...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4" />
                          Generate SWMS Document
                        </>
                      )}
                    </Button>
                    
                    {generatedSWMS && (
                      <Button variant="outline" onClick={downloadSWMS} size="lg">
                        <Download className="h-4 w-4 mr-2" />
                        Download HTML
                      </Button>
                    )}
                  </div>

                  {(!projectInfo.projectName || !selectedTrade || hazards.length === 0) && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Please complete all required fields:
                        <ul className="list-disc list-inside mt-2">
                          {!projectInfo.projectName && <li>Project name is required</li>}
                          {!selectedTrade && <li>Trade type must be selected</li>}
                          {hazards.length === 0 && <li>At least one hazard must be identified</li>}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {generatedSWMS && (
                    <div className="mt-6">
                      <Label>Generated SWMS Preview</Label>
                      <div className="mt-2 border rounded-lg bg-white max-h-[600px] overflow-y-auto">
                        <div 
                          className="p-4 text-sm"
                          dangerouslySetInnerHTML={{ __html: generatedSWMS }}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
};

export default AISWMSCreator;