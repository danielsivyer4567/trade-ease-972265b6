
import { useState, useEffect } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobForm } from "./components/JobForm";
import { TemplateLibrary } from "./components/TemplateLibrary";
import { useToast } from "@/hooks/use-toast";
import { JobTemplate } from "@/types/job";
import { QUICK_TEMPLATES } from "./constants/templates";
import { supabase } from "@/integrations/supabase/client";

export default function NewJob() {
  const navigate = useNavigate();
  const { toast } = useToast();
  
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
  const [allTemplates, setAllTemplates] = useState<JobTemplate[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Initialize with both quick templates and user templates
  useEffect(() => {
    // Start with the quick templates
    const templates = [...QUICK_TEMPLATES];
    
    // Add user templates if they exist
    try {
      const savedTemplates = localStorage.getItem('userJobTemplates');
      if (savedTemplates) {
        const parsedTemplates = JSON.parse(savedTemplates);
        templates.push(...parsedTemplates);
      }
    } catch (err) {
      console.error("Error loading templates:", err);
    }
    
    setAllTemplates(templates);
  }, []);

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
  
  const saveJobToDatabase = async (jobData) => {
    try {
      setIsSaving(true);
      
      const { data: session, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session?.session) {
        console.error("Error getting session:", sessionError);
        toast({
          title: "Authentication Error",
          description: "You need to be logged in to create jobs.",
          variant: "destructive"
        });
        return false;
      }
      
      const { data, error } = await supabase
        .from('jobs')
        .insert({
          ...jobData,
          user_id: session.session.user.id
        })
        .select();
        
      if (error) {
        console.error("Error saving job:", error);
        toast({
          title: "Error",
          description: "Failed to save job to database",
          variant: "destructive"
        });
        return false;
      }
      
      console.log("Job saved successfully:", data);
      return true;
    } catch (error) {
      console.error("Exception saving job:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => navigate("/jobs")} 
            className="mr-2 rounded-md border border-gray-300 bg-slate-400 hover:bg-slate-300"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-3xl font-bold">Create New Job</h1>
        </div>
        
        {showTemplateSearch ? (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Select a Template</h2>
              <Button variant="outline" onClick={() => setShowTemplateSearch(false)}>
                Back to Form
              </Button>
            </div>
            <TemplateLibrary 
              templates={allTemplates} 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery} 
              onAttachToJob={handleTemplateSelection} 
            />
          </div>
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
