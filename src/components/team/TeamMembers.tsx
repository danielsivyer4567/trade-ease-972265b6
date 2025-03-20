
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Mail, Plus, Trash, Edit, UserPlus, Send, Users } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface TeamMembersProps {
  teamColor: string;
  teamName: string;
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  team: string;
}

export const TeamMembers: React.FC<TeamMembersProps> = ({ teamColor, teamName }) => {
  const isMobile = useIsMobile();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');
  const [team, setTeam] = useState(teamColor);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  
  // Sample team members data
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'leader', team: teamColor },
    { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'member', team: teamColor },
    { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'member', team: teamColor },
  ]);
  
  const handleAddMember = () => {
    if (!name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name,
      email,
      role,
      team
    };
    
    setTeamMembers([...teamMembers, newMember]);
    toast.success('Team member added successfully');
    resetFormAndCloseDialog();
  };
  
  const handleInviteMember = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    // In a real app, this would send an actual invitation email via backend
    toast.success(`Invitation sent to ${inviteEmail}`);
    setIsInviteDialogOpen(false);
    setInviteEmail('');
    setInviteRole('member');
  };
  
  const handleEditMember = () => {
    if (!selectedMember || !name || !email) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    const updatedMembers = teamMembers.map(member => 
      member.id === selectedMember.id 
        ? { ...member, name, email, role, team } 
        : member
    );
    
    setTeamMembers(updatedMembers);
    toast.success('Team member updated successfully');
    resetFormAndCloseDialog();
  };
  
  const handleDeleteMember = (id: string) => {
    const memberToDelete = teamMembers.find(member => member.id === id);
    if (!memberToDelete) return;
    
    const confirmed = window.confirm(`Are you sure you want to remove ${memberToDelete.name} from the team?`);
    if (confirmed) {
      const updatedMembers = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedMembers);
      toast.success('Team member removed successfully');
    }
  };
  
  const openEditDialog = (member: TeamMember) => {
    setSelectedMember(member);
    setName(member.name);
    setEmail(member.email);
    setRole(member.role);
    setTeam(member.team);
    setIsEditDialogOpen(true);
  };
  
  const resetFormAndCloseDialog = () => {
    setName('');
    setEmail('');
    setRole('member');
    setTeam(teamColor);
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
    setSelectedMember(null);
  };
  
  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'leader': return 'Team Leader';
      case 'manager': return 'Manager';
      case 'member': return 'Team Member';
      default: return role;
    }
  };
  
  const getTeamLabel = (team: string) => {
    switch (team) {
      case 'red': return 'Red Team';
      case 'blue': return 'Blue Team';
      case 'green': return 'Green Team';
      default: return team;
    }
  };
  
  const getTeamColorClass = (team: string) => {
    switch (team) {
      case 'red': return 'bg-red-100 text-red-800 border-red-300';
      case 'blue': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'green': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <section className="mt-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className={`h-5 w-5 text-${teamColor}-500`} />
          <h2 className="text-xl font-semibold">Team Members</h2>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsInviteDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Mail className="h-4 w-4" />
            <span className={isMobile ? 'sr-only' : ''}>Invite</span>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            onClick={() => setIsAddDialogOpen(true)}
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span className={isMobile ? 'sr-only' : ''}>Add Member</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teamMembers.map(member => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.email}</CardDescription>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-medium border ${getTeamColorClass(member.team)}`}>
                  {getTeamLabel(member.team)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="mb-3">
                <span className="text-sm text-gray-500">Role:</span>
                <span className="ml-2 font-medium">{getRoleLabel(member.role)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(member)}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleDeleteMember(member.id)}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700"
                >
                  <Trash className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Add Member Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Add a new member to {teamName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter full name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email address" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Team Leader</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="team">Team</Label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger id="team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red Team</SelectItem>
                  <SelectItem value="blue">Blue Team</SelectItem>
                  <SelectItem value="green">Green Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFormAndCloseDialog}>Cancel</Button>
            <Button onClick={handleAddMember}>Add Member</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Invite Member Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite Team Member</DialogTitle>
            <DialogDescription>
              Send an invitation email to join {teamName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="invite-email">Email Address</Label>
              <Input 
                id="invite-email" 
                type="email" 
                value={inviteEmail} 
                onChange={(e) => setInviteEmail(e.target.value)} 
                placeholder="Enter email address" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="invite-role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger id="invite-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Team Leader</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <h4 className="font-medium text-yellow-800 flex items-center gap-1 mb-2">
                <Mail className="h-4 w-4" />
                How it works
              </h4>
              <p className="text-sm text-yellow-700">
                An invitation will be sent with a special link that automatically connects the user to this organization and team when they sign up. They'll be assigned the role you've selected.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleInviteMember} className="flex items-center gap-1">
              <Send className="h-4 w-4" />
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Member Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team Member</DialogTitle>
            <DialogDescription>
              Update details for {selectedMember?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Enter full name" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input 
                id="edit-email" 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email address" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-role">Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="leader">Team Leader</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="member">Team Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-team">Team</Label>
              <Select value={team} onValueChange={setTeam}>
                <SelectTrigger id="edit-team">
                  <SelectValue placeholder="Select team" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red Team</SelectItem>
                  <SelectItem value="blue">Blue Team</SelectItem>
                  <SelectItem value="green">Green Team</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetFormAndCloseDialog}>Cancel</Button>
            <Button onClick={handleEditMember}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};
