import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brush } from "lucide-react";
const CleaningRequiredJobs = () => {
  const navigate = useNavigate();
  return <Card className="p-6 bg-slate-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Brush className="mr-2 h-5 w-5 text-orange-500" />
        Cleaning Required Jobs
      </h2>
      <div className="space-y-4">
        <div className="border-b pb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">HVAC Installation - Smith Residence</p>
            <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
          </div>
          <Button size="sm" variant="outline" className="border-black-500 text-slate-950 bg-slate-400 hover:bg-slate-300">
            Details
          </Button>
        </div>
        <div className="border-b pb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">Bathroom Remodel - Johnson Property</p>
            <p className="text-sm text-gray-500">Assigned to Paul Finch</p>
          </div>
          <Button size="sm" variant="outline" className="border-black-500 text-gray-950 bg-slate-400 hover:bg-slate-300">
            Details
          </Button>
        </div>
        <div className="flex justify-end mt-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/jobs")} className="text-gray-950 bg-slate-400 hover:bg-slate-300">
            View All Jobs
          </Button>
        </div>
      </div>
    </Card>;
};
export default CleaningRequiredJobs;