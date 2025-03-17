
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";

interface JobsHeaderProps {
  navigateTo?: string | number;
}

export function JobsHeader({ navigateTo = -1 }: JobsHeaderProps) {
  const navigate = useNavigate();

  const handleNavigation = () => {
    if (typeof navigateTo === 'number') {
      navigate(navigateTo);
    } else {
      navigate(navigateTo);
    }
  };

  return (
    <div className="flex items-center gap-4 mb-4 px-4 py-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleNavigation} 
        className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      
      <Button 
        size="sm" 
        variant="default" 
        onClick={() => navigate("/jobs/new")} 
        className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] text-xs px-3 py-1"
      >
        Create New Job
      </Button>
      
      <TabsList className="flex gap-2">
        <TabsTrigger 
          value="unassigned-jobs" 
          className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
        >
          Unassigned Jobs
        </TabsTrigger>
        <TabsTrigger 
          value="job-templates" 
          className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
        >
          Job Templates
        </TabsTrigger>
        <TabsTrigger 
          value="service-reminders" 
          className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
        >
          Service Reminders
        </TabsTrigger>
        <TabsTrigger 
          value="recurring-jobs" 
          className="rounded-lg bg-[#D3E4FD] hover:bg-[#B5D1F8] border-[#A3C0ED] text-[#1E40AF] hover:text-[#1E3A8A] data-[state=active]:bg-[#B5D1F8] data-[state=active]:text-[#1E3A8A] px-3 py-1 text-xs"
        >
          Recurring Jobs
        </TabsTrigger>
      </TabsList>
    </div>
  );
}
