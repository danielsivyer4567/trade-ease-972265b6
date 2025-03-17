
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { useNavigate } from "react-router-dom";
import { JobForm } from "./components/JobForm";
import { TemplateSearch } from "./components/TemplateSearch";
import { LoadingState } from "./components/LoadingState";
import { JobCreationHeader } from "./components/JobCreationHeader";
import { useToast } from "@/hooks/use-toast";
import { JobTemplate } from "@/types/job";
import { useAuthentication } from "./hooks/useAuthentication";
import { useJobTemplates } from "./hooks/useJobTemplates";
import { useJobSave } from "./hooks/useJobSave";

export default function NewJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isCheckingAuth } = useAuthentication();
  const { allTemplates } = useJobTemplates();
  const { saveJobToDatabase, isSaving } = useJobSave();
  
  // State for the new job form
  const [jobNumber, setJobNumber] = useState("");
  const [title, setTitle] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [team, setTeam] = useState("tba"); // default to TBA
  const [showTemplateSearch, setShowTemplateSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleTemplateSelection = (template: JobTemplate) => {
    // Fill form with template data
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    
    toast({
      title: "Template Applied",
      description: `Template "${template.title}" has been applied to your job`
    });
    
    setShowTemplateSearch(false);
  };

  if (isCheckingAuth) {
    return <LoadingState />;
  }

  // Only render the form if authenticated
  if (!isAuthenticated) {
    return null; // Will redirect via useEffect in useAuthentication
  }

  return (
    <AppLayout>
      <div className="p-6">
        <JobCreationHeader />
        
        {showTemplateSearch ? (
          <TemplateSearch 
            templates={allTemplates}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onTemplateSelected={handleTemplateSelection}
            onClose={() => setShowTemplateSearch(false)}
          />
        ) : (
          <JobForm
            onShowTemplateSearch={() => setShowTemplateSearch(true)}
            jobNumber={jobNumber}
            setJobNumber={setJobNumber}
            title={title}
            setTitle={setTitle}
            customer={customer}
            setCustomer={setCustomer}
            description={description}
            setDescription={setDescription}
            type={type}
            setType={setType}
            date={date}
            setDate={setDate}
            dateUndecided={dateUndecided}
            setDateUndecided={setDateUndecided}
            team={team}
            setTeam={setTeam}
            saveJobToDatabase={saveJobToDatabase}
            isSaving={isSaving}
          />
        )}
      </div>
    </AppLayout>
  );
}
