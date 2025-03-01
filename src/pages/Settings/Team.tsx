
import { AppLayout } from "@/components/ui/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, User, Mail, Phone, MapPin, Edit, Trash2, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";

const mockTeamMembers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@tradeease.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    jobTitle: "Master Plumber",
    address: "123 Main St, San Francisco, CA",
    avatar: null
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@tradeease.com",
    phone: "+1 (555) 234-5678",
    role: "Team Leader",
    jobTitle: "Electrician",
    address: "456 Oak Ave, San Francisco, CA",
    avatar: null
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@tradeease.com",
    phone: "+1 (555) 345-6789",
    role: "Field Technician",
    jobTitle: "HVAC Specialist",
    address: "789 Pine St, San Francisco, CA",
    avatar: null
  },
  {
    id: 4,
    name: "Sarah Williams",
    email: "sarah.williams@tradeease.com",
    phone: "+1 (555) 456-7890",
    role: "Office Staff",
    jobTitle: "Office Manager",
    address: "321 Cedar Rd, San Francisco, CA",
    avatar: null
  }
];

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState(mockTeamMembers);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMemberData, setNewMemberData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    jobTitle: "",
    address: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMemberData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setNewMemberData(prev => ({ ...prev, role: value }));
  };

  const handleAddMember = () => {
    const newMember = {
      id: teamMembers.length + 1,
      ...newMemberData,
      avatar: null
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberData({
      name: "",
      email: "",
      phone: "",
      role: "",
      jobTitle: "",
      address: ""
    });
    setIsAddDialogOpen(false);
    toast.success("Team member added successfully!");
  };

  const handleRemoveMember = (id: number) => {
    setTeamMembers(teamMembers.filter(member => member.id !== id));
    toast.success("Team member removed successfully!");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part.charAt(0))
      .join("")
      .toUpperCase();
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-8 w-8 text-gray-700" />
            <h1 className="text-3xl font-bold">Team Management</h1>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Team Member
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Add Team Member</DialogTitle>
                <DialogDescription>
                  Add a new member to your team. They will receive an email invitation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={newMemberData.name} 
                    onChange={handleInputChange}
                    placeholder="John Doe" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={newMemberData.email} 
                      onChange={handleInputChange}
                      placeholder="john.doe@example.com" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={newMemberData.phone} 
                      onChange={handleInputChange}
                      placeholder="+1 (555) 123-4567" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={newMemberData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Team Leader">Team Leader</SelectItem>
                        <SelectItem value="Field Technician">Field Technician</SelectItem>
                        <SelectItem value="Office Staff">Office Staff</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input 
                      id="jobTitle" 
                      name="jobTitle" 
                      value={newMemberData.jobTitle} 
                      onChange={handleInputChange}
                      placeholder="Plumber" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={newMemberData.address} 
                    onChange={handleInputChange}
                    placeholder="123 Main St, City, State" 
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddMember}>Add Member</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamMembers.map(member => (
            <Card key={member.id}>
              <CardHeader className="pb-4">
                <div className="flex justify-between">
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleRemoveMember(member.id)}
                      className="text-red-500 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardDescription>
                  <div className="flex items-center gap-1">
                    <span>{member.role}</span>
                    {member.role === "Team Leader" && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">Leader</span>
                    )}
                    {member.role === "Admin" && (
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded">Admin</span>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 items-center">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar || ""} />
                    <AvatarFallback className="text-lg">{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <div className="text-sm">{member.jobTitle}</div>
                  </div>
                </div>
                <div className="pt-2 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{member.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>{member.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="line-clamp-1">{member.address}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
