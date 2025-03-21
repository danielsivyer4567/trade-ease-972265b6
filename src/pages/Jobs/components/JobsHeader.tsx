
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface JobsHeaderProps {
  navigateTo?: string;
}

export const JobsHeader = ({ navigateTo = "/jobs" }: JobsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center gap-4 p-4 sticky top-0 z-50 bg-white border-b">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(navigateTo)}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </Button>
    </div>
  );
};
