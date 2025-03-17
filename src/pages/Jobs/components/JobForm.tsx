
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { JobTemplate } from "@/types/job";
import { FormHeader } from "./form-sections/FormHeader";
import { FormFooter } from "./form-sections/FormFooter";
import { MainFormFields } from "./form-sections/MainFormFields";
import { JobDescription } from "./form-sections/JobDescription";
import { useJobFormSubmit } from "../hooks/useJobFormSubmit";

interface JobFormProps {
  onShowTemplateSearch: () => void;
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
  title: string;
  setTitle: (title: string) => void;
  customer: string;
  setCustomer: (customer: string) => void;
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
  saveJobToDatabase: (jobData: any) => Promise<boolean>;
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
  const { validateJobForm, prepareJobData, handleSuccessfulSubmit } = useJobFormSubmit();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateJobForm(jobNumber, title, customer, type, date, dateUndecided)) {
      return;
    }

    const newJob = prepareJobData(
      jobNumber, 
      title, 
      customer, 
      description, 
      type, 
      date, 
      dateUndecided, 
      team
    );
    
    const success = await saveJobToDatabase(newJob);
    
    if (success) {
      handleSuccessfulSubmit();
    }
  };

  const applyTemplate = (template: JobTemplate) => {
    setTitle(template.title);
    setDescription(template.description);
    setType(template.type);
    
    toast({
      title: "Template Applied",
      description: `Applied template: ${template.title}`
    });
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <FormHeader />
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 bg-slate-100">
          <MainFormFields
            jobNumber={jobNumber}
            setJobNumber={setJobNumber}
            title={title}
            setTitle={setTitle}
            customer={customer}
            setCustomer={setCustomer}
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
          
          <JobDescription description={description} setDescription={setDescription} />
        </CardContent>
        
        <FormFooter isSaving={isSaving} onSubmit={handleSubmit} />
      </form>
    </Card>
  );
}
