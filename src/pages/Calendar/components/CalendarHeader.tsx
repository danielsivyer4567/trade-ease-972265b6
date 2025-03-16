
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Link, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CalendarHeaderProps {
  onCalendarIntegration: () => void;
  onAddTeam: () => void;
}

export function CalendarHeader({ onCalendarIntegration, onAddTeam }: CalendarHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)} 
          className="rounded-md border border-gray-300 px-3 py-1 text-slate-950 bg-slate-400 hover:bg-slate-300"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Team Calendars</h1>
      </div>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onCalendarIntegration} 
          className="text-slate-950 bg-slate-300 hover:bg-slate-200"
        >
          <Link className="w-4 h-4 mr-2" />
          Connect Calendars
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddTeam} 
          className="text-slate-950 bg-slate-300 hover:bg-slate-200 px-[64px] text-left"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Team
        </Button>
      </div>
    </div>
  );
}
