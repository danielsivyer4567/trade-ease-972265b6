
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { Staff } from "../types";

interface StaffSelectorProps {
  staffMembers: Staff[];
  selectedStaff: Staff | null;
  onSelectStaff: (staff: Staff) => void;
}

export function StaffSelector({ staffMembers, selectedStaff, onSelectStaff }: StaffSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Select Staff Member
        </CardTitle>
        <CardDescription>Choose a staff member to calculate their rates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {staffMembers.map((staff) => (
            <Button
              key={staff.id}
              variant={selectedStaff?.id === staff.id ? "default" : "outline"}
              onClick={() => onSelectStaff(staff)}
            >
              {staff.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
