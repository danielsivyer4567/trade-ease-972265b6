
import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { JobForm } from "./components/JobForm";
import { TemplateLibrary } from "./components/TemplateLibrary";

export default function NewJob() {
  const navigate = useNavigate();
  
  // State for the new job form
  const [jobNumber, setJobNumber] = useState("");
  const [title, setTitle] = useState("");
  const [customer, setCustomer] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [dateUndecided, setDateUndecided] = useState(false);
  const [showTemplateSearch, setShowTemplateSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Mock templates for the template search
  const templates = [
    {
      id: "1",
      title: "Basic Plumbing Fix",
      description: "Standard plumbing repair service",
      type: "Plumbing",
      estimatedDuration: 2,
      price: 150,
      materials: ["Pipes", "Fixtures", "Sealant"],
      category: "Residential"
    },
    {
      id: "2",
      title: "Electrical Wiring",
      description: "Basic electrical wiring service",
      type: "Electrical",
      estimatedDuration: 3,
      price: 200,
      materials: ["Wires", "Switches", "Junction boxes"],
      category: "Commercial"
    },
    {
      id: "3",
      title: "Bathroom Renovation",
      description: "Complete bathroom renovation",
      type: "Renovation",
      estimatedDuration: 40,
      price: 5000,
      materials: ["Tiles", "Fixtures", "Pipes", "Paint"],
      category: "Residential"
    }
  ];

  const handleTemplateSelection = (template) => {
    // Fill form with template data
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    setShowTemplateSearch(false);
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
              templates={templates} 
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
          />
        )}
      </div>
    </AppLayout>
  );
}
