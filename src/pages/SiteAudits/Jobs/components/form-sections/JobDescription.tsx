import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlignLeft } from "lucide-react";

interface JobDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

export function JobDescription({ description, setDescription }: JobDescriptionProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlignLeft className="h-4 w-4 text-blue-600" />
        <Label htmlFor="description" className="text-sm font-medium text-gray-700">Description</Label>
      </div>
      <Textarea 
        id="description" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Detailed description of the job" 
        rows={4}
        className="resize-none bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
      <p className="text-xs text-gray-500 mt-1">Include specific details about job scope, requirements, and special instructions</p>
    </div>
  );
}
