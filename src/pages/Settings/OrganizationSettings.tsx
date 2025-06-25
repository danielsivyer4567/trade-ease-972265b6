import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrganization } from '@/contexts/OrganizationContext';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Building2, Users, Crown, Briefcase, Plus, Mail, Settings, Shield, CreditCard, Zap, Key, MessageSquare, Bot, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PricingPlans } from "@/components/pricing/PricingPlans";

export default function OrganizationSettings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    currentOrganization, 
    userOrganizations, 
    subscriptionTier,
    canCreateMoreOrganizations,
    updateOrganization,
    inviteToOrganization,
    createOrganization
  } = useOrganization();
  const { toast } = useToast();

  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [isAgencyInvite, setIsAgencyInvite] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [maxUsers, setMaxUsers] = useState(0);
  const [isCreateOrgDialogOpen, setIsCreateOrgDialogOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgType, setNewOrgType] = useState('');

  useEffect(() => {
    const fetchFeatureAccess = async () => {
      const { data: accessData } = await supabase
        .rpc('has_feature_access', { feature_key: 'automations' });
      
      const { data: usersData } = await supabase
        .rpc('get_feature_limit', { feature_key: 'max_users' });

      setHasAccess(accessData);
      setMaxUsers(usersData);
    };

    fetchFeatureAccess();
  }, []);

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter an email address to invite',
        variant: 'destructive'
      });
      return;
    }

    const success = await inviteToOrganization(inviteEmail, inviteRole, isAgencyInvite);
    if (success) {
      setInviteEmail('');
      setInviteRole('member');
      setIsAgencyInvite(false);
      setIsInviteDialogOpen(false);
    }
  };

  const handleCreateOrganization = async () => {
    if (!newOrgName) {
      toast({
        title: 'Organization name required',
        description: 'Please enter a name for your organization',
        variant: 'destructive'
      });
      return;
    }

    const org = await createOrganization({
      name: newOrgName,
      business_type: newOrgType
    });

    if (org) {
      setNewOrgName('');
      setNewOrgType('');
      setIsCreateOrgDialogOpen(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <Tabs defaultValue="organizations" className="w-full">
        <div className="fixed top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex-shrink-0">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Back to Settings
                </Button>
              </div>
              <div className="flex items-center space-x-4">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="organizations">Organizations</TabsTrigger>
                  <TabsTrigger value="subscription">Subscription</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16">
          <TabsContent value="organizations" className="space-y-6 p-6">
            {/* Organizations content */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userOrganizations?.map((org) => (
                <Card key={org.organization_id} className="relative">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {org.organization_name}
                    </CardTitle>
                    <CardDescription>Organization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Role:</span>
                        <Badge variant="outline">{org.role}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Type:</span>
                        <span className="text-sm font-medium">{org.access_type}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {canCreateMoreOrganizations && (
                <Card className="border-dashed border-2 border-gray-300 hover:border-gray-400 transition-colors">
                  <CardContent className="flex flex-col items-center justify-center h-32">
                    <Button
                      variant="ghost"
                      onClick={() => setIsCreateOrgDialogOpen(true)}
                      className="flex flex-col items-center gap-2"
                    >
                      <Plus className="h-8 w-8 text-gray-400" />
                      <span className="text-sm text-gray-600">Create Organization</span>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="subscription" className="space-y-6 p-6">
            <PricingPlans />
          </TabsContent>

          <TabsContent value="features" className="space-y-6 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    Automations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Set up automated workflows and processes
                  </p>
                  <Badge variant={hasAccess ? "default" : "secondary"}>
                    {hasAccess ? "Available" : "Not Available"}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    Team Members
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Maximum number of team members
                  </p>
                  <Badge variant="outline">{maxUsers} Users</Badge>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Invite Dialog */}
      <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite to Organization</DialogTitle>
            <DialogDescription>
              Send an invitation to join your organization
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="member">Member</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>Send Invitation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Organization Dialog */}
      <Dialog open={isCreateOrgDialogOpen} onOpenChange={setIsCreateOrgDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Organization</DialogTitle>
            <DialogDescription>
              Create a new organization for your business
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="orgName">Organization Name</Label>
              <Input
                id="orgName"
                placeholder="Enter organization name"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="orgType">Business Type</Label>
              <Select value={newOrgType} onValueChange={setNewOrgType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="plumbing">Plumbing</SelectItem>
                  <SelectItem value="electrical">Electrical</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOrgDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOrganization}>Create Organization</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 