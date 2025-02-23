
import { AppLayout } from "@/components/ui/AppLayout";
import { Job } from "@/types/job";
import { useEffect, useState } from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const mockJobs: Job[] = [
  {
    id: '1',
    jobNumber: 'JOB001',
    title: 'Emergency Plumbing Repair',
    customer: 'John Smith',
    type: 'emergency',
    status: 'ready',
    date: '2024-03-20',
    location: [-33.865143, 151.209900]
  },
  {
    id: '2',
    jobNumber: 'JOB002',
    title: 'HVAC Installation',
    customer: 'Jane Doe',
    type: 'installation',
    status: 'in-progress',
    date: '2024-03-21',
    location: [-33.863557, 151.211282]
  },
  {
    id: '3',
    jobNumber: 'JOB003',
    title: 'Electrical Maintenance',
    customer: 'Bob Wilson',
    type: 'maintenance',
    status: 'to-invoice',
    date: '2024-03-22',
    location: [-33.867139, 151.207114]
  },
  {
    id: '4',
    jobNumber: 'JOB004',
    title: 'Kitchen Renovation',
    customer: 'Alice Brown',
    type: 'renovation',
    status: 'ready',
    date: '2024-03-23',
    location: [-33.869844, 151.206331]
  }
];

export default function Index() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    setJobs(mockJobs);
  }, []);

  const handleAddTimeOff = () => {
    toast.info("Time off feature coming soon!");
  };

  const handleAddAppointment = () => {
    toast.info("Appointment scheduling coming soon!");
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-8">
        <div className="flex justify-end gap-4">
          <Button onClick={() => navigate('/jobs/new')} className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Job
          </Button>
          <Button onClick={handleAddTimeOff} variant="outline" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Time Off
          </Button>
          <Button onClick={handleAddAppointment} variant="outline" className="shadow-sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Appointment
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Manager's Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
