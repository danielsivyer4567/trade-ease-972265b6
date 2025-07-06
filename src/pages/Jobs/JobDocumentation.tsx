import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  X, 
  Download, 
  FileText, 
  Shield, 
  Building, 
  CreditCard, 
  ShieldCheck, 
  Image, 
  Eye, 
  Plus,
  Settings,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  HardHat,
  Clipboard
} from 'lucide-react';

const JobDocumentation = ({ jobId, jobDetails }) => {
  const [businessCredentials, setBusinessCredentials] = useState({
    businessName: 'Trade Ease Construction',
    abn: '12 345 678 901',
    licenseNumber: 'LIC123456789',
    contactPerson: 'John Smith',
    email: 'john@tradease.com.au',
    phone: '(02) 1234 5678',
    logo: null,
    workCoverPolicy: null,
    publicLiabilityPolicy: null,
    useLogoEverytime: true,
    useCredentialsEverytime: true
  });

  const [swmsDocuments, setSWMSDocuments] = useState([
    {
      id: 1,
      name: 'General Construction SWMS',
      status: 'Approved',
      dateCreated: '2024-01-15',
      hazards: ['Working at height', 'Manual handling', 'Electrical hazards'],
      signedBy: ['John Smith', 'Mike Johnson'],
      nextReview: '2024-07-15'
    },
    {
      id: 2,
      name: 'Plumbing Works SWMS',
      status: 'Draft',
      dateCreated: '2024-01-20',
      hazards: ['Confined spaces', 'Chemical exposure', 'Hot work'],
      signedBy: [],
      nextReview: '2024-07-20'
    }
  ]);

  const [permits, setPermits] = useState([
    {
      id: 1,
      name: 'Building Permit',
      number: 'BP2024001',
      status: 'Approved',
      issueDate: '2024-01-10',
      expiryDate: '2024-12-31',
      issuedBy: 'Brisbane City Council'
    }
  ]);

  const [contracts, setContracts] = useState([
    {
      id: 1,
      name: 'Main Contract Agreement',
      type: 'Primary Contract',
      dateSigned: '2024-01-05',
      value: '$45,000',
      status: 'Active'
    }
  ]);

  // File upload handlers
  const handleFileUpload = (fileType, file, category = 'general') => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (category === 'credentials') {
          setBusinessCredentials(prev => ({
            ...prev,
            [fileType]: {
              name: file.name,
              size: file.size,
              type: file.type,
              data: e.target.result,
              uploadDate: new Date().toISOString()
            }
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (fileType, category = 'credentials') => {
    if (category === 'credentials') {
      setBusinessCredentials(prev => ({
        ...prev,
        [fileType]: null
      }));
    }
  };

  const generateNewSWMS = () => {
    // Navigate to SWMS creator with job details pre-populated
    const params = new URLSearchParams({
      projectName: jobDetails.title || jobDetails.customer || 'New Project',
      jobNumber: jobDetails.job_number || '',
      location: jobDetails.address || '',
      clientName: jobDetails.customer || '',
      tradeType: jobDetails.type || 'General Construction',
      supervisor: businessCredentials.contactPerson,
      projectDate: jobDetails.date || new Date().toISOString().split('T')[0],
      businessName: businessCredentials.businessName,
      abn: businessCredentials.abn,
      contactPerson: businessCredentials.contactPerson,
      email: businessCredentials.email,
      phone: businessCredentials.phone
    });
    window.open(`/calculators/ai-swms?${params.toString()}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="permits">Permits</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="variation">Variation</TabsTrigger>
          <TabsTrigger value="defects">Defects</TabsTrigger>
        </TabsList>

        {/* General Tab - Business Credentials & SWMS */}
        <TabsContent value="general" className="space-y-6">
          {/* Business Credentials Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Business Credentials
              </CardTitle>
              <CardDescription>
                Manage your business information and compliance documents for this job
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Business Information */}
              <div className="space-y-4">
                <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Business Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={businessCredentials.businessName}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, businessName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="abn">ABN</Label>
                    <Input
                      id="abn"
                      value={businessCredentials.abn}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, abn: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="licenseNumber">License Number</Label>
                    <Input
                      id="licenseNumber"
                      value={businessCredentials.licenseNumber}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, licenseNumber: e.target.value})}
                      placeholder="e.g., LIC123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input
                      id="contactPerson"
                      value={businessCredentials.contactPerson}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, contactPerson: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Company Logo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Company Logo</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useLogoEverytime"
                      checked={businessCredentials.useLogoEverytime}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, useLogoEverytime: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="useLogoEverytime" className="text-sm">Use in all job documents</Label>
                  </div>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {businessCredentials.logo ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Image className="h-8 w-8 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{businessCredentials.logo.name}</p>
                          <p className="text-xs text-gray-500">{(businessCredentials.logo.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => removeFile('logo', 'credentials')}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Upload your company logo</p>
                      <p className="text-xs text-gray-500 mb-4">PNG, JPG, SVG up to 2MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('logo', e.target.files[0], 'credentials')}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Label htmlFor="logo-upload" className="cursor-pointer">
                        <Button type="button" className="bg-blue-600 hover:bg-blue-700">
                          Choose File
                        </Button>
                      </Label>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Insurance & Compliance Documents */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wide">Insurance & Compliance</h4>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="useCredentialsEverytime"
                      checked={businessCredentials.useCredentialsEverytime}
                      onChange={(e) => setBusinessCredentials({...businessCredentials, useCredentialsEverytime: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="useCredentialsEverytime" className="text-sm">Attach to all job documents</Label>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* WorkCover Policy */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <ShieldCheck className="h-5 w-5 text-green-500" />
                      <h5 className="font-medium">WorkCover Policy</h5>
                    </div>
                    
                    {businessCredentials.workCoverPolicy ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{businessCredentials.workCoverPolicy.name}</p>
                            <p className="text-xs text-gray-500">{(businessCredentials.workCoverPolicy.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removeFile('workCoverPolicy', 'credentials')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('workCoverPolicy', e.target.files[0], 'credentials')}
                          className="hidden"
                          id="workcover-upload"
                        />
                        <Label htmlFor="workcover-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Policy
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>

                  {/* Public Liability Policy */}
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <CreditCard className="h-5 w-5 text-blue-500" />
                      <h5 className="font-medium">Public Liability</h5>
                    </div>
                    
                    {businessCredentials.publicLiabilityPolicy ? (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{businessCredentials.publicLiabilityPolicy.name}</p>
                            <p className="text-xs text-gray-500">{(businessCredentials.publicLiabilityPolicy.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => removeFile('publicLiabilityPolicy', 'credentials')}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => handleFileUpload('publicLiabilityPolicy', e.target.files[0], 'credentials')}
                          className="hidden"
                          id="liability-upload"
                        />
                        <Label htmlFor="liability-upload" className="cursor-pointer">
                          <Button type="button" variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Policy
                          </Button>
                        </Label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SWMS Documents Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <HardHat className="h-5 w-5" />
                    SWMS Documents
                  </CardTitle>
                  <CardDescription>
                    Safe Work Method Statements for this job
                  </CardDescription>
                </div>
                <Button onClick={generateNewSWMS} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create SWMS
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {swmsDocuments.map(swms => (
                  <div key={swms.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Clipboard className="h-5 w-5 text-blue-500" />
                        <div>
                          <h4 className="font-medium">{swms.name}</h4>
                          <p className="text-sm text-gray-500">Created: {swms.dateCreated}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={swms.status === 'Approved' ? 'default' : 'secondary'}>
                          {swms.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Hazards: </span>
                        <span className="text-gray-600">{swms.hazards.length} identified</span>
                      </div>
                      <div>
                        <span className="font-medium">Signed By: </span>
                        <span className="text-gray-600">{swms.signedBy.length} workers</span>
                      </div>
                      <div>
                        <span className="font-medium">Next Review: </span>
                        <span className="text-gray-600">{swms.nextReview}</span>
                      </div>
                    </div>
                    
                    {swms.status === 'Draft' && (
                      <Alert className="mt-3 border-orange-200 bg-orange-50">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <AlertDescription className="text-orange-800">
                          This SWMS is in draft status and requires approval before work can commence.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upload Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload General Documentation
              </CardTitle>
              <CardDescription>
                Drag and drop files here, or click to select files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Upload job-related documents
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  PDF, DOC, DOCX, JPG, PNG up to 10MB each
                </p>
                <Button variant="outline">
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Technical Tab */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Technical Documentation</CardTitle>
              <CardDescription>Technical drawings, specifications, and compliance documents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Technical documentation content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permits Tab */}
        <TabsContent value="permits" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Permits & Approvals</CardTitle>
                  <CardDescription>Building permits, council approvals, and regulatory compliance</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Permit
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permits.map(permit => (
                  <div key={permit.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{permit.name}</h4>
                      <Badge variant={permit.status === 'Approved' ? 'default' : 'secondary'}>
                        {permit.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Number: </span>
                        <span className="text-gray-600">{permit.number}</span>
                      </div>
                      <div>
                        <span className="font-medium">Issued: </span>
                        <span className="text-gray-600">{permit.issueDate}</span>
                      </div>
                      <div>
                        <span className="font-medium">Expires: </span>
                        <span className="text-gray-600">{permit.expiryDate}</span>
                      </div>
                      <div>
                        <span className="font-medium">Issued By: </span>
                        <span className="text-gray-600">{permit.issuedBy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contracts & Agreements</CardTitle>
                  <CardDescription>Main contracts, subcontractor agreements, and variations</CardDescription>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Contract
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contracts.map(contract => (
                  <div key={contract.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{contract.name}</h4>
                      <Badge variant={contract.status === 'Active' ? 'default' : 'secondary'}>
                        {contract.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Type: </span>
                        <span className="text-gray-600">{contract.type}</span>
                      </div>
                      <div>
                        <span className="font-medium">Date Signed: </span>
                        <span className="text-gray-600">{contract.dateSigned}</span>
                      </div>
                      <div>
                        <span className="font-medium">Value: </span>
                        <span className="text-gray-600">{contract.value}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Variation Tab */}
        <TabsContent value="variation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variations</CardTitle>
              <CardDescription>Contract variations, change orders, and scope modifications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Variation documentation will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Defects Tab */}
        <TabsContent value="defects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Defects & Issues</CardTitle>
              <CardDescription>Defect reports, remedial work, and quality assurance documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Defects documentation will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default JobDocumentation; 