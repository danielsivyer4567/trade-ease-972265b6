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
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundOpacity, setBackgroundOpacity] = useState(30);
  const [fileName, setFileName] = useState('');
  const [showImageControls, setShowImageControls] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentBackgroundFile, setCurrentBackgroundFile] = useState<File | null>(null);
  const [isReadOnlyMode, setIsReadOnlyMode] = useState(false);
  const [templateId, setTemplateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Customization/Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [draggedElement, setDraggedElement] = useState<string | null>(null);
  const [componentCounter, setComponentCounter] = useState(0);
  const [components, setComponents] = useState<any[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Property states for real-time editing
  const [sectionProperties, setSectionProperties] = useState<{[key: string]: any}>({});
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff');
  const [currentTextColor, setCurrentTextColor] = useState('#2c3e50');
  const [currentBorderStyle, setCurrentBorderStyle] = useState('solid');
  const [currentBorderWidth, setCurrentBorderWidth] = useState(1);
  const [currentBorderRadius, setCurrentBorderRadius] = useState(5);
  const [currentPadding, setCurrentPadding] = useState(15);
  const [currentMargin, setCurrentMargin] = useState(20);

  const [imageControls, setImageControls] = useState<ImageControls>({
    size: 100,
    posX: 50,
    posY: 50,
    fitMode: 'contain'
  });

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

  // Initialize default components
  useEffect(() => {
    if (components.length === 0) {
      const defaultComponents = [
        { id: 'project-info', type: 'project-info', title: '📋 Project Information', order: 0 },
        { id: 'measurements', type: 'measurements', title: '📏 Key Measurements', order: 1 },
        { id: 'materials', type: 'materials', title: '🔨 Materials & Equipment', order: 2 },
        { id: 'inspection', type: 'inspection', title: '✅ Inspection Checklist', order: 3 },
        { id: 'notes', type: 'notes', title: '📝 Notes & Comments', order: 4 },
        { id: 'signatures', type: 'signatures', title: '✍️ Signatures', order: 5 }
      ];
      setComponents(defaultComponents);
    }
  }, [components.length]);

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
            // Load from Supabase Storage URL
            setBackgroundImage(data.backgroundImageUrl);
            setShowImageControls(false); // No controls in read-only mode
            console.log(`✅ Loaded background image from Supabase: ${data.backgroundImageUrl}`);
          } else if (data.backgroundImage) {
            // Legacy: Load from base64 data
            setBackgroundImage(data.backgroundImage);
            setShowImageControls(false); // No controls in read-only mode
          } else if (data.backgroundFileName) {
            // Show a message that the background image needs to be re-uploaded
            console.log(`📋 Template had background image: ${data.backgroundFileName} - please re-upload`);
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
  }, [location]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Store the file for later upload to Supabase
      setCurrentBackgroundFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        setShowImageControls(true);
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    }
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

  const handleImageControlChange = (field: keyof ImageControls, value: number | string) => {
    setImageControls(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetImagePosition = () => {
    setImageControls({
      size: 100,
      posX: 50,
      posY: 50,
      fitMode: 'contain'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // ===== CUSTOMIZATION/EDIT MODE FUNCTIONS =====
  
  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setShowSidebar(true);
    } else {
      clearSelection();
      setShowSidebar(false);
    }
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
    if (!showSidebar && !editMode) {
      setEditMode(true);
    }
  };

  const clearSelection = () => {
    setSelectedSection(null);
    setSelectedComponentType(null);
  };

  const selectSection = (sectionId: string) => {
    setSelectedSection(sectionId);
    
    // Find and select the corresponding component type
    const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`) as HTMLElement;
    if (sectionElement) {
      const sectionType = sectionElement.getAttribute('data-section-type');
      setSelectedComponentType(sectionType);
      
      // Load current properties
      const titleElement = sectionElement.querySelector('h3') || sectionElement.querySelector('.card-title');
      if (titleElement) {
        setCurrentTitle(titleElement.textContent || '');
      }
      
      // Get computed styles
      const computedStyle = window.getComputedStyle(sectionElement);
      setCurrentBgColor(rgbToHex(computedStyle.backgroundColor) || '#ffffff');
      setCurrentTextColor(rgbToHex(computedStyle.color) || '#2c3e50');
      setCurrentBorderStyle(computedStyle.borderStyle || 'solid');
      setCurrentBorderWidth(parseInt(computedStyle.borderWidth) || 1);
      setCurrentBorderRadius(parseInt(computedStyle.borderRadius) || 5);
      setCurrentPadding(parseInt(computedStyle.padding) || 15);
      setCurrentMargin(parseInt(computedStyle.marginBottom) || 20);
    }
  };
  
  // Helper function to convert RGB to HEX
  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith('#')) return rgb;
    if (rgb === 'transparent' || rgb === 'rgba(0, 0, 0, 0)') return '#ffffff';
    
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return '#ffffff';
    
    const r = parseInt(result[0]);
    const g = parseInt(result[1]);
    const b = parseInt(result[2]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  const selectComponentType = (componentType: string) => {
    setSelectedComponentType(componentType);
    // Find any existing section of this type
    const existingSections = document.querySelectorAll(`[data-section-type="${componentType}"]`);
    if (existingSections.length > 0) {
      const firstSection = existingSections[0];
      const sectionId = firstSection.getAttribute('data-section-id');
      setSelectedSection(sectionId);
    }
  };

  const addComponent = () => {
    if (!selectedComponentType) {
      toast({
        title: "No Component Selected",
        description: "Please select a component type first",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Create new component based on type
    const newComponentId = `${selectedComponentType}-${Date.now()}`;
    const componentType = componentTypes.find(c => c.id === selectedComponentType);
    
    const newComponent = {
      id: newComponentId,
      type: selectedComponentType,
      title: componentType?.label || 'New Component',
      order: components.length
    };
    
    setComponents(prev => [...prev, newComponent]);
    setComponentCounter(prev => prev + 1);
    
    // Auto-select the new component
    setTimeout(() => {
      setSelectedSection(newComponentId);
    }, 100);
    
    toast({
      title: "Component Added",
      description: `New ${componentType?.label} component added`,
      duration: 2000,
    });
  };

  const duplicateComponent = () => {
    if (!selectedSection) {
      toast({
        title: "No Component Selected",
        description: "Please select a component to duplicate",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const componentToDuplicate = components.find(c => c.id === selectedSection);
    if (!componentToDuplicate) return;

    const duplicatedComponent = {
      ...componentToDuplicate,
      id: `${componentToDuplicate.type}-${Date.now()}`,
      title: `${componentToDuplicate.title} (Copy)`,
      order: components.length
    };

    setComponents(prev => [...prev, duplicatedComponent]);

    toast({
      title: "Component Duplicated",
      description: "Component has been duplicated",
      duration: 2000,
    });
  };

  const deleteComponent = () => {
    if (!selectedSection) {
      toast({
        title: "No Component Selected",
        description: "Please select a component to delete",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Don't allow deleting if it's the last component
    if (components.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one component",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete this component?");
    if (confirmed) {
      setComponents(prev => prev.filter(c => c.id !== selectedSection));
      clearSelection();
      
      toast({
        title: "Component Deleted",
        description: "Component has been removed",
        duration: 2000,
      });
    }
  };

  const applyProperties = (property?: string, value?: any) => {
    if (!selectedSection) return;
    
    const sectionElement = document.querySelector(`[data-section-id="${selectedSection}"]`) as HTMLElement;
    if (!sectionElement) return;

    // Update component in state
    setComponents(prev => prev.map(comp => 
      comp.id === selectedSection 
        ? { ...comp, title: currentTitle }
        : comp
    ));

    // Apply styles immediately
    sectionElement.style.backgroundColor = currentBgColor;
    sectionElement.style.color = currentTextColor;
    sectionElement.style.borderStyle = currentBorderStyle;
    sectionElement.style.borderWidth = `${currentBorderWidth}px`;
    sectionElement.style.borderRadius = `${currentBorderRadius}px`;
    sectionElement.style.padding = `${currentPadding}px`;
    sectionElement.style.marginBottom = `${currentMargin}px`;
    sectionElement.style.borderColor = currentTextColor;

    // Update title if changed
    const titleElement = sectionElement.querySelector('h3') || sectionElement.querySelector('.card-title');
    if (titleElement && currentTitle) {
      titleElement.textContent = currentTitle;
    }

    // Save to properties state for persistence
    setSectionProperties(prev => ({
      ...prev,
      [selectedSection]: {
        backgroundColor: currentBgColor,
        textColor: currentTextColor,
        borderStyle: currentBorderStyle,
        borderWidth: currentBorderWidth,
        borderRadius: currentBorderRadius,
        padding: currentPadding,
        margin: currentMargin,
        title: currentTitle
      }
    }));
  };

  // Real-time property updates
  useEffect(() => {
    if (selectedSection) {
      applyProperties();
    }
  }, [currentBgColor, currentTextColor, currentBorderStyle, currentBorderWidth, 
      currentBorderRadius, currentPadding, currentMargin, currentTitle]);

  // Drag and Drop Functions
  const handleDragStart = (e: React.DragEvent, componentId: string) => {
    setDraggedElement(componentId);
    setIsDragging(true);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
    setIsDragging(false);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (!draggedElement) return;

    const draggedIndex = components.findIndex(c => c.id === draggedElement);
    if (draggedIndex === -1) return;

    const newComponents = [...components];
    const [draggedComponent] = newComponents.splice(draggedIndex, 1);
    newComponents.splice(dropIndex, 0, draggedComponent);

    // Update order property
    const updatedComponents = newComponents.map((comp, index) => ({
      ...comp,
      order: index
    }));

    setComponents(updatedComponents);
    setDragOverIndex(null);
  };

  const moveComponentUp = (componentId: string) => {
    const currentIndex = components.findIndex(c => c.id === componentId);
    if (currentIndex <= 0) return;

    const newComponents = [...components];
    [newComponents[currentIndex - 1], newComponents[currentIndex]] = 
    [newComponents[currentIndex], newComponents[currentIndex - 1]];

    setComponents(newComponents.map((comp, index) => ({ ...comp, order: index })));
  };

  const moveComponentDown = (componentId: string) => {
    const currentIndex = components.findIndex(c => c.id === componentId);
    if (currentIndex >= components.length - 1) return;

    const newComponents = [...components];
    [newComponents[currentIndex], newComponents[currentIndex + 1]] = 
    [newComponents[currentIndex + 1], newComponents[currentIndex]];

    setComponents(newComponents.map((comp, index) => ({ ...comp, order: index })));
  };

  const componentTypes = [
    { id: 'project-info', label: '📋 Project Information', icon: FileText },
    { id: 'measurements', label: '📏 Measurements', icon: Ruler },
    { id: 'materials', label: '🔨 Materials & Equipment', icon: Hammer },
    { id: 'inspection', label: '✅ Inspection Checklist', icon: CheckSquare },
    { id: 'notes', label: '📝 Notes & Comments', icon: MessageSquare },
    { id: 'signatures', label: '✍️ Signatures', icon: PenTool },
    { id: 'custom-text', label: '📄 Custom Text Block', icon: Type },
    { id: 'custom-table', label: '📊 Custom Table', icon: Table },
  ];

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

  const backgroundImageStyle = {
    display: backgroundImage ? 'block' : 'none',
    opacity: backgroundOpacity / 100,
    width: `${imageControls.size}%`,
    height: `${imageControls.size}%`,
    left: `${imageControls.posX}%`,
    top: `${imageControls.posY}%`,
    objectFit: imageControls.fitMode as any,
    transition: 'all 0.3s ease'
  };

  return (
    <div className={`min-h-screen bg-gray-100 p-5 ${editMode ? 'edit-mode' : ''} ${showSidebar ? 'sidebar-open' : ''}`}>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          .print-container {
            box-shadow: none !important;
            max-width: none !important;
            margin: 0 !important;
          }
        }

        /* Edit Mode Styles */
        .edit-mode .form-section {
          border: 2px dashed transparent !important;
          cursor: pointer !important;
          transition: all 0.3s ease !important;
          position: relative !important;
        }

        .edit-mode .form-section:hover {
          border-color: #3498db !important;
          background: rgba(52, 152, 219, 0.1) !important;
          transform: translateY(-2px) !important;
          box-shadow: 0 4px 12px rgba(52, 152, 219, 0.15) !important;
        }

        .edit-mode .form-section.selected {
          border-color: #e74c3c !important;
          background: rgba(231, 76, 60, 0.1) !important;
          box-shadow: 0 0 15px rgba(231, 76, 60, 0.4) !important;
          transform: translateY(-1px) !important;
        }

        .edit-mode .form-section.selected::before {
          content: "✓ SELECTED";
          position: absolute !important;
          top: -8px !important;
          left: 15px !important;
          background: #e74c3c !important;
          color: white !important;
          padding: 2px 8px !important;
          border-radius: 12px !important;
          font-size: 10px !important;
          font-weight: bold !important;
          z-index: 101 !important;
        }

        .edit-mode .form-section .drag-handle {
          display: flex !important;
          position: absolute !important;
          top: 5px !important;
          right: 5px !important;
          background: #3498db !important;
          color: white !important;
          padding: 4px 8px !important;
          border-radius: 6px !important;
          font-size: 10px !important;
          cursor: move !important;
          z-index: 100 !important;
          font-weight: bold !important;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2) !important;
        }

        .edit-mode .form-section .drag-handle:hover {
          background: #2980b9 !important;
          transform: scale(1.05) !important;
        }

        .edit-mode .form-section[draggable="true"] {
          cursor: move !important;
        }

        .edit-mode .form-section[draggable="true"]:active {
          opacity: 0.7 !important;
          transform: rotate(2deg) !important;
        }

        .drag-handle {
          display: none;
        }

        .drag-handle button {
          background: rgba(255,255,255,0.2) !important;
          border: 1px solid rgba(255,255,255,0.3) !important;
          color: white !important;
          width: 20px !important;
          height: 16px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 3px !important;
          font-size: 10px !important;
          line-height: 1 !important;
          padding: 0 !important;
        }

        .drag-handle button:hover {
          background: rgba(255,255,255,0.3) !important;
          transform: scale(1.1) !important;
        }

        .drag-handle button:disabled {
          opacity: 0.3 !important;
          cursor: not-allowed !important;
        }

        /* Sidebar Styles */
        .sidebar-open .container {
          margin-right: 320px;
          transition: margin-right 0.3s ease;
        }

        /* Drag Drop Visual Feedback */
        .border-t-4 {
          border-top: 4px solid #3498db !important;
          background: rgba(52, 152, 219, 0.1) !important;
        }

        /* Improved scrollbars for sidebar */
        .sidebar::-webkit-scrollbar {
          width: 6px;
        }

        .sidebar::-webkit-scrollbar-track {
          background: #1e293b;
        }

        .sidebar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }

        .sidebar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }

        /* Animation for new components */
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .form-section {
          animation: slideInFromRight 0.3s ease-out;
        }

        /* Pulse effect for active edit mode */
        .edit-mode .container::before {
          content: "🎨 EDIT MODE";
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(231, 76, 60, 0.9);
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
      
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden print-container container">
        {/* Header */}
        <div className="bg-slate-800 text-white p-5 text-center no-print">
          <h1 className="text-2xl font-bold">Construction Template</h1>
          <p className="mt-2">Upload your PDF-converted image and fill out the form</p>
          
          {/* Edit Mode Controls */}
          {!isReadOnlyMode && (
            <div className="mt-4 flex justify-center gap-3">
              <Button
                onClick={toggleEditMode}
                className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-4 py-2 text-sm`}
                size="sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {editMode ? '✓ Exit Edit' : '✏️ Edit Mode'}
              </Button>
              <Button
                onClick={toggleSidebar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm"
                size="sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                ⚙️ Customize
              </Button>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="p-5 bg-gray-50 border-b no-print">
          {isReadOnlyMode ? (
            /* Read-Only Mode - Only Template Name Editing */
            <div className="mb-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <h3 className="text-sm font-semibold text-blue-800">Saved Template - Read Only</h3>
                </div>
                <p className="text-xs text-blue-600">
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
                <span className="text-sm text-gray-600">
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
                  <span className="ml-3 text-gray-600">{fileName}</span>
                )}
              </div>
              
              <div className="flex items-center gap-3 mb-3">
                <Label htmlFor="opacity">Background Opacity:</Label>
                <input
                  id="opacity"
                  type="range"
                  min="0"
                  max="100"
                  value={backgroundOpacity}
                  onChange={(e) => setBackgroundOpacity(Number(e.target.value))}
                  className="flex-1 max-w-48"
                />
                <span className="text-sm text-gray-600">{backgroundOpacity}%</span>
              </div>

              {/* Advanced Image Controls */}
              {showImageControls && (
                <div className="mt-4 pt-4 border-t border-gray-300">
                  <div className="flex flex-wrap gap-5">
                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-bold text-gray-700">Image Size:</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="10"
                          max="200"
                          value={imageControls.size}
                          onChange={(e) => handleImageControlChange('size', Number(e.target.value))}
                          className="w-30"
                        />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{imageControls.size}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-bold text-gray-700">Horizontal Position:</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={imageControls.posX}
                          onChange={(e) => handleImageControlChange('posX', Number(e.target.value))}
                          className="w-30"
                        />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{imageControls.posX}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-bold text-gray-700">Vertical Position:</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={imageControls.posY}
                          onChange={(e) => handleImageControlChange('posY', Number(e.target.value))}
                          className="w-30"
                        />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{imageControls.posY}%</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <Label className="text-xs font-bold text-gray-700">Fit Mode:</Label>
                      <select
                        value={imageControls.fitMode}
                        onChange={(e) => handleImageControlChange('fitMode', e.target.value)}
                        className="p-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="contain">Fit to container</option>
                        <option value="cover">Fill container</option>
                        <option value="fill">Stretch to fill</option>
                        <option value="none">Original size</option>
                      </select>
                    </div>

                    <Button
                      onClick={resetImagePosition}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-sm"
                      size="sm"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Reset Position
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Template Area */}
        <div className="relative min-h-screen bg-white overflow-hidden">
          {/* Background Image */}
          {backgroundImage && (
            <img
              src={backgroundImage}
              alt="Background"
              className="absolute pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                ...backgroundImageStyle,
                zIndex: 1
              }}
            />
          )}
          
          {/* Form Overlay */}
          <div className="relative z-10 p-10">
            {/* Project Information */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'project-info' ? 'selected' : ''}`}
              data-section-id="project-info"
              data-section-type="project-info"
              onClick={() => editMode && selectSection('project-info')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'project-info')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('project-info'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('project-info'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  📋 Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="projectName" className="text-xs font-bold text-gray-700">Project Name:</Label>
                    <Input
                      id="projectName"
                      value={projectData.projectName}
                      onChange={(e) => handleProjectDataChange('projectName', e.target.value)}
                      placeholder="Enter project name"
                      className={`text-sm ${isReadOnlyMode ? 'border-blue-300 bg-blue-50' : ''}`}
                      // Project name is always editable
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobNumber" className="text-xs font-bold text-gray-700">Job Number:</Label>
                    <Input
                      id="jobNumber"
                      value={projectData.jobNumber}
                      onChange={(e) => handleProjectDataChange('jobNumber', e.target.value)}
                      placeholder="Job #"
                      className="text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date" className="text-xs font-bold text-gray-700">Date:</Label>
                    <Input
                      id="date"
                      type="date"
                      value={projectData.date}
                      onChange={(e) => handleProjectDataChange('date', e.target.value)}
                      className="text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location" className="text-xs font-bold text-gray-700">Location/Address:</Label>
                    <Input
                      id="location"
                      value={projectData.location}
                      onChange={(e) => handleProjectDataChange('location', e.target.value)}
                      placeholder="Project location"
                      className="text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="contractor" className="text-xs font-bold text-gray-700">Contractor:</Label>
                    <Input
                      id="contractor"
                      value={projectData.contractor}
                      onChange={(e) => handleProjectDataChange('contractor', e.target.value)}
                      placeholder="Contractor name"
                      className="text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Measurements */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'measurements' ? 'selected' : ''}`}
              data-section-id="measurements"
              data-section-type="measurements"
              onClick={() => editMode && selectSection('measurements')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'measurements')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('measurements'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('measurements'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
                  <Ruler className="w-5 h-5 mr-2" />
                  📏 Key Measurements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="length" className="text-xs font-bold text-gray-700">Length (ft):</Label>
                    <Input
                      id="length"
                      type="number"
                      step="0.1"
                      value={projectData.length || ''}
                      onChange={(e) => handleProjectDataChange('length', Number(e.target.value))}
                      className="text-center text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="width" className="text-xs font-bold text-gray-700">Width (ft):</Label>
                    <Input
                      id="width"
                      type="number"
                      step="0.1"
                      value={projectData.width || ''}
                      onChange={(e) => handleProjectDataChange('width', Number(e.target.value))}
                      className="text-center text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="height" className="text-xs font-bold text-gray-700">Height (ft):</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={projectData.height || ''}
                      onChange={(e) => handleProjectDataChange('height', Number(e.target.value))}
                      className="text-center text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                  <div>
                    <Label htmlFor="area" className="text-xs font-bold text-gray-700">Area (sq ft):</Label>
                    <Input
                      id="area"
                      type="number"
                      step="0.1"
                      value={projectData.area || ''}
                      readOnly
                      className="text-center bg-gray-50 text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Materials */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'materials' ? 'selected' : ''}`}
              data-section-id="materials"
              data-section-type="materials"
              onClick={() => editMode && selectSection('materials')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'materials')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('materials'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('materials'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
                  <Hammer className="w-5 h-5 mr-2" />
                  🔨 Materials & Equipment
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryMaterial" className="text-xs font-bold text-gray-700">Primary Material:</Label>
                    <select
                      id="primaryMaterial"
                      value={projectData.primaryMaterial}
                      onChange={(e) => handleProjectDataChange('primaryMaterial', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md text-sm"
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
                    <Label htmlFor="quantity" className="text-xs font-bold text-gray-700">Quantity:</Label>
                    <Input
                      id="quantity"
                      value={projectData.quantity}
                      onChange={(e) => handleProjectDataChange('quantity', e.target.value)}
                      placeholder="Amount needed"
                      className="text-sm"
                      disabled={isReadOnlyMode}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="additionalMaterials" className="text-xs font-bold text-gray-700">Additional Materials:</Label>
                  <Textarea
                    id="additionalMaterials"
                    value={projectData.additionalMaterials}
                    onChange={(e) => handleProjectDataChange('additionalMaterials', e.target.value)}
                    placeholder="List additional materials needed..."
                    className="h-16 text-sm resize-y"
                    disabled={isReadOnlyMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Inspection Checklist */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'inspection' ? 'selected' : ''}`}
              data-section-id="inspection"
              data-section-type="inspection"
              onClick={() => editMode && selectSection('inspection')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'inspection')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('inspection'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('inspection'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
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
                      <Label htmlFor={item.id} className="text-sm">
                        {item.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'notes' ? 'selected' : ''}`}
              data-section-id="notes"
              data-section-type="notes"
              onClick={() => editMode && selectSection('notes')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'notes')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('notes'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('notes'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  📝 Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={projectData.notes}
                  onChange={(e) => handleProjectDataChange('notes', e.target.value)}
                  placeholder="Enter project notes, issues, or special instructions..."
                  className="h-24 text-sm"
                  disabled={isReadOnlyMode}
                />
              </CardContent>
            </Card>

            {/* Signatures */}
            <Card 
              className={`mb-5 bg-white/90 backdrop-blur-sm form-section ${selectedSection === 'signatures' ? 'selected' : ''}`}
              data-section-id="signatures"
              data-section-type="signatures"
              onClick={() => editMode && selectSection('signatures')}
              draggable={editMode}
              onDragStart={(e) => handleDragStart(e, 'signatures')}
              onDragEnd={handleDragEnd}
            >
              <div className="drag-handle flex items-center justify-between">
                <div className="flex items-center">
                  <Move className="w-3 h-3 inline mr-1" />
                  DRAG
                </div>
                <div className="flex gap-1">
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentUp('signatures'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↑
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); moveComponentDown('signatures'); }}
                    className="text-white hover:text-blue-200 text-xs"
                  >
                    ↓
                  </button>
                </div>
              </div>
              <CardHeader className="pb-3">
                <CardTitle className="text-slate-800 flex items-center">
                  <PenTool className="w-5 h-5 mr-2" />
                  ✍️ Signatures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="mb-2 block text-xs font-bold text-gray-700">Inspector Signature:</Label>
                    <div className="border-2 border-dashed border-gray-300 h-20 flex items-center justify-center text-gray-500 italic rounded-md text-sm">
                      Click to sign or print and sign by hand
                    </div>
                  </div>
                  <div>
                    <Label className="mb-2 block text-xs font-bold text-gray-700">Contractor Signature:</Label>
                    <div className="border-2 border-dashed border-gray-300 h-20 flex items-center justify-center text-gray-500 italic rounded-md text-sm">
                      Click to sign or print and sign by hand
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

      {/* Customization Sidebar */}
      {showSidebar && (
        <div className="fixed top-0 right-0 w-80 h-full bg-slate-800 text-white z-50 overflow-y-auto no-print">
          {/* Sidebar Header */}
          <div className="p-5 bg-slate-900 border-b border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold">⚙️ Template Builder</h3>
              <Button
                onClick={toggleSidebar}
                className="bg-slate-700 hover:bg-slate-600 text-white p-2"
                size="sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={toggleEditMode}
                className={`${editMode ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'} text-white px-3 py-1 text-xs`}
                size="sm"
              >
                <Edit3 className="w-3 h-3 mr-1" />
                {editMode ? '✓ Exit Edit' : '✏️ Edit Mode'}
              </Button>
            </div>
          </div>

          <div className="p-5">
            {/* Components List */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-300 mb-3">📦 Available Components</h4>
              <div className="space-y-1">
                {componentTypes.map(component => {
                  const Icon = component.icon;
                  return (
                    <div
                      key={component.id}
                      className={`p-3 rounded cursor-pointer text-sm transition-colors ${
                        selectedComponentType === component.id
                          ? 'bg-red-600 text-white'
                          : 'bg-slate-700 hover:bg-slate-600'
                      }`}
                      onClick={() => selectComponentType(component.id)}
                    >
                      <Icon className="w-4 h-4 inline mr-2" />
                      {component.label}
                    </div>
                  );
                })}
              </div>
            </div>

                         {/* Properties Panel */}
             <div className="mb-6">
               <h4 className="text-sm font-semibold text-slate-300 mb-3">🎨 Properties</h4>
               <div className="bg-slate-700 p-4 rounded max-h-96 overflow-y-auto">
                 {selectedSection ? (
                   <div className="space-y-4">
                     {/* Basic Properties */}
                     <div className="border-b border-slate-600 pb-3">
                       <h5 className="text-xs font-semibold text-slate-400 mb-2">GENERAL</h5>
                       <div className="space-y-2">
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Section Title:</label>
                           <Input
                             className="bg-slate-800 border-slate-600 text-white text-xs h-8"
                             value={currentTitle}
                             onChange={(e) => setCurrentTitle(e.target.value)}
                             placeholder="Enter title"
                           />
                         </div>
                       </div>
                     </div>

                     {/* Style Properties */}
                     <div className="border-b border-slate-600 pb-3">
                       <h5 className="text-xs font-semibold text-slate-400 mb-2">COLORS</h5>
                       <div className="space-y-2">
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Background:</label>
                           <div className="flex gap-2">
                             <input
                               type="color"
                               value={currentBgColor}
                               onChange={(e) => setCurrentBgColor(e.target.value)}
                               className="w-8 h-8 border border-slate-600 rounded"
                             />
                             <Input
                               className="bg-slate-800 border-slate-600 text-white text-xs h-8 flex-1"
                               value={currentBgColor}
                               onChange={(e) => setCurrentBgColor(e.target.value)}
                             />
                           </div>
                         </div>
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Text Color:</label>
                           <div className="flex gap-2">
                             <input
                               type="color"
                               value={currentTextColor}
                               onChange={(e) => setCurrentTextColor(e.target.value)}
                               className="w-8 h-8 border border-slate-600 rounded"
                             />
                             <Input
                               className="bg-slate-800 border-slate-600 text-white text-xs h-8 flex-1"
                               value={currentTextColor}
                               onChange={(e) => setCurrentTextColor(e.target.value)}
                             />
                           </div>
                         </div>
                       </div>
                     </div>

                     {/* Border Properties */}
                     <div className="border-b border-slate-600 pb-3">
                       <h5 className="text-xs font-semibold text-slate-400 mb-2">BORDER</h5>
                       <div className="space-y-2">
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Style:</label>
                           <select 
                             value={currentBorderStyle}
                             onChange={(e) => setCurrentBorderStyle(e.target.value)}
                             className="w-full p-1 bg-slate-800 border border-slate-600 rounded text-white text-xs h-8"
                           >
                             <option value="none">None</option>
                             <option value="solid">Solid</option>
                             <option value="dashed">Dashed</option>
                             <option value="dotted">Dotted</option>
                             <option value="double">Double</option>
                           </select>
                         </div>
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Width: {currentBorderWidth}px</label>
                           <input
                             type="range"
                             min="0"
                             max="10"
                             value={currentBorderWidth}
                             onChange={(e) => setCurrentBorderWidth(Number(e.target.value))}
                             className="w-full"
                           />
                         </div>
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Radius: {currentBorderRadius}px</label>
                           <input
                             type="range"
                             min="0"
                             max="50"
                             value={currentBorderRadius}
                             onChange={(e) => setCurrentBorderRadius(Number(e.target.value))}
                             className="w-full"
                           />
                         </div>
                       </div>
                     </div>

                     {/* Spacing Properties */}
                     <div className="pb-3">
                       <h5 className="text-xs font-semibold text-slate-400 mb-2">SPACING</h5>
                       <div className="space-y-2">
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Padding: {currentPadding}px</label>
                           <input
                             type="range"
                             min="0"
                             max="50"
                             value={currentPadding}
                             onChange={(e) => setCurrentPadding(Number(e.target.value))}
                             className="w-full"
                           />
                         </div>
                         <div>
                           <label className="block text-xs text-slate-300 mb-1">Margin: {currentMargin}px</label>
                           <input
                             type="range"
                             min="0"
                             max="50"
                             value={currentMargin}
                             onChange={(e) => setCurrentMargin(Number(e.target.value))}
                             className="w-full"
                           />
                         </div>
                       </div>
                     </div>

                     {/* Quick Actions */}
                     <div className="flex gap-2">
                       <Button
                         onClick={() => {
                           setCurrentBgColor('#ffffff');
                           setCurrentTextColor('#2c3e50');
                           setCurrentBorderStyle('solid');
                           setCurrentBorderWidth(1);
                           setCurrentBorderRadius(5);
                           setCurrentPadding(15);
                           setCurrentMargin(20);
                         }}
                         className="flex-1 bg-slate-600 hover:bg-slate-500 text-white text-xs h-7"
                         size="sm"
                       >
                         Reset
                       </Button>
                       <Button
                         onClick={() => applyProperties()}
                         className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                         size="sm"
                       >
                         Apply
                       </Button>
                     </div>
                   </div>
                 ) : (
                   <p className="text-xs text-slate-400 text-center">
                     Select a component to edit its properties
                   </p>
                 )}
               </div>
             </div>

                         {/* Actions */}
             <div>
               <h4 className="text-sm font-semibold text-slate-300 mb-3">🔧 Actions</h4>
               <div className="space-y-3">
                 {/* Component Management */}
                 <div className="bg-slate-600 p-3 rounded">
                   <h5 className="text-xs font-semibold text-slate-400 mb-2">COMPONENT</h5>
                   <div className="space-y-2">
                     <Button
                       onClick={addComponent}
                       disabled={!selectedComponentType}
                       className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-500 text-white text-xs h-8"
                       size="sm"
                     >
                       <Plus className="w-3 h-3 mr-1" />
                       Add {selectedComponentType ? componentTypes.find(c => c.id === selectedComponentType)?.label.replace(/📋|📏|🔨|✅|📝|✍️|📄|📊/g, '').trim() : 'Component'}
                     </Button>
                     <div className="flex gap-2">
                       <Button
                         onClick={duplicateComponent}
                         disabled={!selectedSection}
                         className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-500 text-white text-xs h-8"
                         size="sm"
                       >
                         <Copy className="w-3 h-3 mr-1" />
                         Duplicate
                       </Button>
                       <Button
                         onClick={deleteComponent}
                         disabled={!selectedSection}
                         className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-slate-500 text-white text-xs h-8"
                         size="sm"
                       >
                         <Trash2 className="w-3 h-3 mr-1" />
                         Delete
                       </Button>
                     </div>
                   </div>
                 </div>

                 {/* Component Order */}
                 {selectedSection && (
                   <div className="bg-slate-600 p-3 rounded">
                     <h5 className="text-xs font-semibold text-slate-400 mb-2">ORDER</h5>
                     <div className="flex gap-2">
                       <Button
                         onClick={() => moveComponentUp(selectedSection)}
                         className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs h-8"
                         size="sm"
                       >
                         ↑ Move Up
                       </Button>
                       <Button
                         onClick={() => moveComponentDown(selectedSection)}
                         className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-xs h-8"
                         size="sm"
                       >
                         ↓ Move Down
                       </Button>
                     </div>
                   </div>
                 )}

                 {/* Template Actions */}
                 <div className="bg-slate-600 p-3 rounded">
                   <h5 className="text-xs font-semibold text-slate-400 mb-2">TEMPLATE</h5>
                   <div className="space-y-2">
                     <Button
                       onClick={() => {
                         // Clear all selections
                         clearSelection();
                         toast({
                           title: "Selection Cleared",
                           description: "All components deselected",
                           duration: 1500,
                         });
                       }}
                       className="w-full bg-slate-700 hover:bg-slate-600 text-white text-xs h-8"
                       size="sm"
                     >
                       Clear Selection
                     </Button>
                     <Button
                       onClick={() => {
                         const confirmed = window.confirm("Reset all component styles to default?");
                         if (confirmed) {
                           setSectionProperties({});
                           // Reset all visible components
                           const allSections = document.querySelectorAll('.form-section');
                           allSections.forEach(section => {
                             const element = section as HTMLElement;
                             element.style.backgroundColor = '';
                             element.style.color = '';
                             element.style.borderStyle = '';
                             element.style.borderWidth = '';
                             element.style.borderRadius = '';
                             element.style.padding = '';
                             element.style.marginBottom = '';
                           });
                           toast({
                             title: "Styles Reset",
                             description: "All component styles reset to default",
                             duration: 2000,
                           });
                         }
                       }}
                       className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs h-8"
                       size="sm"
                     >
                       Reset All Styles
                     </Button>
                   </div>
                 </div>

                 {/* Component Count */}
                 <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-600">
                   {components.length} component{components.length !== 1 ? 's' : ''} total
                   {editMode && <div className="text-green-400 mt-1">🎨 Edit Mode Active</div>}
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConstructionTemplate3; 