
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

export function useJobFormSubmit() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateJobForm = (
    jobNumber: string, 
    title: string, 
    customer: string, 
    type: string, 
    date: string, 
    dateUndecided: boolean
  ) => {
    if (!jobNumber || !title || !customer || !type || (!date && !dateUndecided)) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  const prepareJobData = (
    jobNumber: string,
    title: string,
    customer: string,
    description: string,
    type: string,
    date: string,
    dateUndecided: boolean,
    team: string
  ) => {
    return {
      jobNumber,
      title,
      customer,
      description,
      type,
      date: dateUndecided ? "Yet to be decided" : date,
      date_undecided: dateUndecided,
      status: "ready",
      location: [151.2093, -33.8688],
      assigned_team: team !== "tba" ? team : null
    };
  };

  const handleSuccessfulSubmit = () => {
    toast({
      title: "Job Created",
      description: `Job has been created successfully`
    });
    navigate("/jobs");
  };

  return {
    validateJobForm,
    prepareJobData,
    handleSuccessfulSubmit
  };
}
