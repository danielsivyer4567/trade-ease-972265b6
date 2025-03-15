
import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { Calendar, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CalendarSync = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const platform = searchParams.get('platform');
  const team = searchParams.get('team');
  const action = searchParams.get('action') || 'sync';
  
  useEffect(() => {
    if (platform && team) {
      toast.success(`Calendar sync initiated for ${team} with ${platform}`);
    }
  }, [platform, team]);
  
  return (
    <AppLayout>
      <div className="container mx-auto py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="h-6 w-6 text-blue-500" />
              <CardTitle>Calendar Synchronization</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {platform && team ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-100">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>Successfully synchronized with {platform}</span>
                </div>
                
                <p>
                  Your {team} calendar has been {action === 'sync' ? 'synchronized' : 'exported'} to your {platform} calendar.
                  Any updates to jobs and schedules will be reflected automatically.
                </p>
                
                <Button 
                  onClick={() => navigate('/calendar')}
                  className="w-full flex items-center justify-center gap-2 mt-4"
                >
                  Return to Calendar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p>
                  No synchronization details were provided. Please return to the calendar page and try again.
                </p>
                
                <Button 
                  onClick={() => navigate('/calendar')}
                  className="w-full flex items-center justify-center gap-2 mt-4"
                >
                  Return to Calendar <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
};

export default CalendarSync;
