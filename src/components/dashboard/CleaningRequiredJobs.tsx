
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Brush } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const CleaningRequiredJobs = () => {
  const navigate = useNavigate();
  return <GlassCard className="p-6">
    <div className="flex justify-between"><h2 className="text-xl font-semibold mb-4 flex items-center">
      <Brush className="mr-2 h-5 w-5 text-orange-500" />
      Cleaning Required Jobs
    </h2>
      <Button variant="default" size="sm" onClick={() => navigate("/jobs")} className="">
        View All Jobs
      </Button></div>
    <div className="space-y-4 pt-3">
      <div className="border-b pb-2 flex justify-between items-center">
        <div>
          <p className="font-medium">HVAC Installation - Smith Residence</p>
          <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
        </div>
        <Button size="sm" variant="outline" className="">
          View Details
        </Button>
      </div>
      <div className="border-b pb-2 flex justify-between items-center">
        <div>
          <p className="font-medium">Bathroom Remodel - Johnson Property</p>
          <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
        </div>
        <Button size="sm" variant="outline" className="">
          View Details
        </Button>
      </div>

    </div>
  </GlassCard>;
};
export default CleaningRequiredJobs;
