import React from "react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export function FormHeader() {
  return (
    <CardHeader className="bg-transparent py-6">
      <div className="flex items-center space-x-2">
        <div className="p-2 rounded-full bg-white/20">
          <Briefcase className="h-6 w-6 text-white" />
        </div>
        <CardTitle className="text-white text-xl">Job Details</CardTitle>
      </div>
      <p className="text-white/80 mt-2 text-sm">Create a new job with the required information below</p>
    </CardHeader>
  );
}
