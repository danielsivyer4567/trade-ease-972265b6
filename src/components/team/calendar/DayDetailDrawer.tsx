
import React from 'react';
import { format } from 'date-fns';
import { Job } from '@/types/job';
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle,
  DrawerFooter
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, User } from 'lucide-react';

interface DayDetailDrawerProps {
  selectedDay: { date: Date, jobs: Job[] } | null;
  onClose: () => void;
  onJobClick: (jobId: string, e: React.MouseEvent) => void;
}

export const DayDetailDrawer: React.FC<DayDetailDrawerProps> = ({ 
  selectedDay, 
  onClose, 
  onJobClick 
}) => {
  if (!selectedDay) return null;
  
  const { date, jobs } = selectedDay;
  
  return (
    <Drawer open={Boolean(selectedDay)} onOpenChange={onClose}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="text-center flex items-center justify-center gap-2">
            <Calendar className="h-5 w-5" />
            Jobs for {format(date, 'MMMM d, yyyy')}
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 overflow-auto">
          {jobs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No jobs scheduled for this day
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div 
                  key={job.id}
                  onClick={(e) => onJobClick(job.id, e)}
                  className="border p-3 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <h3 className="font-medium">{job.title || `Job #${job.jobNumber}`}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5" />
                      <span>{job.customer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{job.type}</span>
                    </div>
                    {job.location && (
                      <div className="flex items-center gap-1 col-span-2">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Coordinates: {job.location.join(', ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <DrawerFooter>
          <Button onClick={onClose} variant="outline" className="w-full">Close</Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
