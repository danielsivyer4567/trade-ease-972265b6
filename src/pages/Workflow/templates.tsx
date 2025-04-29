import { WorkflowTemplateSelector } from '@/components/workflow/WorkflowTemplateSelector';
import { WorkflowTemplate } from '@/types/workflow';
import { AppLayout } from "@/components/ui/AppLayout";
import { useNavigate } from "react-router-dom";

export default function WorkflowTemplatesPage() {
  const navigate = useNavigate();

  const handleTemplateSelect = (template: WorkflowTemplate | null) => {
    if (template) {
      // Navigate to workflow editor with template data
      navigate('/workflow', { state: { template } });
    } else {
      // Navigate to empty workflow
      navigate('/workflow');
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-background">
        <WorkflowTemplateSelector onSelect={handleTemplateSelect} />
      </div>
    </AppLayout>
  );
} 