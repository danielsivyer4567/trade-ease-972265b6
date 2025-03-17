
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface JobDescriptionProps {
  description: string;
  setDescription: (description: string) => void;
}

export function JobDescription({ description, setDescription }: JobDescriptionProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea 
        id="description" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        placeholder="Detailed description of the job" 
        rows={4} 
      />
    </div>
  );
}
