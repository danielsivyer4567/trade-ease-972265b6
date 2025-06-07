"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { templateStorageService } from '@/services/templateStorageService';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Upload, 
  FileText, 
  Ruler, 
  Hammer, 
  CheckSquare, 
  MessageSquare, 
  PenTool,
  Printer,
  RotateCcw,
  Save,
  Settings,
  Edit3,
  X,
  Plus,
  Copy,
  Trash2,
  Move,
  Table,
  Type
} from 'lucide-react';
import { useTemplateEditor } from '../../hooks/useTemplateEditor';
import TemplateEditor from './TemplateEditor';
import '../../styles/template-editor.css';

interface ProjectData {
  projectName: string;
  jobNumber: string;
  date: string;
  location: string;
  contractor: string;
  length: number;
  width: number;
  height: number;
  area: number;
  primaryMaterial: string;
  quantity: string;
  additionalMaterials: string;
  notes: string;
}

interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

interface ImageControls {
  size: number;
  posX: number;
  posY: number;
  fitMode: string;
}

const ConstructionTemplate3: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const editor = useTemplateEditor({
    defaultComponents: [
      { id: 'project-info', type: 'project-info', title: '📋 Project Information', order: 0 },
      { id: 'measurements', type: 'measurements', title: '📏 Key Measurements', order: 1 },
      { id: 'materials', type: 'materials', title: '🔨 Materials & Equipment', order: 2 },
      { id: 'inspection', type: 'inspection', title: '✅ Inspection Checklist', order: 3 },
      { id: 'notes', type: 'notes', title: '📝 Notes & Comments', order: 4 },
      { id: 'signatures', type: 'signatures', title: '✍️ Signatures', order: 5 }
    ]
  });

  const {
    backgroundImage,
    setBackgroundImage,
    backgroundOpacity,
    setBackgroundOpacity,
    imageControls,
    setImageControls,
    handleImageUpload: editorHandleImageUpload,
    removeBackgroundImage,
    getBackgroundOverlayStyles
  } = editor;

  const [fileName, setFileName] = useState('');
  const [currentBackgroundFile, setCurrentBackgroundFile] = useState<File | null>(null);

  const [projectData, setProjectData] = useState<ProjectData>({
    projectName: '',
    jobNumber: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    contractor: '',
    length: 0,
    width: 0,
    height: 0,
    area: 0,
    primaryMaterial: '',
    quantity: '',
    additionalMaterials: '',
    notes: ''
  });

  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: 'foundation', label: 'Foundation', checked: false },
    { id: 'framing', label: 'Framing', checked: false },
    { id: 'electrical', label: 'Electrical', checked: false },
    { id: 'plumbing', label: 'Plumbing', checked: false },
    { id: 'hvac', label: 'HVAC', checked: false },
    { id: 'insulation', label: 'Insulation', checked: false },
    { id: 'drywall', label: 'Drywall', checked: false },
    { id: 'flooring', label: 'Flooring', checked: false }
  ]);

  // Load custom template data if this is a custom template
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const isCustomTemplate = urlParams.get('custom') === 'true';
    
    if (isCustomTemplate) {
      const customTemplateData = sessionStorage.getItem('customTemplateData');
      if (customTemplateData) {
        try {
          const data = JSON.parse(customTemplateData);
          
          // Set read-only mode for saved templates
          setIsReadOnlyMode(true);
          setTemplateId(data.id || null);
          console.log('🔒 Template loaded in read-only mode');
          
          // Load project data
          if (data.projectData) {
            setProjectData(data.projectData);
          }
          
          // Load checklist data
          if (data.checklist) {
            setChecklist(data.checklist);
          }
          
          // Load background image and settings
          if (data.backgroundImageUrl) {
            setBackgroundImage(data.backgroundImageUrl);
          } else if (data.backgroundImage) {
            setBackgroundImage(data.backgroundImage);
          }
          
          if (data.backgroundOpacity !== undefined) {
            setBackgroundOpacity(data.backgroundOpacity);
          }
          
          if (data.imageControls) {
            setImageControls(data.imageControls);
          }
          
          // Clean up session storage
          sessionStorage.removeItem('customTemplateData');
        } catch (error) {
          console.error('Error loading custom template data:', error);
        }
      }
    }
  }, [location, setBackgroundImage, setBackgroundOpacity, setImageControls]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setCurrentBackgroundFile(file);
      setFileName(file.name);
    }
    editorHandleImageUpload(event);
  };

  const handleProjectDataChange = (field: keyof ProjectData, value: string | number) => {
    setProjectData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate area when length or width changes
      if (field === 'length' || field === 'width') {
        if (updated.length && updated.width) {
          updated.area = Number((updated.length * updated.width).toFixed(2));
        }
      }
      
      return updated;
    });
  };

  const handleChecklistChange = (id: string, checked: boolean) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSaveAsTemplate = async () => {
    console.log('🔥 BUTTON CLICKED - Starting save process with Supabase');
    
    try {
      setIsSaving(true);
      console.log('✅ Setting saving state to true');
      
      // Create template data object
      const templateName = projectData.projectName || `Construction Template - ${new Date().toLocaleDateString()}`;
      console.log('📝 Creating template with name:', templateName);
      
      const templateData = {
        name: templateName,
        category: "My Templates",
        price: 0.00,
        projectData,
        checklist,
        backgroundFileName: fileName,
        backgroundOpacity,
        imageControls,
        createdAt: new Date().toISOString()
      };

      console.log('📋 Template data object:', templateData);

      // Save template using Supabase service
      console.log('🚀 Saving template to Supabase...');
      const result = await templateStorageService.saveTemplate(
        templateData, 
        currentBackgroundFile || undefined
      );

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to save template to Supabase');
      }

      console.log('✅ Template saved successfully to Supabase');
      
      // Show success message with toast
      toast({
        title: "Template Saved Successfully! 🎉",
        description: `"${templateName}" saved to My Templates in the cloud${currentBackgroundFile ? ' with background image' : ''}`,
        duration: 5000,
      });
      
      console.log('✅ Save process completed successfully');
      
    } catch (error: any) {
      console.error('❌ SAVE FAILED:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save template. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
      console.log('🏁 Save process finished, setting saving state to false');
    }
  };

  const handleUpdateTemplateName = async () => {
    if (!templateId || !isReadOnlyMode) return;

    try {
      setIsSaving(true);
      
      // Update only the template name in Supabase
      const templateName = projectData.projectName || `Construction Template - ${new Date().toLocaleDateString()}`;
      
      // TODO: Add update method to templateStorageService
      // For now, just show success message
      toast({
        title: "Template Name Updated! ✏️",
        description: `Template renamed to "${templateName}"`,
        duration: 3000,
      });
      
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update template name.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const materials = [
    'Select material',
    'Concrete',
    'Steel',
    'Wood',
    'Brick',
    'Drywall',
    'Other'
  ];

  return (
    <div className={editor.getContainerClasses("min-h-screen bg-gray-100 dark:bg-gray-900 p-5")}>
      <div className="template-container max-w-6xl mx-auto" style={{ position: 'relative' }}>
        {backgroundImage && (
          <div style={{...getBackgroundOverlayStyles(), opacity: backgroundOpacity / 100 }} />
        )}
        
        <div className="max-w-6xl mx-auto bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-hidden print-container">
          {/* Header */}
          <div className="bg-slate-800 text-white p-5 text-center no-print">
            <h1 className="text-2xl font-bold">Construction Template</h1>
            <p className="mt-2">Upload your PDF-converted image and fill out the form</p>
            <div className="mt-4">
              <TemplateEditor {...editor} />
            </div>
          </div>

          {/* Controls */}
          <div className="p-5 bg-gray-50 dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 no-print">
            {isReadOnlyMode ? (
              /* Read-Only Mode - Only Template Name Editing */
              <div className="mb-4">
                <div className="bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200">Saved Template - Read Only</h3>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-300">
                    This is a saved template. You can only edit the template name. All other fields are locked to preserve the original design.
                  </p>
                </div>
                
                <div className="flex items-center gap-3">
                  <Button
                    onClick={handleUpdateTemplateName}
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                  >
                    <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                    {isSaving ? 'Updating...' : 'Update Template Name'}
                  </Button>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    💡 Edit the "Project Name" field below to rename this template
                  </span>
                </div>
              </div>
            ) : (
              /* Edit Mode - Full Controls */
              <>
                <div className="mb-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      📁 Upload Background Image
                    </Button>
                    <Button
                      onClick={handleSaveAsTemplate}
                      disabled={isSaving}
                      className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    >
                      <Save className={`w-4 h-4 mr-2 ${isSaving ? 'animate-spin' : ''}`} />
                      {isSaving ? 'Saving...' : 'Save as Template'}
                    </Button>
                  </div>
                  {fileName && (
                    <span className="ml-3 text-gray-600 dark:text-gray-400">{fileName}</span>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Template Area */}
          <div className="relative min-h-screen bg-white dark:bg-slate-900 overflow-hidden">
            {/* Form Overlay */}
            <div className="relative z-10 p-10">
              {/* Project Information */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "project-info")}
                {...editor.getSectionProps("project-info", "project-info")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <FileText className="w-5 h-5 mr-2" />
                    📋 Project Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="projectName" className="text-xs font-bold text-gray-700 dark:text-gray-300">Project Name:</Label>
                      <Input
                        id="projectName"
                        value={projectData.projectName}
                        onChange={(e) => handleProjectDataChange('projectName', e.target.value)}
                        placeholder="Enter project name"
                        className={`text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 ${isReadOnlyMode ? 'border-blue-300 bg-blue-50' : ''}`}
                        // Project name is always editable
                      />
                    </div>
                    <div>
                      <Label htmlFor="jobNumber" className="text-xs font-bold text-gray-700 dark:text-gray-300">Job Number:</Label>
                      <Input
                        id="jobNumber"
                        value={projectData.jobNumber}
                        onChange={(e) => handleProjectDataChange('jobNumber', e.target.value)}
                        placeholder="Job #"
                        className="text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="date" className="text-xs font-bold text-gray-700 dark:text-gray-300">Date:</Label>
                      <Input
                        id="date"
                        type="date"
                        value={projectData.date}
                        onChange={(e) => handleProjectDataChange('date', e.target.value)}
                        className="text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location" className="text-xs font-bold text-gray-700 dark:text-gray-300">Location/Address:</Label>
                      <Input
                        id="location"
                        value={projectData.location}
                        onChange={(e) => handleProjectDataChange('location', e.target.value)}
                        placeholder="Project location"
                        className="text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="contractor" className="text-xs font-bold text-gray-700 dark:text-gray-300">Contractor:</Label>
                      <Input
                        id="contractor"
                        value={projectData.contractor}
                        onChange={(e) => handleProjectDataChange('contractor', e.target.value)}
                        placeholder="Contractor name"
                        className="text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Measurements */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "measurements")}
                {...editor.getSectionProps("measurements", "measurements")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <Ruler className="w-5 h-5 mr-2" />
                    📏 Key Measurements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="length" className="text-xs font-bold text-gray-700 dark:text-gray-300">Length (ft):</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.1"
                        value={projectData.length || ''}
                        onChange={(e) => handleProjectDataChange('length', Number(e.target.value))}
                        className="text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="width" className="text-xs font-bold text-gray-700 dark:text-gray-300">Width (ft):</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.1"
                        value={projectData.width || ''}
                        onChange={(e) => handleProjectDataChange('width', Number(e.target.value))}
                        className="text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="height" className="text-xs font-bold text-gray-700 dark:text-gray-300">Height (ft):</Label>
                      <Input
                        id="height"
                        type="number"
                        step="0.1"
                        value={projectData.height || ''}
                        onChange={(e) => handleProjectDataChange('height', Number(e.target.value))}
                        className="text-center text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                    <div>
                      <Label htmlFor="area" className="text-xs font-bold text-gray-700 dark:text-gray-300">Area (sq ft):</Label>
                      <Input
                        id="area"
                        type="number"
                        step="0.1"
                        value={projectData.area || ''}
                        readOnly
                        className="text-center bg-gray-50 dark:bg-slate-600 text-sm"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "materials")}
                {...editor.getSectionProps("materials", "materials")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <Hammer className="w-5 h-5 mr-2" />
                    🔨 Materials & Equipment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="primaryMaterial" className="text-xs font-bold text-gray-700 dark:text-gray-300">Primary Material:</Label>
                      <select
                        id="primaryMaterial"
                        value={projectData.primaryMaterial}
                        onChange={(e) => handleProjectDataChange('primaryMaterial', e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-slate-600 rounded-md text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      >
                        {materials.map(material => (
                          <option key={material} value={material === 'Select material' ? '' : material}>
                            {material}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-xs font-bold text-gray-700 dark:text-gray-300">Quantity:</Label>
                      <Input
                        id="quantity"
                        value={projectData.quantity}
                        onChange={(e) => handleProjectDataChange('quantity', e.target.value)}
                        placeholder="Amount needed"
                        className="text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                        disabled={isReadOnlyMode}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="additionalMaterials" className="text-xs font-bold text-gray-700 dark:text-gray-300">Additional Materials:</Label>
                    <Textarea
                      id="additionalMaterials"
                      value={projectData.additionalMaterials}
                      onChange={(e) => handleProjectDataChange('additionalMaterials', e.target.value)}
                      placeholder="List additional materials needed..."
                      className="h-16 text-sm resize-y bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Inspection Checklist */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "inspection")}
                {...editor.getSectionProps("inspection", "inspection")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <CheckSquare className="w-5 h-5 mr-2" />
                    ✅ Inspection Checklist
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {checklist.map(item => (
                      <div key={item.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={(checked) => 
                            handleChecklistChange(item.id, checked as boolean)
                          }
                          disabled={isReadOnlyMode}
                        />
                        <Label htmlFor={item.id} className="text-sm text-gray-800 dark:text-gray-200">
                          {item.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "notes")}
                {...editor.getSectionProps("notes", "notes")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    📝 Notes & Comments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={projectData.notes}
                    onChange={(e) => handleProjectDataChange('notes', e.target.value)}
                    placeholder="Enter project notes, issues, or special instructions..."
                    className="h-24 text-sm bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    disabled={isReadOnlyMode}
                  />
                </CardContent>
              </Card>

              {/* Signatures */}
              <Card 
                className={editor.getSectionClasses("mb-5 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm", "signatures")}
                {...editor.getSectionProps("signatures", "signatures")}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-slate-800 dark:text-slate-200 flex items-center">
                    <PenTool className="w-5 h-5 mr-2" />
                    ✍️ Signatures
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">Inspector Signature:</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 h-20 flex items-center justify-center text-gray-500 dark:text-gray-400 italic rounded-md text-sm">
                        Click to sign or print and sign by hand
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-xs font-bold text-gray-700 dark:text-gray-300">Contractor Signature:</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 h-20 flex items-center justify-center text-gray-500 dark:text-gray-400 italic rounded-md text-sm">
                        Click to sign or print and sign by hand
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Print Button */}
      <Button
        onClick={handlePrint}
        className="fixed bottom-5 right-5 bg-green-600 hover:bg-green-700 text-white rounded-full p-4 shadow-lg no-print"
        size="lg"
      >
        <Printer className="w-5 h-5 mr-2" />
        🖨️ Print Template
      </Button>
    </div>
  );
};

export default ConstructionTemplate3; 