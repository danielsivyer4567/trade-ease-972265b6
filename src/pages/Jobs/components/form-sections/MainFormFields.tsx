
import React from "react";
import { JobNumberGenerator } from "../JobNumberGenerator";
import { JobDateSelector } from "../JobDateSelector";
import { CustomerDetails } from "./CustomerDetails";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { JobTypeSelector } from "./JobTypeSelector";
import { TeamSelector } from "./TeamSelector";
import { TemplateSelector } from "./TemplateSelector";
import { JobTemplate } from "@/types/job";

interface MainFormFieldsProps {
  jobNumber: string;
  setJobNumber: (jobNumber: string) => void;
  title: string;
  setTitle: (title: string) => void;
  customer: string;
  setCustomer: (customer: string) => void;
  type: string;
  setType: (type: string) => void;
  date: string;
  setDate: (date: string) => void;
  dateUndecided: boolean;
  setDateUndecided: (undecided: boolean) => void;
  team: string;
  setTeam: (team: string) => void;
  onShowTemplateSearch: () => void;
  applyTemplate: (template: JobTemplate) => void;
}

export function MainFormFields({
  jobNumber,
  setJobNumber,
  title,
  setTitle,
  customer,
  setCustomer,
  type,
  setType,
  date,
  setDate,
  dateUndecided,
  setDateUndecided,
  team,
  setTeam,
  onShowTemplateSearch,
  applyTemplate
}: MainFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <JobNumberGenerator jobNumber={jobNumber} setJobNumber={setJobNumber} />
      
      <JobDateSelector 
        date={date} 
        setDate={setDate} 
        dateUndecided={dateUndecided} 
        setDateUndecided={setDateUndecided} 
      />
      
      <CustomerDetails customer={customer} setCustomer={setCustomer} />
      
      <div className="space-y-2">
        <Label htmlFor="title">Job Title *</Label>
        <Input 
          id="title" 
          value={title} 
          onChange={e => setTitle(e.target.value)} 
          placeholder="e.g., Kitchen Renovation" 
          required 
        />
      </div>
      
      <JobTypeSelector type={type} setType={setType} />
      
      <TeamSelector team={team} setTeam={setTeam} />
      
      <TemplateSelector 
        onShowTemplateSearch={onShowTemplateSearch} 
        applyTemplate={applyTemplate} 
      />
    </div>
  );
}
