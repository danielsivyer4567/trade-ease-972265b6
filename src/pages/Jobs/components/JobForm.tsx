import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { JobTemplate } from "@/types/job";
import { FormHeader } from "./form-sections/FormHeader";
import { FormFooter } from "./form-sections/FormFooter";
import { MainFormFields } from "./form-sections/MainFormFields";
import { JobDescription } from "./form-sections/JobDescription";
import { JobDocumentation } from "./form-sections/JobDocumentation";
import { JobStreetView } from "@/components/JobStreetView";
import { geocodingService } from "@/services/GeocodingService";

interface JobFormProps {
  onShowTemplateSearch: () => void;
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
  title: string;
  setTitle: (title: string) => void;
  customer: string;
  setCustomer: (customer: string) => void;
  address: string;
  setAddress: (address: string) => void;
  city: string;
  setCity: (city: string) => void;
  state: string;
  setState: (state: string) => void;
  zipCode: string;
  setZipCode: (zipCode: string) => void;
  description: string;
  setDescription: (description: string) => void;
  type: string;
  setType: (type: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateUndecided: boolean;
  setDateUndecided: (undecided: boolean) => void;
  team: string;
  setTeam: (team: string) => void;
  saveJobToDatabase: (jobData: any) => Promise<{success: boolean, data: any}>;
  isSaving: boolean;
}

export function JobForm({
  onShowTemplateSearch,
  jobNumber,
  setJobNumber,
  title,
  setTitle,
  customer,
  setCustomer,
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  zipCode,
  setZipCode,
  description,
  setDescription,
  type,
  setType,
  date,
  setDate,
  dateUndecided,
  setDateUndecided,
  team,
  setTeam,
  saveJobToDatabase,
  isSaving
}: JobFormProps) {
  const { toast } = useToast();
  const [showStreetView, setShowStreetView] = useState(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const [documentationNotes, setDocumentationNotes] = useState("");

  // Check if we have enough address information to show the street view
  useEffect(() => {
    const hasValidAddress = Boolean(address && (city || state));
    setShowStreetView(hasValidAddress);
  }, [address, city, state]);

  const validateJobForm = (
    jobNumber: string,
    title: string,
    customer: string,
    type: string,
    date: string,
    dateUndecided: boolean
  ) => {
    if (!jobNumber) {
      toast({ title: "Job number is required" });
      return false;
    }
    if (!title) {
      toast({ title: "Job title is required" });
      return false;
    }
    if (!customer) {
      toast({ title: "Customer name is required" });
      return false;
    }
    if (!type) {
      toast({ title: "Job type is required" });
      return false;
    }
    if (!dateUndecided && !date) {
      toast({ title: "Job date is required (or mark as undecided)" });
      return false;
    }
    return true;
  };

  const prepareJobData = async (
    jobNumber: string,
    title: string,
    customer: string,
    description: string,
    type: string,
    date: string,
    dateUndecided: boolean,
    team: string,
    address?: string,
    city?: string,
    state?: string,
    zipCode?: string
  ) => {
    const formattedAddress = [address, city, state, zipCode].filter(Boolean).join(", ");
    let location: [number, number] | null = null;
  
    if (formattedAddress && window.google?.maps?.Geocoder) {
      try {
        const geocoder = new window.google.maps.Geocoder();
        const results = await new Promise<google.maps.GeocoderResult[]>((resolve, reject) => {
          geocoder.geocode({ address: formattedAddress }, (results, status) => {
            if (status === "OK" && results[0]) {
              resolve(results);
            } else {
              reject(`Geocoding failed: ${status}`);
            }
          });
        });
  
        const loc = results[0].geometry.location;
        location = [loc.lng(), loc.lat()];
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    }
  
    return {
      job_number: jobNumber,
      title,
      customer,
      description,
      type,
      date: dateUndecided ? "TBD" : date,
      assigned_team: team,
      status: "scheduled",
      address,
      city,
      state,
      zipCode,
      location: location || [151.2093, -33.8688] // fallback: Sydney
    };
  };
  
  

  const handleSuccessfulSubmit = (data: any) => {
    toast({
      title: "Job Created",
      description: `Job ${data.job_number} has been created successfully`
    });
    
    // Redirect to the job detail page or jobs list
    window.location.href = `/jobs/${data.id}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJobForm(jobNumber, title, customer, type, date, dateUndecided)) {
      return;
    }

    const jobData = await prepareJobData(
      jobNumber, 
      title, 
      customer, 
      description, 
      type, 
      date, 
      dateUndecided, 
      team,
      address,
      city,
      state,
      zipCode
    );
    
    const { success, data } = await saveJobToDatabase(jobData);
    
    if (success && data) {
      handleSuccessfulSubmit(data);
    }
  };

  // Apply a template to the form
  const applyTemplate = (template: JobTemplate) => {
    if (template.title) setTitle(template.title);
    if (template.description) setDescription(template.description);
    if (template.type) setType(template.type);
    
    toast({
      title: "Template Applied",
      description: `Template "${template.title}" has been applied to your job`
    });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="border-0 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1">
          <FormHeader />
        </div>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="p-0">
            <div className="p-6 space-y-8 bg-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <MainFormFields
                    jobNumber={jobNumber}
                    setJobNumber={setJobNumber}
                    title={title}
                    setTitle={setTitle}
                    customer={customer}
                    setCustomer={setCustomer}
                    setAddress={setAddress}
                    setCity={setCity}
                    setState={setState}
                    setZipCode={setZipCode}
                    type={type}
                    setType={setType}
                    date={date}
                    setDate={setDate}
                    dateUndecided={dateUndecided}
                    setDateUndecided={setDateUndecided}
                    team={team}
                    setTeam={setTeam}
                    onShowTemplateSearch={onShowTemplateSearch}
                    applyTemplate={applyTemplate}
                  />
                </div>
                
                <div className="space-y-6">
                  {/* Street View will appear when an address is entered */}
                  <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                    <div className="bg-blue-500 text-white py-2 px-4 flex items-center gap-2 text-sm">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                      </svg>
                      Location View
                    </div>
                    
                    {showStreetView ? (
                      <JobStreetView 
                        address={address} 
                        city={city} 
                        state={state} 
                        zipCode={zipCode} 
                        height="350px"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-[350px] bg-gray-50">
                        <div className="text-gray-500 text-center p-4 max-w-xs">
                          <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <p className="text-sm">Enter a complete address in the customer details section to see the street view</p>
                          <p className="text-xs text-gray-400 mt-2">The street view will automatically appear when you provide an address and city/state</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <JobDescription description={description} setDescription={setDescription} />
                </div>
              </div>

              {/* Documentation Section */}
              <div className="border-t pt-8">
                <JobDocumentation
                  documents={documents}
                  setDocuments={setDocuments}
                  notes={documentationNotes}
                  setNotes={setDocumentationNotes}
                />
              </div>
            </div>
            
            <div className="bg-gray-50 border-t">
              <FormFooter isSaving={isSaving} onSubmit={handleSubmit} />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
