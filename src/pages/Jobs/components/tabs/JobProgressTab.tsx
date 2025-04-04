
import { useState, useEffect } from "react";
import { JobStepProgress } from "@/components/dashboard/JobStepProgress";
import { FileUpload } from "@/components/tasks/FileUpload";
import { ImagesGrid } from "@/components/tasks/ImagesGrid";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Camera, MessageSquare } from "lucide-react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface StepImage {
  url: string;
  note: string;
}

interface StepComment {
  id: string;
  author: string;
  authorAvatar?: string;
  content: string;
  timestamp: string;
  isCustomer?: boolean;
}

interface StepData {
  id: number;
  title: string;
  notes: string;
  images: StepImage[];
  comments: StepComment[];
  isOpen: boolean;
  isCompleted: boolean;
  assignedTeam?: string;
  teamColor?: string;
}

export const JobProgressTab = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [stepData, setStepData] = useState<Record<number, StepData>>({});
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [stepOrder, setStepOrder] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number | null>(null);
  
  useEffect(() => {
    // Load step data from the database or initialize defaults
    const fetchStepData = async () => {
      setLoading(true);
      try {
        if (jobId) {
          // In a real implementation, fetch data from Supabase
          const { data, error } = await supabase
            .from('jobs')
            .select('job_steps, status, assigned_team')
            .eq('id', jobId)
            .single();

          if (data && data.job_steps) {
            // Convert server data to our format
            const formattedSteps: Record<number, StepData> = {};
            const serverSteps = data.job_steps;
            const stepIds: number[] = [];
            
            // Map through the steps and format them
            serverSteps.forEach((step: any) => {
              stepIds.push(step.id);
              formattedSteps[step.id] = {
                id: step.id,
                title: step.title || `Step ${step.id}`,
                notes: step.notes || "",
                images: step.images || [],
                comments: step.comments || [],
                isOpen: false,
                isCompleted: step.isCompleted || false,
                assignedTeam: data.assigned_team,
                teamColor: getTeamColor(data.assigned_team)
              };
            });
            
            setStepData(formattedSteps);
            setStepOrder(stepIds);
            
            // Set the current step
            const currentStep = serverSteps.findIndex((s: any) => !s.isCompleted);
            if (currentStep >= 0) {
              setCurrentStep(serverSteps[currentStep].id);
            } else {
              setCurrentStep(stepIds[0]);
            }
          } else {
            // Initialize default steps
            initializeDefaultSteps(data?.assigned_team);
          }
        } else {
          initializeDefaultSteps();
        }
      } catch (error) {
        console.error("Error loading job progress data:", error);
        toast({
          title: "Error loading progress data",
          description: "There was a problem loading the job progress data."
        });
        initializeDefaultSteps();
      } finally {
        setLoading(false);
      }
    };

    fetchStepData();
  }, [jobId, toast]);

  const initializeDefaultSteps = (assignedTeam?: string) => {
    const defaultSteps: Record<number, StepData> = {
      1: { 
        id: 1, 
        title: "Initial Assessment", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
      2: { 
        id: 2, 
        title: "Material Preparation", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
      3: { 
        id: 3, 
        title: "Work Execution", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
      4: { 
        id: 4, 
        title: "Quality Inspection", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
      5: { 
        id: 5, 
        title: "Customer Approval", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
      6: { 
        id: 6, 
        title: "Final Documentation", 
        notes: "", 
        images: [], 
        comments: [], 
        isOpen: false, 
        isCompleted: false,
        assignedTeam,
        teamColor: getTeamColor(assignedTeam)
      },
    };
    setStepData(defaultSteps);
    setStepOrder([1, 2, 3, 4, 5, 6]);
    setCurrentStep(1);
  };

  const getTeamColor = (teamName?: string) => {
    if (!teamName) return "bg-gray-400"; // Default color
    
    // Map team names to colors
    const teamColors: Record<string, string> = {
      "Team A": "bg-blue-500",
      "Team B": "bg-green-500",
      "Team C": "bg-purple-500",
      "Team D": "bg-orange-500",
      "Team E": "bg-pink-500"
    };
    
    return teamColors[teamName] || "bg-gray-400";
  };

  const handleNoteChange = (stepId: number, notes: string) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        notes
      }
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, stepId: number) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: StepImage[] = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      note: ""
    }));

    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        images: [...prev[stepId].images, ...newImages]
      }
    }));

    toast({
      title: "Images uploaded",
      description: `${newImages.length} image(s) added to step ${stepId}`
    });
  };

  const handleImageNoteChange = (stepId: number, imageIndex: number, note: string) => {
    setStepData(prev => {
      const step = prev[stepId];
      const updatedImages = [...step.images];
      updatedImages[imageIndex] = {
        ...updatedImages[imageIndex],
        note
      };
      
      return {
        ...prev,
        [stepId]: {
          ...step,
          images: updatedImages
        }
      };
    });
  };

  const toggleStepOpen = (stepId: number) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        isOpen: !prev[stepId].isOpen
      }
    }));
  };

  const handleAddComment = (stepId: number) => {
    if (!newComment.trim()) return;
    
    const comment: StepComment = {
      id: Date.now().toString(),
      author: "Current User",
      content: newComment,
      timestamp: new Date().toISOString()
    };
    
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        comments: [...prev[stepId].comments, comment]
      }
    }));
    
    setNewComment("");
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the progress"
    });
  };

  const markStepComplete = (stepId: number, isCompleted: boolean) => {
    setStepData(prev => ({
      ...prev,
      [stepId]: {
        ...prev[stepId],
        isCompleted
      }
    }));
    
    // Update current step
    if (isCompleted) {
      // Find the next incomplete step
      const nextIncompleteStep = stepOrder.find(
        id => id > stepId && !stepData[id].isCompleted
      );
      
      if (nextIncompleteStep) {
        setCurrentStep(nextIncompleteStep);
      }
    } else {
      // If uncompleting a step, this becomes the current step
      setCurrentStep(stepId);
    }
    
    // In a real implementation, save to Supabase here
    saveStepDataToSupabase(stepId);
  };

  const saveStepDataToSupabase = async (stepId: number) => {
    if (!jobId) return;
    
    try {
      // Convert our step data to the format needed by the database
      const allSteps = Object.values(stepData).map(step => ({
        id: step.id,
        title: step.title,
        notes: step.notes,
        images: step.images,
        comments: step.comments,
        isCompleted: step.isCompleted
      }));
      
      // In a real implementation, update the job steps in Supabase
      const { error } = await supabase
        .from('jobs')
        .update({
          job_steps: allSteps,
          // If the final step is completed, update the job status
          ...(stepId === Math.max(...stepOrder) && stepData[stepId].isCompleted 
            ? { status: 'completed' } 
            : {})
        })
        .eq('id', jobId);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Progress saved",
        description: `Step ${stepId} has been updated`
      });
    } catch (error) {
      console.error("Error saving progress data:", error);
      toast({
        title: "Error saving progress",
        description: "There was a problem saving the job progress.",
        variant: "destructive"
      });
    }
  };

  const saveStepData = (stepId: number) => {
    // In a real app, you would save this data to your backend
    saveStepDataToSupabase(stepId);
  };

  if (loading) {
    return (
      <div className="p-4 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-48 mb-4"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  // Calculate progress percentage
  const completedSteps = Object.values(stepData).filter(step => step.isCompleted).length;
  const totalSteps = Object.values(stepData).length;
  const progressPercentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <div className="p-4 space-y-6">
      {/* Main progress tracker with current step highlighted */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Job Progress</h2>
            <Badge variant="outline" className="text-sm">
              {progressPercentage}% Complete
            </Badge>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 overflow-x-auto py-2">
          {stepOrder.map((stepId) => (
            <div 
              key={stepId}
              className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 
                ${currentStep === stepId ? 'border-blue-500 shadow-md' : 'border-gray-200'} 
                ${stepData[stepId].isCompleted ? 'bg-green-100' : 'bg-white'}
                ${stepData[stepId].teamColor ? `ring-2 ring-offset-2 ring-${stepData[stepId].teamColor.replace('bg-', '')}` : ''}
              `}
              onClick={() => toggleStepOpen(stepId)}
            >
              <span className={`text-sm font-medium ${stepData[stepId].isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                {stepId}
              </span>
            </div>
          ))}
        </div>
        
        {/* Display the team color indicator if assigned */}
        {stepData[currentStep || 1]?.assignedTeam && (
          <div className="flex items-center mt-3">
            <div className={`w-3 h-3 rounded-full ${stepData[currentStep || 1]?.teamColor || 'bg-gray-400'} mr-2`}></div>
            <span className="text-sm text-gray-600">Assigned to: {stepData[currentStep || 1]?.assignedTeam}</span>
          </div>
        )}
      </div>
      
      {/* Step details with notes, images and comments */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Step Details</h3>
        
        {stepOrder.map((stepId) => (
          <Collapsible 
            key={stepId}
            open={stepData[stepId].isOpen}
            onOpenChange={() => toggleStepOpen(stepId)}
            className={`bg-white rounded-lg shadow-sm overflow-hidden
              ${currentStep === stepId ? 'ring-2 ring-blue-500' : ''}
            `}
          >
            <CollapsibleTrigger className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div 
                  className={`w-6 h-6 rounded-full flex items-center justify-center
                    ${stepData[stepId].isCompleted ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}
                  `}
                >
                  {stepId}
                </div>
                <div className="font-medium">{stepData[stepId].title}</div>
                {stepData[stepId].isCompleted && (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Completed
                  </Badge>
                )}
              </div>
              {stepData[stepId].isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </CollapsibleTrigger>
            
            <CollapsibleContent className="p-4 border-t">
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium">Step {stepId} Details</h4>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant={stepData[stepId].isCompleted ? "outline" : "default"}
                      size="sm"
                      onClick={() => markStepComplete(stepId, !stepData[stepId].isCompleted)}
                    >
                      {stepData[stepId].isCompleted ? "Mark Incomplete" : "Mark Complete"}
                    </Button>
                  </div>
                </div>

                {/* Notes section */}
                <div>
                  <label htmlFor={`step-${stepId}-notes`} className="block text-sm font-medium text-gray-700 mb-1">
                    Notes for Step {stepId}
                  </label>
                  <Textarea
                    id={`step-${stepId}-notes`}
                    value={stepData[stepId].notes}
                    onChange={(e) => handleNoteChange(stepId, e.target.value)}
                    placeholder="Add notes about this step..."
                    className="w-full"
                  />
                </div>
                
                {/* Image upload - direct integration into progression */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Upload Images for Step {stepId}
                  </label>
                  <div className="flex items-center space-x-2">
                    <FileUpload
                      onFileUpload={(e) => handleImageUpload(e, stepId)}
                      label={`Upload images for Step ${stepId}`}
                    />
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Camera className="h-4 w-4" /> Take Photo
                    </Button>
                  </div>
                </div>
                
                {/* Images display with notes */}
                {stepData[stepId].images.length > 0 && (
                  <div className="space-y-4 mt-4">
                    <h4 className="text-sm font-medium">Images</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {stepData[stepId].images.map((image, imageIndex) => (
                        <div key={imageIndex} className="border rounded-lg overflow-hidden">
                          <div className="aspect-video bg-gray-100">
                            <img 
                              src={image.url} 
                              alt={`Step ${stepId} image ${imageIndex + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="p-2">
                            <Textarea
                              value={image.note}
                              onChange={(e) => handleImageNoteChange(stepId, imageIndex, e.target.value)}
                              placeholder="Add notes about this image..."
                              className="w-full text-sm min-h-[60px]"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Conversations section - integrated into progression */}
                <div className="mt-6">
                  <div className="flex items-center mb-3">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    <h4 className="font-medium">Conversations</h4>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto p-2 bg-gray-50 rounded-lg mb-3">
                    {stepData[stepId].comments.length > 0 ? (
                      stepData[stepId].comments.map(comment => (
                        <div 
                          key={comment.id} 
                          className={`p-3 rounded-lg ${comment.isCustomer ? 'bg-blue-50 ml-6' : 'bg-white mr-6 border'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              {comment.authorAvatar && (
                                <AvatarImage src={comment.authorAvatar} alt={comment.author} />
                              )}
                              <AvatarFallback className="text-xs">
                                {comment.author.split(' ').map(part => part[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="text-sm font-medium">{comment.author}</div>
                            <div className="text-xs text-gray-500 ml-auto">
                              {new Date(comment.timestamp).toLocaleString()}
                            </div>
                          </div>
                          <p className="text-sm">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-gray-500 py-4">
                        No conversations yet. Add a comment below.
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-grow"
                    />
                    <Button 
                      onClick={() => handleAddComment(stepId)}
                      disabled={!newComment.trim()}
                    >
                      Send
                    </Button>
                  </div>
                </div>
                
                {/* Save button */}
                <div className="flex justify-end">
                  <Button onClick={() => saveStepData(stepId)} className="mt-2">
                    Save Step Data
                  </Button>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};
