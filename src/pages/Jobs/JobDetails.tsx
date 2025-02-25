import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, User, Calendar, Clock, FileText, Image as ImageIcon, Tag, Navigation, Receipt, DollarSign, ScrollText, Calculator, Upload, Play, Pause, Utensils } from "lucide-react";
import type { Job } from "@/types/job";
import React, { useState, useEffect } from "react";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { useToast } from "@/hooks/use-toast";
import JobMap from "@/components/JobMap";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TeamCalendar } from "@/components/team/TeamCalendar";
import { format } from "date-fns";

const mockStaffMembers = [
  { id: "1", name: "John Smith", role: "<strong>Senior Plumber</strong>" },
  { id: "2", name: "Sarah Johnson", role: "<em>Electrical Lead</em>" },
  { id: "3", name: "Mike Williams", role: "<strong>HVAC Specialist</strong>" },
  { id: "4", name: "Emma Davis", role: "<em>Project Manager</em>" },
];

const mockJobs: Job[] = [{
  id: "1",
  customer: "John Smith",
  type: "Plumbing Repair",
  status: "in-progress",
  date: "Today",
  location: [151.2093, -33.8688],
  address: "123 Main Street, Sydney NSW 2000",
  jobNumber: "PLM-001",
  title: "Emergency Pipe Repair",
  description: "Fix leaking pipe in basement",
  assignedTeam: "Red Team",
  assignedMemberId: "RT-001"
}, {
  id: "2",
  customer: "Sarah Johnson",
  type: "Electrical Installation",
  status: "ready",
  date: "Tomorrow",
  location: [151.2543, -33.8688],
  address: "45 Park Avenue, Sydney NSW 2000",
  jobNumber: "ELE-001",
  title: "New Circuit Installation",
  description: "Install new circuit for home office",
  assignedTeam: "Blue Team"
}];

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const job = mockJobs.find(j => j.id === id);
  const isMobile = useIsMobile();
  const isManager = true;

  const [quotePhotos, setQuotePhotos] = useState<string[]>([]);
  const [completionPhotos, setCompletionPhotos] = useState<string[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [jobTimer, setJobTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [jobNotes, setJobNotes] = useState("");
  const [invoices, setInvoices] = useState<any[]>([]);
  const [bills, setBills] = useState<any[]>([]);
  const [costs, setCosts] = useState<any[]>([]);
  const [tabNotes, setTabNotes] = useState<Record<string, string>>({
    bills: "",
    costs: "",
    invoices: "",
    purchase_orders: ""
  });
  const [locationHistory, setLocationHistory] = useState<{timestamp: number; coords: [number, number]}[]>([]);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [jobs, setJobs] = useState(mockJobs);
  const [selectedDate, setSelectedDate] = useState<Date>();

  useEffect(() => {
    checkLocationPermission();
  }, []);

  useEffect(() => {
    let interval: number | undefined;

    if (isTimerRunning && !isOnBreak) {
      interval = window.setInterval(() => {
        setJobTimer(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, isOnBreak]);

  const checkLocationPermission = async () => {
    if (!navigator.geolocation) {
      setHasLocationPermission(false);
      return;
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      setHasLocationPermission(permission.state === 'granted');
      
      permission.addEventListener('change', () => {
        setHasLocationPermission(permission.state === 'granted');
      });
    } catch (error) {
      navigator.geolocation.getCurrentPosition(
        () => setHasLocationPermission(true),
        () => setHasLocationPermission(false)
      );
    }
  };

  const requestLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setHasLocationPermission(true);
          toast({
            title: "Location Access Granted",
            description: "You can now start the timer.",
          });
        },
        (error) => {
          setHasLocationPermission(false);
          toast({
            title: "Location Access Required",
            description: "Please enable location services to use the timer.",
            variant: "destructive"
          });
        }
      );
    }
  };

  const handleTimerToggle = () => {
    if (!hasLocationPermission) {
      requestLocationPermission();
      return;
    }

    setIsTimerRunning(!isTimerRunning);
    if (!isTimerRunning) {
      getCurrentLocation("Timer started");
    } else {
      getCurrentLocation("Timer stopped");
    }
  };

  const handleBreakToggle = () => {
    setIsOnBreak(!isOnBreak);
    if (!isOnBreak) {
      getCurrentLocation("Break started");
    } else {
      getCurrentLocation("Break ended");
    }
  };

  const getCurrentLocation = (action: string) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            timestamp: Date.now(),
            coords: [position.coords.longitude, position.coords.latitude] as [number, number]
          };
          setLocationHistory(prev => [...prev, newLocation]);
          toast({
            title: action,
            description: `Location recorded: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get current location. Please enable location services.",
            variant: "destructive"
          });
          console.error("Location error:", error);
        }
      );
    }
  };

  const handleQuotePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setQuotePhotos([...quotePhotos, ...newPhotos]);
      toast({
        title: "Photos Uploaded",
        description: `${event.target.files.length} quote inspection photos added`
      });
    }
  };

  const handleCompletionPhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newPhotos = Array.from(event.target.files).map(file => URL.createObjectURL(file));
      setCompletionPhotos([...completionPhotos, ...newPhotos]);
      toast({
        title: "Photos Uploaded",
        description: `${event.target.files.length} completion photos added`
      });
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'bill' | 'receipt' | 'invoice' | 'purchase_order') => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          toast({
            title: "File Uploaded",
            description: `${file.name} has been uploaded successfully`
          });
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTagMembers = () => {
    if (selectedMembers.length > 0) {
      const taggedMembers = selectedMembers
        .map(id => {
          const member = mockStaffMembers.find(m => m.id === id);
          return member ? `${member.name} (${member.role})` : null;
        })
        .filter(Boolean)
        .join("<br/>");
      
      toast({
        title: "Members Tagged",
        description: (
          <div dangerouslySetInnerHTML={{ __html: `${taggedMembers} have been notified about this job` }} />
        )
      });
      setSelectedMembers([]);
    }
  };

  const getNavigationUrl = () => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const [lng, lat] = job?.location || [0, 0];
    
    if (isIOS) {
      return `maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=d`;
    } else {
      return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    }
  };

  const handleJobAssign = (jobId: string, newDate: Date) => {
    setJobs(prevJobs => prevJobs.map(job => 
      job.id === jobId 
        ? { ...job, date: format(newDate, 'yyyy-MM-dd') }
        : job
    ));

    toast({
      title: "Job Rescheduled",
      description: `Job has been rescheduled to ${format(newDate, 'PPP')}`,
    });
  };

  if (!job) {
    return (
      <AppLayout>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-red-600">Job not found</h1>
          <Button onClick={() => navigate("/jobs")} className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={() => navigate("/jobs")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
          <span className={`px-3 py-1 rounded-full text-sm ${
            job.status === "ready" ? "bg-yellow-100 text-yellow-800" :
            job.status === "in-progress" ? "bg-blue-100 text-blue-800" :
            job.status === "to-invoice" ? "bg-purple-100 text-purple-800" :
            "bg-green-100 text-green-800"
          }`}>
            {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
          </span>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl flex items-center justify-between">
              {job.title || job.type}
              <span className="text-sm font-mono text-gray-500">#{job.jobNumber}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-8 mb-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="notes">
                  <FileText className="w-4 h-4 mr-2" />
                  Notes
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="w-4 h-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="timer">
                  <Clock className="w-4 h-4 mr-2" />
                  Timer
                </TabsTrigger>
                {isManager && (
                  <>
                    <TabsTrigger value="purchase-orders">
                      <Receipt className="w-4 h-4 mr-2" />
                      Orders
                    </TabsTrigger>
                    <TabsTrigger value="bills">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Bills
                    </TabsTrigger>
                    <TabsTrigger value="costs">
                      <Calculator className="w-4 h-4 mr-2" />
                      Costs
                    </TabsTrigger>
                    <TabsTrigger value="invoices">
                      <ScrollText className="w-4 h-4 mr-2" />
                      Invoices
                    </TabsTrigger>
                  </>
                )}
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="flex justify-between items-center">
                  <Button variant="outline" onClick={() => navigate("/jobs")}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                  </Button>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    job.status === "ready" ? "bg-yellow-100 text-yellow-800" :
                    job.status === "in-progress" ? "bg-blue-100 text-blue-800" :
                    job.status === "to-invoice" ? "bg-purple-100 text-purple-800" :
                    "bg-green-100 text-green-800"
                  }`}>
                    {job.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Customer:</span> {job.customer}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-5 h-5" />
                      <span className="font-medium">Date:</span> {job.date}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <MapPin className="w-5 h-5" />
                        <span className="font-medium">Location:</span>
                        <span>{job.address}</span>
                        <div className="flex gap-2 ml-2">
                          <a 
                            href={`https://www.google.com/maps?q=${job.location[1]},${job.location[0]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View on Map
                          </a>
                          {isMobile && (
                            <a 
                              href={getNavigationUrl()}
                              className="flex items-center gap-1 text-green-600 hover:underline"
                            >
                              <Navigation className="w-4 h-4" />
                              Navigate
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="h-[200px] rounded-lg overflow-hidden border border-gray-200">
                        <JobMap jobs={[job]} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span className="font-medium">Status:</span> {job.status}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-5 h-5" />
                      <span className="font-medium">Assigned Team:</span> {job.assignedTeam || 'Unassigned'}
                    </div>
                    {job.assignedMemberId && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <User className="w-5 h-5" />
                        <span className="font-medium">Team Member ID:</span> {job.assignedMemberId}
                      </div>
                    )}
                  </div>
                </div>

                {job.description && (
                  <div className="mt-6">
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <FileText className="w-5 h-5" />
                      <span className="font-medium">Description:</span>
                    </div>
                    <p className="text-gray-600 whitespace-pre-line">{job.description}</p>
                  </div>
                )}

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      <span className="font-medium">Quote Inspection Photos</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        onValueChange={(value) => {
                          setSelectedMembers(prev => 
                            prev.includes(value) 
                              ? prev.filter(id => id !== value)
                              : [...prev, value]
                          );
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select team members..." />
                        </SelectTrigger>
                        <SelectContent>
                          {mockStaffMembers.map((member) => (
                            <SelectItem 
                              key={member.id} 
                              value={member.id}
                              className={selectedMembers.includes(member.id) ? "bg-accent" : ""}
                            >
                              <div dangerouslySetInnerHTML={{ __html: `${member.name} - ${member.role}` }} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleTagMembers}
                        className="font-bold text-black uppercase"
                        disabled={selectedMembers.length === 0}
                      >
                        <Tag className="w-4 h-4 mr-2" />
                        Tag Members ({selectedMembers.length})
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <FileUpload
                      onFileUpload={handleQuotePhotoUpload}
                      label="Upload quote inspection photos"
                    />
                    {quotePhotos.length > 0 ? (
                      <ImagesGrid
                        images={quotePhotos}
                        title="Quote Inspection Photos"
                      />
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No quote inspection photos uploaded
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <ImageIcon className="w-5 h-5" />
                    <span className="font-medium">Completion Photos</span>
                  </div>
                  <div className="space-y-4">
                    <FileUpload
                      onFileUpload={handleCompletionPhotoUpload}
                      label="Upload completion photos"
                    />
                    {completionPhotos.length > 0 ? (
                      <ImagesGrid
                        images={completionPhotos}
                        title="Completion Photos"
                      />
                    ) : (
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        No completion photos uploaded
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <textarea
                  className="w-full min-h-[200px] p-4 border rounded-lg"
                  placeholder="Add job notes here..."
                  value={jobNotes}
                  onChange={(e) => setJobNotes(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="calendar" className="space-y-4">
                <div className="h-[500px] border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold">Job Schedule</h3>
                    <div className="flex gap-2">
                      <Select
                        value={job?.assignedTeam || ''}
                        onValueChange={(value) => {
                          setJobs(prevJobs => prevJobs.map(j => 
                            j.id === job?.id 
                              ? { ...j, assignedTeam: value }
                              : j
                          ));
                          toast({
                            title: "Team Assigned",
                            description: `Job has been assigned to ${value}`,
                          });
                        }}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select team..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Red Team">Red Team</SelectItem>
                          <SelectItem value="Blue Team">Blue Team</SelectItem>
                          <SelectItem value="Green Team">Green Team</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <TeamCalendar 
                    date={selectedDate}
                    setDate={setSelectedDate}
                    teamColor={job?.assignedTeam === 'Red Team' ? 'red' : job?.assignedTeam === 'Blue Team' ? 'blue' : 'green'}
                    onJobAssign={handleJobAssign}
                    assignedJobs={jobs}
                  />
                </div>
              </TabsContent>

              <TabsContent value="timer" className="space-y-4">
                <div className="flex flex-col items-center space-y-6">
                  <div className="text-4xl font-mono">
                    {Math.floor(jobTimer / 3600).toString().padStart(2, '0')}:
                    {Math.floor((jobTimer % 3600) / 60).toString().padStart(2, '0')}:
                    {(jobTimer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex flex-col items-center space-y-4">
                    {!hasLocationPermission && (
                      <div className="text-sm text-red-500 mb-2">
                        Location access is required to use the timer
                      </div>
                    )}
                    <div className="flex items-center justify-center space-x-4">
                      {!hasLocationPermission ? (
                        <Button
                          onClick={requestLocationPermission}
                          variant="default"
                          className="w-48"
                        >
                          <MapPin className="w-4 h-4 mr-2" />
                          Enable Location Access
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={handleTimerToggle}
                            variant={isTimerRunning ? "destructive" : "default"}
                            className="w-32"
                          >
                            {isTimerRunning ? (
                              <>
                                <Pause className="w-4 h-4 mr-2" />
                                Stop
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Start
                              </>
                            )}
                          </Button>
                          <Button
                            onClick={handleBreakToggle}
                            variant={isOnBreak ? "outline" : "secondary"}
                            className="w-32"
                            disabled={!isTimerRunning}
                          >
                            <Utensils className="w-4 h-4 mr-2" />
                            {isOnBreak ? "End Break" : "Break"}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {locationHistory.length > 0 && (
                    <div className="w-full mt-6 space-y-2">
                      <h3 className="font-medium text-lg">Location History</h3>
                      <div className="border rounded-lg p-4 space-y-2 max-h-[200px] overflow-y-auto">
                        {locationHistory.map((entry, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>
                              {new Date(entry.timestamp).toLocaleTimeString()}: {entry.coords[1].toFixed(6)}, {entry.coords[0].toFixed(6)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              {isManager && (
                <>
                  <TabsContent value="purchase-orders" className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Purchase Orders</h3>
                      <div className="space-y-4">
                        <FileUpload
                          onFileUpload={(e) => handleFileUpload(e, 'purchase_order')}
                          label="Upload purchase order documents"
                        />
                        <textarea
                          placeholder="Add notes about purchase orders..."
                          value={tabNotes.purchase_orders}
                          onChange={(e) => setTabNotes(prev => ({
                            ...prev,
                            purchase_orders: e.target.value
                          }))}
                          className="w-full min-h-[100px] p-3 border rounded-lg mt-4"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bills" className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Bills & Receipts</h3>
                      <div className="space-y-4">
                        <FileUpload
                          onFileUpload={(e) => handleFileUpload(e, 'bill')}
                          label="Upload bills or receipts"
                        />
                        <textarea
                          placeholder="Add notes about bills and receipts..."
                          value={tabNotes.bills}
                          onChange={(e) => setTabNotes(prev => ({
                            ...prev,
                            bills: e.target.value
                          }))}
                          className="w-full min-h-[100px] p-3 border rounded-lg mt-4"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Costs Overview</h3>
                      <div className="space-y-4">
                        <FileUpload
                          onFileUpload={(e) => handleFileUpload(e, 'receipt')}
                          label="Upload cost documentation"
                        />
                        <textarea
                          placeholder="Add notes about costs..."
                          value={tabNotes.costs}
                          onChange={(e) => setTabNotes(prev => ({
                            ...prev,
                            costs: e.target.value
                          }))}
                          className="w-full min-h-[100px] p-3 border rounded-lg mt-4"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="invoices" className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-4">Invoices</h3>
                      <div className="space-y-4">
                        <FileUpload
                          onFileUpload={(e) => handleFileUpload(e, 'invoice')}
                          label="Upload contractor invoice"
                        />
                        <textarea
                          placeholder="Add notes about invoices..."
                          value={tabNotes.invoices}
                          onChange={(e) => setTabNotes(prev => ({
                            ...prev,
                            invoices: e.target.value
                          }))}
                          className="w-full min-h-[100px] p-3 border rounded-lg mt-4"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
