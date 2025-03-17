import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
interface JobDateSelectorProps {
  date: string;
  setDate: (date: string) => void;
  dateUndecided: boolean;
  setDateUndecided: (undecided: boolean) => void;
}
export function JobDateSelector({
  date,
  setDate,
  dateUndecided,
  setDateUndecided
}: JobDateSelectorProps) {
  return <div className="space-y-2">
      <Label htmlFor="date">Job Date *</Label>
      <div className="space-y-2">
        <Input id="date" type="date" value={date} onChange={e => setDate(e.target.value)} disabled={dateUndecided} required={!dateUndecided} />
        <div className="flex items-center space-x-2 mt-1">
          <Checkbox id="dateUndecided" checked={dateUndecided} onCheckedChange={checked => {
          setDateUndecided(checked === true);
          if (checked) {
            setDate("");
          }
        }} className="py-0 px-0 mx-[4px]" />
          <label htmlFor="dateUndecided" className="text-sm font-medium cursor-pointer">
            Yet to be decided
          </label>
        </div>
      </div>
    </div>;
}