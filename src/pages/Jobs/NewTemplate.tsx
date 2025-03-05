
import { AppLayout } from "@/components/ui/AppLayout";
import { NewTemplateForm } from "./components/templates/NewTemplateForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function NewTemplate() {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-2 rounded-md border border-gray-300" 
            onClick={() => navigate("/jobs")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Job Template</h1>
        </div>
        <NewTemplateForm />
      </div>
    </AppLayout>
  );
}
