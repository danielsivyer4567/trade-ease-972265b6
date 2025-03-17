
import React from "react";
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface FormFooterProps {
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function FormFooter({ isSaving, onSubmit }: FormFooterProps) {
  const navigate = useNavigate();
  
  return (
    <CardFooter className="flex justify-between">
      <Button 
        type="button" 
        variant="outline" 
        onClick={() => navigate("/jobs")} 
        className="bg-slate-400 hover:bg-slate-300"
        disabled={isSaving}
      >
        Cancel
      </Button>
      <Button 
        type="submit" 
        className="bg-slate-400 hover:bg-slate-300"
        disabled={isSaving}
        onClick={onSubmit}
      >
        {isSaving ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          'Create Job'
        )}
      </Button>
    </CardFooter>
  );
}
