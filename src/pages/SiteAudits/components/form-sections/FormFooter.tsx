import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Save, X } from "lucide-react";

interface FormFooterProps {
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormFooter({ isSaving, onSubmit }: FormFooterProps) {
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex justify-between py-6 px-6">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/jobs")} 
        className="border-gray-300 text-gray-700 hover:bg-gray-100"
        disabled={isSaving}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-blue-600 hover:bg-blue-700 text-white"
        disabled={isSaving}
        onClick={onSubmit}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save className="h-4 w-4 mr-2" />
            Create Job
          </>
        )}
      </Button>
    </CardFooter>
  );
}
