import { useState } from 'react';
import { FileText, User, List, Hash, Building2 } from 'lucide-react';

interface TemplateComponent {
  id: string;
  type: string;
  title: string;
  order: number;
}

interface EditModeHookProps {
  defaultComponents?: TemplateComponent[];
}

export const useTemplateEditor = ({
  defaultComponents = [
    { id: 'header', type: 'header', title: '📋 Header Information', order: 0 },
    { id: 'client-info', type: 'client-info', title: '👤 Client Information', order: 1 },
    { id: 'items-table', type: 'items-table', title: '📊 Items Table', order: 2 },
    { id: 'totals', type: 'totals', title: '💰 Totals', order: 3 },
    { id: 'notes', type: 'notes', title: '📝 Notes', order: 4 }
  ]
}: EditModeHookProps = {}) => {
  // Edit mode states
  const [editMode, setEditMode] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedComponentType, setSelectedComponentType] = useState<string | null>(null);
  const [components, setComponents] = useState<TemplateComponent[]>(defaultComponents);

  // Property states for real-time editing
  const [currentTitle, setCurrentTitle] = useState('');
  const [currentBgColor, setCurrentBgColor] = useState('#ffffff');
  const [currentTextColor, setCurrentTextColor] = useState('#2c3e50');
  const [currentBorderStyle, setCurrentBorderStyle] = useState('solid');
  const [currentBorderWidth, setCurrentBorderWidth] = useState(1);
  const [currentBorderRadius, setCurrentBorderRadius] = useState(5);
  const [currentPadding, setCurrentPadding] = useState(15);
  const [currentMargin, setCurrentMargin] = useState(20);

  // Background image states
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [backgroundImageName, setBackgroundImageName] = useState<string>('');
  const [backgroundOpacity, setBackgroundOpacity] = useState(30);
  const [imageSize, setImageSize] = useState(100);
  const [horizontalPosition, setHorizontalPosition] = useState(50);
  const [verticalPosition, setVerticalPosition] = useState(50);
  const [fitMode, setFitMode] = useState('cover');
  const [imageControls, setImageControls] = useState({
    size: 100,
    posX: 50,
    posY: 50,
    fitMode: 'contain'
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  const componentTypes = [
    { id: 'header', label: '📋 Header', icon: FileText },
    { id: 'client-info', label: '👤 Client Info', icon: User },
    { id: 'items-table', label: '📊 Items Table', icon: List },
    { id: 'totals', label: '💰 Totals', icon: Hash },
    { id: 'notes', label: '📝 Notes', icon: FileText },
    { id: 'project-details', label: '📁 Project Details', icon: FileText },
    { id: 'company-client-info', label: '👤 Company & Client Info', icon: User },
    { id: 'services-table', label: '⚒️ Services Table', icon: List },
    { id: 'terms', label: '📝 Terms & Conditions', icon: FileText },
    { id: 'footer', label: '📄 Footer', icon: FileText },
  ];

  // Edit mode functions
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
    const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`) as HTMLElement;
    if (sectionElement) {
      const sectionType = sectionElement.getAttribute('data-section-type');
      setSelectedComponentType(sectionType);
      const titleElement = sectionElement.querySelector('h3') || sectionElement.querySelector('.section-title');
      if (titleElement) {
        setCurrentTitle(titleElement.textContent || '');
      }
    }
  };

  const selectComponentType = (componentType: string) => {
    setSelectedComponentType(componentType);
    const existingSections = document.querySelectorAll(`[data-section-type="${componentType}"]`);
    if (existingSections.length > 0) {
      const firstSection = existingSections[0];
      const sectionId = firstSection.getAttribute('data-section-id');
      setSelectedSection(sectionId);
    }
  };

  // Background image functions
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImage(e.target?.result as string);
        setBackgroundImageName(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetImagePosition = () => {
    setImageSize(100);
    setHorizontalPosition(50);
    setVerticalPosition(50);
    setFitMode('cover');
  };

  const removeBackgroundImage = () => {
    setBackgroundImage(null);
    setBackgroundImageName('');
    resetImagePosition();
  };

  // Dark mode toggle function
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  // Utility functions for applying edit mode classes
  const getContainerClasses = (baseClasses: string = '') => {
    return `${baseClasses} ${editMode ? 'edit-mode' : ''} ${showSidebar ? 'sidebar-open' : ''} ${isDarkMode ? 'dark' : ''}`;
  };

  const getSectionClasses = (baseClasses: string, sectionId: string) => {
    return `${baseClasses} form-section ${selectedSection === sectionId ? 'selected' : ''}`;
  };

  const getSectionProps = (sectionId: string, sectionType: string) => ({
    'data-section-id': sectionId,
    'data-section-type': sectionType,
    onClick: () => editMode && selectSection(sectionId)
  });

  const getBackgroundImageStyles = () => {
    if (!backgroundImage) return {};
    
    return {
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: fitMode === 'none' ? `${imageSize}%` : fitMode,
      backgroundPosition: `${horizontalPosition}% ${verticalPosition}%`,
      backgroundRepeat: fitMode === 'repeat' ? 'repeat' : 'no-repeat',
      opacity: backgroundOpacity / 100,
      position: 'relative' as const,
    };
  };

  const getBackgroundOverlayStyles = () => {
    if (!backgroundImage) return {};
    
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: fitMode === 'none' ? `${imageSize}%` : fitMode,
      backgroundPosition: `${horizontalPosition}% ${verticalPosition}%`,
      backgroundRepeat: fitMode === 'repeat' ? 'repeat' : 'no-repeat',
      opacity: backgroundOpacity / 100,
      pointerEvents: 'none' as const,
      zIndex: -1,
    };
  };

  return {
    // States
    editMode,
    showSidebar,
    selectedSection,
    selectedComponentType,
    components,
    currentTitle,
    currentBgColor,
    currentTextColor,
    currentBorderStyle,
    currentBorderWidth,
    currentBorderRadius,
    currentPadding,
    currentMargin,
    componentTypes,

    // Background image states
    backgroundImage,
    backgroundImageName,
    backgroundOpacity,
    imageSize,
    horizontalPosition,
    verticalPosition,
    fitMode,
    imageControls,

    // Dark mode state
    isDarkMode,

    // Functions
    toggleEditMode,
    toggleSidebar,
    clearSelection,
    selectSection,
    selectComponentType,
    toggleDarkMode,

    // Background image functions
    handleImageUpload,
    resetImagePosition,
    removeBackgroundImage,

    // Setters
    setCurrentTitle,
    setCurrentBgColor,
    setCurrentTextColor,
    setCurrentBorderStyle,
    setCurrentBorderWidth,
    setCurrentBorderRadius,
    setCurrentPadding,
    setCurrentMargin,

    // Background image setters
    setBackgroundImage,
    setBackgroundImageName,
    setBackgroundOpacity,
    setImageSize,
    setHorizontalPosition,
    setVerticalPosition,
    setFitMode,
    setImageControls,
    setIsDarkMode,

    // Utility functions
    getContainerClasses,
    getSectionClasses,
    getSectionProps,
    getBackgroundImageStyles,
    getBackgroundOverlayStyles
  };
}; 