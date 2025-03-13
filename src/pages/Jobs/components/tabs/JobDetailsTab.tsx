import { TabsContent } from "@/components/ui/tabs";
import type { Job } from "@/types/job";
import JobMap from "@/components/JobMap";
import { User, Calendar, MapPin, Navigation, FileText, ClipboardList, Edit, Check, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Button } from "@/components/ui/button";
interface JobDetailsTabProps {
  job: Job;
}
export const JobDetailsTab = ({
  job
}: JobDetailsTabProps) => {
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [descriptionText, setDescriptionText] = useState(job.description || "");
  const [additionalNotes, setAdditionalNotes] = useState("No additional notes provided. Contact office for more information if needed.");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const handleSaveDescription = () => {
    // In a real app, this would update the job description via an API call
    console.log("Saving description:", descriptionText);
    setIsEditingDescription(false);
  };
  const handleCancelDescription = () => {
    setDescriptionText(job.description || "");
    setIsEditingDescription(false);
  };
  const handleSaveNotes = () => {
    // In a real app, this would update the additional notes via an API call
    console.log("Saving additional notes:", additionalNotes);
    setIsEditingNotes(false);
  };
  const handleCancelNotes = () => {
    setAdditionalNotes("No additional notes provided. Contact office for more information if needed.");
    setIsEditingNotes(false);
  };
  return;
};