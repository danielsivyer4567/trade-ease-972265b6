import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { LayoutTemplate } from 'lucide-react';

interface TemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: any) => void;
}

export default function TemplateSelector({ isOpen, onClose, onSelectTemplate }: TemplateSelectorProps) {
  const navigate = useNavigate();

  const handleOpenTemplates = () => {
    onClose(); // Close the current dialog
    navigate('/workflow/templates'); // Navigate to the templates page
  };

  return (
    <Button
      variant="outline"
      size="lg"
      className="whitespace-nowrap flex items-center"
      onClick={handleOpenTemplates}
    >
      <LayoutTemplate className="mr-2 h-5 w-5" />
      Browse Templates
    </Button>
  );
} 