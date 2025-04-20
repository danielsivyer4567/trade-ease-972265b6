import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock, CheckCircle } from "lucide-react";

const RecentActivity = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="p-6 bg-slate-50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          Finished Jobs
        </h2>
        <Button 
          variant="default" 
          size="sm" 
          onClick={() => navigate("/jobs")} 
          className="bg-primary hover:bg-primary/90"
        >
          View All
        </Button>
      </div>
      <div className="space-y-4">
        <div className="border-b pb-2">
          <p className="font-medium">Water Heater Installation</p>
          <p className="text-sm text-gray-500">Completed by Team Red</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">Electrical Panel Upgrade</p>
          <p className="text-sm text-gray-500">Completed by Team Blue</p>
        </div>
        <div className="border-b pb-2">
          <p className="font-medium">HVAC Maintenance</p>
          <p className="text-sm text-gray-500">Completed yesterday</p>
        </div>
      </div>
    </Card>
  );
};

export default RecentActivity;