
import React from 'react';
import { AuditsByDay } from '../types/auditTypes';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, CheckSquare, User } from 'lucide-react';
import { format } from 'date-fns';

interface DailyAuditListProps {
  dayData: AuditsByDay;
}

export const DailyAuditList: React.FC<DailyAuditListProps> = ({ dayData }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="text-center p-2 bg-slate-100 rounded-t-lg">
        <h3 className="font-medium">{dayData.dayName}</h3>
        <p className="text-xs text-muted-foreground">{dayData.formattedDate}</p>
      </div>
      
      <div className="flex-1 flex flex-col gap-3 p-2 bg-slate-50 min-h-[300px]">
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
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No audits scheduled
          </div>
        )}
      </div>
    </div>
  );
};
