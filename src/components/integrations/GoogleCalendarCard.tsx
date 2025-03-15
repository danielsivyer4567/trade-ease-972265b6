
import { useState } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export function GoogleCalendarCard() {
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  // Function to handle Google Calendar connection
  const handleConnectCalendar = () => {
    setIsConnecting(true);
    
    // For demo purposes, we'll simulate a connection and redirect to a success page
    // In a real implementation, we would authenticate with Google OAuth here
    setTimeout(() => {
      setIsConnecting(false);
      toast.success("Connected to Google Calendar successfully");
      navigate("/calendar/sync?platform=Google Calendar&team=All Teams&action=sync");
    }, 1500);
  };

  return (
    <Card className="glass-card">
      <CardHeader className="bg-slate-200">
        <div className="flex items-center gap-2">
          <div className="bg-blue-100 p-2 rounded-full">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <CardTitle>Google Calendar</CardTitle>
        </div>
        <CardDescription>
          Sync your team's schedule with Google Calendar
        </CardDescription>
      </CardHeader>
      <CardContent className="bg-slate-200">
        <p className="text-sm text-gray-600 mb-4">
          Connect your Google Calendar to automatically sync team schedules, 
          jobs, and appointments. All changes will be reflected in both systems.
        </p>
        <Button 
          className="w-full flex items-center justify-center gap-1 bg-slate-400 hover:bg-slate-300"
          onClick={handleConnectCalendar}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting..." : "Connect to Google Calendar"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
}
