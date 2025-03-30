import React from 'react';
import { AuditsByDay } from '../types/auditTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, User, Camera, Upload, MapPin, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { useIsMobile } from '@/hooks/use-mobile';

interface DailyAuditListProps {
  dayData: AuditsByDay;
  onAddPhoto?: () => void;
}

export const DailyAuditList: React.FC<DailyAuditListProps> = ({ dayData, onAddPhoto }) => {
  // Generate array of 12 empty slots
  const emptySlots = Array.from({ length: 12 }, (_, index) => index);
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col h-full">
      <div className="text-center p-2 bg-slate-100 rounded-t-lg">
        <h3 className="font-medium">{dayData.dayName}</h3>
        <p className="text-xs text-muted-foreground">{dayData.formattedDate}</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-4 p-3 bg-slate-50 min-h-[300px] overflow-y-auto max-h-[600px]">
        {dayData.audits.length > 0 ? (
          dayData.audits.map((audit) => (
            <Card key={audit.id} className="border border-border shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-sm font-medium">{audit.title}</CardTitle>
                  {audit.status === 'in_progress' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">In Progress</span>
                  )}
                  {audit.status === 'scheduled' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700">Scheduled</span>
                  )}
                  {audit.status === 'completed' && (
                    <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">Completed</span>
                  )}
                </div>
                <CardDescription className="text-xs">{audit.location}</CardDescription>
              </CardHeader>
              <CardContent className="py-1">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <CheckSquare className="h-3 w-3" />
                  <span>{audit.completedItems}/{audit.totalItems}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-1 border-t text-xs">
                <div className="flex justify-between w-full">
                  <div className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    <span>{audit.assignedTo}</span>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                    View
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          // Display 12 empty slots with larger customer details
          emptySlots.map((index) => (
            <div key={index} className="border border-dashed border-gray-200 rounded-lg p-6 bg-white mb-3 min-h-[160px]">
              <div className="flex flex-col items-start justify-between h-full">
                <div className="w-full">
                  <h3 className="font-semibold text-lg md:text-xl mb-2">Customer {index + 1}</h3>
                  <div className="flex items-center gap-2 text-md mb-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700 text-base md:text-lg font-medium">123 Main Street, Springfield</p>
                  </div>
                  <div className="flex items-center gap-2 text-md">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <p className="text-gray-700 text-base">555-123-4567</p>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4 w-full">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 h-10 flex-1 text-sm"
                    onClick={onAddPhoto}
                  >
                    <Camera className="h-5 w-5" />
                    <span>Photo</span>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2 h-10 flex-1 text-sm"
                    onClick={onAddPhoto}
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload</span>
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
