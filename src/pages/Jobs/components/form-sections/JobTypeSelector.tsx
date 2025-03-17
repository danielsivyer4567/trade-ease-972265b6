
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JOB_TYPES } from "../../constants/jobTypes";

interface JobTypeSelectorProps {
  type: string;
  setType: (type: string) => void;
}

export function JobTypeSelector({ type, setType }: JobTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="type">Job Type *</Label>
      <Select value={type} onValueChange={setType} required>
        <SelectTrigger>
          <SelectValue placeholder="Select job type" />
        </SelectTrigger>
        <SelectContent>
          {JOB_TYPES.map(jobType => (
            <SelectItem key={jobType} value={jobType}>
              {jobType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
