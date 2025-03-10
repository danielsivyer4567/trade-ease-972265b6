import { ArrowLeft, Plus, Search, Users } from "lucide-react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserConfig } from "@/components/messaging/hooks/useUserConfig";

// Example data - would come from an API in a real app
const staffMembers = [{
  id: 1,
  name: "Jane Smith",
  email: "jane.smith@tradeease.com",
  role: "Office Manager",
  phone: "555-123-4567"
}, {
  id: 2,
  name: "John Doe",
  email: "john.doe@tradeease.com",
  role: "Administrative Assistant",
  phone: "555-987-6543"
}, {
  id: 3,
  name: "Sarah Johnson",
  email: "sarah.johnson@tradeease.com",
  role: "Bookkeeper",
  phone: "555-456-7890"
}, {
  id: 4,
  name: "Michael Brown",
  email: "michael.brown@tradeease.com",
  role: "Customer Service",
  phone: "555-789-0123"
}];
export default function OfficeStaff() {
  const {
    toast
  } = useToast();
  const {
    userConfig
  } = useUserConfig();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("staff");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleInvite = async e => {
    e.preventDefault();
    if (!inviteEmail) {
      toast({
        title: "Email required",
        description: "Please enter an email address to send the invitation.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    try {
      // Get current user's organization
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("You must be logged in to invite team members");
      }
      if (!userConfig?.organization_id) {
        throw new Error("You must be part of an organization to invite members");
      }

      // Send the invitation using the edge function
      const response = await supabase.functions.invoke('organization-invite', {
        body: {
          organizationId: userConfig.organization_id,
          email: inviteEmail,
          role: inviteRole,
          inviterEmail: session.user.email
        }
      });
      if (response.error) throw new Error(response.error.message);
      const result = response.data;
      if (result.success) {
        toast({
          title: "Invitation sent!",
          description: `An invitation has been sent to ${inviteEmail}`
        });
        setInviteEmail("");
        setIsInviteDialogOpen(false);
      } else {
        throw new Error(result.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error sending invitation:", error);
      toast({
        title: "Invitation failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  return <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/settings">
              <Button variant="outline" size="icon" className="rounded-md border border-gray-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Users className="h-7 w-7 text-gray-700" />
              <h1 className="text-2xl font-bold">Office Staff</h1>
            </div>
          </div>
          <Button className="flex items-center gap-1" onClick={() => setIsInviteDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="text-center px-[228px] mx-px my-[7px] py-[3px]">Add Staff Member</span>
          </Button>
        </div>

        <div className="flex justify-between items-center py-[6px] px-[34px]">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input className="pl-9" placeholder="Search staff members..." />
          </div>
          <div className="flex items-center gap-2">
            <Label>Sort by:</Label>
            <select className="border rounded-md p-2">
              <option>Name (A-Z)</option>
              <option>Name (Z-A)</option>
              <option>Role</option>
              <option>Recently Added</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staffMembers.map(staff => <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{staff.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="block text-gray-500 text-sm">Role</Label>
                  <p>{staff.role}</p>
                </div>
                <div>
                  <Label className="block text-gray-500 text-sm">Email</Label>
                  <p>{staff.email}</p>
                </div>
                <div>
                  <Label className="block text-gray-500 text-sm">Phone</Label>
                  <p>{staff.phone}</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">Remove</Button>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>

      {/* Team Invitation Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleInvite} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="colleague@example.com" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="staff">Staff</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="bg-slate-100 p-3 rounded-md text-sm">
              <h4 className="font-medium mb-2">Role Permissions:</h4>
              <ul className="space-y-1">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-16">Staff:</span> 
                  <span>Can view and work with jobs, customers, and day-to-day operations</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-16">Admin:</span> 
                  <span>Can manage team members, billing, company settings, and all staff permissions</span>
                </li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Invitation"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </AppLayout>;
}