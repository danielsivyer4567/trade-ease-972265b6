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
  setAddress: (address: string) => void;
  setCity: (city: string) => void; 
  setState: (state: string) => void;
  setZipCode: (zipCode: string) => void;
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
  setAddress,
  setCity,
  setState,
  setZipCode,
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
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium text-gray-700">Job Title *</Label>
          <Input 
            id="title" 
            value={title} 
            onChange={e => setTitle(e.target.value)} 
            placeholder="e.g., Kitchen Renovation" 
            required 
            className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <JobNumberGenerator jobNumber={jobNumber} setJobNumber={setJobNumber} />
        <JobDateSelector 
          date={date} 
          setDate={setDate} 
          dateUndecided={dateUndecided} 
          setDateUndecided={setDateUndecided} 
        />
      </div>
      
      <CustomerDetails 
        customer={customer} 
        setCustomer={setCustomer} 
        setAddress={setAddress}
        setCity={setCity}
        setState={setState}
        setZipCode={setZipCode}
      />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <JobTypeSelector type={type} setType={setType} />
        <TeamSelector team={team} setTeam={setTeam} />
      </div>
      
      <TemplateSelector 
        onShowTemplateSearch={onShowTemplateSearch} 
        applyTemplate={applyTemplate} 
      />
    </div>
  );
}
