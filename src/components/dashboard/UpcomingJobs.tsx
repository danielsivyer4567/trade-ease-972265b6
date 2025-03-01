
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";

const UpcomingJobs = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Calendar className="mr-2 h-5 w-5 text-green-500" />
        Upcoming Jobs
      </h2>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <p className="font-medium">Bathroom Renovation</p>
          <p className="text-sm text-gray-500">Tomorrow, 9:00 AM</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">Kitchen Plumbing</p>
          <p className="text-sm text-gray-500">Friday, 11:30 AM</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">Roof Repair</p>
          <p className="text-sm text-gray-500">Saturday, 10:00 AM</p>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate("/calendar")}>
            View Calendar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default UpcomingJobs;
