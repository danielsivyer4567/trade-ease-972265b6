import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { JOB_TYPES } from "../../constants/jobTypes";
import { Tags } from "lucide-react";

interface JobTypeSelectorProps {
  type: string;
  setType: (type: string) => void;
}

export function JobTypeSelector({ type, setType }: JobTypeSelectorProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Tags className="h-4 w-4 text-blue-600" />
        <Label htmlFor="type" className="text-sm font-medium text-gray-700">Job Type *</Label>
      </div>
      <Select value={type} onValueChange={setType} required>
        <SelectTrigger id="type" className="bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
          <SelectValue placeholder="Select job type" />
        </SelectTrigger>
        <SelectContent>
          {JOB_TYPES.map(jobType => (
            <SelectItem key={jobType} value={jobType} className="cursor-pointer hover:bg-gray-100">
              {jobType}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-xs text-gray-500 mt-1">Category of work to be performed</p>
    </div>
  );
}
