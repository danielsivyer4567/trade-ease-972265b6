
import { useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CalendarProvider, calendarService } from "@/integrations/calendar/CalendarService";

export function GoogleCalendarCard() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [connectionId, setConnectionId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkConnection = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUserId(data.user.id);
        
        // Check if user already has a Google Calendar connection
        const connections = await calendarService.getUserCalendarConnections(data.user.id);
        const googleConnection = connections.find(conn => conn.provider === 'google');
        
        if (googleConnection) {
          setIsConnected(true);
          setConnectionId(googleConnection.id);
        }
      }
    };
    
    checkConnection();
  }, []);

  // Function to handle Google Calendar connection
  const handleConnectCalendar = async () => {
    if (!userId) {
      toast.error("Please sign in to connect your calendar");
      return;
    }
    
    setIsConnecting(true);
    
    try {
      // For demo purposes, we'll simulate a connection and redirect to a success page
      // In a real implementation, we would authenticate with Google OAuth here
      // Then store the token in our database
      
      // Create a connection record in the database
      const connectionData = await calendarService.createCalendarConnection(
        userId,
        'google',
        'mock_access_token',
        'mock_refresh_token',
        `google_${Date.now()}`,
        'primary'
      );
      
      setTimeout(() => {
        setIsConnecting(false);
        setIsConnected(true);
        setConnectionId(connectionData.id);
        toast.success("Connected to Google Calendar successfully");
        navigate("/calendar/sync?platform=Google Calendar&team=All Teams&action=sync");
      }, 1500);
    } catch (error) {
      console.error('Error connecting to Google Calendar:', error);
      toast.error("Failed to connect to Google Calendar");
      setIsConnecting(false);
    }
  };
  
  const handleManageCalendar = () => {
    navigate("/calendar");
  };
  
  const handleDisconnect = async () => {
    if (!connectionId) return;
    
    setIsConnecting(true);
    try {
      await calendarService.deleteCalendarConnection(connectionId);
      setIsConnected(false);
      setConnectionId(null);
      toast.success("Disconnected from Google Calendar");
    } catch (error) {
      console.error('Error disconnecting from Google Calendar:', error);
      toast.error("Failed to disconnect from Google Calendar");
    } finally {
      setIsConnecting(false);
    }
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
        
        {isConnected ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-100">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-green-800">Connected to Google Calendar</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="w-full flex items-center justify-center gap-1 bg-slate-400 hover:bg-slate-300"
                onClick={handleManageCalendar}
              >
                Manage Calendar
                <ArrowRight className="h-4 w-4" />
              </Button>
              
              <Button 
                variant="outline"
                className="w-full flex items-center justify-center gap-1 text-red-500 border-red-200 hover:bg-red-50"
                onClick={handleDisconnect}
                disabled={isConnecting}
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            className="w-full flex items-center justify-center gap-1 bg-slate-400 hover:bg-slate-300"
            onClick={handleConnectCalendar}
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : "Connect to Google Calendar"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
