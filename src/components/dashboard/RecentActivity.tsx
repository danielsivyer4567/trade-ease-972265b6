import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
const RecentActivity = () => {
  const navigate = useNavigate();
  return <Card className="p-6 bg-slate-200">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Clock className="mr-2 h-5 w-5 text-blue-500" />
        Recent Activity
      </h2>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <p className="font-medium">Water Heater Installation</p>
          <p className="text-sm text-gray-500">Completed by Team Red</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">Electrical Panel Upgrade</p>
          <p className="text-sm text-gray-500">In progress - Team Blue</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">HVAC Maintenance</p>
          <p className="text-sm text-gray-500">Scheduled for tomorrow</p>
        </div>
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={() => navigate("/jobs")} className="bg-slate-400 hover:bg-slate-300">
            View All
          </Button>
        </div>
      </div>
    </Card>;
};
export default RecentActivity;